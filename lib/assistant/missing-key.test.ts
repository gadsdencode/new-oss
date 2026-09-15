import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { loadAssistantConfig } from "./config";
import { visitorSafeAssistantResponse } from "./errors";
import { VISITOR_UNAVAILABLE_MESSAGE } from "./constants";

describe("missing-key behavior", () => {
  it("reports missing_key when neither GEMINI_API_KEY nor GOOGLE_API_KEY is set", () => {
    const loaded = loadAssistantConfig({
      GEMINI_API_KEY: "  ",
      GOOGLE_API_KEY: "",
    });
    assert.equal(loaded.ok, false);
    if (loaded.ok) {
      return;
    }
    assert.equal(loaded.code, "missing_key");
  });

  it("does not treat a client-supplied key as a configuration source", () => {
    const loaded = loadAssistantConfig({
      GEMINI_API_KEY: undefined,
      GOOGLE_API_KEY: undefined,
    });
    assert.equal(loaded.ok, false);
    if (loaded.ok) {
      return;
    }
    assert.equal(loaded.code, "missing_key");
  });

  it("keeps visitor-facing errors free of configuration diagnostics", async () => {
    const response = visitorSafeAssistantResponse(503);
    const body = await response.json();
    assert.equal(body.error, "ASSISTANT_UNAVAILABLE");
    assert.equal(body.message, VISITOR_UNAVAILABLE_MESSAGE);
    assert.equal(body.statusCode, 503);
    assert.equal("details" in body, false);
    assert.doesNotMatch(JSON.stringify(body), /GEMINI_API_KEY|GOOGLE_API_KEY|Vercel|adapter/i);
  });
});
