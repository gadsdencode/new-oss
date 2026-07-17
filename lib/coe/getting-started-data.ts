// lib/coe/getting-started-data.ts
// ---------------------------------------------------------------------------
// GETTING_STARTED — single source of truth for ALL copy in the getting-started
// funnel. Consumed by:
//   - app/ai-center-of-excellence/getting-started/page.tsx (page + JSON-LD)
//   - app/ai-center-of-excellence/page.tsx (hub engagement section)
//   - components/coe/path-finder.tsx (interactive wizard)
//   - components/coe/engagement-phases.tsx (phase stepper)
//   - components/coe/coe-readiness-assessment.tsx (entry-tier recommendation)
//   - app/ai-center-of-excellence/CoEPageTools.tsx (assistant context)
// Editorial defaults: timelines SHOWN as estimates, pricing NOT shown.
// ---------------------------------------------------------------------------
export const GETTING_STARTED = {
  hero: {
    eyebrow: "Center of Excellence",
    title: "How to get started",
    subtitle:
      "You don't have to commit to a full build to begin. Most teams start with a short, fixed-scope diagnostic, then scale as the value is proven.",
  },

  /**
   * Shown near every timeline surface. Durations are estimates, not commitments.
   */
  durationDisclaimer:
    "All durations are estimates. Actual timelines depend on organizational readiness, access to data and systems, use-case complexity, stakeholder availability, security requirements, and existing infrastructure.",

  // Three entry tiers. Maps to journey stages:
  // Diagnostic = Exploring/Planning, Pilot = Building, Build & Scale = Scaling.
  tiers: [
    {
      id: "diagnostic",
      name: "Readiness Diagnostic",
      tagline: "Find out where you stand",
      image: "/images/coe/coe-tier-diagnostic.webp",
      duration: "Estimated 2–3 weeks",
      whatItIs:
        "Discovery across the six CoE pillars: a substantiated maturity profile, prioritized gaps, success measures, and a recommended roadmap. This engagement is the Readiness Diagnostic only — estimated 2–3 weeks — and does not include Foundation, Pilot & Prove, or Scale & Enable work.",
      walkAwayWith: [
        "A maturity profile across the six pillars",
        "A prioritized gap analysis",
        "Success measures and a recommended roadmap",
      ],
      bestFor:
        "Teams exploring or planning a CoE who want an objective baseline before committing.",
      featured: true,
    },
    {
      id: "pilot",
      name: "Foundation Pilot",
      tagline: "Prove value on one real use case",
      image: "/images/coe/coe-tier-pilot.webp",
      duration: "Estimated 8–12 weeks",
      whatItIs:
        "Establish the minimum governance, data, and technical foundation, and deliver one high-value use case through a production-ready pilot.",
      walkAwayWith: [
        "A production-ready pilot",
        "A governance and data baseline",
        "A measured outcome to build the internal case",
      ],
      bestFor:
        "Teams ready to build who want to de-risk the full investment by proving the model first.",
      featured: false,
    },
    {
      id: "scale",
      name: "CoE Build & Scale",
      tagline: "Operationalize the full Center of Excellence",
      image: "/images/coe/coe-tier-scale.webp",
      duration: "Phased, generally 6 months or more",
      whatItIs:
        "Operationalize and expand the full CoE operating model — internal ownership, adoption, and continuous improvement across the six pillars.",
      walkAwayWith: [
        "A running Center of Excellence",
        "An operating model and governance framework",
        "An enabled internal team and adoption plan",
      ],
      bestFor:
        "Teams scaling AI who are committed to a durable, organization-wide capability.",
      featured: false,
    },
  ],

  // "What you'll need" — qualifies leads and builds trust.
  prerequisites: [
    {
      title: "An executive sponsor",
      detail:
        "A senior leader accountable for outcomes and empowered to clear roadblocks.",
    },
    {
      title: "A defined business problem",
      detail:
        "At least one concrete, high-value problem to anchor the work. We help you sharpen it if needed.",
    },
    {
      title: "Access to data and systems",
      detail:
        "Reasonable access to the relevant data, tools, and stakeholders during the engagement.",
    },
    {
      title: "A cross-functional point of contact",
      detail:
        "One person or small team to coordinate on your side and keep momentum.",
    },
  ],
  prerequisitesNote:
    "Don't have all of these in place yet? That is exactly what the Readiness Diagnostic is for.",

  // Engagement phases — how work progresses across tiers.
  // Phase 01 = Diagnostic scope only.
  // Phases 02–03 together = Foundation Pilot (estimated 8–12 weeks total).
  // Phase 04 = Build & Scale.
  phases: [
    {
      step: "01",
      title: "Discovery & Readiness",
      duration: "Estimated 2–3 weeks",
      tierLabel: "Readiness Diagnostic",
      ossDoes:
        "Run discovery and a six-pillar readiness baseline, identify prioritized gaps, and define success measures with a recommended roadmap.",
      youDo: "Connect us with stakeholders and provide access to context.",
      deliverable: "Maturity baseline, prioritized gaps, and recommended roadmap.",
    },
    {
      step: "02",
      title: "Foundation",
      duration: "Within Foundation Pilot (est. 8–12 weeks total)",
      tierLabel: "Foundation Pilot",
      ossDoes:
        "Establish the minimum governance, data, and technical foundation the pilot will run on.",
      youDo: "Review and approve the operating model and guardrails.",
      deliverable: "Governance framework and technical foundation.",
    },
    {
      step: "03",
      title: "Pilot & Prove",
      duration: "Within Foundation Pilot (est. 8–12 weeks total)",
      tierLabel: "Foundation Pilot",
      ossDoes:
        "Deliver one high-value use case through a production-ready pilot.",
      youDo: "Provide subject-matter input and validate outcomes.",
      deliverable: "Production-ready pilot with measured results.",
    },
    {
      step: "04",
      title: "Scale & Enable",
      duration: "Phased, generally 6 months or more",
      tierLabel: "CoE Build & Scale",
      ossDoes:
        "Operationalize and expand the full CoE operating model, enable internal ownership, and drive adoption and continuous improvement.",
      youDo: "Grow internal ownership and adoption.",
      deliverable: "A self-sustaining Center of Excellence.",
    },
  ],

  cta: {
    title: "Start with the Readiness Diagnostic",
    body: "The lowest-risk first step. We give you an objective baseline and a clear recommendation, no commitment to a full build.",
    primaryLabel: "Request a Readiness Diagnostic",
    primaryHref: "/contact?intent=diagnostic",
    secondaryLabel: "Not sure yet? Take the free AI CoE Readiness Snapshot",
    // Anchor verified against app/ai-center-of-excellence/page.tsx (section id="assessment").
    secondaryHref: "/ai-center-of-excellence#assessment",
  },
} as const;

