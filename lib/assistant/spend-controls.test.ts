import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { loadAssistantConfig } from "./config";
import { createSpendGuard, AssistantSpendError } from "./spend-controls";
import { MemorySpendStore, utcDayStart, utcMonthStart, type SpendStore, type RateLimitHit } from "./spend-store";
import type { AssistantSpendConfig } from "./spend-config";
import type { BoundInputResult } from "./token-budget";
import { conservativeCallChargeNanos, getModelPrices } from "./pricing";
import { usdToNanos } from "./money";
import { VISITOR_UNAVAILABLE_MESSAGE } from "./constants";
import type { ProviderUsage } from "./usage";

const MODEL = "gemini-2.5-flash-lite";
const prices = getModelPrices(MODEL);
assert.ok(prices);

function assistantConfig(maxOutputTokens = 8) {
  const loaded = loadAssistantConfig({
    ASSISTANT_PROVIDER: "gemini",
    GEMINI_API_KEY: "test-key",
    GEMINI_MODEL: MODEL,
    ASSISTANT_MAX_OUTPUT_TOKENS: String(maxOutputTokens),
  });
  assert.equal(loaded.ok, true);
  if (!loaded.ok) {
    throw new Error("expected assistant config");
  }
  return loaded.config;
}

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

function boundInput(estimatedInputTokens: number): BoundInputResult {
  return {
    messages: [],
    estimatedInputTokens,
    historyTruncated: false,
    droppedMessageCount: 0,
    reservedTokens: estimatedInputTokens,
  };
}

function reserveCost(inputTokens: number, maxOutputTokens = 8) {
  return conservativeCallChargeNanos(prices!, inputTokens, maxOutputTokens, 0);
}

class FailingSpendStore implements SpendStore {
  hitRateLimit(): Promise<RateLimitHit> {
    return Promise.reject(new Error("connection refused"));
  }
  reserve(): ReturnType<SpendStore["reserve"]> {
    return Promise.resolve({ ok: false, reason: "store_error" });
  }
  reconcile(): ReturnType<SpendStore["reconcile"]> {
    return Promise.resolve({ ok: false });
  }
  recordUsage(): Promise<void> {
    return Promise.reject(new Error("connection refused"));
  }
  admitVisitorMessage(): ReturnType<SpendStore["admitVisitorMessage"]> {
    return Promise.reject(new Error("connection refused"));
  }
  consumeTurnModelCall(): ReturnType<SpendStore["consumeTurnModelCall"]> {
    return Promise.resolve({ ok: false, callNumber: 0, answerOnly: true, toolEvents: 0, reason: "store_error" });
  }
}

async function invokeGuarded(
  spend: ReturnType<typeof createSpendGuard>,
  bound: BoundInputResult,
  invoke: () => Promise<{ usage?: ProviderUsage; aborted?: boolean; failed?: boolean }>,
  now?: Date
) {
  let modelCalls = 0;
  const reservation = await spend.beforeModelCall(bound, now);
  try {
    modelCalls += 1;
    const result = await invoke();
    await spend.afterModelCall({
      reservation,
      usage: result.usage,
      aborted: result.aborted === true,
      failed: result.failed === true,
      latencyMs: 5,
      model: MODEL,
    });
    return { reservation, result, modelCalls };
  } catch (error) {
    await spend.afterModelCall({
      reservation,
      aborted: false,
      failed: true,
      latencyMs: 5,
      model: MODEL,
    });
    throw error;
  }
}

