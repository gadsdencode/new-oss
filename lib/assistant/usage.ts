export interface ProviderUsage {
  inputTokens?: number;
  outputTokens?: number;
  reasoningTokens?: number;
  totalTokens?: number;
  source: "provider" | "estimated" | "unknown";
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : undefined;
}

/**
 * Provider field semantics:
 * Google reports promptTokenCount, candidatesTokenCount, thoughtsTokenCount.
 * LangChain maps input_tokens / output_tokens. Output price includes thinking
 * when thoughts are already folded into output_tokens. If thoughts/reasoning
 * are reported separately, they are billed as additional output tokens.
 */
export function readUsageMetadata(value: unknown): ProviderUsage | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const candidate = value as Record<string, unknown>;
  const usage = (candidate.usage_metadata ?? candidate.usageMetadata ?? candidate.usageMetadata) as
    | Record<string, unknown>
    | undefined;
  const google = candidate.usageMetadata as Record<string, unknown> | undefined;
  const source = usage ?? google;
  if (!source) {
    return undefined;
  }

  const inputTokens = asNumber(source.input_tokens) ?? asNumber(source.promptTokenCount);
  const outputTokens = asNumber(source.output_tokens) ?? asNumber(source.candidatesTokenCount);
  const details = (source.output_token_details ?? source.outputTokenDetails) as Record<string, unknown> | undefined;
  const reasoningSeparate =
    asNumber(source.thoughtsTokenCount)
    ?? asNumber(source.thoughts_tokens)
    ?? asNumber(details?.reasoning)
    ?? asNumber(details?.reasoning_tokens);

  if (inputTokens == null && outputTokens == null && reasoningSeparate == null) {
    return undefined;
  }

  return {
    inputTokens,
    outputTokens,
    reasoningTokens: reasoningSeparate,
    totalTokens: asNumber(source.total_tokens) ?? asNumber(source.totalTokenCount),
    source: "provider",
  };
}

export function billableOutputTokens(usage: ProviderUsage): number {
  const output = usage.outputTokens ?? 0;
  const reasoning = usage.reasoningTokens ?? 0;
  const combined = output + reasoning;
  if (usage.totalTokens != null && usage.inputTokens != null) {
    const impliedOutput = Math.max(0, usage.totalTokens - usage.inputTokens);
    return Math.max(combined, impliedOutput);
  }
  return combined;
}
