import { AIMessage, BaseMessage, HumanMessage, SystemMessage, ToolMessage } from "@langchain/core/messages";

export interface TokenCountableTool {
  name?: string;
  description?: string;
  jsonSchema?: string;
  schema?: unknown;
}

export interface BoundInputResult {
  messages: BaseMessage[];
  estimatedInputTokens: number;
  historyTruncated: boolean;
  droppedMessageCount: number;
  reservedTokens: number;
}

const PER_PART_OVERHEAD_TOKENS = 8;

/**
 * Conservative local estimate. Over-counting keeps assembled model input
 * under the configured budget, including system text, page context, tools,
 * history, and a small reasoning reserve on the input side.
 */
export function estimateTextTokens(text: string): number {
  if (!text) {
    return 0;
  }
  return Math.ceil(text.length / 4) + PER_PART_OVERHEAD_TOKENS;
}

function messageText(message: BaseMessage): string {
  const content = message.content;
  if (typeof content === "string") {
    return content;
  }
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }
        if (part && typeof part === "object" && "text" in part && typeof part.text === "string") {
          return part.text;
        }
        try {
          return JSON.stringify(part);
        } catch {
          return "";
        }
      })
      .join("\n");
  }
  if (content == null) {
    return "";
  }
  try {
    return JSON.stringify(content);
  } catch {
    return "";
  }
}

export function estimateMessageTokens(message: BaseMessage): number {
  let total = estimateTextTokens(messageText(message));
  if (message instanceof AIMessage && Array.isArray(message.tool_calls) && message.tool_calls.length > 0) {
    try {
      total += estimateTextTokens(JSON.stringify(message.tool_calls));
    } catch {
      total += 32;
    }
  }
  if (message instanceof ToolMessage && message.tool_call_id) {
    total += estimateTextTokens(message.tool_call_id);
  }
  return total;
}

export function estimateToolSchemaTokens(tools: TokenCountableTool[]): number {
  if (!tools.length) {
    return 0;
  }

  return tools.reduce((sum, tool) => {
    const serialized = [
      tool.name ?? "",
      tool.description ?? "",
      tool.jsonSchema ?? "",
      tool.schema ? safeJson(tool.schema) : "",
    ]
      .filter(Boolean)
      .join("\n");
    return sum + estimateTextTokens(serialized);
  }, 0);
}

function safeJson(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
}

function messageType(message: BaseMessage): string {
  if (message && typeof (message as { _getType?: () => string })._getType === "function") {
    return (message as { _getType: () => string })._getType();
  }
  return "";
}

function isToolMessage(message: BaseMessage): message is ToolMessage {
  return messageType(message) === "tool" || message instanceof ToolMessage;
}

function isHumanMessage(message: BaseMessage): message is HumanMessage {
  return messageType(message) === "human" || message instanceof HumanMessage;
}

function isSystemMessage(message: BaseMessage): message is SystemMessage {
  return messageType(message) === "system" || message instanceof SystemMessage;
}

function hasToolCalls(message: BaseMessage): message is AIMessage {
  const toolCalls = (message as AIMessage).tool_calls;
  const isAi = messageType(message) === "ai" || message instanceof AIMessage;
  return isAi && Array.isArray(toolCalls) && toolCalls.length > 0;
}

/**
 * Group an assistant tool-call message with its following tool results so
 * history truncation never drops one side of a pair.
 */
export function groupMessagesPreservingToolPairs(messages: BaseMessage[]): BaseMessage[][] {
  const groups: BaseMessage[][] = [];
  let index = 0;

  while (index < messages.length) {
    const current = messages[index];
    if (hasToolCalls(current)) {
      const group: BaseMessage[] = [current];
      index += 1;
      while (index < messages.length && isToolMessage(messages[index])) {
        group.push(messages[index]);
        index += 1;
      }
      groups.push(group);
      continue;
    }

    if (isToolMessage(current)) {
      const group: BaseMessage[] = [current];
      index += 1;
      while (index < messages.length && isToolMessage(messages[index])) {
        group.push(messages[index]);
        index += 1;
      }
      groups.push(group);
      continue;
    }

    groups.push([current]);
    index += 1;
  }

  return groups;
}

function truncateMessageContent(message: BaseMessage, tokenBudget: number): BaseMessage {
  const currentTokens = estimateMessageTokens(message);
  if (currentTokens <= tokenBudget || tokenBudget <= PER_PART_OVERHEAD_TOKENS) {
    return message;
  }

  const text = messageText(message);
  const charBudget = Math.max(0, (tokenBudget - PER_PART_OVERHEAD_TOKENS) * 4);
  const truncated = text.slice(0, charBudget);

  if (isSystemMessage(message)) {
    return new SystemMessage(truncated);
  }
  if (isHumanMessage(message)) {
    return new HumanMessage(truncated);
  }
  if (messageType(message) === "tool") {
    const toolCallId = String((message as ToolMessage).tool_call_id ?? "");
    return new ToolMessage({
      content: truncated,
      tool_call_id: toolCallId,
    });
  }
  if (messageType(message) === "ai") {
    return new AIMessage({
      content: truncated,
      tool_calls: (message as AIMessage).tool_calls,
    });
  }
  return message;
}

