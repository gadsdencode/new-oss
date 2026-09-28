import { AssistantSpendError, AssistantUnavailableError } from "./errors";
import {
  visitorGatewayBusyMessage,
  visitorGatewayRateLimitMessage,
  visitorQueueFullMessage,
  visitorQueueTimeoutMessage,
} from "./constants";

function readStatus(error: unknown): number | undefined {
  if (!error || typeof error !== "object") {
    return undefined;
  }
  const record = error as { status?: unknown; statusCode?: unknown; cause?: unknown; message?: unknown };
  if (typeof record.status === "number") {
    return record.status;
  }
  if (typeof record.statusCode === "number") {
    return record.statusCode;
  }
  if (typeof record.message === "string" && /\b429\b/.test(record.message)) {
    return 429;
  }
  if (record.cause) {
    return readStatus(record.cause);
  }
  return undefined;
}

function headerValue(headers: unknown, name: string): string | undefined {
  if (!headers) {
    return undefined;
  }
  if (typeof (headers as { get?: unknown }).get === "function") {
    const value = (headers as { get: (header: string) => string | null }).get(name);
    return value ?? undefined;
  }
  if (typeof headers === "object") {
    const record = headers as Record<string, unknown>;
    const match = record[name] ?? record[name.toLowerCase()] ?? record[name.toUpperCase()];
    return typeof match === "string" ? match : undefined;
  }
  return undefined;
}

export type GatewayBusyCode = "queue_full" | "queue_timeout" | "rate_limit";

function readErrorCode(error: unknown): string | undefined {
  if (!error || typeof error !== "object") {
    return undefined;
  }
  const record = error as {
    code?: unknown;
    message?: unknown;
    error?: { code?: unknown };
    cause?: unknown;
  };
  if (typeof record.code === "string" && record.code.trim() && record.code !== "ASSISTANT_BUSY") {
    return record.code.trim();
  }
  if (record.error && typeof record.error.code === "string" && record.error.code.trim()) {
    return record.error.code.trim();
  }
  if (typeof record.message === "string") {
    const match = record.message.match(/"code"\s*:\s*"(queue_full|queue_timeout|rate_limit)"/);
    if (match?.[1]) {
      return match[1];
    }
  }
  if (record.cause) {
    return readErrorCode(record.cause);
  }
  return undefined;
}

export function readGatewayBusyCode(error: unknown): GatewayBusyCode | null {
  const code = readErrorCode(error);
  if (code === "queue_full" || code === "queue_timeout" || code === "rate_limit") {
    return code;
  }
  return null;
}

export function readRetryAfterSeconds(error: unknown): number | undefined {
  if (!error || typeof error !== "object") {
    return undefined;
  }
  const headers = (error as { headers?: unknown; response?: { headers?: unknown } }).headers
    ?? (error as { response?: { headers?: unknown } }).response?.headers;
  const raw = headerValue(headers, "retry-after");
  if (!raw) {
    const cause = (error as { cause?: unknown }).cause;
    return cause ? readRetryAfterSeconds(cause) : undefined;
  }
  const seconds = Number.parseInt(raw, 10);
  if (Number.isFinite(seconds) && seconds >= 0) {
    return seconds;
  }
  const date = Date.parse(raw);
  if (Number.isFinite(date)) {
    return Math.max(0, Math.ceil((date - Date.now()) / 1000));
  }
  return undefined;
}

/**
 * Map an upstream failure to a visitor-safe error.
 * 429 is not retried here. Callers must not start another model request.
 */
export function classifyUpstreamError(error: unknown, aborted = false): AssistantUnavailableError {
  if (error instanceof AssistantUnavailableError) {
    return error;
  }
  if (aborted) {
    const reason = error as { name?: string } | undefined;
    if (reason && typeof reason === "object" && reason.name === "TimeoutError") {
      return new AssistantUnavailableError("ASSISTANT_TIMEOUT");
    }
    return new AssistantUnavailableError(aborted ? "ASSISTANT_CANCELLED" : "ASSISTANT_PROVIDER_ERROR");
  }
  const status = readStatus(error);
  if (status === 429) {
    const busyCode = readGatewayBusyCode(error);
    const retryAfterSeconds = readRetryAfterSeconds(error) ?? (busyCode === "rate_limit" ? 60 : 5);
    const message = busyCode === "queue_full"
      ? visitorQueueFullMessage(retryAfterSeconds)
      : busyCode === "queue_timeout"
        ? visitorQueueTimeoutMessage(retryAfterSeconds)
        : busyCode === "rate_limit"
          ? visitorGatewayRateLimitMessage(retryAfterSeconds)
          : visitorGatewayBusyMessage(retryAfterSeconds);
    return new AssistantSpendError("ASSISTANT_BUSY", message, 429, retryAfterSeconds, busyCode ?? undefined);
  }
  return new AssistantUnavailableError("ASSISTANT_PROVIDER_ERROR");
}

export function upstreamShouldRetry(): false {
  return false;
}
