// lib/coe/snapshot-handoff.ts
// ---------------------------------------------------------------------------
// Browser session handoff from the free AI CoE Readiness Snapshot to the
// tier finder. Non-sensitive orientation fields only — never put PII or
// free-text org details here or in the URL.
// ---------------------------------------------------------------------------

import type { JourneyStageId, TierId } from "./getting-started-data";
import type { MaturityBandId, SnapshotPillarId } from "./readiness-snapshot";

export const SNAPSHOT_HANDOFF_KEY = "coe-snapshot-handoff-v1";

export interface SnapshotHandoff {
  version: 1;
  /** ISO timestamp for freshness / debugging. */
  createdAt: string;
  maturityBandId: MaturityBandId;
  maturityBandName: string;
  recommendedTierId: TierId;
  recommendedTierName: string;
  stageId: JourneyStageId;
  largestGapId: SnapshotPillarId;
  largestGapLabel: string;
  strongestId: SnapshotPillarId;
  strongestLabel: string;
  /** Indicative 0–100 index only — not a validated maturity score. */
  percent: number;
  /** Foundation checkboxes selected in the tier finder (indexes into GETTING_STARTED.prerequisites). */
  foundationIndexes?: number[];
}

export function createSnapshotHandoff(
  input: Omit<SnapshotHandoff, "version" | "createdAt"> & { foundationIndexes?: number[] }
): SnapshotHandoff {
  return {
    version: 1,
    createdAt: new Date().toISOString(),
    ...input,
  };
}

export function writeSnapshotHandoff(handoff: SnapshotHandoff): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SNAPSHOT_HANDOFF_KEY, JSON.stringify(handoff));
  } catch {
    // Ignore quota / private-mode failures; URL stage param remains a fallback.
  }
}

export function readSnapshotHandoff(): SnapshotHandoff | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SNAPSHOT_HANDOFF_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SnapshotHandoff;
    if (parsed?.version !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function updateHandoffFoundations(foundationIndexes: number[]): void {
  const existing = readSnapshotHandoff();
  if (!existing) {
    // Path finder can still store a minimal handoff for CTA consistency.
    writeSnapshotHandoff(
      createSnapshotHandoff({
        maturityBandId: "foundational",
        maturityBandName: "Foundational",
        recommendedTierId: "diagnostic",
        recommendedTierName: "Readiness Diagnostic",
        stageId: "exploring",
        largestGapId: "vision",
        largestGapLabel: "Strategic Vision & Leadership",
        strongestId: "vision",
        strongestLabel: "Strategic Vision & Leadership",
        percent: 0,
        foundationIndexes,
      })
    );
    return;
  }
  writeSnapshotHandoff({ ...existing, foundationIndexes });
}

export function clearSnapshotHandoff(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(SNAPSHOT_HANDOFF_KEY);
  } catch {
    // ignore
  }
}
