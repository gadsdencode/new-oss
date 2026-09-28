import { LangChainAdapter } from "@copilotkit/runtime";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { AIMessage, SystemMessage, ToolMessage, type BaseMessage } from "@langchain/core/messages";
import type { AssistantConfig } from "./config";
import { boundAssembledModelInput, type BoundInputResult } from "./token-budget";
import { logAssistantError, logAssistantEvent } from "./logging";
import { AssistantSpendError, AssistantUnavailableError } from "./errors";
import { createGenerationSignal, throwIfAborted } from "./signals";
import { readUsageMetadata, type ProviderUsage } from "./usage";
import type { SpendGuard } from "./spend-controls";
import { getModelPrices } from "./pricing";
import { applyOperatingInstructions } from "./instructions";
import { ICDU_MAX_OUTPUT_TOKENS, ICDU_MAX_TOOLS, ICDU_MAX_UPSTREAM_BODY_BYTES, VISITOR_TURN_DEADLINE_MESSAGE } from "./constants";
import { classifyUpstreamError } from "./provider-errors";
import { fitUpstreamChatRequest } from "./upstream-request";
import { formatRetrievedPassages } from "./knowledge/retrieve";
import { retrieveForVisitor } from "./retrieval";
import { generationTimeoutMs, retrievalPlan } from "./turn-budget";

export type { ProviderUsage } from "./usage";
export { readUsageMetadata } from "./usage";

export interface AssistantGenerationAccount {
  model: string;
  estimatedInputTokens: number;
  providerInputTokens?: number;
  providerOutputTokens?: number;
  providerTotalTokens?: number;
  historyTruncated: boolean;
  droppedMessageCount: number;
  durationMs: number;
  aborted: boolean;
}

/**
 * CopilotKit 1.10.6 GoogleGenerativeAIAdapter only accepts `model` and `apiKey`.
 * ChatGoogleGenerativeAI is used here because it exposes maxOutputTokens,
 * streamUsage, maxRetries, and stream() AbortSignal support.
 */
export function createGeminiChatModelFields(config: AssistantConfig) {
  return {
    model: config.model,
    modelName: config.model,
    apiKey: config.apiKey,
    apiVersion: "v1beta" as const,
    maxOutputTokens: config.maxOutputTokens,
    maxRetries: 0,
    streaming: true,
    streamUsage: true,
  };
}

export function createIcdUChatModelFields(config: AssistantConfig, timeoutMs = config.timeoutMs) {
  return {
    model: config.model,
    apiKey: config.apiKey,
    maxTokens: Math.min(config.maxOutputTokens, ICDU_MAX_OUTPUT_TOKENS),
    maxRetries: 0,
    streaming: true,
    streamUsage: true,
    timeout: timeoutMs,
    useResponsesApi: false as const,
    configuration: {
      baseURL: config.baseUrl,
      apiKey: config.apiKey,
      timeout: timeoutMs,
      maxRetries: 0,
    },
  };
}

export function filterEmptyAssistantMessages(messages: BaseMessage[]): BaseMessage[] {
  return messages.filter((message) => {
    if (!message) {
      return false;
    }
    const messageType =
      typeof (message as { _getType?: () => string })._getType === "function"
        ? (message as { _getType: () => string })._getType()
        : "";
    const isAi = messageType === "ai" || message instanceof AIMessage;
    if (!isAi) {
      return true;
    }
    const hasContent = Boolean(message.content) && String(message.content).trim().length > 0;
    const toolCalls = (message as AIMessage).tool_calls;
    const hasToolCalls = Array.isArray(toolCalls) && toolCalls.length > 0;
    return hasContent || hasToolCalls;
  });
}

type StreamToolCallChunk = {
  id?: string;
  name?: string;
  args?: unknown;
  index?: number;
  type?: string;
};

function flattenCopilotKitStreamContent(content: unknown): unknown {
  if (typeof content === "string" || !Array.isArray(content)) {
    return content;
  }

  const texts = content
    .map((part) => {
      if (typeof part === "string") {
        return part;
      }
      if (part && typeof part === "object" && typeof (part as { text?: unknown }).text === "string") {
        return (part as { text: string }).text;
      }
      return "";
    })
    .join("");

  return texts || content;
}

/**
 * CopilotKit 1.10.6 only starts a HITL action when a streamed tool chunk has
 * both a name and an id. Gemini/LangChain often emit name+args with no id, so
 * a tool-only reply (e.g. scheduleConsultation) completes with a blank sidebar.
 */
