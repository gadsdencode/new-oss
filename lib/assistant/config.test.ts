import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  loadAssistantConfig,
  parseAssistantEnabled,
  parsePositiveInt,
  resolveAssistantApiKey,
  resolveAssistantModel,
  type AssistantEnv,
} from "./config";
import {
  ASSISTANT_DEFAULT_MAX_INPUT_TOKENS,
  ASSISTANT_DEFAULT_MAX_OUTPUT_TOKENS,
  ASSISTANT_DEFAULT_MODEL,
  ASSISTANT_DEFAULT_TIMEOUT_MS,
  ASSISTANT_ROLLBACK_MODEL,
  ASSISTANT_TRIAL_CANDIDATE_MODEL,
} from "./constants";

function env(overrides: AssistantEnv = {}): AssistantEnv {
  return {
    GEMINI_API_KEY: "test-gemini-key",
    ...overrides,
  };
}

describe("assistant configuration validation", () => {
  it("defaults to gemini-2.5-flash without changing production default", () => {
    const loaded = loadAssistantConfig(env({ GEMINI_MODEL: undefined }));
    assert.equal(loaded.ok, true);
    if (!loaded.ok) {
      return;
    }
    assert.equal(loaded.config.model, ASSISTANT_DEFAULT_MODEL);
    assert.equal(loaded.config.model, ASSISTANT_ROLLBACK_MODEL);
    assert.equal(loaded.config.modelSource, "default");
    assert.equal(loaded.config.isRollbackModel, true);
    assert.equal(loaded.config.isTrialCandidate, false);
  });

  it("allows gemini-2.5-flash-lite as an explicit local/preview candidate", () => {
    const loaded = loadAssistantConfig(env({ GEMINI_MODEL: ASSISTANT_TRIAL_CANDIDATE_MODEL }));
    assert.equal(loaded.ok, true);
    if (!loaded.ok) {
      return;
    }
    assert.equal(loaded.config.model, ASSISTANT_TRIAL_CANDIDATE_MODEL);
    assert.equal(loaded.config.modelSource, "override");
    assert.equal(loaded.config.isTrialCandidate, true);
    assert.equal(loaded.config.isRollbackModel, false);
  });

  it("preserves an existing model override instead of replacing it", () => {
    const loaded = loadAssistantConfig(env({ GEMINI_MODEL: "gemini-1.5-pro" }));
    assert.equal(loaded.ok, true);
    if (!loaded.ok) {
      return;
    }
    assert.equal(loaded.config.model, "gemini-1.5-pro");
    assert.equal(loaded.config.modelSource, "override");
    assert.equal(loaded.config.isKnownTrialModel, false);
  });

  it("prefers GEMINI_API_KEY over GOOGLE_API_KEY", () => {
    const resolved = resolveAssistantApiKey({
      GEMINI_API_KEY: "gemini-first",
      GOOGLE_API_KEY: "google-second",
    });
    assert.deepEqual(resolved, { apiKey: "gemini-first", source: "GEMINI_API_KEY" });
  });

  it("falls back to GOOGLE_API_KEY when GEMINI_API_KEY is absent", () => {
    const loaded = loadAssistantConfig({
      GOOGLE_API_KEY: "google-only",
    });
    assert.equal(loaded.ok, true);
    if (!loaded.ok) {
      return;
    }
    assert.equal(loaded.config.apiKeySource, "GOOGLE_API_KEY");
    assert.equal(loaded.config.apiKey, "google-only");
  });

  it("uses the initial input, output, and timeout limits", () => {
    const loaded = loadAssistantConfig(env());
    assert.equal(loaded.ok, true);
    if (!loaded.ok) {
      return;
    }
    assert.equal(loaded.config.maxInputTokens, ASSISTANT_DEFAULT_MAX_INPUT_TOKENS);
    assert.equal(loaded.config.maxOutputTokens, ASSISTANT_DEFAULT_MAX_OUTPUT_TOKENS);
    assert.equal(loaded.config.timeoutMs, ASSISTANT_DEFAULT_TIMEOUT_MS);
  });

  it("accepts validated numeric overrides", () => {
    const loaded = loadAssistantConfig(
      env({
        ASSISTANT_MAX_INPUT_TOKENS: "8000",
        ASSISTANT_MAX_OUTPUT_TOKENS: "512",
        ASSISTANT_GENERATION_TIMEOUT_MS: "15000",
      })
    );
    assert.equal(loaded.ok, true);
    if (!loaded.ok) {
      return;
    }
    assert.equal(loaded.config.maxInputTokens, 8000);
    assert.equal(loaded.config.maxOutputTokens, 512);
    assert.equal(loaded.config.timeoutMs, 15000);
  });

  it("fails closed on invalid numeric settings", () => {
    const loaded = loadAssistantConfig(env({ ASSISTANT_MAX_OUTPUT_TOKENS: "not-a-number" }));
    assert.equal(loaded.ok, false);
    if (loaded.ok) {
      return;
    }
    assert.equal(loaded.code, "invalid_config");
  });

  it("fails closed on an invalid model name", () => {
    const loaded = loadAssistantConfig(env({ GEMINI_MODEL: "bad model!" }));
    assert.equal(loaded.ok, false);
    if (loaded.ok) {
      return;
    }
    assert.equal(loaded.code, "invalid_config");
  });

  it("treats ASSISTANT_ENABLED=false as disabled without requiring a key", () => {
    const loaded = loadAssistantConfig({ ASSISTANT_ENABLED: "false" });
    assert.equal(loaded.ok, false);
    if (loaded.ok) {
      return;
    }
    assert.equal(loaded.code, "disabled");
  });

  it("parses enabled flags strictly", () => {
    assert.equal(parseAssistantEnabled(undefined).enabled, true);
    assert.equal(parseAssistantEnabled("true").enabled, true);
    assert.equal(parseAssistantEnabled("off").enabled, false);
    assert.ok(parseAssistantEnabled("maybe").invalid);
  });

  it("rejects out-of-range integers", () => {
    const parsed = parsePositiveInt("0", 1024, { max: 8192, name: "ASSISTANT_MAX_OUTPUT_TOKENS" });
    assert.ok(parsed.issue);
  });

  it("keeps the default model when GEMINI_MODEL is blank", () => {
    const resolved = resolveAssistantModel("   ");
    assert.equal(resolved.model, ASSISTANT_DEFAULT_MODEL);
    assert.equal(resolved.source, "default");
  });
});
