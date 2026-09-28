import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { AIMessage, HumanMessage, SystemMessage, ToolMessage } from "@langchain/core/messages";
import { loadAssistantConfig, publicAssistantConfigSummary } from "./config";
import { createIcdUChatModelFields, normalizeIcdUStreamChunk } from "./adapter";
import { classifyUpstreamError, readGatewayBusyCode, upstreamShouldRetry } from "./provider-errors";
import { AssistantSpendError, AssistantUnavailableError } from "./errors";
import { fitUpstreamChatRequest } from "./upstream-request";
import { MemorySpendStore } from "./spend-store";
import { embedIcdUTexts } from "./embeddings";
import { retrieveForVisitor } from "./retrieval";
import { generationTimeoutMs, retrievalPlan } from "./turn-budget";
import type { AssistantSpendConfig } from "./spend-config";
import { usdToNanos } from "./money";
import { getModelPrices } from "./pricing";
import {
  ASSISTANT_QUEUE_NOTE_DELAY_MS,
  ASSISTANT_TURN_DEADLINE_MS,
  ICDU_DEFAULT_BASE_URL,
  ICDU_DEFAULT_MODEL,
  ICDU_EMBED_DIMENSIONS,
  ICDU_GENERATION_TIMEOUT_MS,
  ICDU_MAX_MESSAGES,
  ICDU_MAX_UPSTREAM_BODY_BYTES,
  ICDU_RETRIEVAL_BUDGET_MS,
  retryDelaySeconds,
  VISITOR_UNAVAILABLE_MESSAGE,
  visitorGatewayBusyMessage,
  visitorGatewayRateLimitMessage,
  visitorQueueFullMessage,
  visitorQueueTimeoutMessage,
} from "./constants";

function spendConfig(overrides: Partial<AssistantSpendConfig> = {}): AssistantSpendConfig {
  return {
    namespace: "development",
    storeKind: "memory",
    requestsPerMinute: 10,
    requestsPerHour: 25,
    requestsPerDay: 100,
    dailyBudgetNanos: usdToNanos(1),
    monthlyBudgetNanos: usdToNanos(10),
    maxBodyBytes: 262_144,
    maxUserMessageChars: 4_000,
    maxToolResultChars: 8_000,
    maxModelCallsPerRequest: 4,
    maxToolEventsPerTurn: 6,
    ...overrides,
  };
}

