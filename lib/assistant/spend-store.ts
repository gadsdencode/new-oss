import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { resolveDatabaseUrl } from "../database-url";
import { ZERO_NANOS, type NanoDollars } from "./money";
import type { AssistantSpendConfig } from "./spend-config";
import type { SpendNamespace } from "./client-id";

export type ReservationStatus = "reserved" | "committed" | "retained";
export type UsageSource = "provider" | "estimated" | "unknown";

export interface SpendReservation {
  reservationId: string;
  requestId: string;
  callIndex: number;
  reservedNanos: NanoDollars;
  committedNanos?: NanoDollars;
  status: ReservationStatus;
  reused: boolean;
  dayStart?: string;
  monthStart?: string;
  answerOnly?: boolean;
}

export interface VisitorAdmission {
  ok: boolean;
  alreadySeen: boolean;
  blockedWindow?: "minute" | "hour" | "day";
  retryAfterSeconds: number;
  hourCount: number;
  hourLimit: number;
}

export interface TurnModelCallResult {
  ok: boolean;
  callNumber: number;
  answerOnly: boolean;
  toolEvents: number;
  reason?: "model_call_limit" | "store_error";
}

export interface UsageRecord {
  callId: string;
  requestId: string;
  callIndex: number;
  createdAt: string;
  environment: string;
  namespace: SpendNamespace;
  model: string;
  pricingVersion: string;
  inputTokens?: number;
  outputTokens?: number;
  reasoningTokens?: number;
  usageSource: UsageSource;
  estimatedCostNanos: NanoDollars;
  latencyMs?: number;
  outcome: string;
}

export interface RateLimitHit {
  allowed: boolean;
  retryAfterSeconds: number;
}

export interface SpendStore {
  hitRateLimit(input: {
    clientHash: string;
    windowType: "minute" | "hour" | "day";
    windowStart: Date;
    limit: number;
  }): Promise<RateLimitHit>;
  admitVisitorMessage(input: {
    clientHash: string;
    turnKey: string;
    now: Date;
  }): Promise<VisitorAdmission>;
  consumeTurnModelCall(input: {
    clientHash: string;
    turnKey: string;
    now: Date;
    maxModelCalls: number;
    toolEventsSeen: number;
    maxToolEvents: number;
  }): Promise<TurnModelCallResult>;
  reserve(input: {
    requestId: string;
    callIndex: number;
    reserveNanos: NanoDollars;
    now: Date;
  }): Promise<{ ok: true; reservation: SpendReservation } | { ok: false; reason: "budget_exhausted" | "store_error" }>;
  reconcile(input: {
    reservationId: string;
    commitNanos: NanoDollars;
    status: "committed" | "retained";
  }): Promise<{ ok: true; committedNanos: NanoDollars; alreadyReconciled: boolean } | { ok: false }>;
  recordUsage(record: UsageRecord): Promise<void>;
}

export function utcDayStart(now: Date): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export function utcMonthStart(now: Date): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

export function utcHourStart(now: Date): Date {
  return new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours()
  ));
}

export function utcMinuteStart(now: Date): Date {
  return new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes()
  ));
}

class AsyncMutex {
  private chain: Promise<void> = Promise.resolve();

  run<T>(fn: () => T | Promise<T>): Promise<T> {
    const next = this.chain.then(fn, fn);
    this.chain = next.then(() => undefined, () => undefined);
    return next;
  }
}

export class MemorySpendStore implements SpendStore {
  private readonly mutex = new AsyncMutex();
  private readonly budgets = new Map<string, { reserved: NanoDollars; committed: NanoDollars; limit: NanoDollars }>();
  private readonly reservations = new Map<string, SpendReservation>();
  private readonly reservationByCall = new Map<string, string>();
  private readonly windows = new Map<string, number>();
  private readonly visitorTurns = new Map<string, { modelCalls: number; toolEvents: number }>();
  readonly usage: UsageRecord[] = [];

  constructor(private readonly config: AssistantSpendConfig) {}

  private budgetKey(periodType: "day" | "month", start: Date): string {
    return `${this.config.namespace}:${periodType}:${start.toISOString().slice(0, 10)}`;
  }

