// lib/contact/coe-intent.ts
// ---------------------------------------------------------------------------
// CoE → /contact intent handoff. Query param carries only a non-sensitive
// intent key; Snapshot context comes from session storage (see snapshot-handoff).
// ---------------------------------------------------------------------------

import type { SnapshotHandoff } from "@/lib/coe/snapshot-handoff";

export const COE_INTENT_IDS = [
  "diagnostic",
  "pilot",
  "scale",
  "readiness-workshop",
] as const;

export type CoeIntentId = (typeof COE_INTENT_IDS)[number];
export type ResolvedCoeIntentId = CoeIntentId | "general";

export interface CoeIntentCopy {
  id: ResolvedCoeIntentId;
  /** Normalized value stored in the hidden form field / submission. */
  normalizedIntent: ResolvedCoeIntentId;
  subject: string;
  heading: string;
  intro: string;
  /** Default editable message body (without Snapshot summary). */
  messageTemplate: string;
  source: "ai-coe";
}

const INTENT_COPY: Record<CoeIntentId, Omit<CoeIntentCopy, "id" | "normalizedIntent" | "source">> = {
  diagnostic: {
    subject: "AI CoE Readiness Diagnostic",
    heading: "Request a Readiness Diagnostic",
    intro:
      "Tell us a bit about your organization. We’ll follow up to discuss a fixed-scope Readiness Diagnostic (estimated 2–3 weeks) — this form does not schedule a meeting by itself.",
    messageTemplate:
      "I’d like to discuss an AI CoE Readiness Diagnostic for our organization. Please follow up to scope next steps.",
  },
  pilot: {
    subject: "AI CoE Foundation Pilot",
    heading: "Request a Foundation Pilot conversation",
    intro:
      "Share context for a Foundation Pilot discussion. Submitting this form requests a follow-up — it does not book a calendar slot.",
    messageTemplate:
      "I’d like to discuss an AI CoE Foundation Pilot. Please follow up to scope a conversation about proving value on one use case.",
  },
  scale: {
    subject: "AI CoE Build & Scale",
    heading: "Request a CoE Build & Scale conversation",
    intro:
      "Share context for a Build & Scale discussion. Submitting this form requests a follow-up — it does not book a calendar slot.",
    messageTemplate:
      "I’d like to discuss CoE Build & Scale for our organization. Please follow up to scope next steps.",
  },
  "readiness-workshop": {
    subject: "AI CoE Readiness Workshop",
    heading: "Request a Readiness Workshop",
    intro:
      "Tell us what you’d like to cover in a Readiness Workshop. Submitting this form requests a follow-up — it does not schedule the workshop.",
    messageTemplate:
      "I’d like to request an AI CoE Readiness Workshop. Please follow up to discuss timing and scope.",
  },
};

const GENERAL_COPY: CoeIntentCopy = {
  id: "general",
  normalizedIntent: "general",
  subject: "",
  heading: "Get in Touch",
  intro: "Fill out the form below and we’ll follow up during business hours.",
  messageTemplate: "",
  source: "ai-coe",
};

export function isCoeIntentId(value: string | null | undefined): value is CoeIntentId {
  return COE_INTENT_IDS.includes(value as CoeIntentId);
}

/** Parse ?intent= into a supported CoE intent or safe generic fallback. */
export function resolveCoeIntent(raw: string | null | undefined): ResolvedCoeIntentId {
  if (!raw) return "general";
  const normalized = raw.trim().toLowerCase();
  if (isCoeIntentId(normalized)) return normalized;
  // Common aliases from older or alternate CTAs
  if (normalized === "workshop" || normalized === "readiness_workshop") return "readiness-workshop";
  if (normalized === "build" || normalized === "build-scale" || normalized === "build_and_scale") {
    return "scale";
  }
  if (normalized === "foundation" || normalized === "foundation-pilot") return "pilot";
  return "general";
}

export function getCoeIntentCopy(raw: string | null | undefined): CoeIntentCopy {
  const id = resolveCoeIntent(raw);
  if (id === "general") return GENERAL_COPY;
  return {
    id,
    normalizedIntent: id,
    source: "ai-coe",
    ...INTENT_COPY[id],
  };
}

/** Non-sensitive Snapshot lines appended into the editable message when present. */
export function formatSnapshotContextForMessage(handoff: SnapshotHandoff | null | undefined): string {
  if (!handoff) return "";
  const lines = [
    "",
    "—",
    "AI CoE Readiness Snapshot context (orientation only — not a validated maturity score):",
    `Maturity band: ${handoff.maturityBandName}`,
    `Recommended entry tier: ${handoff.recommendedTierName}`,
    `Primary opportunity: ${handoff.largestGapLabel}`,
  ];
  return lines.join("\n");
}

export function buildPrefillMessage(
  intent: ResolvedCoeIntentId,
  handoff: SnapshotHandoff | null | undefined
): string {
  const copy = getCoeIntentCopy(intent === "general" ? null : intent);
  const base = copy.messageTemplate;
  const context = formatSnapshotContextForMessage(handoff);
  if (!base && !context) return "";
  if (!base) return context.trim();
  if (!context) return base;
  return `${base}${context}`;
}

/**
 * Compact, non-sensitive context string for a hidden form field / server log.
 * Never include free-text company details or PII.
 */
export function serializeCoeContextForSubmit(
  handoff: SnapshotHandoff | null | undefined
): string {
  if (!handoff) return "";
  return JSON.stringify({
    maturityBand: handoff.maturityBandName,
    recommendedTier: handoff.recommendedTierName,
    primaryOpportunity: handoff.largestGapLabel,
    stage: handoff.stageId,
  });
}

/** Server-side footer ensuring intent is present in persisted submission data. */
export function appendSubmissionMetadata(params: {
  message: string;
  intent: ResolvedCoeIntentId;
  source: string;
  coeContextJson?: string;
}): string {
  const parts = [
    params.message.trim(),
    "",
    "—",
    `Inquiry source: ${params.source}`,
    `Normalized intent: ${params.intent}`,
  ];
  if (params.coeContextJson) {
    try {
      const ctx = JSON.parse(params.coeContextJson) as Record<string, string>;
      parts.push("CoE Snapshot context (non-sensitive):");
      if (ctx.maturityBand) parts.push(`  Maturity band: ${ctx.maturityBand}`);
      if (ctx.recommendedTier) parts.push(`  Recommended tier: ${ctx.recommendedTier}`);
      if (ctx.primaryOpportunity) parts.push(`  Primary opportunity: ${ctx.primaryOpportunity}`);
      if (ctx.stage) parts.push(`  Visitor stage: ${ctx.stage}`);
    } catch {
      // Ignore malformed context — never block submission.
    }
  }
  return parts.join("\n");
}