export type Tier = (typeof GETTING_STARTED.tiers)[number];
export type TierId = Tier["id"];

// ---------------------------------------------------------------------------
// Journey stages — the Path Finder's first question ("Where are you today?").
// Stage-to-tier mapping mirrors the tiers comment above:
// Diagnostic = Exploring/Planning, Pilot = Building, Build & Scale = Scaling.
// ---------------------------------------------------------------------------
export const JOURNEY_STAGES = [
  {
    id: "exploring",
    label: "Exploring",
    description: "We're curious about AI but haven't committed to anything yet.",
    tierId: "diagnostic",
  },
  {
    id: "planning",
    label: "Planning",
    description: "Leadership is interested and budget talks have started, but there's no roadmap.",
    tierId: "diagnostic",
  },
  {
    id: "building",
    label: "Building",
    description: "We're running pilots or building our first real AI use cases.",
    tierId: "pilot",
  },
  {
    id: "scaling",
    label: "Scaling",
    description: "AI works in pockets - now we need it to work across the organization.",
    tierId: "scale",
  },
] as const;

export type JourneyStage = (typeof JOURNEY_STAGES)[number];
export type JourneyStageId = JourneyStage["id"];

export const GETTING_STARTED_PATH = "/ai-center-of-excellence/getting-started";

export function isJourneyStageId(value: string | null | undefined): value is JourneyStageId {
  return JOURNEY_STAGES.some((s) => s.id === value);
}