describe("assistant spend controls", () => {
  it("does not call the model when the daily budget is exhausted", async () => {
    const cost = reserveCost(100);
    const store = new MemorySpendStore(spendConfig({ dailyBudgetNanos: cost, monthlyBudgetNanos: cost * BigInt(10) }));
    const spend = createSpendGuard({
      store,
      spend: spendConfig({ dailyBudgetNanos: cost, monthlyBudgetNanos: cost * BigInt(10) }),
      assistant: assistantConfig(),
      clientHash: "client-a",
      requestId: "req-budget-1",
    });

    let modelCalls = 0;
    await invokeGuarded(spend, boundInput(100), async () => {
      modelCalls += 1;
      return {
        usage: {
          inputTokens: 20,
          outputTokens: 2,
          source: "provider",
        },
      };
    });
    assert.equal(modelCalls, 1);

    const second = createSpendGuard({
      store,
      spend: spendConfig({ dailyBudgetNanos: cost, monthlyBudgetNanos: cost * BigInt(10) }),
      assistant: assistantConfig(),
      clientHash: "client-a",
      requestId: "req-budget-2",
    });
    let secondCalls = 0;
    await assert.rejects(
      () =>
        invokeGuarded(second, boundInput(100), async () => {
          secondCalls += 1;
          return {};
        }),
      (error: unknown) => error instanceof AssistantSpendError && error.httpStatus === 503
    );
    assert.equal(secondCalls, 0);
    assert.equal(store.remaining("day", new Date()) >= BigInt(0), true);
  });

  it("does not let concurrent reservations oversubscribe the remaining budget", async () => {
    const cost = reserveCost(50);
    const config = spendConfig({
      dailyBudgetNanos: cost * BigInt(3),
      monthlyBudgetNanos: cost * BigInt(3),
    });
    const store = new MemorySpendStore(config);
    const now = new Date("2026-09-15T12:00:00.000Z");

    const attempts = Array.from({ length: 12 }, (_, index) => {
      const spend = createSpendGuard({
        store,
        spend: config,
        assistant: assistantConfig(),
        clientHash: `client-${index}`,
        requestId: `req-concurrent-${index}`,
      });
      return spend
        .beforeModelCall(boundInput(50), now)
        .then(() => "ok" as const)
        .catch(() => "blocked" as const);
    });

    const results = await Promise.all(attempts);
    const accepted = results.filter((result) => result === "ok").length;
    const blocked = results.filter((result) => result === "blocked").length;
    assert.equal(accepted, 3);
    assert.equal(blocked, 9);
    assert.equal(store.remaining("day", now), BigInt(0));
  });

  it("accounts for additional tool-related model calls on the same request", async () => {
    const cost = reserveCost(40);
    const config = spendConfig({
      dailyBudgetNanos: cost * BigInt(10),
      monthlyBudgetNanos: cost * BigInt(10),
      maxModelCallsPerRequest: 4,
    });
    const store = new MemorySpendStore(config);
    const spend = createSpendGuard({
      store,
      spend: config,
      assistant: assistantConfig(),
      clientHash: "client-tools",
      requestId: "req-tools",
    });

    let modelCalls = 0;
    const first = await invokeGuarded(spend, boundInput(40), async () => {
      modelCalls += 1;
      return {
        usage: { inputTokens: 10, outputTokens: 2, source: "provider" as const },
      };
    });
    const second = await invokeGuarded(spend, boundInput(40), async () => {
      modelCalls += 1;
      return {
        usage: { inputTokens: 12, outputTokens: 3, source: "provider" as const },
      };
    });

    assert.equal(modelCalls, 2);
    assert.equal(first.reservation.callIndex, 1);
    assert.equal(second.reservation.callIndex, 2);
    assert.equal(store.usage.length, 2);
    assert.equal(store.usage[0]?.callIndex, 1);
    assert.equal(store.usage[1]?.callIndex, 2);
    const used = usdToNanos(1) - store.remaining("day", new Date());
    assert.ok(used > BigInt(0));
  });

  it("retains a conservative charge when usage is missing, cancelled, or only partially streamed", async () => {
    const cost = reserveCost(80);
    const config = spendConfig({
      dailyBudgetNanos: cost * BigInt(5),
      monthlyBudgetNanos: cost * BigInt(5),
    });
    const store = new MemorySpendStore(config);
    const now = new Date("2026-09-15T15:00:00.000Z");

    const missing = createSpendGuard({
      store,
      spend: config,
      assistant: assistantConfig(),
      clientHash: "client-retain",
      requestId: "req-missing",
    });
    await invokeGuarded(
      missing,
      boundInput(80),
      async () => ({}),
      now
    );

    const cancelled = createSpendGuard({
      store,
      spend: config,
      assistant: assistantConfig(),
      clientHash: "client-retain",
      requestId: "req-cancel",
    });
    await invokeGuarded(
      cancelled,
      boundInput(80),
      async () => ({
        aborted: true,
        usage: { inputTokens: 10, outputTokens: 1, source: "provider" },
      }),
      now
    );

    const partial = createSpendGuard({
      store,
      spend: config,
      assistant: assistantConfig(),
      clientHash: "client-retain",
      requestId: "req-partial",
    });
    await invokeGuarded(
      partial,
      boundInput(80),
      async () => ({
        failed: true,
        usage: { inputTokens: 10, outputTokens: 1, source: "provider" },
      }),
      now
    );

    assert.equal(store.usage.length, 3);
    assert.equal(store.usage[0]?.usageSource, "unknown");
    assert.equal(store.usage[0]?.estimatedCostNanos, cost);
    assert.equal(store.usage[1]?.outcome, "cancelled");
    assert.equal(store.usage[1]?.estimatedCostNanos, cost);
    assert.equal(store.usage[2]?.outcome, "provider_error");
    assert.equal(store.usage[2]?.estimatedCostNanos, cost);
    assert.equal(store.remaining("day", now), cost * BigInt(2));
  });

  it("reconciles a reservation exactly once", async () => {
    const cost = reserveCost(30);
    const config = spendConfig({
      dailyBudgetNanos: cost * BigInt(4),
      monthlyBudgetNanos: cost * BigInt(4),
    });
    const store = new MemorySpendStore(config);
    const spend = createSpendGuard({
      store,
      spend: config,
      assistant: assistantConfig(),
      clientHash: "client-idempotent",
      requestId: "req-idempotent",
    });
    const reservation = await spend.beforeModelCall(boundInput(30));
    const usage = { inputTokens: 10, outputTokens: 2, source: "provider" as const };
    await spend.afterModelCall({
      reservation,
      usage,
      aborted: false,
      failed: false,
      latencyMs: 4,
      model: MODEL,
    });
    const remainingAfterFirst = store.remaining("day", new Date());
    await spend.afterModelCall({
      reservation,
      usage: { inputTokens: 1, outputTokens: 1, source: "provider" },
      aborted: false,
      failed: false,
      latencyMs: 4,
      model: MODEL,
    });
    assert.equal(store.remaining("day", new Date()), remainingAfterFirst);
    assert.equal(store.usage.length, 1);
  });

  it("does not allow a reused request id to obtain another provider call", async () => {
    const cost = reserveCost(20);
    const config = spendConfig({
      dailyBudgetNanos: cost * BigInt(4),
      monthlyBudgetNanos: cost * BigInt(4),
    });
    const store = new MemorySpendStore(config);
    const first = createSpendGuard({
      store,
      spend: config,
      assistant: assistantConfig(),
      clientHash: "client-reuse",
      requestId: "req-reuse",
    });
    const reservation = await first.beforeModelCall(boundInput(20));
    assert.equal(reservation.reused, false);

    const retry = createSpendGuard({
      store,
      spend: config,
      assistant: assistantConfig(),
      clientHash: "client-reuse",
      requestId: "req-reuse",
    });
    let modelCalls = 0;
    await assert.rejects(
      () =>
        invokeGuarded(retry, boundInput(20), async () => {
          modelCalls += 1;
          return {};
        }),
      (error: unknown) => error instanceof AssistantSpendError
    );
    assert.equal(modelCalls, 0);
  });

  it("opens a new daily and monthly budget after UTC rollover", async () => {
    const cost = reserveCost(25);
    const config = spendConfig({
      dailyBudgetNanos: cost,
      monthlyBudgetNanos: cost * BigInt(2),
    });
    const store = new MemorySpendStore(config);
    const dayOne = new Date("2026-09-15T23:00:00.000Z");
    const dayTwo = new Date("2026-09-16T00:30:00.000Z");
    const nextMonth = new Date("2026-10-01T00:00:00.000Z");

    const first = createSpendGuard({
      store,
      spend: config,
      assistant: assistantConfig(),
      clientHash: "client-roll",
      requestId: "req-day-1",
    });
    await first.beforeModelCall(boundInput(25), dayOne);
    assert.equal(store.remaining("day", dayOne), BigInt(0));
    assert.equal(store.remaining("month", dayOne), cost);

    const second = createSpendGuard({
      store,
      spend: config,
      assistant: assistantConfig(),
      clientHash: "client-roll",
      requestId: "req-day-2",
    });
    const dayTwoReservation = await second.beforeModelCall(boundInput(25), dayTwo);
    assert.equal(dayTwoReservation.status, "reserved");
    assert.equal(store.remaining("day", dayTwo), BigInt(0));
    assert.equal(store.remaining("month", dayTwo), BigInt(0));
    assert.notEqual(utcDayStart(dayOne).toISOString(), utcDayStart(dayTwo).toISOString());

    const third = createSpendGuard({
      store,
      spend: config,
      assistant: assistantConfig(),
      clientHash: "client-roll",
      requestId: "req-month-2",
    });
    const monthReservation = await third.beforeModelCall(boundInput(25), nextMonth);
    assert.equal(monthReservation.status, "reserved");
    assert.notEqual(utcMonthStart(dayTwo).toISOString(), utcMonthStart(nextMonth).toISOString());
    assert.equal(store.remaining("month", nextMonth), cost);
  });

  it("blocks paid inference when enforcement storage fails", async () => {
    const spend = createSpendGuard({
      store: new FailingSpendStore(),
      spend: spendConfig(),
      assistant: assistantConfig(),
      clientHash: "client-fail",
      requestId: "req-fail",
    });
    let modelCalls = 0;
    await assert.rejects(
      () => spend.checkRateLimit(),
      (error: unknown) => error instanceof Error && !String(error).includes("password")
    );
    await assert.rejects(
      () =>
        invokeGuarded(spend, boundInput(10), async () => {
          modelCalls += 1;
          return {};
        }),
      (error: unknown) =>
        error instanceof AssistantSpendError &&
        error.httpStatus === 503 &&
        error.visitorMessage === VISITOR_UNAVAILABLE_MESSAGE
    );
    assert.equal(modelCalls, 0);
  });

  it("enforces per-client generation request rate limits before a model call", async () => {
    const config = spendConfig({ requestsPerMinute: 2, requestsPerDay: 2 });
    const store = new MemorySpendStore(config);
    const now = new Date("2026-09-15T12:00:00.000Z");
    const spend = createSpendGuard({
      store,
      spend: config,
      assistant: assistantConfig(),
      clientHash: "client-rate",
      requestId: "req-rate-1",
    });
    await spend.checkRateLimit(now);
    await spend.checkRateLimit(now);
    await assert.rejects(
      () => spend.checkRateLimit(now),
      (error: unknown) =>
        error instanceof AssistantSpendError && error.httpStatus === 429 && error.retryAfterSeconds === 60
    );
  });
});
