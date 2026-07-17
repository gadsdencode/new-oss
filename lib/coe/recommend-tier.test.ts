// lib/coe/recommend-tier.test.ts
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  FOUNDATION_UNLOCK_COUNT,
  JOURNEY_STAGES,
  ctaForRecommendedTier,
  explainTierRecommendation,
  recommendTier,
  type JourneyStageId,
  type TierId,
} from "./getting-started-data";

/** Full recommendation matrix used by the tier finder. */
const MATRIX: Record<JourneyStageId, Record<number, TierId>> = {
  exploring: { 0: "diagnostic", 1: "diagnostic", 2: "diagnostic", 3: "diagnostic", 4: "diagnostic" },
  planning: { 0: "diagnostic", 1: "diagnostic", 2: "diagnostic", 3: "diagnostic", 4: "diagnostic" },
  building: { 0: "diagnostic", 1: "diagnostic", 2: "pilot", 3: "pilot", 4: "pilot" },
  scaling: { 0: "diagnostic", 1: "diagnostic", 2: "scale", 3: "scale", 4: "scale" },
};

describe("recommendTier matrix", () => {
  for (const stage of JOURNEY_STAGES) {
    for (let foundations = 0; foundations <= 4; foundations++) {
      it(`${stage.id} + ${foundations} foundations → ${MATRIX[stage.id][foundations]}`, () => {
        assert.equal(recommendTier(stage.id, foundations), MATRIX[stage.id][foundations]);
      });
    }
  }
});

describe("recommendTier edge cases", () => {
  it("foundation unlock boundary is 2", () => {
    assert.equal(FOUNDATION_UNLOCK_COUNT, 2);
    assert.equal(recommendTier("building", 1), "diagnostic");
    assert.equal(recommendTier("building", 2), "pilot");
    assert.equal(recommendTier("scaling", 1), "diagnostic");
    assert.equal(recommendTier("scaling", 2), "scale");
  });

  it("exploring/planning never escalate past Diagnostic", () => {
    assert.equal(recommendTier("exploring", 4), "diagnostic");
    assert.equal(recommendTier("planning", 4), "diagnostic");
  });
});

describe("explainTierRecommendation", () => {
  it("marks downgrade when foundations gate overrides stage", () => {
    const result = explainTierRecommendation("building", 0);
    assert.equal(result.tierId, "diagnostic");
    assert.equal(result.downgraded, true);
    assert.match(result.reason, /Diagnostic/i);
  });

  it("does not downgrade when foundations unlock Pilot", () => {
    const result = explainTierRecommendation("building", 2);
    assert.equal(result.tierId, "pilot");
    assert.equal(result.downgraded, false);
  });

  it("explains Scale recommendation", () => {
    const result = explainTierRecommendation("scaling", 3);
    assert.equal(result.tierId, "scale");
    assert.equal(result.downgraded, false);
    assert.match(result.reason, /Build & Scale/i);
  });
});

describe("ctaForRecommendedTier", () => {
  it("Diagnostic CTA starts with Diagnostic language", () => {
    const cta = ctaForRecommendedTier("diagnostic");
    assert.match(cta.title, /Diagnostic/i);
    assert.match(cta.primaryLabel, /Request/i);
    assert.match(cta.primaryHref, /intent=diagnostic/);
    assert.equal(cta.showDiagnosticAlternative, false);
  });

  it("Pilot CTA does not universally force Diagnostic as primary", () => {
    const cta = ctaForRecommendedTier("pilot");
    assert.match(cta.title, /Pilot/i);
    assert.match(cta.primaryHref, /intent=pilot/);
    assert.equal(cta.showDiagnosticAlternative, true);
    assert.match(cta.secondaryLabel, /Diagnostic/i);
  });

  it("Build & Scale CTA offers Diagnostic as alternative", () => {
    const cta = ctaForRecommendedTier("scale");
    assert.match(cta.title, /Build & Scale/i);
    assert.match(cta.primaryHref, /intent=scale/);
    assert.equal(cta.showDiagnosticAlternative, true);
  });

  it("null recommendation defaults to Diagnostic-first CTA", () => {
    const cta = ctaForRecommendedTier(null);
    assert.match(cta.title, /Diagnostic/i);
    assert.match(cta.primaryHref, /intent=diagnostic/);
  });
});
