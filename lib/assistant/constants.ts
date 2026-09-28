/**
 * Shared assistant constants. Safe for client and server.
 * Server-only settings live in `config.ts` and must not be imported here.
 */

export const ASSISTANT_CONTACT_PATH = "/contact";

export const VISITOR_UNAVAILABLE_MESSAGE =
  "The assistant is temporarily unavailable. Please visit the contact page to reach our team.";

/** Production and rollback model. Unchanged as the default during this stage. */
export const ASSISTANT_ROLLBACK_MODEL = "gemini-2.5-flash";

/** Local/preview trial candidate. Must be opted into via GEMINI_MODEL. */
export const ASSISTANT_TRIAL_CANDIDATE_MODEL = "gemini-2.5-flash-lite";

export const ASSISTANT_DEFAULT_MODEL = ASSISTANT_ROLLBACK_MODEL;

export const ASSISTANT_KNOWN_TRIAL_MODELS = [
  ASSISTANT_ROLLBACK_MODEL,
  ASSISTANT_TRIAL_CANDIDATE_MODEL,
] as const;

export type AssistantKnownTrialModel = (typeof ASSISTANT_KNOWN_TRIAL_MODELS)[number];

export const ASSISTANT_DEFAULT_MAX_INPUT_TOKENS = 16_000;
export const ASSISTANT_DEFAULT_MAX_OUTPUT_TOKENS = 1_024;
export const ASSISTANT_DEFAULT_TIMEOUT_MS = 30_000;

export const ASSISTANT_MAX_INPUT_TOKENS_CEILING = 1_000_000;
export const ASSISTANT_MAX_OUTPUT_TOKENS_CEILING = 8_192;
export const ASSISTANT_TIMEOUT_MS_CEILING = 120_000;

export const VISITOR_BUSY_MESSAGE =
  "The assistant is busy right now. Please try again in a moment, or visit the contact page to reach our team.";

export const ASSISTANT_DEFAULT_REQUESTS_PER_MINUTE = 10;
export const ASSISTANT_DEFAULT_REQUESTS_PER_HOUR = 25;
export const ASSISTANT_DEFAULT_REQUESTS_PER_DAY = 100;
export const ASSISTANT_DEFAULT_DAILY_BUDGET_USD = 1;
export const ASSISTANT_DEFAULT_MONTHLY_BUDGET_USD = 10;
export const ASSISTANT_DEFAULT_MAX_BODY_BYTES = 262_144;
export const ASSISTANT_DEFAULT_MAX_USER_MESSAGE_CHARS = 4_000;
export const ASSISTANT_DEFAULT_MAX_TOOL_RESULT_CHARS = 8_000;
export const ASSISTANT_DEFAULT_MAX_MODEL_CALLS_PER_REQUEST = 4;
export const ASSISTANT_DEFAULT_MAX_TOOL_EVENTS_PER_TURN = 6;

/** ICDU is the assistant model provider. Gemini is an explicit rollback only. */
export const ASSISTANT_DEFAULT_PROVIDER = "icdu" as const;
export const ICDU_DEFAULT_BASE_URL = "https://icdu-api.uterpi.com/v1";
export const ICDU_DEFAULT_MODEL = "icdu";
export const ICDU_EMBED_MODEL = "icdu-embed-v1";
export const ICDU_EMBED_DIMENSIONS = 768;
export const ICDU_MAX_OUTPUT_TOKENS = 2_048;
export const ICDU_MAX_UPSTREAM_BODY_BYTES = 96 * 1024;
export const ICDU_MAX_MESSAGES = 100;
export const ICDU_MAX_TOOLS = 32;
export const ICDU_EMBED_MAX_STRINGS = 16;
export const ICDU_EMBED_MAX_CHARS = 3_000;
export const ICDU_EMBED_MAX_COMBINED_CHARS = 24_000;

export const VISITOR_TURN_LIMIT_MESSAGE =
  "This conversation has used its model-call allowance. Please send a new question later, or visit the contact page to reach our team.";

export function visitorGatewayBusyMessage(retryAfterSeconds: number): string {
  const seconds = Math.max(1, Math.ceil(retryAfterSeconds));
  return `The assistant is busy right now. Please try again in ${seconds} seconds, or visit the contact page to reach our team.`;
}

export function visitorHourlyLimitMessage(limit: number, remaining: number, resetAtIso: string): string {
  const left = Math.max(0, Math.floor(remaining));
  return `You can send ${limit} messages per hour. ${left} remaining. The allowance resets at ${resetAtIso}. Please try again then, or visit the contact page.`;
}

export function approvedVisitorMessage(message: string | undefined): string {
  if (!message) {
    return VISITOR_UNAVAILABLE_MESSAGE;
  }
  if (message === VISITOR_UNAVAILABLE_MESSAGE || message === VISITOR_BUSY_MESSAGE || message === VISITOR_TURN_LIMIT_MESSAGE) {
    return message;
  }
  if (
    message.startsWith("The assistant is busy right now. Please try again in ")
    && message.endsWith("or visit the contact page to reach our team.")
    && !/api[_ -]?key|bearer|password|authorization/i.test(message)
  ) {
    return message;
  }
  if (
    message.startsWith("You can send ")
    && message.includes(" remaining. The allowance resets at ")
    && message.endsWith("Please try again then, or visit the contact page.")
    && !/api[_ -]?key|bearer|password|authorization/i.test(message)
  ) {
    return message;
  }
  return VISITOR_UNAVAILABLE_MESSAGE;
}
