import { createErrorResponse } from "../errors";
import { VISITOR_BUSY_MESSAGE, VISITOR_UNAVAILABLE_MESSAGE } from "./constants";

export class AssistantUnavailableError extends Error {
  readonly code: string;

  constructor(code = "ASSISTANT_UNAVAILABLE", message = VISITOR_UNAVAILABLE_MESSAGE) {
    super(message);
    this.name = "AssistantUnavailableError";
    this.code = code;
  }
}

export class AssistantSpendError extends AssistantUnavailableError {
  readonly httpStatus: number;
  readonly retryAfterSeconds?: number;
  readonly visitorMessage: string;

  constructor(
    code: string,
    visitorMessage: string,
    httpStatus: number,
    retryAfterSeconds?: number
  ) {
    super(code, visitorMessage);
    this.name = "AssistantSpendError";
    this.visitorMessage = visitorMessage;
    this.httpStatus = httpStatus;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export function visitorSafeAssistantResponse(
  statusCode = 503,
  options?: {
    error?: string;
    message?: string;
    retryAfterSeconds?: number;
  }
) {
  const response = createErrorResponse(
    options?.error ?? "ASSISTANT_UNAVAILABLE",
    options?.message ?? VISITOR_UNAVAILABLE_MESSAGE,
    statusCode
  );
  if (options?.retryAfterSeconds && options.retryAfterSeconds > 0) {
    response.headers.set("Retry-After", String(options.retryAfterSeconds));
  }
  return response;
}

export function responseFromSpendError(error: AssistantSpendError) {
  return visitorSafeAssistantResponse(error.httpStatus, {
    error: error.code,
    message: error.visitorMessage,
    retryAfterSeconds: error.retryAfterSeconds,
  });
}

export function toVisitorSafeError(error: unknown): AssistantUnavailableError {
  if (error instanceof AssistantUnavailableError) {
    return error;
  }
  return new AssistantUnavailableError();
}

export { VISITOR_BUSY_MESSAGE };
