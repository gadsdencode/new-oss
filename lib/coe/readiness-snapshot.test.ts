// lib/coe/readiness-snapshot.test.ts
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  computeSnapshotResult,
  getMaturityBand,
  normalizeSnapshotPercent,
  pickStrongestAndOpportunity,
  sumSnapshotLevels,
  type SnapshotLevel,
  type SnapshotPillarScore,
} from "./readiness-snapshot";

function levels(all: SnapshotLevel): SnapshotPillarScore[] {
  const ids = ["vision", "expertise", "infrastructure", "data", "governance", "adoption"] as const;
  return ids.map((id) => ({
    id,
    level: all,
    title: id,
    label: id,
  }));
}

function mixed(
  map: Partial<Record<SnapshotPillarScore["id"], SnapshotLevel>>
): SnapshotPillarScore[] {
  const defaults: SnapshotLevel = 1;
  const ids = ["vision", "expertise", "infrastructure", "data", "governance", "adoption"] as const;
  return ids.map((id) => ({
    id,
    level: map[id] ?? defaults,
    title: id,
    label: id,
  }));
}

describe("normalizeSnapshotPercent", () => {
  it("all-lowest completed score is 0%", () => {
    assert.equal(normalizeSnapshotPercent(0), 0);
    assert.equal(normalizeSnapshotPercent(sumSnapshotLevels([0, 0, 0, 0, 0, 0])), 0);
  });

  it("all-highest completed score is 100%", () => {
    assert.equal(normalizeSnapshotPercent(18), 100);
    assert.equal(normalizeSnapshotPercent(sumSnapshotLevels([3, 3, 3, 3, 3, 3])), 100);
  });

  it("uniform middle (all level 1) is ~33%", () => {
    // 6/18 = 33.333… → Math.round → 33
    assert.equal(normalizeSnapshotPercent(6), 33);
  });

  it("uniform middle (all level 2) is ~67%", () => {
    // 12/18 = 66.666… → Math.round → 67
    assert.equal(normalizeSnapshotPercent(12), 67);
  });

  it("rounding is deterministic for .5 cases", () => {
    // 9/18 = 50 exactly
    assert.equal(normalizeSnapshotPercent(9), 50);
    // 1/18 ≈ 5.555 → 6
    assert.equal(normalizeSnapshotPercent(1), 6);
  });
});

describe("computeSnapshotResult", () => {
  it("all-lowest → Foundational, Diagnostic, 0%", () => {
    const result = computeSnapshotResult(levels(0));
    assert.equal(result.percent, 0);
    assert.equal(result.band.id, "foundational");
    assert.equal(result.band.entryTierId, "diagnostic");
    assert.equal(result.band.stageId, "exploring");
  });

  it("all-highest → Leading, Build & Scale, 100%", () => {
    const result = computeSnapshotResult(levels(3));
    assert.equal(result.percent, 100);
    assert.equal(result.band.id, "leading");
    assert.equal(result.band.entryTierId, "scale");
    assert.equal(result.band.stageId, "scaling");
  });

  it("uniform middle (all 2) → Developing or Operational consistently", () => {
    const result = computeSnapshotResult(levels(2));
    assert.equal(result.percent, 67);
    assert.equal(result.total, 12);
    // 12 is Developing (min 9) but below Operational (13)
    assert.equal(result.band.id, "developing");
    assert.equal(result.band.entryTierId, "diagnostic");
  });

  it("mixed responses identify strongest and largest opportunity", () => {
    const result = computeSnapshotResult(
      mixed({ vision: 3, expertise: 0, infrastructure: 2, data: 1, governance: 2, adoption: 1 })
    );
    assert.equal(result.strongest.id, "vision");
    assert.equal(result.opportunity.id, "expertise");
    assert.equal(result.percent, normalizeSnapshotPercent(3 + 0 + 2 + 1 + 2 + 1));
  });
});

describe("getMaturityBand boundaries", () => {
  it("uses documented total thresholds", () => {
    assert.equal(getMaturityBand(0).id, "foundational");
    assert.equal(getMaturityBand(8).id, "foundational");
    assert.equal(getMaturityBand(9).id, "developing");
    assert.equal(getMaturityBand(12).id, "developing");
    assert.equal(getMaturityBand(13).id, "operational");
    assert.equal(getMaturityBand(15).id, "operational");
    assert.equal(getMaturityBand(16).id, "leading");
    assert.equal(getMaturityBand(18).id, "leading");
  });
});

describe("pickStrongestAndOpportunity ties", () => {
  it("resolves ties to first pillar in order", () => {
    const scores = levels(2);
    const { strongest, opportunity } = pickStrongestAndOpportunity(scores);
    assert.equal(strongest.id, "vision");
    assert.equal(opportunity.id, "vision");
  });
});