export function normalizeCopilotKitStreamChunk(value: unknown): unknown {
  if (!value || typeof value !== "object") {
    return value;
  }

  const chunk = value as {
    content?: unknown;
    tool_call_chunks?: StreamToolCallChunk[];
    tool_calls?: Array<{ id?: string; name?: string; args?: unknown }>;
  };

  if ("content" in chunk) {
    chunk.content = flattenCopilotKitStreamContent(chunk.content);
  }

  let toolChunks = Array.isArray(chunk.tool_call_chunks) ? chunk.tool_call_chunks : [];
  if (toolChunks.length === 0 && Array.isArray(chunk.tool_calls) && chunk.tool_calls.length > 0) {
    toolChunks = chunk.tool_calls.map((toolCall, index) => ({
      id: toolCall.id,
      name: toolCall.name,
      args: typeof toolCall.args === "string" ? toolCall.args : JSON.stringify(toolCall.args ?? {}),
      index,
      type: "tool_call_chunk",
    }));
  }

  if (toolChunks.length === 0) {
    return value;
  }

  chunk.tool_call_chunks = toolChunks.map((toolChunk, index) => {
    const existingId = typeof toolChunk.id === "string" ? toolChunk.id.trim() : "";
    return {
      ...toolChunk,
      id: existingId || `gemini-tool-${typeof toolChunk.index === "number" ? toolChunk.index : index}`,
      index: typeof toolChunk.index === "number" ? toolChunk.index : index,
    };
  });

  return value;
}

/**
 * OpenAI-compatible streams already carry tool-call ids on the first fragment.
 * Later fragments often omit the id. Do not replace those with a new synthetic id,
 * or CopilotKit will lose the tool-result association.
 */
export function normalizeIcdUStreamChunk(value: unknown): unknown {
  if (!value || typeof value !== "object") {
    return value;
  }

  const chunk = value as {
    content?: unknown;
    tool_call_chunks?: StreamToolCallChunk[];
    tool_calls?: Array<{ id?: string; name?: string; args?: unknown }>;
  };

  if (Array.isArray(chunk.content)) {
    chunk.content = flattenCopilotKitStreamContent(chunk.content);
  }

  let toolChunks = Array.isArray(chunk.tool_call_chunks) ? chunk.tool_call_chunks : [];
  if (toolChunks.length === 0 && Array.isArray(chunk.tool_calls) && chunk.tool_calls.length > 0) {
    toolChunks = chunk.tool_calls.map((toolCall, index) => ({
      id: toolCall.id,
      name: toolCall.name,
      args: typeof toolCall.args === "string" ? toolCall.args : JSON.stringify(toolCall.args ?? {}),
      index,
      type: "tool_call_chunk",
    }));
  }

  if (toolChunks.length === 0) {
    return value;
  }

  chunk.tool_call_chunks = toolChunks.map((toolChunk, index) => {
    const existingId = typeof toolChunk.id === "string" ? toolChunk.id.trim() : "";
    const name = typeof toolChunk.name === "string" ? toolChunk.name.trim() : "";
    const stableIndex = typeof toolChunk.index === "number" ? toolChunk.index : index;
    if (existingId) {
      return { ...toolChunk, id: existingId, index: stableIndex };
    }
    if (name) {
      return { ...toolChunk, id: `icdu-tool-${stableIndex}`, index: stableIndex };
    }
    return { ...toolChunk, index: stableIndex };
  });

  return value;
}

export function instrumentLangChainStream<T>(
  stream: T,
  options: {
    signal: AbortSignal;
    onUsage: (usage: ProviderUsage) => void;
    onFinally?: (details: { aborted: boolean }) => void;
    normalizer?: (value: unknown) => unknown;
  }
): T {
  if (!stream || typeof stream !== "object" || !("getReader" in stream)) {
    options.onFinally?.({ aborted: options.signal.aborted });
    return stream;
  }

  const readable = stream as ReadableStream<unknown> & T;
  const reader = readable.getReader();
  let settled = false;

  const settle = (aborted: boolean) => {
    if (settled) {
      return;
    }
    settled = true;
    options.onFinally?.({ aborted });
  };

  const readNext = () => {
    throwIfAborted(options.signal);
    return new Promise<ReadableStreamReadResult<unknown>>((resolve, reject) => {
      const onAbort = () => {
        try {
          throwIfAborted(options.signal);
          reject(new AssistantUnavailableError("ASSISTANT_CANCELLED"));
        } catch (error) {
          reject(error);
        }
      };
      options.signal.addEventListener("abort", onAbort, { once: true });
      reader.read().then(
        (result) => {
          options.signal.removeEventListener("abort", onAbort);
          resolve(result);
        },
        (error) => {
          options.signal.removeEventListener("abort", onAbort);
          reject(error);
        }
      );
    });
  };

  return new ReadableStream({
    async pull(controller) {
      try {
        const { done, value } = await readNext();
        if (done) {
          settle(options.signal.aborted);
          controller.close();
          return;
        }
        const usage = readUsageMetadata(value);
        if (usage) {
          options.onUsage(usage);
        }
        controller.enqueue((options.normalizer ?? normalizeCopilotKitStreamChunk)(value));
      } catch (error) {
        try {
          await reader.cancel();
        } catch {
          // Ignore cancel failures while propagating the original error.
        }
        settle(options.signal.aborted);
        const safe = error instanceof AssistantUnavailableError
          ? error
          : classifyUpstreamError(error, options.signal.aborted);
        controller.error(safe);
      }
    },
    async cancel(reason) {
      try {
        await reader.cancel(reason);
      } finally {
        settle(true);
      }
    },
  }) as T;
}

