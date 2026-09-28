import { AssistantSpendError, AssistantUnavailableError } from "./errors";
import { visitorGatewayBusyMessage } from "./constants";

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
    const retryAfterSeconds = readRetryAfterSeconds(error) ?? 5;
    return new AssistantSpendError(
      "ASSISTANT_BUSY",
      visitorGatewayBusyMessage(retryAfterSeconds),
      429,
      retryAfterSeconds
    );
  }
  return new AssistantUnavailableError("ASSISTANT_PROVIDER_ERROR");
}

export function upstreamShouldRetry(): false {
  return false;
}
