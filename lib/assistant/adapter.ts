import { LangChainAdapter } from "@copilotkit/runtime";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AIMessage, type BaseMessage } from "@langchain/core/messages";
import type { AssistantConfig } from "./config";
import { boundAssembledModelInput, type BoundInputResult } from "./token-budget";
import { logAssistantError, logAssistantEvent } from "./logging";
import { AssistantUnavailableError } from "./errors";
import { createGenerationSignal, throwIfAborted } from "./signals";
import { readUsageMetadata, type ProviderUsage } from "./usage";
import type { SpendGuard } from "./spend-controls";
import { getModelPrices } from "./pricing";
import { applyOperatingInstructions } from "./instructions";

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

export function instrumentLangChainStream<T>(
  stream: T,
  options: {
    signal: AbortSignal;
    onUsage: (usage: ProviderUsage) => void;
    onFinally?: (details: { aborted: boolean }) => void;
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
        controller.enqueue(normalizeCopilotKitStreamChunk(value));
      } catch (error) {
        try {
          await reader.cancel();
        } catch {
          // Ignore cancel failures while propagating the original error.
        }
        settle(options.signal.aborted);
        controller.error(error instanceof Error ? error : new AssistantUnavailableError());
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

/**
 * Smallest CopilotKit-compatible adapter change: same LangChainAdapter streaming
 * path as GoogleGenerativeAIAdapter, plus input bounding, provider output limits,
 * usage accounting, timeout, and cancellation. No automatic fallback or retries.
 */
export function createAssistantServiceAdapter(
  config: AssistantConfig,
  requestSignal?: AbortSignal,
  spend?: SpendGuard
) {
  const modelFields = createGeminiChatModelFields(config);

  return new LangChainAdapter({
    chainFn: async ({ messages, tools, threadId }) => {
      if (!spend || !getModelPrices(config.model)) {
        throw new AssistantUnavailableError("ASSISTANT_UNAVAILABLE");
      }

      const { signal, cleanup } = createGenerationSignal(requestSignal, config.timeoutMs);
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
      };

      try {
        throwIfAborted(signal);

        const filtered = filterEmptyAssistantMessages(messages);
        const withPolicy = applyOperatingInstructions(filtered);
        bound = boundAssembledModelInput(withPolicy, tools, config.maxInputTokens);
        reservation = await spend.beforeModelCall(bound);

        logAssistantEvent("assistant.model_call", {
          source: "assistant-adapter",
          model: config.model,
          estimatedInputTokens: bound.estimatedInputTokens,
          historyTruncated: bound.historyTruncated,
          droppedMessageCount: bound.droppedMessageCount,
          maxOutputTokens: config.maxOutputTokens,
        });

        providerStarted = true;
        const model = new ChatGoogleGenerativeAI(modelFields).bindTools(tools);
        const rawStream = await model.stream(bound.messages, {
          signal,
          metadata: {
            conversation_id: threadId,
          },
        });

        return instrumentLangChainStream(rawStream, {
          signal,
          onUsage: (usage) => {
            latestUsage = usage;
          },
          onFinally: ({ aborted }) => {
            void finish(aborted);
          },
        });
      } catch (error) {
        failed = true;
        logAssistantError(error, {
          source: "assistant-adapter",
          errorCode: signal.aborted ? "ASSISTANT_TIMEOUT" : "ASSISTANT_PROVIDER_ERROR",
          model: config.model,
          providerStarted,
        });
        await finish(signal.aborted);
        throw error instanceof AssistantUnavailableError
          ? error
          : new AssistantUnavailableError(signal.aborted ? "ASSISTANT_TIMEOUT" : "ASSISTANT_PROVIDER_ERROR");
      }
    },
  });
}
