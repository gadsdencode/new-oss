import { ASSISTANT_ROLLBACK_MODEL, ASSISTANT_TRIAL_CANDIDATE_MODEL } from "./constants";
import type { NanoDollars } from "./money";

/**
 * Application model-price table verified against Google Gemini Developer API
 * pricing on 2026-09-15:
 * https://ai.google.dev/gemini-api/docs/pricing
 *
 * Standard paid tier, text input, output including thinking tokens.
 * This is an application budget for modeled API charges, not a guaranteed
 * cap on the full Google or Vercel invoice.
 */
export const ASSISTANT_PRICING_VERSION = "google-ai-2026-09-15";
export const ASSISTANT_PRICING_SOURCE = "https://ai.google.dev/gemini-api/docs/pricing";

export interface ModelTokenPrices {
  model: string;
  inputNanosPerToken: NanoDollars;
  outputNanosPerToken: NanoDollars;
  notes: string;
}

const PRICES: Record<string, ModelTokenPrices> = {
  [ASSISTANT_ROLLBACK_MODEL]: {
    model: ASSISTANT_ROLLBACK_MODEL,
    // $0.30 / 1M input tokens = 300 nanos/token
    inputNanosPerToken: BigInt(300),
    // $2.50 / 1M output tokens (includes thinking tokens) = 2500 nanos/token
    outputNanosPerToken: BigInt(2500),
    notes: "Standard paid tier. Output price includes thinking tokens.",
  },
  [ASSISTANT_TRIAL_CANDIDATE_MODEL]: {
    model: ASSISTANT_TRIAL_CANDIDATE_MODEL,
    // $0.10 / 1M input tokens = 100 nanos/token
    inputNanosPerToken: BigInt(100),
    // $0.40 / 1M output tokens (includes thinking tokens) = 400 nanos/token
    outputNanosPerToken: BigInt(400),
    notes: "Standard paid tier. Output price includes thinking tokens.",
  },
};

export function getModelPrices(model: string): ModelTokenPrices | null {
  return PRICES[model] ?? null;
}

export function conservativeCallChargeNanos(
  prices: ModelTokenPrices,
  inputTokens: number,
  outputTokens: number,
  reasoningTokens = 0
): NanoDollars {
  const billableOutput = outputTokens + reasoningTokens;
  return BigInt(Math.max(0, Math.ceil(inputTokens))) * prices.inputNanosPerToken
    + BigInt(Math.max(0, Math.ceil(billableOutput))) * prices.outputNanosPerToken;
}
