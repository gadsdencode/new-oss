// lib/coe/getting-started-data.ts
// ---------------------------------------------------------------------------
// GETTING_STARTED — single source of truth for ALL copy in the getting-started
// funnel. Consumed by:
//   - app/ai-center-of-excellence/getting-started/page.tsx (page + JSON-LD)
//   - components/coe/path-finder.tsx (interactive wizard)
//   - components/coe/engagement-phases.tsx (phase stepper)
//   - components/coe/coe-readiness-assessment.tsx (entry-tier recommendation)
// Editorial defaults: timelines SHOWN (as ranges), pricing NOT shown.
// To show pricing later: add a `price` field per tier here and render one line
// in the tier card. No other file changes required.
// ---------------------------------------------------------------------------
export const GETTING_STARTED = {
  hero: {
    eyebrow: "Center of Excellence",
    title: "How to get started",
    subtitle:
      "You don't have to commit to a full build to begin. Most teams start with a short, fixed-scope diagnostic, then scale as the value is proven.",
  },

  // Three entry tiers (crawl / walk / run). Maps to journey stages:
  // Diagnostic = Exploring/Planning, Pilot = Building, Build & Scale = Scaling.
  tiers: [
    {
      id: "diagnostic",
      name: "Readiness Diagnostic",
      tagline: "Find out where you stand",
      image: "/images/coe/coe-tier-diagnostic.webp",
      duration: "2 to 3 weeks",
      whatItIs:
        "A structured assessment across all six CoE pillars, benchmarked against a maturity model.",
      walkAwayWith: [
        "A maturity score across the six pillars",
        "A prioritized gap analysis",
        "A recommended roadmap and starting point",
      ],
      bestFor:
        "Teams exploring or planning a CoE who want an objective baseline before committing.",
      featured: true, // primary, lowest-barrier entry point
    },
    {
      id: "pilot",
      name: "Foundation Pilot",
      tagline: "Prove value on one real use case",
      image: "/images/coe/coe-tier-pilot.webp",
      duration: "8 to 12 weeks",
      whatItIs:
        "We stand up the governance and infrastructure baseline and deliver one high-value use case end to end.",
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
      duration: "Phased, typically 6 months and up",
      whatItIs:
        "Full operationalization across all six pillars, with the operating model, enablement, and governance to scale AI organization-wide.",
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

  // Engagement phases — shows BOTH sides of the work (this is what converts).
  phases: [
    {
      step: "01",
      title: "Discovery & Readiness",
      duration: "2 to 3 weeks",
      ossDoes:
        "Assess maturity across the six pillars, identify gaps, and define success metrics.",
      youDo: "Connect us with stakeholders and provide access to context.",
      deliverable: "Maturity baseline and prioritized roadmap.",
    },
    {
      step: "02",
      title: "Foundation",
      duration: "4 to 6 weeks",
      ossDoes: "Stand up governance, data, and infrastructure baselines.",
      youDo: "Review and approve the operating model and guardrails.",
      deliverable: "Governance framework and technical foundation.",
    },
    {
      step: "03",
      title: "Pilot & Prove",
      duration: "4 to 8 weeks",
      ossDoes: "Build and deploy one high-value use case end to end.",
      youDo: "Provide subject-matter input and validate outcomes.",
      deliverable: "Production-ready pilot with measured results.",
    },
    {
      step: "04",
      title: "Scale & Enable",
      duration: "Ongoing",
      ossDoes:
        "Expand across the pillars, enable your team, and operationalize the CoE.",
      youDo: "Grow internal ownership and adoption.",
      deliverable: "A self-sustaining Center of Excellence.",
    },
  ],

  cta: {
    title: "Start with a readiness diagnostic",
    body: "The lowest-risk first step. We give you an objective baseline and a clear recommendation, no commitment to a full build.",
    primaryLabel: "Book a readiness workshop",
    primaryHref: "/contact",
    secondaryLabel: "Take the 5-minute readiness assessment",
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
 * The Path Finder recommendation rule:
 * - The chosen stage maps to a base tier.
 * - Fewer than 2 prerequisites in place always recommends the Diagnostic
 *   (mirrors GETTING_STARTED.prerequisitesNote), since the diagnostic is
 *   exactly how missing foundations get identified and planned.
 */
export function recommendTier(stageId: JourneyStageId, prerequisitesMet: number): TierId {
  const stage = JOURNEY_STAGES.find((s) => s.id === stageId) ?? JOURNEY_STAGES[0];
  if (prerequisitesMet < 2) return "diagnostic";
  return stage.tierId;
}
