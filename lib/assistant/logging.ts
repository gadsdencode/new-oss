import { logError, logMessage, type ErrorContext } from "../monitoring";

const SENSITIVE_KEY_PATTERN =
  /(api[_-]?key|authorization|token|secret|password|email|prompt|message|payload|conversation|form)/i;

function sanitizeContext(context?: ErrorContext): ErrorContext | undefined {
  if (!context) {
    return undefined;
  }

  const sanitized: ErrorContext = {};
  for (const [key, value] of Object.entries(context)) {
    if (SENSITIVE_KEY_PATTERN.test(key)) {
      continue;
    }
    if (typeof value === "string" && value.length > 240) {
      sanitized[key] = "[omitted]";
      continue;
    }
    if (value && typeof value === "object") {
      continue;
    }
    sanitized[key] = value;
  }
  return sanitized;
}

export function logAssistantEvent(
  event: string,
  context?: ErrorContext,
  level: "info" | "warn" | "error" = "info"
): void {
  logMessage(event, sanitizeContext(context), level);
}

export function logAssistantError(error: unknown, context?: ErrorContext): void {
  logError(error, sanitizeContext(context), "high");
}
