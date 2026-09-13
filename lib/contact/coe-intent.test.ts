// lib/contact/coe-intent.test.ts
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  appendSubmissionMetadata,
  buildPrefillMessage,
  getCoeIntentCopy,
  resolveCoeIntent,
  serializeCoeContextForSubmit,
  type ResolvedCoeIntentId,
} from "./coe-intent";
import type { SnapshotHandoff } from "../coe/snapshot-handoff";

const sampleHandoff: SnapshotHandoff = {
  version: 1,
  createdAt: "2026-07-17T00:00:00.000Z",
  maturityBandId: "developing",
  maturityBandName: "Developing",
  recommendedTierId: "diagnostic",
  recommendedTierName: "Readiness Diagnostic",
  stageId: "planning",
  largestGapId: "governance",
  largestGapLabel: "Governance, Risk & Responsible AI",
  strongestId: "vision",
  strongestLabel: "Strategic Vision & Leadership",
  percent: 50,
};

describe("resolveCoeIntent", () => {
  const cases: [string | null | undefined, ResolvedCoeIntentId][] = [
    ["diagnostic", "diagnostic"],
    ["pilot", "pilot"],
    ["scale", "scale"],
    ["readiness-workshop", "readiness-workshop"],
    ["DIAGNOSTIC", "diagnostic"],
    ["workshop", "readiness-workshop"],
    ["foundation-pilot", "pilot"],
    ["build-scale", "scale"],
    [null, "general"],
    [undefined, "general"],
    ["", "general"],
    ["totally-unknown", "general"],
    ["hack'; DROP TABLE", "general"],
  ];

  for (const [input, expected] of cases) {
    it(`maps ${JSON.stringify(input)} → ${expected}`, () => {
      assert.equal(resolveCoeIntent(input), expected);
    });
  }
});

describe("getCoeIntentCopy subjects", () => {
  it("uses approved subjects for each supported intent", () => {
    assert.equal(getCoeIntentCopy("diagnostic").subject, "AI CoE Readiness Diagnostic");
    assert.equal(getCoeIntentCopy("pilot").subject, "AI CoE Foundation Pilot");
    assert.equal(getCoeIntentCopy("scale").subject, "AI CoE Build & Scale");
    assert.equal(getCoeIntentCopy("readiness-workshop").subject, "AI CoE Readiness Workshop");
  });

  it("generic fallback has empty subject and safe heading", () => {
    const copy = getCoeIntentCopy("nonsense");
    assert.equal(copy.id, "general");
    assert.equal(copy.normalizedIntent, "general");
    assert.equal(copy.subject, "");
    assert.match(copy.heading, /Get in Touch/i);
  });

  it("marks CoE intents with ai-coe source", () => {
    assert.equal(getCoeIntentCopy("diagnostic").source, "ai-coe");
  });
});

describe("buildPrefillMessage", () => {
  it("uses the diagnostic conversation starter and omits Snapshot score dump", () => {
    const msg = buildPrefillMessage("diagnostic", sampleHandoff);
    assert.match(msg, /Readiness Diagnostic/i);
    assert.doesNotMatch(msg, /Maturity band/);
    assert.doesNotMatch(msg, /Primary opportunity/);
  });

  it("uses a general inquiry starter even if Snapshot handoff is leftover", () => {
    const msg = buildPrefillMessage("general", sampleHandoff);
    assert.match(msg, /how Overture can help/i);
    assert.doesNotMatch(msg, /Maturity band/);
    assert.doesNotMatch(msg, /Foundational|Developing/);
  });
});

describe("serializeCoeContextForSubmit", () => {
  it("includes only non-sensitive fields", () => {
    const raw = serializeCoeContextForSubmit(sampleHandoff);
    const parsed = JSON.parse(raw) as Record<string, string>;
    assert.equal(parsed.maturityBand, "Developing");
    assert.equal(parsed.recommendedTier, "Readiness Diagnostic");
    assert.equal(parsed.primaryOpportunity, "Governance, Risk & Responsible AI");
    assert.equal(parsed.stage, "planning");
    assert.equal(parsed.email, undefined);
    assert.equal(parsed.company, undefined);
  });
});

describe("appendSubmissionMetadata", () => {
  it("embeds normalized intent and source in stored message", () => {
    const stored = appendSubmissionMetadata({
      message: "Please follow up.",
      intent: "pilot",
      source: "ai-coe",
      coeContextJson: serializeCoeContextForSubmit(sampleHandoff),
    });
    assert.match(stored, /Normalized intent: pilot/);
    assert.match(stored, /Inquiry source: ai-coe/);
    assert.match(stored, /Maturity band: Developing/);
    assert.match(stored, /Please follow up\./);
  });

  it("handles general intent without requiring context", () => {
    const stored = appendSubmissionMetadata({
      message: "Hello",
      intent: "general",
      source: "website",
    });
    assert.match(stored, /Normalized intent: general/);
  });
});
