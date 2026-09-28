import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { NextRequest } from "next/server";
import { POST } from "../../app/api/copilotkit/route";
import { VISITOR_UNAVAILABLE_MESSAGE, VISITOR_BUSY_MESSAGE } from "./constants";
import { resetMemorySpendStoreForTests, utcMinuteStart, createSpendStore } from "./spend-store";
import { loadAssistantSpendConfig } from "./spend-config";
import { deriveClientHash } from "./client-id";

const DATABASE_KEYS = [
  "DATABASE_URL",
  "POSTGRES_URL",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL_NON_POOLING",
  "DATABASE_URL_UNPOOLED",
  "NEWOSS_DATABASE_URL",
  "NEWOSS_POSTGRES_URL",
  "NEWOSS_POSTGRES_PRISMA_URL",
  "NEWOSS_POSTGRES_URL_NON_POOLING",
  "NEWOSS_DATABASE_URL_UNPOOLED",
] as const;

const ENV_KEYS = [
  ...DATABASE_KEYS,
  "GEMINI_API_KEY",
  "GOOGLE_API_KEY",
  "GEMINI_MODEL",
  "VERCEL",
  "VERCEL_ENV",
  "ASSISTANT_SPEND_STORE",
  "ASSISTANT_PROVIDER",
  "ICDU_API_KEY",
  "ICDU_MODEL",
  "ICDU_API_BASE_URL",
  "ASSISTANT_REQUESTS_PER_MINUTE",
  "ASSISTANT_REQUESTS_PER_HOUR",
  "ASSISTANT_REQUESTS_PER_DAY",
] as const;

const saved: Record<string, string | undefined> = {};

function snapshotEnv() {
  for (const key of ENV_KEYS) {
    saved[key] = process.env[key];
  }
}

function restoreEnv() {
  for (const key of ENV_KEYS) {
    if (saved[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = saved[key];
    }
  }
}

function setEnv(overrides: Record<string, string | undefined>) {
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

function generateRequest(content = "Hello", headers?: HeadersInit) {
  return new NextRequest("http://localhost/api/copilotkit", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...headers,
    },
    body: JSON.stringify({
      operationName: "generateCopilotResponse",
      query: "mutation generateCopilotResponse($data: GenerateCopilotResponseInput!) { generateCopilotResponse(data: $data) { threadId } }",
      variables: {
        data: {
          frontend: { actions: [], url: "http://localhost/" },
          messages: [{ textMessage: { role: "user", content } }],
          metadata: { requestType: "Chat" },
        },
      },
    }),
  });
}

describe("copilotkit route spend gates", { concurrency: false }, () => {
  before(() => {
    snapshotEnv();
  });

  after(() => {
    restoreEnv();
    resetMemorySpendStoreForTests();
  });

  it("returns 503 without budget details when production enforcement storage is unavailable", async () => {
    resetMemorySpendStoreForTests();
    const clearedDb: Record<string, string | undefined> = {};
    for (const key of DATABASE_KEYS) {
      clearedDb[key] = undefined;
    }
    setEnv({
      ...clearedDb,
      GEMINI_API_KEY: "test-key",
      GEMINI_MODEL: "gemini-2.5-flash",
      ASSISTANT_PROVIDER: "gemini",
      ICDU_API_KEY: undefined,
      VERCEL: "1",
      VERCEL_ENV: "production",
      ASSISTANT_SPEND_STORE: undefined,
    });

    const response = await POST(
      generateRequest("Hello", {
        "x-vercel-forwarded-for": "198.51.100.10",
        "x-forwarded-for": "203.0.113.9",
      })
    );
    assert.equal(response.status, 503);
    const body = await response.json();
    assert.equal(body.message, VISITOR_UNAVAILABLE_MESSAGE);
    assert.equal("details" in body, false);
    assert.doesNotMatch(JSON.stringify(body), /budget|nanos|DATABASE_URL|remaining|1\.00|password/i);
    const contact = readFileSync(new URL("../../app/contact/page.tsx", import.meta.url), "utf8");
    const actions = readFileSync(new URL("../../app/contact/actions.ts", import.meta.url), "utf8");
    assert.match(contact, /ContactForm/);
    assert.match(actions, /export async function submitContactForm/);
    assert.equal(actions.includes("spend-store"), false);
    assert.equal(actions.includes("createSpendGuard"), false);
  });

  it("rejects untrusted identifiers and unknown model prices without calling the provider path", async () => {
    resetMemorySpendStoreForTests();
    setEnv({
      GEMINI_API_KEY: "test-key",
      GEMINI_MODEL: "gemini-1.5-pro",
      ASSISTANT_PROVIDER: "gemini",
      ICDU_API_KEY: undefined,
      VERCEL: "1",
      VERCEL_ENV: "production",
      DATABASE_URL: "postgres://example/db",
    });
    const response = await POST(
      generateRequest("Hello", {
        "x-vercel-forwarded-for": "198.51.100.10",
      })
    );
    assert.equal(response.status, 503);
    const body = await response.json();
    assert.equal(body.message, VISITOR_UNAVAILABLE_MESSAGE);
  });

  it("returns 429 with Retry-After after the per-client generation cap", async () => {
    resetMemorySpendStoreForTests();
    setEnv({
      GEMINI_API_KEY: "test-key",
      GEMINI_MODEL: "gemini-2.5-flash",
      ASSISTANT_PROVIDER: "gemini",
      ICDU_API_KEY: undefined,
      VERCEL: undefined,
      VERCEL_ENV: undefined,
      ASSISTANT_SPEND_STORE: "memory",
      ASSISTANT_REQUESTS_PER_MINUTE: "2",
      ASSISTANT_REQUESTS_PER_DAY: "100",
    });

    const loaded = loadAssistantSpendConfig();
    assert.equal(loaded.ok, true);
    if (!loaded.ok) {
      return;
    }
    const store = createSpendStore(loaded.config);
    assert.ok(store);
    const client = deriveClientHash(new Headers());
    const now = new Date();
    const minuteStart = utcMinuteStart(now);
    const first = await store.hitRateLimit({
      clientHash: client.hash,
      windowType: "minute",
      windowStart: minuteStart,
      limit: loaded.config.requestsPerMinute,
    });
    const second = await store.hitRateLimit({
      clientHash: client.hash,
      windowType: "minute",
      windowStart: minuteStart,
      limit: loaded.config.requestsPerMinute,
    });
    assert.equal(first.allowed, true);
    assert.equal(second.allowed, true);

    const response = await POST(generateRequest());
    assert.equal(response.status, 429);
    assert.equal(response.headers.get("Retry-After"), "60");
    const body = await response.json();
    assert.equal(body.message, VISITOR_BUSY_MESSAGE);
    assert.doesNotMatch(JSON.stringify(body), /remaining|budget|hash/i);
  });

  it("rejects oversized CopilotKit bodies before generation", async () => {
    resetMemorySpendStoreForTests();
    setEnv({
      GEMINI_API_KEY: "test-key",
      GEMINI_MODEL: "gemini-2.5-flash",
      ASSISTANT_PROVIDER: "gemini",
      ICDU_API_KEY: undefined,
      VERCEL: undefined,
      ASSISTANT_SPEND_STORE: "memory",
    });
    const response = await POST(generateRequest("x".repeat(5_000)));
    assert.equal(response.status, 413);
  });
});