function accountGeneration(
  config: AssistantConfig,
  bound: BoundInputResult,
  usage: ProviderUsage | undefined,
  startedAt: number,
  aborted: boolean
): AssistantGenerationAccount {
  return {
    model: config.model,
    estimatedInputTokens: bound.estimatedInputTokens,
    providerInputTokens: usage?.inputTokens,
    providerOutputTokens: usage?.outputTokens,
    providerTotalTokens: usage?.totalTokens,
    historyTruncated: bound.historyTruncated,
    droppedMessageCount: bound.droppedMessageCount,
    durationMs: Date.now() - startedAt,
    aborted,
  };
}

function childSignal(parent: AbortSignal, timeoutMs: number): { signal: AbortSignal; cleanup: () => void } {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const onParent = () => controller.abort(parent.reason);
  if (parent.aborted) {
    controller.abort(parent.reason);
  } else {
    parent.addEventListener("abort", onParent, { once: true });
  }
  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timer);
      parent.removeEventListener("abort", onParent);
    },
  };
}

function latestUserText(messages: BaseMessage[]): string {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (!message) {
      continue;
    }
    const type = typeof message._getType === "function" ? message._getType() : "";
    if (type === "human" && typeof message.content === "string" && message.content.trim()) {
      return message.content.trim();
    }
  }
  return "";
}

function countToolMessages(messages: BaseMessage[]): number {
  return messages.filter((message) => {
    const type = message && typeof message._getType === "function" ? message._getType() : "";
    return type === "tool" || message instanceof ToolMessage;
  }).length;
}

function requireNaturalLanguageAnswer(messages: BaseMessage[]): BaseMessage[] {
  const note = "Answer the visitor in natural language now. Do not call tools. Summarize tool results already in the conversation, then offer a next step.";
  const first = messages[0];
  if (first && typeof first._getType === "function" && first._getType() === "system") {
    return [new SystemMessage(`${String(first.content)}\n\n${note}`), ...messages.slice(1)];
  }
  return [new SystemMessage(note), ...messages];
}

/**
 * Smallest CopilotKit-compatible adapter change: same LangChainAdapter streaming
 * path, plus input bounding, provider output limits, usage accounting, timeout,
 * and cancellation. ICDU uses Chat Completions. There is no automatic fallback
 * to Gemini and no retry of a busy or partial response.
 */