describe("ICDU provider configuration", () => {
  it("uses ICDU by default and does not select Gemini when a Gemini key is present", () => {
    const loaded = loadAssistantConfig({
      ICDU_API_KEY: "server-secret",
      GEMINI_API_KEY: "paid-gemini-key",
    });
    assert.equal(loaded.ok, true);
    if (!loaded.ok) {
      return;
    }
    assert.equal(loaded.config.provider, "icdu");
    assert.equal(loaded.config.model, ICDU_DEFAULT_MODEL);
    assert.equal(loaded.config.apiKeySource, "ICDU_API_KEY");
    assert.equal(loaded.config.baseUrl, ICDU_DEFAULT_BASE_URL);
    assert.equal(loaded.config.apiKey, "server-secret");
    assert.equal(getModelPrices(loaded.config.model)?.externalCharge, false);
    const summary = JSON.stringify(publicAssistantConfigSummary(loaded.config));
    assert.equal(summary.includes("server-secret"), false);
    assert.equal(summary.includes("paid-gemini-key"), false);
  });

  it("fails closed when the ICDU key is missing instead of using Gemini", () => {
    const loaded = loadAssistantConfig({
      GEMINI_API_KEY: "paid-gemini-key",
      GOOGLE_API_KEY: "paid-google-key",
    });
    assert.equal(loaded.ok, false);
    if (loaded.ok) {
      return;
    }
    assert.equal(loaded.code, "missing_key");
    assert.match(loaded.issues.join(" "), /does not fall back to Gemini/i);
  });

  it("keeps Gemini available only as an explicit rollback", () => {
    const loaded = loadAssistantConfig({
      ASSISTANT_PROVIDER: "gemini",
      GEMINI_API_KEY: "rollback-key",
    });
    assert.equal(loaded.ok, true);
    if (!loaded.ok) {
      return;
    }
    assert.equal(loaded.config.provider, "gemini");
    assert.equal(loaded.config.model, "gemini-2.5-flash");
    assert.equal(loaded.config.apiKeySource, "GEMINI_API_KEY");
  });

  it("rejects an ICDU output limit above the gateway ceiling and a credentialed base URL", () => {
    const tooLarge = loadAssistantConfig({
      ICDU_API_KEY: "server-secret",
      ASSISTANT_MAX_OUTPUT_TOKENS: "4096",
    });
    assert.equal(tooLarge.ok, false);
    const insecure = loadAssistantConfig({
      ICDU_API_KEY: "server-secret",
      ICDU_API_BASE_URL: "http://user:secret@example.test/v1",
    });
    assert.equal(insecure.ok, false);
  });

  it("configures Chat Completions without the Responses API or retries", () => {
    const loaded = loadAssistantConfig({ ICDU_API_KEY: "server-secret" });
    assert.equal(loaded.ok, true);
    if (!loaded.ok) {
      return;
    }
    const fields = createIcdUChatModelFields(loaded.config);
    assert.equal(fields.useResponsesApi, false);
    assert.equal(fields.maxRetries, 0);
    assert.equal(fields.streaming, true);
    assert.equal(fields.streamUsage, true);
    assert.equal(fields.maxTokens, loaded.config.maxOutputTokens);
    assert.equal(fields.configuration.baseURL, ICDU_DEFAULT_BASE_URL);
    assert.equal(fields.timeout, ICDU_GENERATION_TIMEOUT_MS);
    assert.equal(fields.configuration.timeout, ICDU_GENERATION_TIMEOUT_MS);
    assert.equal(upstreamShouldRetry(), false);
  });

  it("maps queue_full, queue_timeout, and rate_limit without retrying", () => {
    const full = classifyUpstreamError(Object.assign(new Error("busy"), {
      status: 429,
      code: "queue_full",
      headers: { get: () => "5" },
    }));
    const timedOut = classifyUpstreamError(Object.assign(new Error('{"error":{"code":"queue_timeout"}}'), {
      status: 429,
      headers: { get: () => "5" },
    }));
    const limited = classifyUpstreamError(Object.assign(new Error("slow"), {
      status: 429,
      code: "rate_limit",
      headers: { get: () => "60" },
    }));
    assert.equal(full instanceof AssistantSpendError, true);
    assert.equal(readGatewayBusyCode(Object.assign(new Error("busy"), { status: 429, code: "queue_full" })), "queue_full");
    if (full instanceof AssistantSpendError) {
      assert.match(full.message, /cannot take another waiting conversation/);
      assert.equal(full.retryAfterSeconds, 5);
    }
    if (timedOut instanceof AssistantSpendError) {
      assert.match(timedOut.message, /turn to start expired/);
    }
    if (limited instanceof AssistantSpendError) {
      assert.equal(limited.retryAfterSeconds, 60);
      assert.match(limited.message, /too many new conversations/);
    }
    assert.equal(upstreamShouldRetry(), false);
  });
});

describe("ICDU stream and gateway errors", () => {
  it("keeps fragmented tool-call ids associated with the original call", () => {
    const first = normalizeIcdUStreamChunk({
      content: "",
      tool_call_chunks: [{ id: "call_abc", name: "navigateToPublishedPage", args: "", index: 0 }],
    }) as { tool_call_chunks: Array<{ id?: string; name?: string }> };
    const fragment = normalizeIcdUStreamChunk({
      content: "Consulting starts with a request.",
      tool_call_chunks: [{ id: "", name: "", args: "{\"path\":\"/consulting\"}", index: 0 }],
    }) as { content: string; tool_call_chunks: Array<{ id?: string }> };
    assert.equal(first.tool_call_chunks[0]?.id, "call_abc");
    assert.equal(first.tool_call_chunks[0]?.name, "navigateToPublishedPage");
    assert.equal(fragment.tool_call_chunks[0]?.id, "");
    assert.equal(fragment.content, "Consulting starts with a request.");
    assert.equal(JSON.stringify(fragment).includes("gemini-tool"), false);
  });

  it("maps gateway busy and invalid credentials without retrying or echoing a key", () => {
    const busy = classifyUpstreamError(Object.assign(new Error("rate limit"), {
      status: 429,
      headers: { get: (name: string) => (name.toLowerCase() === "retry-after" ? "12" : null) },
    }));
    assert.equal(busy instanceof AssistantSpendError, true);
    if (busy instanceof AssistantSpendError) {
      assert.equal(busy.httpStatus, 429);
      assert.equal(busy.retryAfterSeconds, 12);
      assert.equal(busy.message, visitorGatewayBusyMessage(12));
    }

    const invalid = classifyUpstreamError(Object.assign(new Error("Incorrect API key sk-secret"), { status: 401 }));
    assert.equal(invalid.code, "ASSISTANT_PROVIDER_ERROR");
    assert.equal(invalid.message, VISITOR_UNAVAILABLE_MESSAGE);
    assert.equal(invalid.message.includes("sk-secret"), false);
    assert.equal(upstreamShouldRetry(), false);
  });

  it("classifies an aborted timeout separately from cancellation", () => {
    const timeout = classifyUpstreamError(Object.assign(new Error("The operation was aborted"), { name: "TimeoutError" }), true);
    const cancelled = classifyUpstreamError(Object.assign(new Error("The operation was aborted"), { name: "AbortError" }), true);
    assert.equal(timeout.code, "ASSISTANT_TIMEOUT");
    assert.equal(cancelled.code, "ASSISTANT_CANCELLED");
    assert.equal(timeout.message, VISITOR_UNAVAILABLE_MESSAGE);
    assert.equal(cancelled.message, VISITOR_UNAVAILABLE_MESSAGE);
  });
});

