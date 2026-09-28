import {
  ASSISTANT_DEFAULT_MAX_INPUT_TOKENS,
  ASSISTANT_DEFAULT_MAX_OUTPUT_TOKENS,
  ASSISTANT_DEFAULT_MODEL,
  ASSISTANT_DEFAULT_PROVIDER,
  ASSISTANT_DEFAULT_TIMEOUT_MS,
  ASSISTANT_KNOWN_TRIAL_MODELS,
  ASSISTANT_MAX_INPUT_TOKENS_CEILING,
  ASSISTANT_MAX_OUTPUT_TOKENS_CEILING,
  ASSISTANT_ROLLBACK_MODEL,
  ASSISTANT_TIMEOUT_MS_CEILING,
  ASSISTANT_TRIAL_CANDIDATE_MODEL,
  ICDU_DEFAULT_BASE_URL,
  ICDU_DEFAULT_MODEL,
  ICDU_MAX_OUTPUT_TOKENS,
  type AssistantKnownTrialModel,
} from "./constants";

export type AssistantProviderName = "icdu" | "gemini";
export type AssistantApiKeySource = "ICDU_API_KEY" | "GEMINI_API_KEY" | "GOOGLE_API_KEY";
export type AssistantModelSource = "default" | "override";

export interface AssistantConfig {
  enabled: true;
  provider: AssistantProviderName;
  apiKey: string;
  apiKeySource: AssistantApiKeySource;
  baseUrl?: string;
  model: string;
  modelSource: AssistantModelSource;
  isTrialCandidate: boolean;
  isRollbackModel: boolean;
  isKnownTrialModel: boolean;
  maxInputTokens: number;
  maxOutputTokens: number;
  timeoutMs: number;
}

export type AssistantConfigFailureCode =
  | "missing_key"
  | "disabled"
  | "invalid_config";

export interface AssistantConfigSuccess {
  ok: true;
  config: AssistantConfig;
}

export interface AssistantConfigFailure {
  ok: false;
  code: AssistantConfigFailureCode;
  issues: string[];
}

export type AssistantConfigResult = AssistantConfigSuccess | AssistantConfigFailure;

export type AssistantEnv = Record<string, string | undefined>;

const MODEL_NAME_PATTERN = /^[a-zA-Z0-9._:-]+$/;

function readTrimmed(value: string | undefined): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function resolveAssistantProvider(env: AssistantEnv = process.env): {
  provider: AssistantProviderName;
  issue?: string;
} {
  const trimmed = readTrimmed(env.ASSISTANT_PROVIDER)?.toLowerCase();
  if (!trimmed) {
    return { provider: ASSISTANT_DEFAULT_PROVIDER };
  }
  if (trimmed === "icdu" || trimmed === "gemini") {
    return { provider: trimmed };
  }
  return { provider: ASSISTANT_DEFAULT_PROVIDER, issue: "ASSISTANT_PROVIDER must be icdu or gemini" };
}

/**
 * ICDU credentials are never replaced with a Gemini key.
 */
export function resolveIcdUApiKey(env: AssistantEnv = process.env): string | null {
  return readTrimmed(env.ICDU_API_KEY) ?? null;
}

export function resolveIcdUBaseUrl(raw: string | undefined): { baseUrl: string; issue?: string } {
  const trimmed = readTrimmed(raw) ?? ICDU_DEFAULT_BASE_URL;
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return { baseUrl: ICDU_DEFAULT_BASE_URL, issue: "ICDU_API_BASE_URL must be an https URL" };
  }
  if (url.protocol !== "https:" || url.username || url.password) {
    return { baseUrl: ICDU_DEFAULT_BASE_URL, issue: "ICDU_API_BASE_URL must be an https URL without credentials" };
  }
  return { baseUrl: trimmed.replace(/\/$/, "") };
}

/**
 * Current Gemini precedence: GEMINI_API_KEY, then GOOGLE_API_KEY.
 * Visitors never supply a key. This is used only when ASSISTANT_PROVIDER=gemini.
 */
