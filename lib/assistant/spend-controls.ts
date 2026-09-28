import { randomUUID } from "node:crypto";
import type { AssistantConfig } from "./config";
import type { AssistantSpendConfig } from "./spend-config";
import { conservativeCallChargeNanos, getModelPrices, pricingVersionFor } from "./pricing";
import { utcHourStart, utcMinuteStart, utcDayStart, type SpendStore, type SpendReservation, type UsageRecord } from "./spend-store";
import { billableOutputTokens, type ProviderUsage } from "./usage";
import type { BoundInputResult } from "./token-budget";
import { AssistantSpendError } from "./errors";
import {
  VISITOR_BUSY_MESSAGE,
  VISITOR_TURN_LIMIT_MESSAGE,
  VISITOR_UNAVAILABLE_MESSAGE,
  visitorHourlyLimitMessage,
} from "./constants";
import { logAssistantEvent, logAssistantError } from "./logging";
import { resolveSpendNamespace } from "./client-id";

export { AssistantSpendError } from "./errors";

export interface SpendGuard {
  requestId: string;
  checkRateLimit(now?: Date): Promise<void>;
  admitVisitorMessage(turnKey: string, now?: Date): Promise<void>;
  beforeModelCall(
    bound: BoundInputResult,
    now?: Date,
    extras?: { toolEventsSeen?: number }
  ): Promise<SpendReservation>;
  afterModelCall(input: {
    reservation: SpendReservation;
    usage?: ProviderUsage;
    aborted: boolean;
    failed: boolean;
    latencyMs: number;
    model: string;
  }): Promise<void>;
}