describe("ICDU upstream request limits", () => {
  it("truncates history to the gateway body limit without splitting a tool pair", () => {
    const messages = [new SystemMessage("Policy")];
    for (let index = 0; index < 30; index += 1) {
      messages.push(new HumanMessage(`older question ${index} ${"context ".repeat(80)}`));
      messages.push(new AIMessage(`older answer ${index} ${"detail ".repeat(80)}`));
    }
    messages.push(new HumanMessage("Book a consultation"));
    messages.push(new AIMessage({
      content: "",
      tool_calls: [{ id: "call-1", name: "scheduleConsultation", args: {} }],
    }));
    messages.push(new ToolMessage({ content: "request submitted", tool_call_id: "call-1" }));
    messages.push(new HumanMessage("What happens next?"));

    const fitted = fitUpstreamChatRequest(messages, [{ name: "scheduleConsultation", description: "request", jsonSchema: "{}" }], "icdu", 1024);
    assert.ok(fitted.bodyBytes <= ICDU_MAX_UPSTREAM_BODY_BYTES);
    assert.ok(fitted.messages.length <= ICDU_MAX_MESSAGES);
    const hasToolCall = fitted.messages.some((message) => {
      const toolCalls = (message as AIMessage).tool_calls;
      return message._getType?.() === "ai" && Array.isArray(toolCalls) && toolCalls.length > 0;
    });
    const hasToolResult = fitted.messages.some((message) => message._getType?.() === "tool");
    assert.equal(hasToolCall, hasToolResult);
    assert.equal(String(fitted.messages.at(-1)?.content), "What happens next?");
  });
});

