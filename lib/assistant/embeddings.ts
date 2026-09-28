import {
  ICDU_EMBED_DIMENSIONS,
  ICDU_EMBED_MAX_CHARS,
  ICDU_EMBED_MAX_COMBINED_CHARS,
  ICDU_EMBED_MAX_STRINGS,
  ICDU_EMBED_MODEL,
} from "./constants";
import { logAssistantError, logAssistantEvent } from "./logging";
import { classifyUpstreamError } from "./provider-errors";
import { AssistantSpendError } from "./errors";

export class EmbeddingBatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmbeddingBatchError";
  }
}

export function assertEmbeddingBatch(texts: string[]): void {
  if (texts.length === 0 || texts.length > ICDU_EMBED_MAX_STRINGS) {
    throw new EmbeddingBatchError(`Embedding batches must contain 1 to ${ICDU_EMBED_MAX_STRINGS} strings.`);
  }
  let combined = 0;
  for (const text of texts) {
    if (text.length > ICDU_EMBED_MAX_CHARS) {
      throw new EmbeddingBatchError(`An embedding input exceeds ${ICDU_EMBED_MAX_CHARS} characters.`);
    }
    combined += text.length;
  }
  if (combined > ICDU_EMBED_MAX_COMBINED_CHARS) {
    throw new EmbeddingBatchError(`An embedding batch exceeds ${ICDU_EMBED_MAX_COMBINED_CHARS} characters.`);
  }
}

export interface EmbedRequestOptions {
  apiKey: string;
  baseUrl: string;
  signal?: AbortSignal;
  /** Background jobs yield to interactive chat. Retrieval stays interactive. */
  priority?: "interactive" | "background";
  /** Background ingestion may retry a busy gateway. Interactive retrieval must not. */
  maxAttempts?: number;
}

/**
 * One embeddings call. Interactive requests are not retried.
 * Background ingestion retries a bounded number of times and honors Retry-After.
 * The API key is sent as a bearer token and is not logged.
 */
export async function embedIcdUTexts(texts: string[], options: EmbedRequestOptions): Promise<number[][]> {
  assertEmbeddingBatch(texts);
  const attempts = options.priority === "background" ? Math.max(1, options.maxAttempts ?? 4) : 1;
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    if (options.signal?.aborted) {
      throw classifyUpstreamError(options.signal.reason, true);
    }
    const started = Date.now();
    try {
      return await embedOnce(texts, options, started);
    } catch (error) {
      lastError = error;
      const busy = error instanceof AssistantSpendError && error.httpStatus === 429 ? error : null;
      if (!busy || attempt === attempts || options.signal?.aborted) {
        throw error;
      }
      await waitForRetry(busy.retryAfterSeconds ?? 5, options.signal);
    }
  }
  throw lastError instanceof Error ? lastError : new EmbeddingBatchError("Embedding failed.");
}

async function embedOnce(texts: string[], options: EmbedRequestOptions, started: number): Promise<number[][]> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${options.apiKey}`,
    "Content-Type": "application/json",
        "X-ICDU-Site": "overture",
  };
  if (options.priority === "background") {
    headers["X-ICDU-Priority"] = "background";
  }
  try {
    const response = await fetch(new URL("embeddings", ensureTrailingSlash(options.baseUrl)), {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: ICDU_EMBED_MODEL,
        input: texts,
        dimensions: ICDU_EMBED_DIMENSIONS,
      }),
      signal: options.signal,
    });
    if (!response.ok) {
      const body = await response.text();
      let code: string | undefined;
      try {
        const parsed = JSON.parse(body) as { error?: { code?: string } };
        code = parsed.error?.code;
      } catch {
        code = undefined;
      }
      throw Object.assign(new Error("embedding_request_failed"), {
        status: response.status,
        headers: response.headers,
        code,
      });
    }
    const queueWait = response.headers.get("x-icdu-queue-wait-ms");
    const payload = (await response.json()) as {
      data?: Array<{ embedding?: number[]; index?: number }>;
    };
    const rows = Array.isArray(payload.data) ? payload.data : [];
    const ordered = [...rows].sort((left, right) => (left.index ?? 0) - (right.index ?? 0));
    if (ordered.length !== texts.length) {
      throw new EmbeddingBatchError("The embedding response did not match the input batch.");
    }
    const vectors = ordered.map((row) => row.embedding ?? []);
    if (vectors.some((vector) => vector.length !== ICDU_EMBED_DIMENSIONS || vector.some((value) => !Number.isFinite(value)))) {
      throw new EmbeddingBatchError("The embedding response was not a 768-dimension vector.");
    }
    logAssistantEvent("assistant.embeddings", {
      source: "icdu-embeddings",
      model: ICDU_EMBED_MODEL,
      count: texts.length,
      durationMs: Date.now() - started,
      priority: options.priority ?? "interactive",
      queueWaitMs: queueWait && /^\d+$/.test(queueWait) ? Number(queueWait) : undefined,
    });
    return vectors;
  } catch (error) {
    if (error instanceof EmbeddingBatchError) {
      throw error;
    }
    logAssistantError(error, {
      source: "icdu-embeddings",
      model: ICDU_EMBED_MODEL,
      count: texts.length,
      durationMs: Date.now() - started,
      priority: options.priority ?? "interactive",
    });
    throw classifyUpstreamError(error, options.signal?.aborted === true);
  }
}

function waitForRetry(seconds: number, signal?: AbortSignal): Promise<void> {
  const delay = Math.max(0, seconds) * 1000;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, delay);
    if (!signal) {
      return;
    }
    if (signal.aborted) {
      clearTimeout(timer);
      reject(classifyUpstreamError(signal.reason, true));
      return;
    }
    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(classifyUpstreamError(signal.reason, true));
    }, { once: true });
  });
}

function ensureTrailingSlash(baseUrl: string): string {
  return baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
}
