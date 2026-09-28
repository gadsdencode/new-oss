import {
  ICDU_EMBED_DIMENSIONS,
  ICDU_EMBED_MAX_CHARS,
  ICDU_EMBED_MAX_COMBINED_CHARS,
  ICDU_EMBED_MAX_STRINGS,
  ICDU_EMBED_MODEL,
} from "./constants";
import { acquireIcdUSlot } from "./icdu-gate";
import { logAssistantError, logAssistantEvent } from "./logging";
import { classifyUpstreamError } from "./provider-errors";

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

/**
 * One serialized embeddings call. Does not retry a busy gateway.
 * The API key is sent as a bearer token and is not logged.
 */
export async function embedIcdUTexts(
  texts: string[],
  options: { apiKey: string; baseUrl: string; signal?: AbortSignal }
): Promise<number[][]> {
  assertEmbeddingBatch(texts);
  const release = await acquireIcdUSlot(options.signal);
  const started = Date.now();
  try {
    const response = await fetch(new URL("embeddings", ensureTrailingSlash(options.baseUrl)), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${options.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: ICDU_EMBED_MODEL,
        input: texts,
        dimensions: ICDU_EMBED_DIMENSIONS,
      }),
      signal: options.signal,
    });
    if (!response.ok) {
      const error = Object.assign(new Error("embedding_request_failed"), {
        status: response.status,
        headers: response.headers,
      });
      throw error;
    }
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
    });
    return vectors;
  } catch (error) {
    logAssistantError(error, {
      source: "icdu-embeddings",
      model: ICDU_EMBED_MODEL,
      count: texts.length,
      durationMs: Date.now() - started,
    });
    throw classifyUpstreamError(error, options.signal?.aborted === true);
  } finally {
    release();
  }
}

function ensureTrailingSlash(baseUrl: string): string {
  return baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
}