describe("shared hourly visitor allowance", () => {
  it("counts a visitor message once across retries and blocks the next distinct message", async () => {
    const store = new MemorySpendStore(spendConfig({ requestsPerHour: 1, requestsPerMinute: 10, requestsPerDay: 10 }));
    const now = new Date("2026-09-28T12:15:00.000Z");
    const first = await store.admitVisitorMessage({ clientHash: "visitor", turnKey: "turn-a", now });
    const retry = await store.admitVisitorMessage({ clientHash: "visitor", turnKey: "turn-a", now });
    const next = await store.admitVisitorMessage({ clientHash: "visitor", turnKey: "turn-b", now });
    assert.equal(first.ok, true);
    assert.equal(first.alreadySeen, false);
    assert.equal(retry.ok, true);
    assert.equal(retry.alreadySeen, true);
    assert.equal(next.ok, false);
    assert.equal(next.blockedWindow, "hour");
    assert.equal(next.hourLimit, 1);
    assert.equal(getModelPrices("icdu")?.externalCharge, false);
  });

  it("reserves the last model call for a written answer and then stops the turn", async () => {
    const store = new MemorySpendStore(spendConfig({ maxModelCallsPerRequest: 2, maxToolEventsPerTurn: 6 }));
    const now = new Date("2026-09-28T12:15:00.000Z");
    const first = await store.consumeTurnModelCall({
      clientHash: "visitor",
      turnKey: "turn-a",
      now,
      maxModelCalls: 2,
      toolEventsSeen: 0,
      maxToolEvents: 6,
    });
    await store.releaseTurnModelCall({ clientHash: "visitor", turnKey: "turn-a", now });
    const last = await store.consumeTurnModelCall({
      clientHash: "visitor",
      turnKey: "turn-a",
      now,
      maxModelCalls: 2,
      toolEventsSeen: 1,
      maxToolEvents: 6,
    });
    await store.releaseTurnModelCall({ clientHash: "visitor", turnKey: "turn-a", now });
    const extra = await store.consumeTurnModelCall({
      clientHash: "visitor",
      turnKey: "turn-a",
      now,
      maxModelCalls: 2,
      toolEventsSeen: 1,
      maxToolEvents: 6,
    });
    assert.equal(first.answerOnly, false);
    assert.equal(last.answerOnly, true);
    assert.equal(last.ok, true);
    assert.equal(extra.ok, false);
    assert.equal(extra.reason, "model_call_limit");
  });

  it("lets two visitors reach the gateway and blocks only a duplicate submit of the same turn", async () => {
    const store = new MemorySpendStore(spendConfig());
    const now = new Date("2026-09-28T12:15:00.000Z");
    await store.admitVisitorMessage({ clientHash: "visitor-a", turnKey: "turn", now });
    await store.admitVisitorMessage({ clientHash: "visitor-b", turnKey: "turn", now });
    const first = await store.consumeTurnModelCall({
      clientHash: "visitor-a",
      turnKey: "turn",
      now,
      maxModelCalls: 4,
      toolEventsSeen: 0,
      maxToolEvents: 6,
    });
    const otherVisitor = await store.consumeTurnModelCall({
      clientHash: "visitor-b",
      turnKey: "turn",
      now,
      maxModelCalls: 4,
      toolEventsSeen: 0,
      maxToolEvents: 6,
    });
    const duplicate = await store.consumeTurnModelCall({
      clientHash: "visitor-a",
      turnKey: "turn",
      now,
      maxModelCalls: 4,
      toolEventsSeen: 0,
      maxToolEvents: 6,
    });
    assert.equal(first.ok, true);
    assert.equal(otherVisitor.ok, true);
    assert.equal(duplicate.ok, false);
    assert.equal(duplicate.reason, "duplicate");
  });

  it("keeps the original turn deadline across a later tool continuation", async () => {
    const store = new MemorySpendStore(spendConfig());
    const started = new Date("2026-09-28T12:00:00.000Z");
    await store.admitVisitorMessage({ clientHash: "visitor", turnKey: "turn-a", now: started });
    const continued = new Date(started.getTime() + 200_000);
    const call = await store.consumeTurnModelCall({
      clientHash: "visitor",
      turnKey: "turn-a",
      now: continued,
      maxModelCalls: 4,
      toolEventsSeen: 1,
      maxToolEvents: 6,
    });
    const expired = await store.consumeTurnModelCall({
      clientHash: "visitor",
      turnKey: "turn-a",
      now: new Date(started.getTime() + 241_000),
      maxModelCalls: 4,
      toolEventsSeen: 1,
      maxToolEvents: 6,
    });
    assert.equal(call.ok, true);
    assert.equal(call.answerOnly, true);
    assert.equal(expired.ok, false);
    assert.equal(expired.reason, "turn_deadline");
  });

  it("treats a second submit as a duplicate until the in-flight window goes stale", async () => {
    const store = new MemorySpendStore(spendConfig());
    const started = new Date("2026-09-28T12:00:00.000Z");
    await store.admitVisitorMessage({ clientHash: "visitor", turnKey: "turn-a", now: started });
    const first = await store.consumeTurnModelCall({
      clientHash: "visitor",
      turnKey: "turn-a",
      now: started,
      maxModelCalls: 4,
      toolEventsSeen: 0,
      maxToolEvents: 6,
    });
    const duplicate = await store.consumeTurnModelCall({
      clientHash: "visitor",
      turnKey: "turn-a",
      now: new Date(started.getTime() + 10_000),
      maxModelCalls: 4,
      toolEventsSeen: 0,
      maxToolEvents: 6,
    });
    const recovered = await store.consumeTurnModelCall({
      clientHash: "visitor",
      turnKey: "turn-a",
      now: new Date(started.getTime() + 131_000),
      maxModelCalls: 4,
      toolEventsSeen: 0,
      maxToolEvents: 6,
    });
    assert.equal(first.ok, true);
    assert.equal(duplicate.ok, false);
    assert.equal(duplicate.reason, "duplicate");
    assert.equal(recovered.ok, true);
    assert.equal(recovered.callNumber, 2);
  });
});

