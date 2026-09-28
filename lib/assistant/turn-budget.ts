import { ICDU_RETRIEVAL_BUDGET_MS } from "./constants";

/** How long query embedding may run, and whether it is worth starting. */
export function retrievalPlan(remainingMs: number): { budgetMs: number; embed: boolean } {
  const budgetMs = Math.min(ICDU_RETRIEVAL_BUDGET_MS, Math.max(0, remainingMs));
  return { budgetMs, embed: budgetMs >= 1_000 };
}

/**
 * Per-call model timeout. Never longer than the configured gateway budget,
 * and never longer than the time left on the visitor's whole turn.
 */
export function generationTimeoutMs(remainingMs: number, configuredTimeoutMs: number): number {
  return Math.min(configuredTimeoutMs, Math.max(0, remainingMs));
}