export function resolveAssistantApiKey(env: AssistantEnv = process.env): {
  apiKey: string;
  source: AssistantApiKeySource;
} | null {
  const geminiKey = readTrimmed(env.GEMINI_API_KEY);
  if (geminiKey) {
    return { apiKey: geminiKey, source: "GEMINI_API_KEY" };
  }

  const googleKey = readTrimmed(env.GOOGLE_API_KEY);
  if (googleKey) {
    return { apiKey: googleKey, source: "GOOGLE_API_KEY" };
  }

  return null;
}

export function parseAssistantEnabled(value: string | undefined): {
  enabled: boolean;
  invalid?: string;
} {
  const trimmed = readTrimmed(value);
  if (!trimmed) {
    return { enabled: true };
  }

  const normalized = trimmed.toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) {
    return { enabled: true };
  }
  if (["0", "false", "no", "off"].includes(normalized)) {
    return { enabled: false };
  }

  return {
    enabled: false,
    invalid: "ASSISTANT_ENABLED must be true or false",
  };
}

export function parsePositiveInt(
  raw: string | undefined,
  fallback: number,
  { min = 1, max, name }: { min?: number; max: number; name: string }
): { value: number; issue?: string } {
  const trimmed = readTrimmed(raw);
  if (!trimmed) {
    return { value: fallback };
  }

  if (!/^[0-9]+$/.test(trimmed)) {
    return { value: fallback, issue: `${name} must be a positive integer` };
  }

  const parsed = Number.parseInt(trimmed, 10);
  if (!Number.isSafeInteger(parsed) || parsed < min || parsed > max) {
    return {
      value: fallback,
      issue: `${name} must be between ${min} and ${max}`,
    };
  }

  return { value: parsed };
}

export function resolveAssistantModel(
  raw: string | undefined,
  options: { envName: string; fallback: string } = { envName: "GEMINI_MODEL", fallback: ASSISTANT_DEFAULT_MODEL }
): {
  model: string;
  source: AssistantModelSource;
  issue?: string;
} {
  const trimmed = readTrimmed(raw);
  if (!trimmed) {
    return { model: options.fallback, source: "default" };
  }

  if (!MODEL_NAME_PATTERN.test(trimmed)) {
    return {
      model: options.fallback,
      source: "override",
      issue: `${options.envName} contains unsupported characters`,
    };
  }

  return { model: trimmed, source: "override" };
}

export function isKnownTrialModel(model: string): model is AssistantKnownTrialModel {
  return (ASSISTANT_KNOWN_TRIAL_MODELS as readonly string[]).includes(model);
}

/**
 * Load and validate assistant settings.
 * Unset ASSISTANT_PROVIDER selects ICDU and does not fall back to Gemini.
 * ASSISTANT_PROVIDER=gemini is the explicit paid rollback.
 */
