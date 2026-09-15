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
export const ASSISTANT_DEFAULT_REQUESTS_PER_DAY = 100;
export const ASSISTANT_DEFAULT_DAILY_BUDGET_USD = 1;
export const ASSISTANT_DEFAULT_MONTHLY_BUDGET_USD = 10;
export const ASSISTANT_DEFAULT_MAX_BODY_BYTES = 262_144;
export const ASSISTANT_DEFAULT_MAX_USER_MESSAGE_CHARS = 4_000;
export const ASSISTANT_DEFAULT_MAX_TOOL_RESULT_CHARS = 8_000;
export const ASSISTANT_DEFAULT_MAX_MODEL_CALLS_PER_REQUEST = 4;
