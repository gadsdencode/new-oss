/**
 * Dated assumptions for public calculators and educational AI explanations.
 * These are Overture engagement estimates, not live provider quotes or a
 * ranking of current models.
 */
export const ESTIMATE_ASSUMPTIONS_VERSION = "overture-estimates-2026-09-15";

export const OFFICIAL_PROVIDER_PRICING_LINKS = [
  { name: "Google Gemini", href: "https://ai.google.dev/gemini-api/docs/pricing" },
  { name: "OpenAI", href: "https://openai.com/api/pricing/" },
  { name: "Anthropic", href: "https://docs.anthropic.com/en/docs/about-claude/pricing" },
  { name: "Google Cloud Vertex AI", href: "https://cloud.google.com/vertex-ai/generative-ai/pricing" },
] as const;

export const ESTIMATE_ASSUMPTIONS = {
  version: ESTIMATE_ASSUMPTIONS_VERSION,
  asOf: "2026-09-15",
  summary:
    "Calculator figures are internal Overture ballpark engagement estimates using fixed setup and monthly multipliers. They are not current official provider list prices, benchmarks, or an invoice.",
  officialPricingLinks: OFFICIAL_PROVIDER_PRICING_LINKS,
  catalogNote:
    "On-page model names, scores, and prices are educational and undated. Do not present them as current verified advice or rankings.",
} as const;

export function estimatorDisclaimerText(): string {
  return `${ESTIMATE_ASSUMPTIONS.summary} Assumptions dated ${ESTIMATE_ASSUMPTIONS.asOf} (${ESTIMATE_ASSUMPTIONS.version}). Official provider pricing: ${OFFICIAL_PROVIDER_PRICING_LINKS.map((link) => link.href).join(" ")}`;
}
