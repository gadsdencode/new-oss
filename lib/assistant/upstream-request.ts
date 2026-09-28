import { AIMessage, BaseMessage, HumanMessage, SystemMessage, ToolMessage } from "@langchain/core/messages";
import { _convertMessagesToOpenAIParams } from "@langchain/openai";
import {
  ICDU_MAX_MESSAGES,
  ICDU_MAX_TOOLS,
  ICDU_MAX_UPSTREAM_BODY_BYTES,
} from "./constants";
import { groupMessagesPreservingToolPairs } from "./token-budget";
import type { TokenCountableTool } from "./token-budget";

export interface UpstreamChatRequest {
  messages: BaseMessage[];
  tools: TokenCountableTool[];
  bodyBytes: number;
  truncated: boolean;
  droppedMessageCount: number;
}

function messageType(message: BaseMessage): string {
  if (typeof message._getType === "function") {
    return message._getType();
  }
  return "";
}

function isSystem(message: BaseMessage): boolean {
  return messageType(message) === "system" || message instanceof SystemMessage;
}

function isHuman(message: BaseMessage): boolean {
  return messageType(message) === "human" || message instanceof HumanMessage;
}

function textOf(message: BaseMessage): string {
  return typeof message.content === "string" ? message.content : JSON.stringify(message.content ?? "");
}

function withText(message: BaseMessage, text: string): BaseMessage {
  if (isSystem(message)) {
    return new SystemMessage(text);
  }
  if (isHuman(message)) {
    return new HumanMessage(text);
  }
  if (messageType(message) === "tool") {
    return new ToolMessage({
      content: text,
      tool_call_id: String((message as ToolMessage).tool_call_id ?? ""),
    });
  }
  if (messageType(message) === "ai") {
    return new AIMessage({
      content: text,
      tool_calls: (message as AIMessage).tool_calls,
    });
  }
  return message;
}

function toolPayload(tools: TokenCountableTool[]) {
  return tools.slice(0, ICDU_MAX_TOOLS).map((tool) => ({
    type: "function",
    function: {
      name: tool.name ?? "tool",
      description: tool.description ?? "",
      parameters: tool.schema ?? (tool.jsonSchema ? safeParse(tool.jsonSchema) : { type: "object", properties: {} }),
    },
  }));
}

function safeParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return { type: "object", properties: {} };
  }
}

export function serializedChatCompletionsBody(
  messages: BaseMessage[],
  tools: TokenCountableTool[],
  model: string,
  maxTokens: number
): string {
  const converted = _convertMessagesToOpenAIParams(messages);
  return JSON.stringify({
    model,
    messages: converted,
    tools: tools.length > 0 ? toolPayload(tools) : undefined,
    max_tokens: maxTokens,
    stream: true,
    stream_options: { include_usage: true },
  });
}

export function measureUpstreamBodyBytes(
  messages: BaseMessage[],
  tools: TokenCountableTool[],
  model: string,
  maxTokens: number
): number {
  return Buffer.byteLength(serializedChatCompletionsBody(messages, tools, model, maxTokens), "utf8");
}

/**
 * Shrink history until the Chat Completions body fits the ICDU gateway limits.
 * Tool-call and tool-result pairs stay together. The latest user turn is kept.
 */
export function fitUpstreamChatRequest(
  messages: BaseMessage[],
  tools: TokenCountableTool[],
  model: string,
  maxTokens: number
): UpstreamChatRequest {
  const limitedTools = tools.slice(0, ICDU_MAX_TOOLS);
  const defined = messages.filter((message): message is BaseMessage => Boolean(message));
  const systems = defined.filter(isSystem);
  const rest = defined.filter((message) => !isSystem(message));
  const lastUserIndex = findLastIndex(rest, isHuman);
  const prefix = lastUserIndex >= 0 ? rest.slice(0, lastUserIndex) : [];
  const suffix = lastUserIndex >= 0 ? rest.slice(lastUserIndex) : rest;
  const groups = groupMessagesPreservingToolPairs(prefix);

  const kept = groups.slice();
  let droppedMessageCount = 0;
  let truncated = limitedTools.length !== tools.length;

  const assemble = (): BaseMessage[] => [...systems, ...kept.flat(), ...suffix];

  const fits = (candidate: BaseMessage[]): boolean => {
    if (candidate.length > ICDU_MAX_MESSAGES) {
      return false;
    }
    return measureUpstreamBodyBytes(candidate, limitedTools, model, maxTokens) <= ICDU_MAX_UPSTREAM_BODY_BYTES;
  };

  while (kept.length > 0 && !fits(assemble())) {
    const removed = kept.shift();
    droppedMessageCount += removed?.length ?? 0;
    truncated = true;
  }

  let bounded = assemble();
  if (!fits(bounded)) {
    const humanIndex = bounded.findIndex(isHuman);
    if (humanIndex >= 0) {
      let text = textOf(bounded[humanIndex]);
      while (text.length > 0 && !fits(bounded)) {
        text = text.slice(0, Math.floor(text.length * 0.8));
        bounded = bounded.map((message, index) => (index === humanIndex ? withText(message, text) : message));
        truncated = true;
      }
    }
  }

  if (bounded.length > ICDU_MAX_MESSAGES) {
    const overflow = bounded.length - ICDU_MAX_MESSAGES;
    const nonSystem = bounded.filter((message) => !isSystem(message));
    const systemMessages = bounded.filter(isSystem);
    const trimmed = nonSystem.slice(Math.max(0, nonSystem.length - (ICDU_MAX_MESSAGES - systemMessages.length)));
    droppedMessageCount += overflow;
    bounded = [...systemMessages, ...trimmed];
    truncated = true;
  }

  return {
    messages: bounded,
    tools: limitedTools,
    bodyBytes: measureUpstreamBodyBytes(bounded, limitedTools, model, maxTokens),
    truncated,
    droppedMessageCount,
  };
}

function findLastIndex<T>(items: T[], predicate: (item: T) => boolean): number {
  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (predicate(items[index])) {
      return index;
    }
  }
  return -1;
}
