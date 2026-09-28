import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getModelPrices, conservativeCallChargeNanos, ASSISTANT_PRICING_VERSION } from "./pricing";
import { billableOutputTokens, readUsageMetadata } from "./usage";
import { usdToNanos, nanosToUsdString } from "./money";

describe("assistant pricing and usage accounting", () => {
  it("uses the dated Google Gemini paid-tier prices for known models", () => {
    const flash = getModelPrices("gemini-2.5-flash");
    const lite = getModelPrices("gemini-2.5-flash-lite");
    assert.ok(flash);
    assert.ok(lite);
    assert.equal(ASSISTANT_PRICING_VERSION, "google-ai-2026-09-15");
    assert.equal(flash.inputNanosPerToken, BigInt(300));
    assert.equal(flash.outputNanosPerToken, BigInt(2500));
    assert.equal(lite.inputNanosPerToken, BigInt(100));
    assert.equal(lite.outputNanosPerToken, BigInt(400));
    assert.equal(getModelPrices("gemini-1.5-pro"), null);
    const icdu = getModelPrices("icdu");
    assert.ok(icdu);
    assert.equal(icdu.externalCharge, false);
    assert.equal(icdu.inputNanosPerToken, BigInt(0));
    assert.equal(icdu.outputNanosPerToken, BigInt(0));
    assert.equal(conservativeCallChargeNanos(icdu, 1_000, 2_048, 0), BigInt(0));
    assert.match(icdu.notes, /not a statement that infrastructure or hosting is cost-free/i);
  });

  it("charges thinking tokens as billable output when reported separately", () => {
    const usage = readUsageMetadata({
      usageMetadata: {
        promptTokenCount: 40,
        candidatesTokenCount: 10,
        thoughtsTokenCount: 6,
        totalTokenCount: 56,
      },
    });
    assert.equal(usage?.source, "provider");
    assert.equal(usage?.reasoningTokens, 6);
    assert.equal(billableOutputTokens(usage!), 16);
  });

  it("keeps estimated charges in integer nano-dollars", () => {
    const prices = getModelPrices("gemini-2.5-flash-lite");
    assert.ok(prices);
    const charge = conservativeCallChargeNanos(prices, 1_000, 1_024, 0);
    assert.equal(typeof charge, "bigint");
    assert.equal(usdToNanos(1), BigInt(1_000_000_000));
    assert.equal(nanosToUsdString(charge).startsWith("-"), false);
  });
});