export function createSpendGuard(options: {
  store: SpendStore;
  spend: AssistantSpendConfig;
  assistant: AssistantConfig;
  clientHash: string;
  requestId?: string;
  environment?: string;
  turnKey?: string;
}): SpendGuard {
  const requestId = options.requestId ?? randomUUID();
  let callIndex = 0;
  const prices = getModelPrices(options.assistant.model);

  return {
    requestId,
    async checkRateLimit(now = new Date()) {
      const minute = await options.store.hitRateLimit({
        clientHash: options.clientHash,
        windowType: "minute",
        windowStart: utcMinuteStart(now),
        limit: options.spend.requestsPerMinute,
      });
      if (!minute.allowed) {
        throw new AssistantSpendError(
          "ASSISTANT_RATE_LIMITED",
          VISITOR_BUSY_MESSAGE,
          429,
          minute.retryAfterSeconds || 60
        );
      }
      const day = await options.store.hitRateLimit({
        clientHash: options.clientHash,
        windowType: "day",
        windowStart: utcDayStart(now),
        limit: options.spend.requestsPerDay,
      });
      if (!day.allowed) {
        throw new AssistantSpendError(
          "ASSISTANT_RATE_LIMITED",
          VISITOR_BUSY_MESSAGE,
          429,
          day.retryAfterSeconds || 86_400
        );
      }
    },
    async admitVisitorMessage(turnKey, now = new Date()) {
      let admission;
      try {
        admission = await options.store.admitVisitorMessage({
          clientHash: options.clientHash,
          turnKey,
          now,
        });
      } catch (error) {
        logAssistantError(error, { source: "assistant-spend", errorCode: "VISITOR_ADMIT_FAILED" });
        throw new AssistantSpendError("ASSISTANT_UNAVAILABLE", VISITOR_UNAVAILABLE_MESSAGE, 503);
      }
      if (admission.ok) {
        return;
      }
      if (admission.blockedWindow === "hour") {
        const reset = new Date(utcHourStart(now).getTime() + 3_600_000);
        const remaining = Math.max(0, admission.hourLimit - admission.hourCount);
        const retryAfterSeconds = Math.max(1, Math.ceil((reset.getTime() - now.getTime()) / 1000));
        throw new AssistantSpendError(
          "ASSISTANT_RATE_LIMITED",
          visitorHourlyLimitMessage(admission.hourLimit, remaining, reset.toISOString()),
          429,
          retryAfterSeconds
        );
      }
      throw new AssistantSpendError(
        "ASSISTANT_RATE_LIMITED",
        VISITOR_BUSY_MESSAGE,
        429,
        admission.retryAfterSeconds || (admission.blockedWindow === "day" ? 86_400 : 60)
      );
    },
    async beforeModelCall(bound, now = new Date(), extras) {
      if (!prices) {
        throw new AssistantSpendError(
          "ASSISTANT_UNAVAILABLE",
          VISITOR_UNAVAILABLE_MESSAGE,
          503
        );
      }
      let answerOnly = false;
      if (options.turnKey) {
        const turn = await options.store.consumeTurnModelCall({
          clientHash: options.clientHash,
          turnKey: options.turnKey,
          now,
          maxModelCalls: options.spend.maxModelCallsPerRequest,
          toolEventsSeen: extras?.toolEventsSeen ?? 0,
          maxToolEvents: options.spend.maxToolEventsPerTurn,
        });
        if (!turn.ok) {
          throw new AssistantSpendError(
            turn.reason === "store_error" ? "ASSISTANT_UNAVAILABLE" : "ASSISTANT_RATE_LIMITED",
            turn.reason === "store_error" ? VISITOR_UNAVAILABLE_MESSAGE : VISITOR_TURN_LIMIT_MESSAGE,
            turn.reason === "store_error" ? 503 : 429,
            turn.reason === "store_error" ? undefined : 60
          );
        }
        answerOnly = turn.answerOnly;
      }
      callIndex += 1;
      if (callIndex > options.spend.maxModelCallsPerRequest) {
        throw new AssistantSpendError(
          "ASSISTANT_RATE_LIMITED",
          VISITOR_BUSY_MESSAGE,
          429,
          60
        );
      }

      const reserveNanos = conservativeCallChargeNanos(
        prices,
        bound.estimatedInputTokens,
        options.assistant.maxOutputTokens,
        0
      );
      logAssistantEvent("assistant.spend_reserve", {
        source: "assistant-spend",
        model: options.assistant.model,
        estimatedInputTokens: bound.estimatedInputTokens,
        maxOutputTokens: options.assistant.maxOutputTokens,
        callIndex,
      });

      const reserved = await options.store.reserve({
        requestId,
        callIndex,
        reserveNanos,
        now,
      });
      if (!reserved.ok) {
        if (reserved.reason === "budget_exhausted") {
          throw new AssistantSpendError(
            "ASSISTANT_UNAVAILABLE",
            VISITOR_UNAVAILABLE_MESSAGE,
            503
          );
        }
        throw new AssistantSpendError(
          "ASSISTANT_UNAVAILABLE",
          VISITOR_UNAVAILABLE_MESSAGE,
          503
        );
      }
      if (reserved.reservation.reused) {
        throw new AssistantSpendError(
          "ASSISTANT_UNAVAILABLE",
          VISITOR_UNAVAILABLE_MESSAGE,
          503
        );
      }
      return { ...reserved.reservation, answerOnly };
    },
    async afterModelCall(input) {
      try {
        const completed = !input.aborted && !input.failed && input.usage?.source === "provider";
        const commitNanos = completed && prices && input.usage
          ? conservativeCallChargeNanos(
              prices,
              input.usage.inputTokens ?? 0,
              billableOutputTokens(input.usage),
              0
            )
          : input.reservation.reservedNanos;
        const status = completed ? "committed" : "retained";
        const usageSource = completed ? "provider" : input.usage ? "estimated" : "unknown";

        const reconciled = await options.store.reconcile({
          reservationId: input.reservation.reservationId,
          commitNanos,
          status,
        });
        if (!reconciled.ok) {
          logAssistantError(new Error("spend_reconcile_failed"), {
            source: "assistant-spend",
            errorCode: "SPEND_RECONCILE_FAILED",
          });
        }

        const record: UsageRecord = {
          callId: input.reservation.reservationId,
          requestId,
          callIndex: input.reservation.callIndex,
          createdAt: new Date().toISOString(),
          environment: options.environment || process.env.NODE_ENV || "unknown",
          namespace: resolveSpendNamespace(),
          model: input.model,
          pricingVersion: pricingVersionFor(input.model),
          inputTokens: input.usage?.inputTokens,
          outputTokens: input.usage?.outputTokens,
          reasoningTokens: input.usage?.reasoningTokens,
          usageSource,
          estimatedCostNanos: reconciled.ok ? reconciled.committedNanos : input.reservation.reservedNanos,
          latencyMs: input.latencyMs,
          outcome: input.aborted ? "cancelled" : input.failed ? "provider_error" : "completed",
        };
        await options.store.recordUsage(record);
      } catch (error) {
        logAssistantError(error, { source: "assistant-spend", errorCode: "USAGE_RECORD_FAILED" });
      }
    },
  };
}
