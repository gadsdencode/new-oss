import { hashVisitorText } from "./visitor-turn";

export const COPILOTKIT_GENERATE_OPERATION = "generateCopilotResponse";

export type CopilotKitGraphqlBody = {
  operationName?: string;
  query?: string;
  variables?: {
    data?: Record<string, unknown>;
    properties?: unknown;
  };
};

export type CopilotMessageKind = "user-text" | "assistant-text" | "tool-call" | "tool-result" | "other";

export interface ParsedCopilotMessage {
  kind: CopilotMessageKind;
  role?: string;
  textLength: number;
  digest?: string;
}

export type ParsedCopilotRequest =
  | { kind: "generation"; operationName: string; messages: ParsedCopilotMessage[]; isToolContinuation: boolean }
  | { kind: "metadata"; operationName: string }
  | { kind: "invalid"; reason: string };

function messageKind(message: unknown): ParsedCopilotMessage {
  if (!message || typeof message !== "object") {
    return { kind: "other", textLength: 0 };
  }
  const value = message as Record<string, unknown>;
  const text = value.textMessage as Record<string, unknown> | undefined;
  if (text && typeof text.content === "string") {
    const role = typeof text.role === "string" ? text.role.toLowerCase() : "";
    if (role === "user") {
      return { kind: "user-text", role, textLength: text.content.length, digest: hashVisitorText(text.content) };
    }
    return { kind: "assistant-text", role, textLength: text.content.length };
  }
  if (value.actionExecutionMessage && typeof value.actionExecutionMessage === "object") {
    const args = (value.actionExecutionMessage as { arguments?: unknown }).arguments;
    return { kind: "tool-call", textLength: typeof args === "string" ? args.length : 0 };
  }
  if (value.resultMessage && typeof value.resultMessage === "object") {
    const result = (value.resultMessage as { result?: unknown }).result;
    return { kind: "tool-result", textLength: typeof result === "string" ? result.length : 0 };
  }
  return { kind: "other", textLength: 0 };
}

function operationNameFrom(body: CopilotKitGraphqlBody): string {
  if (typeof body.operationName === "string" && body.operationName.trim()) {
    return body.operationName.trim();
  }
  const query = typeof body.query === "string" ? body.query : "";
  const match = query.match(/\b(mutation|query)\s+(\w+)/);
  if (match?.[2]) {
    return match[2];
  }
  if (query.includes(COPILOTKIT_GENERATE_OPERATION)) {
    return COPILOTKIT_GENERATE_OPERATION;
  }
  if (/\bavailableAgents\b/.test(query) || /\bloadAgentState\b/.test(query) || /\bhello\b/.test(query)) {
    return "metadata";
  }
  return "";
}

export function parseCopilotKitRequest(body: unknown): ParsedCopilotRequest {
  if (!body || typeof body !== "object") {
    return { kind: "invalid", reason: "not_json_object" };
  }
  const graphql = body as CopilotKitGraphqlBody;
  const operationName = operationNameFrom(graphql);

  if (!operationName || operationName === "metadata" || operationName === "availableAgents" || operationName === "loadAgentState" || operationName === "hello") {
    if (!operationName) {
      return { kind: "invalid", reason: "unknown_operation" };
    }
    return { kind: "metadata", operationName };
  }

  if (operationName !== COPILOTKIT_GENERATE_OPERATION) {
    return { kind: "invalid", reason: "unsupported_operation" };
  }

  const data = graphql.variables?.data;
  if (!data || typeof data !== "object") {
    return { kind: "invalid", reason: "missing_generate_data" };
  }
  if (!Array.isArray((data as { messages?: unknown }).messages)) {
    return { kind: "invalid", reason: "missing_messages" };
  }
  if (!(data as { frontend?: unknown }).frontend || typeof (data as { frontend?: unknown }).frontend !== "object") {
    return { kind: "invalid", reason: "missing_frontend" };
  }

  const messages = ((data as { messages: unknown[] }).messages).map(messageKind);
  const last = messages.at(-1);
  const isToolContinuation = last?.kind === "tool-result" || last?.kind === "tool-call";
  return {
    kind: "generation",
    operationName,
    messages,
    isToolContinuation,
  };
}

export function findExcessUserMessage(
  messages: ParsedCopilotMessage[],
  maxUserChars: number,
  maxToolResultChars: number
): "user" | "tool-result" | null {
  for (const message of messages) {
    if (message.kind === "user-text" && message.textLength > maxUserChars) {
      return "user";
    }
    if (message.kind === "tool-result" && message.textLength > maxToolResultChars) {
      return "tool-result";
    }
  }
  return null;
}