/**
 * Path Finder / tier-finder recommendation matrix
 * ---------------------------------------------------------------------------
 * Inputs:
 *   - Journey stage (Exploring | Planning | Building | Scaling)
 *   - Foundations met count (0–4 checkboxes from GETTING_STARTED.prerequisites)
 *
 * Base stage → tier (when foundations are sufficient):
 *   Exploring → Readiness Diagnostic
 *   Planning  → Readiness Diagnostic
 *   Building  → Foundation Pilot
 *   Scaling   → CoE Build & Scale
 *
 * Foundation gate:
 *   If foundationsMet < 2 → always Readiness Diagnostic
 *   (matches prerequisitesNote: missing foundations are what the Diagnostic is for)
 *
 * Matrix (foundationsMet → tier):
 *               | 0–1          | 2–4
 *   ------------|--------------|----------------
 *   Exploring   | Diagnostic   | Diagnostic
 *   Planning    | Diagnostic   | Diagnostic
 *   Building    | Diagnostic   | Foundation Pilot
 *   Scaling     | Diagnostic   | CoE Build & Scale
 *
 * Boundary: foundationsMet === 2 is the first count that unlocks Pilot/Scale
 * for Building/Scaling stages.
 */
export const FOUNDATION_UNLOCK_COUNT = 2;

export function recommendTier(stageId: JourneyStageId, foundationsMet: number): TierId {
  const stage = JOURNEY_STAGES.find((s) => s.id === stageId) ?? JOURNEY_STAGES[0];
  if (foundationsMet < FOUNDATION_UNLOCK_COUNT) return "diagnostic";
  return stage.tierId;
}

export interface TierRecommendation {
  tierId: TierId;
  /** True when foundations gate overrode the stage's natural tier. */
  downgraded: boolean;
  /** Short explanation shown in the tier finder result. */
  reason: string;
}

export function explainTierRecommendation(
  stageId: JourneyStageId,
  foundationsMet: number
): TierRecommendation {
  const stage = JOURNEY_STAGES.find((s) => s.id === stageId) ?? JOURNEY_STAGES[0];
  const tierId = recommendTier(stageId, foundationsMet);
  const downgraded = stage.tierId !== tierId;

  if (downgraded) {
    return {
      tierId,
      downgraded: true,
      reason: GETTING_STARTED.prerequisitesNote,
    };
  }

  const reasons: Record<TierId, string> = {
    diagnostic:
      "Based on your stage, a Readiness Diagnostic (estimated 2–3 weeks) is the right starting point — a substantiated baseline and roadmap before Foundation, Pilot & Prove, or Scale & Enable work.",
    pilot:
      "Based on your stage and foundations in place, a Foundation Pilot (estimated 8–12 weeks) fits — prove value on one use case while establishing the minimum operating baseline.",
    scale:
      "Based on your stage and foundations in place, CoE Build & Scale fits — operationalize organization-wide capability across the six pillars.",
  };

  return { tierId, downgraded: false, reason: reasons[tierId] };
}

/** CTA copy for the getting-started page footer, keyed by recommended tier. */
export function ctaForRecommendedTier(tierId: TierId | null | undefined): {
  title: string;
  body: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  showDiagnosticAlternative: boolean;
} {
  if (tierId === "pilot") {
    return {
      title: "Continue with a Foundation Pilot",
      body: "Your path points to proving value on one real use case. Prefer a lower-commitment start? A Readiness Diagnostic remains available.",
      primaryLabel: "Request a Foundation Pilot conversation",
      primaryHref: "/contact?intent=pilot",
      secondaryLabel: "Or request a Readiness Diagnostic",
      secondaryHref: "/contact?intent=diagnostic",
      showDiagnosticAlternative: true,
    };
  }
  if (tierId === "scale") {
    return {
      title: "Continue with CoE Build & Scale",
      body: "Your path points to operationalizing a durable CoE. Prefer a lower-commitment start? A Readiness Diagnostic remains available.",
      primaryLabel: "Request a Build & Scale conversation",
      primaryHref: "/contact?intent=scale",
      secondaryLabel: "Or request a Readiness Diagnostic",
      secondaryHref: "/contact?intent=diagnostic",
      showDiagnosticAlternative: true,
    };
  }
  // Default / diagnostic / unknown — Diagnostic-first CTA is appropriate.
  return {
    title: GETTING_STARTED.cta.title,
    body: GETTING_STARTED.cta.body,
    primaryLabel: GETTING_STARTED.cta.primaryLabel,
    primaryHref: GETTING_STARTED.cta.primaryHref,
    secondaryLabel: GETTING_STARTED.cta.secondaryLabel,
    secondaryHref: GETTING_STARTED.cta.secondaryHref,
    showDiagnosticAlternative: false,
  };
}