  private ensureBudget(periodType: "day" | "month", start: Date, limit: NanoDollars) {
    const key = this.budgetKey(periodType, start);
    if (!this.budgets.has(key)) {
      this.budgets.set(key, { reserved: ZERO_NANOS, committed: ZERO_NANOS, limit });
    }
    return this.budgets.get(key)!;
  }

  hitRateLimit(input: {
    clientHash: string;
    windowType: "minute" | "hour" | "day";
    windowStart: Date;
    limit: number;
  }): Promise<RateLimitHit> {
    return this.mutex.run(() => this.applyWindow(input));
  }

  private applyWindow(input: {
    clientHash: string;
    windowType: "minute" | "hour" | "day";
    windowStart: Date;
    limit: number;
  }): RateLimitHit {
    const key = `${input.clientHash}:${this.config.namespace}:${input.windowType}:${input.windowStart.toISOString()}`;
    const count = this.windows.get(key) ?? 0;
    const retryAfterSeconds = input.windowType === "minute" ? 60 : input.windowType === "hour" ? 3_600 : 86_400;
    if (count >= input.limit) {
      return { allowed: false, retryAfterSeconds };
    }
    this.windows.set(key, count + 1);
    return { allowed: true, retryAfterSeconds: 0 };
  }

  private turnStorageKey(clientHash: string, turnKey: string, hourStart: Date): string {
    return `${this.config.namespace}:${clientHash}:${turnKey}:${hourStart.toISOString()}`;
  }

  admitVisitorMessage(input: {
    clientHash: string;
    turnKey: string;
    now: Date;
  }): Promise<VisitorAdmission> {
    return this.mutex.run(() => {
      const hourStart = utcHourStart(input.now);
      const storageKey = this.turnStorageKey(input.clientHash, input.turnKey, hourStart);
      const hourLimit = this.config.requestsPerHour;
      if (this.visitorTurns.has(storageKey)) {
        return {
          ok: true,
          alreadySeen: true,
          retryAfterSeconds: 0,
          hourCount: 0,
          hourLimit,
        };
      }

      const minute = this.applyWindow({
        clientHash: input.clientHash,
        windowType: "minute",
        windowStart: utcMinuteStart(input.now),
        limit: this.config.requestsPerMinute,
      });
      if (!minute.allowed) {
        return {
          ok: false,
          alreadySeen: false,
          blockedWindow: "minute",
          retryAfterSeconds: minute.retryAfterSeconds,
          hourCount: 0,
          hourLimit,
        };
      }

      const hour = this.applyWindow({
        clientHash: input.clientHash,
        windowType: "hour",
        windowStart: hourStart,
        limit: hourLimit,
      });
      if (!hour.allowed) {
        return {
          ok: false,
          alreadySeen: false,
          blockedWindow: "hour",
          retryAfterSeconds: hour.retryAfterSeconds,
          hourCount: hourLimit,
          hourLimit,
        };
      }

      const day = this.applyWindow({
        clientHash: input.clientHash,
        windowType: "day",
        windowStart: utcDayStart(input.now),
        limit: this.config.requestsPerDay,
      });
      if (!day.allowed) {
        return {
          ok: false,
          alreadySeen: false,
          blockedWindow: "day",
          retryAfterSeconds: day.retryAfterSeconds,
          hourCount: 0,
          hourLimit,
        };
      }

      this.visitorTurns.set(storageKey, { modelCalls: 0, toolEvents: 0 });
      const hourKey = `${input.clientHash}:${this.config.namespace}:hour:${hourStart.toISOString()}`;
      return {
        ok: true,
        alreadySeen: false,
        retryAfterSeconds: 0,
        hourCount: this.windows.get(hourKey) ?? 1,
        hourLimit,
      };
    });
  }

