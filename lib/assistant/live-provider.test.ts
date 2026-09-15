import { describe, it } from "node:test";
import assert from "node:assert/strict";

/**
 * Real Gemini requests are gated and never run with the mocked suite.
 * Collect provider evidence separately with:
 * ASSISTANT_LIVE_CHECK=1 GEMINI_API_KEY=... npx tsx --test lib/assistant/live-provider.test.ts
 */
const liveEnabled = process.env.ASSISTANT_LIVE_CHECK === "1";
const describeLive = liveEnabled ? describe : describe.skip;

describeLive("real Gemini provider evidence", () => {
  it("sends one bounded request and records only usage metadata", async () => {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    assert.ok(apiKey, "ASSISTANT_LIVE_CHECK=1 requires a server API key in the environment");

    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: "Reply with the single word ok." }] }],
          generationConfig: { maxOutputTokens: 8 },
        }),
        signal: AbortSignal.timeout(30_000),
      }
    );

    const payload = (await response.json()) as {
      usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number; totalTokenCount?: number };
    };

    assert.equal(response.ok, true, "Provider request failed");
    assert.equal(typeof payload.usageMetadata?.totalTokenCount, "number");
  });
});