export function loadAssistantConfig(env: AssistantEnv = process.env): AssistantConfigResult {
  const issues: string[] = [];
  const enabledResult = parseAssistantEnabled(env.ASSISTANT_ENABLED);
  if (enabledResult.invalid) {
    issues.push(enabledResult.invalid);
  }

  const providerResult = resolveAssistantProvider(env);
  if (providerResult.issue) {
    issues.push(providerResult.issue);
  }

  const modelResult = providerResult.provider === "icdu"
    ? resolveAssistantModel(env.ICDU_MODEL, { envName: "ICDU_MODEL", fallback: ICDU_DEFAULT_MODEL })
    : resolveAssistantModel(env.GEMINI_MODEL);
  if (modelResult.issue) {
    issues.push(modelResult.issue);
  }

  const baseUrl = providerResult.provider === "icdu" ? resolveIcdUBaseUrl(env.ICDU_API_BASE_URL) : undefined;
  if (baseUrl?.issue) {
    issues.push(baseUrl.issue);
  }

  const maxInput = parsePositiveInt(env.ASSISTANT_MAX_INPUT_TOKENS, ASSISTANT_DEFAULT_MAX_INPUT_TOKENS, {
    max: ASSISTANT_MAX_INPUT_TOKENS_CEILING,
    name: "ASSISTANT_MAX_INPUT_TOKENS",
  });
  if (maxInput.issue) {
    issues.push(maxInput.issue);
  }

  const maxOutput = parsePositiveInt(
    env.ASSISTANT_MAX_OUTPUT_TOKENS,
    ASSISTANT_DEFAULT_MAX_OUTPUT_TOKENS,
    {
      max: ASSISTANT_MAX_OUTPUT_TOKENS_CEILING,
      name: "ASSISTANT_MAX_OUTPUT_TOKENS",
    }
  );
  if (maxOutput.issue) {
    issues.push(maxOutput.issue);
  }
  if (providerResult.provider === "icdu" && maxOutput.value > ICDU_MAX_OUTPUT_TOKENS) {
    issues.push(`ASSISTANT_MAX_OUTPUT_TOKENS must be at most ${ICDU_MAX_OUTPUT_TOKENS} for the ICDU gateway`);
  }

  const timeout = parsePositiveInt(
    env.ASSISTANT_GENERATION_TIMEOUT_MS,
    ASSISTANT_DEFAULT_TIMEOUT_MS,
    {
      min: 1_000,
      max: ASSISTANT_TIMEOUT_MS_CEILING,
      name: "ASSISTANT_GENERATION_TIMEOUT_MS",
    }
  );
  if (timeout.issue) {
    issues.push(timeout.issue);
  }

  if (issues.length > 0) {
    return { ok: false, code: "invalid_config", issues };
  }

  if (!enabledResult.enabled) {
    return { ok: false, code: "disabled", issues: ["Assistant is disabled"] };
  }

  if (providerResult.provider === "icdu") {
    const apiKey = resolveIcdUApiKey(env);
    if (!apiKey) {
      return {
        ok: false,
        code: "missing_key",
        issues: ["ICDU_API_KEY is not configured. The assistant does not fall back to Gemini."],
      };
    }
    return {
      ok: true,
      config: {
        enabled: true,
        provider: "icdu",
        apiKey,
        apiKeySource: "ICDU_API_KEY",
        baseUrl: baseUrl?.baseUrl ?? ICDU_DEFAULT_BASE_URL,
        model: modelResult.model,
        modelSource: modelResult.source,
        isTrialCandidate: false,
        isRollbackModel: false,
        isKnownTrialModel: isKnownTrialModel(modelResult.model),
        maxInputTokens: maxInput.value,
        maxOutputTokens: maxOutput.value,
        timeoutMs: timeout.value,
      },
    };
  }

  const apiKey = resolveAssistantApiKey(env);
  if (!apiKey) {
    return { ok: false, code: "missing_key", issues: ["No server API key is configured"] };
  }

  return {
    ok: true,
    config: {
      enabled: true,
      provider: "gemini",
      apiKey: apiKey.apiKey,
      apiKeySource: apiKey.source,
      model: modelResult.model,
      modelSource: modelResult.source,
      isTrialCandidate: modelResult.model === ASSISTANT_TRIAL_CANDIDATE_MODEL,
      isRollbackModel: modelResult.model === ASSISTANT_ROLLBACK_MODEL,
      isKnownTrialModel: isKnownTrialModel(modelResult.model),
      maxInputTokens: maxInput.value,
      maxOutputTokens: maxOutput.value,
      timeoutMs: timeout.value,
    },
  };
}

export function publicAssistantConfigSummary(config: AssistantConfig): Record<string, unknown> {
  return {
    provider: config.provider,
    model: config.model,
    modelSource: config.modelSource,
    isTrialCandidate: config.isTrialCandidate,
    isRollbackModel: config.isRollbackModel,
    isKnownTrialModel: config.isKnownTrialModel,
    apiKeySource: config.apiKeySource,
    maxInputTokens: config.maxInputTokens,
    maxOutputTokens: config.maxOutputTokens,
    timeoutMs: config.timeoutMs,
  };
}