  consumeTurnModelCall(input: {
    clientHash: string;
    turnKey: string;
    now: Date;
    maxModelCalls: number;
    toolEventsSeen: number;
    maxToolEvents: number;
  }): Promise<TurnModelCallResult> {
    return this.mutex.run(() => {
      const storageKey = this.turnStorageKey(input.clientHash, input.turnKey, utcHourStart(input.now));
      const current = this.visitorTurns.get(storageKey) ?? { modelCalls: 0, toolEvents: 0 };
      if (current.modelCalls >= input.maxModelCalls) {
        return {
          ok: false,
          callNumber: current.modelCalls,
          answerOnly: true,
          toolEvents: current.toolEvents,
          reason: "model_call_limit" as const,
        };
      }
      current.modelCalls += 1;
      current.toolEvents = Math.max(current.toolEvents, input.toolEventsSeen);
      this.visitorTurns.set(storageKey, current);
      return {
        ok: true,
        callNumber: current.modelCalls,
        answerOnly: current.modelCalls >= input.maxModelCalls || current.toolEvents >= input.maxToolEvents,
        toolEvents: current.toolEvents,
      };
    });
  }

  reserve(input: {
    requestId: string;
    callIndex: number;
    reserveNanos: NanoDollars;
    now: Date;
  }): Promise<{ ok: true; reservation: SpendReservation } | { ok: false; reason: "budget_exhausted" | "store_error" }> {
    return this.mutex.run(() => {
      const callKey = `${input.requestId}:${input.callIndex}`;
      const existingId = this.reservationByCall.get(callKey);
      if (existingId) {
        const existing = this.reservations.get(existingId);
        if (!existing) {
          return { ok: false, reason: "store_error" as const };
        }
        return { ok: true as const, reservation: { ...existing, reused: true } };
      }

      const day = utcDayStart(input.now);
      const month = utcMonthStart(input.now);
      const dayBudget = this.ensureBudget("day", day, this.config.dailyBudgetNanos);
      const monthBudget = this.ensureBudget("month", month, this.config.monthlyBudgetNanos);
      const dayUsed = dayBudget.reserved + dayBudget.committed;
      const monthUsed = monthBudget.reserved + monthBudget.committed;
      if (dayUsed + input.reserveNanos > dayBudget.limit || monthUsed + input.reserveNanos > monthBudget.limit) {
        return { ok: false as const, reason: "budget_exhausted" as const };
      }

      dayBudget.reserved += input.reserveNanos;
      monthBudget.reserved += input.reserveNanos;
      const reservation: SpendReservation = {
        reservationId: randomUUID(),
        requestId: input.requestId,
        callIndex: input.callIndex,
        reservedNanos: input.reserveNanos,
        status: "reserved",
        reused: false,
        dayStart: day.toISOString().slice(0, 10),
        monthStart: month.toISOString().slice(0, 10),
      };
      this.reservations.set(reservation.reservationId, reservation);
      this.reservationByCall.set(callKey, reservation.reservationId);
      return { ok: true as const, reservation };
    });
  }

  reconcile(input: {
    reservationId: string;
    commitNanos: NanoDollars;
    status: "committed" | "retained";
  }): Promise<{ ok: true; committedNanos: NanoDollars; alreadyReconciled: boolean } | { ok: false }> {
    return this.mutex.run(() => {
      const reservation = this.reservations.get(input.reservationId);
      if (!reservation) {
        return { ok: false as const };
      }
      if (reservation.status === "committed" || reservation.status === "retained") {
        return {
          ok: true as const,
          committedNanos: reservation.committedNanos ?? reservation.reservedNanos,
          alreadyReconciled: true,
        };
      }

      let commit = input.commitNanos;
      if (commit > reservation.reservedNanos) {
        commit = reservation.reservedNanos;
      }
      if (commit < ZERO_NANOS) {
        commit = ZERO_NANOS;
      }

      const dayBudget = reservation.dayStart
        ? this.budgets.get(`${this.config.namespace}:day:${reservation.dayStart}`)
        : undefined;
      const monthBudget = reservation.monthStart
        ? this.budgets.get(`${this.config.namespace}:month:${reservation.monthStart}`)
        : undefined;
      for (const budget of [dayBudget, monthBudget]) {
        if (!budget) {
          continue;
        }
        budget.reserved -= reservation.reservedNanos;
        if (budget.reserved < ZERO_NANOS) {
          budget.reserved = ZERO_NANOS;
        }
        budget.committed += commit;
      }

      reservation.status = input.status;
      reservation.committedNanos = commit;
      this.reservations.set(reservation.reservationId, reservation);
      return { ok: true as const, committedNanos: commit, alreadyReconciled: false };
    });
  }