export function createAssistantServiceAdapter(
  config: AssistantConfig,
  requestSignal?: AbortSignal,
  spend?: SpendGuard
) {
  return new LangChainAdapter({
    chainFn: async ({ messages, tools, threadId }) => {
      if (!spend || !getModelPrices(config.model)) {
        throw new AssistantUnavailableError("ASSISTANT_UNAVAILABLE");
      }

      let signal: AbortSignal = requestSignal ?? new AbortController().signal;
      let cleanup: () => void = () => undefined;
      const startedAt = Date.now();
      let latestUsage: ProviderUsage | undefined;
      let bound: BoundInputResult | undefined;
      let reservation: Awaited<ReturnType<SpendGuard["beforeModelCall"]>> | undefined;
      let providerStarted = false;
      let finished = false;
      let failed = false;

      const finish = async (aborted: boolean) => {
        if (finished) {
          return;
        }
        finished = true;
        const account = bound
          ? accountGeneration(config, bound, latestUsage, startedAt, aborted)
          : undefined;
        logAssistantEvent("assistant.generation", {
          source: "assistant-adapter",
          provider: config.provider,
          model: config.model,
          estimatedInputTokens: account?.estimatedInputTokens,
          providerInputTokens: account?.providerInputTokens,
          providerOutputTokens: account?.providerOutputTokens,
          providerTotalTokens: account?.providerTotalTokens,
          historyTruncated: account?.historyTruncated,
          droppedMessageCount: account?.droppedMessageCount,
          durationMs: account?.durationMs ?? Date.now() - startedAt,
          aborted,
          maxOutputTokens: config.maxOutputTokens,
        });
        if (reservation && providerStarted) {
          await spend.afterModelCall({
            reservation,
            usage: latestUsage,
            aborted,
            failed,
            latencyMs: Date.now() - startedAt,
            model: config.model,
          });
        }
        cleanup();
        await spend.releaseTurn();
      };

      try {
        throwIfAborted(signal);

        const filtered = filterEmptyAssistantMessages(messages);
        const query = latestUserText(filtered);
        const turnClock = await spend.readTurnClock();
        const plan = retrievalPlan(turnClock.remainingMs);
        const retrievalSignal = plan.budgetMs > 0 ? childSignal(signal, plan.budgetMs) : undefined;
        let retrieval = null;
        try {
          retrieval = query
            ? await retrieveForVisitor(query, {
                embed: config.provider === "icdu" && plan.embed,
                apiKey: config.apiKey,
                baseUrl: config.baseUrl,
                signal: retrievalSignal?.signal ?? signal,
                parentSignal: requestSignal,
              })
            : null;
        } finally {
          retrievalSignal?.cleanup();
        }
        const afterRetrieval = await spend.readTurnClock();
        const modelTimeoutMs = generationTimeoutMs(afterRetrieval.remainingMs, config.timeoutMs);
        if (modelTimeoutMs <= 0) {
          throw new AssistantSpendError(
            "ASSISTANT_RATE_LIMITED",
            VISITOR_TURN_DEADLINE_MESSAGE,
            429
          );
        }
        const generation = createGenerationSignal(requestSignal, modelTimeoutMs);
        signal = generation.signal;
        cleanup = generation.cleanup;
        throwIfAborted(signal);
        const retrievalText = retrieval ? formatRetrievedPassages(retrieval) : null;
        const withRetrieval = retrievalText ? [...filtered, new SystemMessage(retrievalText)] : filtered;
        const withPolicy = applyOperatingInstructions(withRetrieval);
        bound = boundAssembledModelInput(withPolicy, tools, config.maxInputTokens);
        reservation = await spend.beforeModelCall(bound, undefined, {
          toolEventsSeen: countToolMessages(filtered),
        });

        let outboundMessages = reservation.answerOnly ? requireNaturalLanguageAnswer(bound.messages) : bound.messages;
        const outboundTools = reservation.answerOnly ? [] : tools.slice(0, ICDU_MAX_TOOLS);
        if (config.provider === "icdu") {
          const fitted = fitUpstreamChatRequest(
            outboundMessages,
            outboundTools,
            config.model,
            Math.min(config.maxOutputTokens, ICDU_MAX_OUTPUT_TOKENS)
          );
          if (fitted.bodyBytes > ICDU_MAX_UPSTREAM_BODY_BYTES) {
            throw new AssistantUnavailableError("ASSISTANT_UNAVAILABLE");
          }
          outboundMessages = fitted.messages;
          bound = {
            ...bound,
            messages: outboundMessages,
            historyTruncated: bound.historyTruncated || fitted.truncated,
            droppedMessageCount: bound.droppedMessageCount + fitted.droppedMessageCount,
          };
        }

        logAssistantEvent("assistant.model_call", {
          source: "assistant-adapter",
          provider: config.provider,
          model: config.model,
          estimatedInputTokens: bound.estimatedInputTokens,
          historyTruncated: bound.historyTruncated,
          droppedMessageCount: bound.droppedMessageCount,
          maxOutputTokens: config.maxOutputTokens,
          retrievalMode: retrieval?.mode,
          sourceIds: retrieval?.sourceIds.join(","),
        });

        providerStarted = true;
        const chat = config.provider === "icdu"
          ? new ChatOpenAI(createIcdUChatModelFields(config, modelTimeoutMs))
          : new ChatGoogleGenerativeAI(createGeminiChatModelFields(config));
        const runnable = outboundTools.length > 0 ? chat.bindTools(outboundTools) : chat;
        const rawStream = await runnable.stream(outboundMessages, {
          signal,
          metadata: {
            conversation_id: threadId,
          },
        });

        return instrumentLangChainStream(rawStream, {
          signal,
          normalizer: config.provider === "icdu" ? normalizeIcdUStreamChunk : normalizeCopilotKitStreamChunk,
          onUsage: (usage) => {
            latestUsage = usage;
          },
          onFinally: ({ aborted }) => {
            void finish(aborted);
          },
        });
      } catch (error) {
        failed = true;
        const classified = classifyUpstreamError(error, signal.aborted);
        logAssistantError(error, {
          source: "assistant-adapter",
          errorCode: classified.code,
          provider: config.provider,
          model: config.model,
          providerStarted,
        });
        await finish(signal.aborted);
        throw classified;
      }
    },
  });
}