describe("shared gateway queue and retrieval budget", () => {
  it("keeps retrieval inside the turn deadline and caps generation to the time remaining", () => {
    assert.equal(retrievalPlan(ASSISTANT_TURN_DEADLINE_MS).budgetMs, ICDU_RETRIEVAL_BUDGET_MS);
    assert.equal(retrievalPlan(ASSISTANT_TURN_DEADLINE_MS).embed, true);
    assert.equal(retrievalPlan(800).embed, false);
    assert.equal(generationTimeoutMs(ASSISTANT_TURN_DEADLINE_MS - ICDU_RETRIEVAL_BUDGET_MS, ICDU_GENERATION_TIMEOUT_MS), ICDU_GENERATION_TIMEOUT_MS);
    assert.equal(generationTimeoutMs(40_000, ICDU_GENERATION_TIMEOUT_MS), 40_000);
    assert.equal(generationTimeoutMs(0, ICDU_GENERATION_TIMEOUT_MS), 0);
    assert.equal(retryDelaySeconds(visitorQueueFullMessage(5)), 5);
    assert.equal(retryDelaySeconds(visitorQueueTimeoutMessage(5)), 5);
    assert.equal(retryDelaySeconds(visitorGatewayRateLimitMessage(60)), 60);
    assert.equal(ASSISTANT_QUEUE_NOTE_DELAY_MS, 4_000);
  });

  it("retries a background embedding after delayed admission and keeps retrieval interactive", async () => {
    const original = globalThis.fetch;
    let attempts = 0;
    const priorities: Array<string | null> = [];
    globalThis.fetch = async (_input, init) => {
      attempts += 1;
      const headers = new Headers(init?.headers);
      priorities.push(headers.get("x-icdu-priority"));
      if (attempts === 1) {
        return new Response(JSON.stringify({ error: { code: "queue_full" } }), {
          status: 429,
          headers: { "retry-after": "0" },
        });
      }
      return new Response(JSON.stringify({
        data: [{ index: 0, embedding: Array.from({ length: ICDU_EMBED_DIMENSIONS }, () => 0.01) }],
      }), {
        status: 200,
        headers: { "x-icdu-queue-wait-ms": "20" },
      });
    };
    try {
      const vectors = await embedIcdUTexts(["consulting services"], {
        apiKey: "server-secret",
        baseUrl: ICDU_DEFAULT_BASE_URL,
        priority: "background",
        maxAttempts: 2,
      });
      assert.equal(vectors.length, 1);
      assert.equal(vectors[0]?.length, ICDU_EMBED_DIMENSIONS);
      assert.deepEqual(priorities, ["background", "background"]);
      assert.equal(JSON.stringify(vectors).includes("server-secret"), false);
    } finally {
      globalThis.fetch = original;
    }

    attempts = 0;
    globalThis.fetch = async () => {
      attempts += 1;
      return new Response(JSON.stringify({ error: { code: "queue_timeout" } }), {
        status: 429,
        headers: { "retry-after": "5" },
      });
    };
    try {
      await assert.rejects(
        () => embedIcdUTexts(["consulting"], {
          apiKey: "server-secret",
          baseUrl: ICDU_DEFAULT_BASE_URL,
          priority: "interactive",
          maxAttempts: 4,
        }),
        (error: unknown) => error instanceof AssistantSpendError && error.gatewayCode === "queue_timeout"
      );
      assert.equal(attempts, 1);
    } finally {
      globalThis.fetch = original;
    }
  });

  it("cancels a queued background embedding when the caller aborts", async () => {
    const original = globalThis.fetch;
    const controller = new AbortController();
    let attempts = 0;
    globalThis.fetch = async () => {
      attempts += 1;
      setTimeout(() => controller.abort(), 15);
      return new Response(JSON.stringify({ error: { code: "queue_full" } }), {
        status: 429,
        headers: { "retry-after": "30" },
      });
    };
    try {
      await assert.rejects(
        () => embedIcdUTexts(["page copy"], {
          apiKey: "server-secret",
          baseUrl: ICDU_DEFAULT_BASE_URL,
          priority: "background",
          maxAttempts: 4,
          signal: controller.signal,
        }),
        (error: unknown) => error instanceof AssistantUnavailableError && error.code === "ASSISTANT_CANCELLED"
      );
      assert.equal(attempts, 1);
    } finally {
      globalThis.fetch = original;
    }
  });

  it("uses keyword search when a query embedding is cancelled by its own budget", async () => {
    const original = globalThis.fetch;
    globalThis.fetch = (_input, init) => new Promise((_resolve, reject) => {
      const signal = init?.signal;
      const fail = () => reject(Object.assign(new Error("aborted"), { name: "AbortError" }));
      if (signal?.aborted) {
        fail();
        return;
      }
      signal?.addEventListener("abort", fail, { once: true });
    });
    try {
      const packet = await retrieveForVisitor("What consulting services does Overture offer?", {
        embed: true,
        apiKey: "server-secret",
        baseUrl: ICDU_DEFAULT_BASE_URL,
        signal: AbortSignal.timeout(40),
      });
      assert.equal(packet.mode, "keyword");
      assert.match(packet.limitation ?? "", /keyword matches/);
      assert.ok((packet.passages[0]?.sourceUrl ?? "").includes("overture-systems.com"));
    } finally {
      globalThis.fetch = original;
    }
  });
});