/**
 * Bound the fully assembled model input: system instructions, page context,
 * tool schemas, and history. Oldest history is dropped first. Tool-call and
 * tool-result groups stay together. Chronological order is preserved so
 * CopilotKit continuations remain user → model tool call → tool result.
 */
export function boundAssembledModelInput(
  messages: BaseMessage[],
  tools: TokenCountableTool[],
  maxInputTokens: number
): BoundInputResult {
  const definedMessages = messages.filter((message): message is BaseMessage => Boolean(message));
  const toolTokens = estimateToolSchemaTokens(tools);
  const systemMessages = definedMessages.filter(isSystemMessage);
  const nonSystem = definedMessages.filter((message) => !isSystemMessage(message));

  const lastUserIndex = findLastIndex(nonSystem, isHumanMessage);
  const prefix = lastUserIndex >= 0 ? nonSystem.slice(0, lastUserIndex) : [];
  const suffix = lastUserIndex >= 0 ? nonSystem.slice(lastUserIndex) : nonSystem;

  let boundedSystems = collapseSystemMessages(systemMessages);
  let boundedSuffix = suffix;
  let systemTokens = boundedSystems.reduce((sum, message) => sum + estimateMessageTokens(message), 0);
  let suffixTokens = boundedSuffix.reduce((sum, message) => sum + estimateMessageTokens(message), 0);
  let reservedTokens = toolTokens + systemTokens + suffixTokens;

  if (reservedTokens > maxInputTokens) {
    const remainingAfterTools = Math.max(0, maxInputTokens - toolTokens);
    const systemBudget = Math.max(32, Math.floor(remainingAfterTools * 0.6));
    boundedSystems = boundedSystems.map((message) => truncateMessageContent(message, systemBudget));
    systemTokens = boundedSystems.reduce((sum, message) => sum + estimateMessageTokens(message), 0);

    const remainingForSuffix = Math.max(32, remainingAfterTools - systemTokens);
    const humanIndex = boundedSuffix.findIndex(isHumanMessage);
    if (humanIndex >= 0) {
      const human = boundedSuffix[humanIndex];
      const otherSuffixTokens = suffixTokens - estimateMessageTokens(human);
      const userBudget = Math.max(32, remainingForSuffix - otherSuffixTokens);
      boundedSuffix = boundedSuffix.map((message, index) =>
        index === humanIndex ? truncateMessageContent(message, userBudget) : message
      );
      suffixTokens = boundedSuffix.reduce((sum, message) => sum + estimateMessageTokens(message), 0);
    }
    reservedTokens = toolTokens + systemTokens + suffixTokens;
  }

  const historyBudget = Math.max(0, maxInputTokens - reservedTokens);
  const groups = groupMessagesPreservingToolPairs(prefix);
  const keptGroups: BaseMessage[][] = [];
  let usedHistoryTokens = 0;
  let droppedMessageCount = 0;

  for (let index = groups.length - 1; index >= 0; index -= 1) {
    const group = groups[index];
    const groupTokens = group.reduce((sum, message) => sum + estimateMessageTokens(message), 0);
    if (usedHistoryTokens + groupTokens <= historyBudget) {
      keptGroups.unshift(group);
      usedHistoryTokens += groupTokens;
    } else {
      droppedMessageCount += group.length;
    }
  }

  const boundedMessages = [...boundedSystems, ...keptGroups.flat(), ...boundedSuffix];

  const estimatedInputTokens =
    toolTokens + boundedMessages.reduce((sum, message) => sum + estimateMessageTokens(message), 0);

  return {
    messages: boundedMessages,
    estimatedInputTokens,
    historyTruncated: droppedMessageCount > 0 || boundedMessages.length !== definedMessages.length,
    droppedMessageCount,
    reservedTokens,
  };
}

function collapseSystemMessages(systems: BaseMessage[]): BaseMessage[] {
  if (systems.length <= 1) {
    return systems;
  }
  const content = systems
    .map((message) => messageText(message).trim())
    .filter(Boolean)
    .join("\n\n");
  return content ? [new SystemMessage(content)] : [];
}

function findLastIndex<T>(items: T[], predicate: (item: T) => boolean): number {
  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (predicate(items[index])) {
      return index;
    }
  }
  return -1;
}
