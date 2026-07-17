// lib/coe/readiness-snapshot.ts
// ---------------------------------------------------------------------------
// Pure scoring + recommendation helpers for the free AI CoE Readiness Snapshot.
// Levels are 0–3 per pillar (not 1–4). Percentage = total / (6 × 3) × 100,
// rounded with Math.round for deterministic display. The UI should emphasize
// maturity band and pillar profile over the percentage — the Snapshot is
// orientation only, not a validated organizational maturity score.
// ---------------------------------------------------------------------------

import type { JourneyStageId, TierId } from "./getting-started-data";

export const SNAPSHOT_PILLAR_IDS = [
  "vision",
  "expertise",
  "infrastructure",
  "data",
  "governance",
  "adoption",
] as const;

export type SnapshotPillarId = (typeof SNAPSHOT_PILLAR_IDS)[number];

/** Answer levels: 0 = lowest, 3 = highest. Unanswered is represented as null outside this type. */
export type SnapshotLevel = 0 | 1 | 2 | 3;

export type MaturityBandId = "foundational" | "developing" | "operational" | "leading";

export interface MaturityBand {
  id: MaturityBandId;
  name: string;
  /** Minimum total score (0–18) for this band. Evaluated top-down. */
  minTotal: number;
  blurb: string;
  stageId: JourneyStageId;
  entryTierId: TierId;
  entryTierName: string;
  whyTier: string;
  ctaLabel: string;
}

export const PILLAR_COUNT = SNAPSHOT_PILLAR_IDS.length;
export const MAX_LEVEL: SnapshotLevel = 3;
export const MAX_TOTAL = PILLAR_COUNT * MAX_LEVEL; // 18

/**
 * Maturity bands on the 0–18 total scale (equivalent intent to the former
 * 1–4 / max-24 thresholds: Leading ≥21/24, Operational ≥17/24, Developing ≥12/24).
 */
export const MATURITY_BANDS: readonly MaturityBand[] = [
  {
    id: "leading",
    name: "Leading",
    minTotal: 16,
    blurb:
      "Your self-reported profile suggests stronger operating foundations across most pillars. A CoE Build & Scale conversation can focus on consistency, ownership, and organization-wide capability.",
    stageId: "scaling",
    entryTierId: "scale",
    entryTierName: "CoE Build & Scale",
    whyTier:
      "Your Snapshot band is Leading, so the suggested entry is CoE Build & Scale — operationalizing a durable CoE model rather than starting from a first baseline.",
    ctaLabel: "Discuss CoE Build & Scale",
  },
  {
    id: "operational",
    name: "Operational",
    minTotal: 13,
    blurb:
      "Your self-reported profile suggests a working foundation in places. A Foundation Pilot can prove value on one focused use case while tightening governance and delivery practices.",
    stageId: "building",
    entryTierId: "pilot",
    entryTierName: "Foundation Pilot",
    whyTier:
      "Your Snapshot band is Operational, so the suggested entry is a Foundation Pilot — prove value on one real use case before a broader build.",
    ctaLabel: "Discuss a Foundation Pilot",
  },
  {
    id: "developing",
    name: "Developing",
    minTotal: 9,
    blurb:
      "Your self-reported profile shows momentum in places and gaps in others. A Readiness Diagnostic can establish a substantiated baseline and a sequenced roadmap before larger investment.",
    stageId: "planning",
    entryTierId: "diagnostic",
    entryTierName: "Readiness Diagnostic",
    whyTier:
      "Your Snapshot band is Developing, so the suggested entry is a Readiness Diagnostic — clarify gaps and success measures before committing to a pilot or full build.",
    ctaLabel: "Request a Readiness Diagnostic",
  },
  {
    id: "foundational",
    name: "Foundational",
    minTotal: 0,
    blurb:
      "Your self-reported profile suggests you are early in the journey. A Readiness Diagnostic is the lowest-commitment way to establish a clear baseline and recommended path.",
    stageId: "exploring",
    entryTierId: "diagnostic",
    entryTierName: "Readiness Diagnostic",
    whyTier:
      "Your Snapshot band is Foundational, so the suggested entry is a Readiness Diagnostic — establish sponsorship, priorities, and a roadmap before building.",
    ctaLabel: "Request a Readiness Diagnostic",
  },
] as const;

export function isSnapshotLevel(value: number): value is SnapshotLevel {
  return Number.isInteger(value) && value >= 0 && value <= MAX_LEVEL;
}

/** Sum of six 0–3 levels. Caller must pass a complete answer set. */
export function sumSnapshotLevels(levels: readonly SnapshotLevel[]): number {
  return levels.reduce<number>((sum, level) => sum + level, 0);
}

/**
 * Normalize completed Snapshot score to 0–100.
 * All-lowest (0×6) → 0; all-highest (3×6) → 100.
 * Uses Math.round for deterministic display rounding.
 */
export function normalizeSnapshotPercent(total: number, pillarCount = PILLAR_COUNT): number {
  const max = pillarCount * MAX_LEVEL;
  if (max <= 0) return 0;
  const clamped = Math.min(Math.max(total, 0), max);
  return Math.round((clamped / max) * 100);
}

export function getMaturityBand(total: number): MaturityBand {
  const clamped = Math.min(Math.max(total, 0), MAX_TOTAL);
  return MATURITY_BANDS.find((band) => clamped >= band.minTotal) ?? MATURITY_BANDS[MATURITY_BANDS.length - 1];
}

export interface SnapshotPillarScore {
  id: SnapshotPillarId;
  level: SnapshotLevel;
  title: string;
  label: string;
}

/**
 * Strongest / largest-opportunity pillars.
 * Ties resolve to the first pillar in SNAPSHOT_PILLAR_IDS order for stability.
 */
export function pickStrongestAndOpportunity(
  scores: readonly SnapshotPillarScore[]
): { strongest: SnapshotPillarScore; opportunity: SnapshotPillarScore } {
  let strongest = scores[0];
  let opportunity = scores[0];
  for (const score of scores) {
    if (score.level > strongest.level) strongest = score;
    if (score.level < opportunity.level) opportunity = score;
  }
  return { strongest, opportunity };
}

export interface SnapshotResult {
  total: number;
  percent: number;
  band: MaturityBand;
  strongest: SnapshotPillarScore;
  opportunity: SnapshotPillarScore;
  profile: SnapshotPillarScore[];
}

export function computeSnapshotResult(scores: readonly SnapshotPillarScore[]): SnapshotResult {
  if (scores.length !== PILLAR_COUNT) {
    throw new Error(`Snapshot requires exactly ${PILLAR_COUNT} pillar scores`);
  }
  for (const score of scores) {
    if (!isSnapshotLevel(score.level)) {
      throw new Error(`Invalid Snapshot level for ${score.id}: ${score.level}`);
    }
  }
  const total = sumSnapshotLevels(scores.map((s) => s.level));
  const percent = normalizeSnapshotPercent(total);
  const band = getMaturityBand(total);
  const { strongest, opportunity } = pickStrongestAndOpportunity(scores);
  return { total, percent, band, strongest, opportunity, profile: [...scores] };
}
