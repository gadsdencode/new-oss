import {
  ASSISTANT_DEFAULT_DAILY_BUDGET_USD,
  ASSISTANT_DEFAULT_MAX_BODY_BYTES,
  ASSISTANT_DEFAULT_MAX_MODEL_CALLS_PER_REQUEST,
  ASSISTANT_DEFAULT_MAX_TOOL_RESULT_CHARS,
  ASSISTANT_DEFAULT_MAX_USER_MESSAGE_CHARS,
  ASSISTANT_DEFAULT_MONTHLY_BUDGET_USD,
  ASSISTANT_DEFAULT_REQUESTS_PER_DAY,
  ASSISTANT_DEFAULT_REQUESTS_PER_HOUR,
  ASSISTANT_DEFAULT_REQUESTS_PER_MINUTE,
  ASSISTANT_DEFAULT_MAX_TOOL_EVENTS_PER_TURN,
} from "./constants";
import { parsePositiveInt, type AssistantEnv } from "./config";
import { parseUsdToNanos, type NanoDollars } from "./money";
import { isLocalDevelopment, resolveSpendNamespace, type SpendNamespace } from "./client-id";
import { resolveDatabaseUrl } from "../database-url";

export type SpendStoreKind = "neon" | "memory";

export interface AssistantSpendConfig {
  namespace: SpendNamespace;
  storeKind: SpendStoreKind;
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  dailyBudgetNanos: NanoDollars;
  monthlyBudgetNanos: NanoDollars;
  maxBodyBytes: number;
  maxUserMessageChars: number;
  maxToolResultChars: number;
  maxModelCallsPerRequest: number;
  maxToolEventsPerTurn: number;
}

export type SpendConfigResult =
  | { ok: true; config: AssistantSpendConfig }
  | { ok: false; code: "invalid_config" | "store_unavailable"; issues: string[] };

export function resolveSpendStoreKind(env: AssistantEnv = process.env): SpendStoreKind | "unavailable" {
  const namespace = resolveSpendNamespace(env);
  const explicit = env.ASSISTANT_SPEND_STORE?.trim().toLowerCase();
  const hasNeon = Boolean(resolveDatabaseUrl(env));

  if (explicit === "memory") {
    if (namespace === "production" || namespace === "preview") {
      return "unavailable";
    }
    return "memory";
  }

  if (explicit === "neon") {
    return hasNeon ? "neon" : "unavailable";
  }

  if (namespace === "production" || namespace === "preview") {
    return hasNeon ? "neon" : "unavailable";
  }

  if (isLocalDevelopment(env)) {
    return "memory";
  }

  return hasNeon ? "neon" : "unavailable";
}

export function loadAssistantSpendConfig(env: AssistantEnv = process.env): SpendConfigResult {
  const issues: string[] = [];
  const storeKind = resolveSpendStoreKind(env);
  if (storeKind === "unavailable") {
    return { ok: false, code: "store_unavailable", issues: ["Spend enforcement storage is unavailable"] };
  }

  const perMinute = parsePositiveInt(env.ASSISTANT_REQUESTS_PER_MINUTE, ASSISTANT_DEFAULT_REQUESTS_PER_MINUTE, {
    max: 1_000,
    name: "ASSISTANT_REQUESTS_PER_MINUTE",
  });
  const perHour = parsePositiveInt(env.ASSISTANT_REQUESTS_PER_HOUR, ASSISTANT_DEFAULT_REQUESTS_PER_HOUR, {
    max: 10_000,
    name: "ASSISTANT_REQUESTS_PER_HOUR",
  });
  const perDay = parsePositiveInt(env.ASSISTANT_REQUESTS_PER_DAY, ASSISTANT_DEFAULT_REQUESTS_PER_DAY, {
    max: 100_000,
    name: "ASSISTANT_REQUESTS_PER_DAY",
  });
  const maxBody = parsePositiveInt(env.ASSISTANT_MAX_BODY_BYTES, ASSISTANT_DEFAULT_MAX_BODY_BYTES, {
    min: 1_024,
    max: 2_000_000,
    name: "ASSISTANT_MAX_BODY_BYTES",
  });
  const maxUser = parsePositiveInt(env.ASSISTANT_MAX_USER_MESSAGE_CHARS, ASSISTANT_DEFAULT_MAX_USER_MESSAGE_CHARS, {
    min: 64,
    max: 100_000,
    name: "ASSISTANT_MAX_USER_MESSAGE_CHARS",
  });
  const maxTool = parsePositiveInt(env.ASSISTANT_MAX_TOOL_RESULT_CHARS, ASSISTANT_DEFAULT_MAX_TOOL_RESULT_CHARS, {
    min: 64,
    max: 200_000,
    name: "ASSISTANT_MAX_TOOL_RESULT_CHARS",
  });
  const maxCalls = parsePositiveInt(
    env.ASSISTANT_MAX_MODEL_CALLS_PER_REQUEST,
    ASSISTANT_DEFAULT_MAX_MODEL_CALLS_PER_REQUEST,
    {
      min: 1,
      max: 20,
      name: "ASSISTANT_MAX_MODEL_CALLS_PER_REQUEST",
    }
  );
  const maxToolEvents = parsePositiveInt(
    env.ASSISTANT_MAX_TOOL_EVENTS_PER_TURN,
    ASSISTANT_DEFAULT_MAX_TOOL_EVENTS_PER_TURN,
    {
      min: 1,
      max: 32,
      name: "ASSISTANT_MAX_TOOL_EVENTS_PER_TURN",
    }
  );
  const daily = parseUsdToNanos(env.ASSISTANT_DAILY_BUDGET_USD, ASSISTANT_DEFAULT_DAILY_BUDGET_USD);
  const monthly = parseUsdToNanos(env.ASSISTANT_MONTHLY_BUDGET_USD, ASSISTANT_DEFAULT_MONTHLY_BUDGET_USD);

  for (const parsed of [perMinute, perHour, perDay, maxBody, maxUser, maxTool, maxCalls, maxToolEvents]) {
    if (parsed.issue) {
      issues.push(parsed.issue);
    }
  }
  if (daily.issue) {
    issues.push(daily.issue);
  }
  if (monthly.issue) {
    issues.push(monthly.issue);
  }
  if (issues.length > 0) {
    return { ok: false, code: "invalid_config", issues };
  }

  return {
    ok: true,
    config: {
      namespace: resolveSpendNamespace(env),
      storeKind,
      requestsPerMinute: perMinute.value,
      requestsPerHour: perHour.value,
      requestsPerDay: perDay.value,
      dailyBudgetNanos: daily.value,
      monthlyBudgetNanos: monthly.value,
      maxBodyBytes: maxBody.value,
      maxUserMessageChars: maxUser.value,
      maxToolResultChars: maxTool.value,
      maxModelCallsPerRequest: maxCalls.value,
      maxToolEventsPerTurn: maxToolEvents.value,
    },
  };
}