  recordUsage(record: UsageRecord): Promise<void> {
    return this.mutex.run(() => {
      if (this.usage.some((item) => item.callId === record.callId)) {
        return;
      }
      this.usage.push(record);
    });
  }

  remaining(periodType: "day" | "month", now: Date): NanoDollars {
    const start = periodType === "day" ? utcDayStart(now) : utcMonthStart(now);
    const budget = this.budgets.get(this.budgetKey(periodType, start));
    if (!budget) {
      return periodType === "day" ? this.config.dailyBudgetNanos : this.config.monthlyBudgetNanos;
    }
    return budget.limit - budget.reserved - budget.committed;
  }
}

type NeonQueryClient = {
  query: (query: string, params?: unknown[]) => Promise<unknown>;
};

export class NeonSpendStore implements SpendStore {
  constructor(
    private readonly config: AssistantSpendConfig,
    private readonly sql: NeonQueryClient
  ) {}

  static fromConfig(config: AssistantSpendConfig, env: Record<string, string | undefined> = process.env): NeonSpendStore | null {
    const url = resolveDatabaseUrl(env);
    if (!url) {
      return null;
    }
    return new NeonSpendStore(config, neon(url) as unknown as NeonQueryClient);
  }

  private async query<T>(text: string, params: unknown[]): Promise<T[]> {
    const rows = await this.sql.query(text, params);
    return (Array.isArray(rows) ? rows : []) as T[];
  }

  async hitRateLimit(input: {
    clientHash: string;
    windowType: "minute" | "hour" | "day";
    windowStart: Date;
    limit: number;
  }): Promise<RateLimitHit> {
    const rows = await this.query<{ allowed: boolean; count: number; retry_after_seconds: number }>(
      "SELECT allowed, count, retry_after_seconds FROM assistant_hit_rate_limit($1, $2, $3, $4, $5)",
      [input.clientHash, this.config.namespace, input.windowType, input.windowStart.toISOString(), input.limit]
    );
    const row = rows[0];
    if (!row) {
      throw new Error("rate_limit_query_failed");
    }
    return { allowed: row.allowed, retryAfterSeconds: row.retry_after_seconds };
  }

  async admitVisitorMessage(input: {
    clientHash: string;
    turnKey: string;
    now: Date;
  }): Promise<VisitorAdmission> {
    const hourStart = utcHourStart(input.now);
    const rows = await this.query<{
      ok: boolean;
      already_seen: boolean;
      blocked_window: "minute" | "hour" | "day" | null;
      retry_after_seconds: number;
      hour_count: number;
      hour_limit: number;
    }>(
      "SELECT ok, already_seen, blocked_window, retry_after_seconds, hour_count, hour_limit FROM assistant_admit_visitor_message($1,$2,$3,$4,$5,$6,$7,$8,$9)",
      [
        input.clientHash,
        this.config.namespace,
        input.turnKey,
        hourStart.toISOString(),
        utcMinuteStart(input.now).toISOString(),
        utcDayStart(input.now).toISOString(),
        this.config.requestsPerMinute,
        this.config.requestsPerHour,
        this.config.requestsPerDay,
      ]
    );
    const row = rows[0];
    if (!row) {
      throw new Error("visitor_admit_failed");
    }
    return {
      ok: row.ok,
      alreadySeen: row.already_seen,
      blockedWindow: row.blocked_window ?? undefined,
      retryAfterSeconds: row.retry_after_seconds,
      hourCount: row.hour_count,
      hourLimit: row.hour_limit,
    };
  }

  async consumeTurnModelCall(input: {
    clientHash: string;
    turnKey: string;
    now: Date;
    maxModelCalls: number;
    toolEventsSeen: number;
    maxToolEvents: number;
  }): Promise<TurnModelCallResult> {
    try {
      const rows = await this.query<{
        ok: boolean;
        call_number: number;
        answer_only: boolean;
        tool_events: number;
      }>(
        "SELECT ok, call_number, answer_only, tool_events FROM assistant_consume_turn_model_call($1,$2,$3,$4,$5,$6,$7)",
        [
          input.clientHash,
          this.config.namespace,
          input.turnKey,
          utcHourStart(input.now).toISOString(),
          input.maxModelCalls,
          input.toolEventsSeen,
          input.maxToolEvents,
        ]
      );
      const row = rows[0];
      if (!row) {
        return { ok: false, callNumber: 0, answerOnly: true, toolEvents: 0, reason: "store_error" };
      }
      return {
        ok: row.ok,
        callNumber: row.call_number,
        answerOnly: row.answer_only,
        toolEvents: row.tool_events,
        reason: row.ok ? undefined : "model_call_limit",
      };
    } catch {
      return { ok: false, callNumber: 0, answerOnly: true, toolEvents: 0, reason: "store_error" };
    }
  }

