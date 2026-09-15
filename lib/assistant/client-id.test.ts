import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { deriveClientHash, isLocalDevelopment, resolveSpendNamespace } from "./client-id";
import { loadAssistantSpendConfig } from "./spend-config";

describe("assistant client identifiers and spend store selection", () => {
  it("uses Vercel platform metadata and ignores spoofable forwarding headers", () => {
    const headers = new Headers({
      "x-forwarded-for": "203.0.113.9",
      "x-vercel-forwarded-for": "198.51.100.4",
      "x-vercel-ja4-digest": "ja4-example",
    });
    const derived = deriveClientHash(headers, { VERCEL: "1", VERCEL_ENV: "production" });
    assert.equal(derived.trusted, true);
    assert.equal(derived.source, "vercel");
    assert.equal(derived.hash.includes("."), false);
    assert.doesNotMatch(derived.hash, /198\.51\.100\.4|203\.0\.113\.9/);

    const spoofed = deriveClientHash(new Headers({ "x-forwarded-for": "203.0.113.9" }), {
      VERCEL: "1",
      VERCEL_ENV: "production",
    });
    assert.equal(spoofed.trusted, false);
  });

  it("does not treat a client session id as a trusted identifier", () => {
    const derived = deriveClientHash(
      new Headers({
        "x-copilotkit-session": "session-123",
        "x-forwarded-for": "203.0.113.9",
      }),
      { NODE_ENV: "production", VERCEL: undefined }
    );
    assert.equal(derived.trusted, false);
    assert.equal(derived.source, "untrusted");
  });

  it("allows an explicit local-development hash only off Vercel", () => {
    assert.equal(isLocalDevelopment({ NODE_ENV: "development", VERCEL: undefined }), true);
    const local = deriveClientHash(new Headers(), { NODE_ENV: "development" });
    assert.equal(local.trusted, true);
    assert.equal(local.source, "local-dev");
  });

  it("separates production, preview, and development namespaces", () => {
    assert.equal(resolveSpendNamespace({ VERCEL_ENV: "production" }), "production");
    assert.equal(resolveSpendNamespace({ VERCEL_ENV: "preview" }), "preview");
    assert.equal(resolveSpendNamespace({ NODE_ENV: "development" }), "development");
  });

  it("forbids in-memory spend storage in production and preview", () => {
    const productionMemory = loadAssistantSpendConfig({
      VERCEL: "1",
      VERCEL_ENV: "production",
      ASSISTANT_SPEND_STORE: "memory",
      DATABASE_URL: "postgres://example/db",
    });
    assert.equal(productionMemory.ok, false);

    const previewWithoutDb = loadAssistantSpendConfig({
      VERCEL: "1",
      VERCEL_ENV: "preview",
    });
    assert.equal(previewWithoutDb.ok, false);
    if (!previewWithoutDb.ok) {
      assert.equal(previewWithoutDb.code, "store_unavailable");
    }

    const local = loadAssistantSpendConfig({ NODE_ENV: "development" });
    assert.equal(local.ok, true);
    if (local.ok) {
      assert.equal(local.config.storeKind, "memory");
      assert.equal(local.config.namespace, "development");
    }
  });
});