  async reserve(input: {
    requestId: string;
    callIndex: number;
    reserveNanos: NanoDollars;
    now: Date;
  }): Promise<{ ok: true; reservation: SpendReservation } | { ok: false; reason: "budget_exhausted" | "store_error" }> {
    const day = utcDayStart(input.now).toISOString().slice(0, 10);
    const month = utcMonthStart(input.now).toISOString().slice(0, 10);
    const reservationId = randomUUID();
    try {
      const rows = await this.query<{ ok: boolean; reason: string; reservation_id: string | null }>(
        "SELECT ok, reason, reservation_id FROM assistant_reserve_spend($1,$2,$3,$4,$5,$6,$7,$8,$9)",
        [
          this.config.namespace,
          day,
          month,
          this.config.dailyBudgetNanos.toString(),
          this.config.monthlyBudgetNanos.toString(),
          input.reserveNanos.toString(),
          reservationId,
          input.requestId,
          input.callIndex,
        ]
      );
      const row = rows[0];
      if (!row?.ok || !row.reservation_id) {
        return { ok: false, reason: row?.reason === "budget_exhausted" ? "budget_exhausted" : "store_error" };
      }
      return {
        ok: true,
        reservation: {
          reservationId: row.reservation_id,
          requestId: input.requestId,
          callIndex: input.callIndex,
          reservedNanos: input.reserveNanos,
          status: "reserved",
          reused: row.reason === "existing",
        },
      };
    } catch {
      return { ok: false, reason: "store_error" };
    }
  }

  async reconcile(input: {
    reservationId: string;
    commitNanos: NanoDollars;
    status: "committed" | "retained";
  }): Promise<{ ok: true; committedNanos: NanoDollars; alreadyReconciled: boolean } | { ok: false }> {
    try {
      const rows = await this.query<{ ok: boolean; committed_nanos: string; already_reconciled: boolean }>(
        "SELECT ok, committed_nanos, already_reconciled FROM assistant_reconcile_spend($1,$2,$3)",
        [input.reservationId, input.commitNanos.toString(), input.status]
      );
      const row = rows[0];
      if (!row?.ok) {
        return { ok: false };
      }
      return {
        ok: true,
        committedNanos: BigInt(row.committed_nanos),
        alreadyReconciled: row.already_reconciled,
      };
    } catch {
      return { ok: false };
    }
  }

  async recordUsage(record: UsageRecord): Promise<void> {
    await this.query(
      `INSERT INTO assistant_generation_usage (
        call_id, request_id, call_index, created_at, environment, namespace, model, pricing_version,
        input_tokens, output_tokens, reasoning_tokens, usage_source, estimated_cost_nanos, latency_ms, outcome
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      ON CONFLICT (call_id) DO NOTHING`,
      [
        record.callId,
        record.requestId,
        record.callIndex,
        record.createdAt,
        record.environment,
        record.namespace,
        record.model,
        record.pricingVersion,
        record.inputTokens ?? null,
        record.outputTokens ?? null,
        record.reasoningTokens ?? null,
        record.usageSource,
        record.estimatedCostNanos.toString(),
        record.latencyMs ?? null,
        record.outcome,
      ]
    );
  }
}

let memorySpendStore: MemorySpendStore | undefined;

export function resetMemorySpendStoreForTests(): void {
  memorySpendStore = undefined;
}

export function createSpendStore(
  config: AssistantSpendConfig,
  env: Record<string, string | undefined> = process.env
): SpendStore | null {
  if (config.storeKind === "memory") {
    if (!memorySpendStore) {
      memorySpendStore = new MemorySpendStore(config);
    }
    return memorySpendStore;
  }
  return NeonSpendStore.fromConfig(config, env);
}
