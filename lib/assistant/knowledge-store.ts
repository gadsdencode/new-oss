import { neon } from "@neondatabase/serverless";
import { ICDU_EMBED_DIMENSIONS, ICDU_EMBED_MODEL } from "./constants";
import { resolveDatabaseUrl } from "../database-url";
import type { RankedPassage } from "./knowledge/retrieve";

const EMBEDDING_VERSION = `${ICDU_EMBED_MODEL}:${ICDU_EMBED_DIMENSIONS}`;

export function embeddingVersion(): string {
  return EMBEDDING_VERSION;
}

export function toVectorLiteral(vector: number[]): string | null {
  if (vector.length !== ICDU_EMBED_DIMENSIONS || vector.some((value) => !Number.isFinite(value))) {
    return null;
  }
  return `[${vector.join(",")}]`;
}

/**
 * Keyword retrieval does not need this. A missing database or extension returns null
 * so the caller can say vector search was unavailable.
 */
export async function searchKnowledgeByVector(vector: number[], limit = 4): Promise<RankedPassage[] | null> {
  const url = resolveDatabaseUrl();
  const literal = toVectorLiteral(vector);
  if (!url || !literal) {
    return null;
  }
  try {
    const sql = neon(url);
    const rows = await sql.query(
      `SELECT chunk_id, document_id, title, source_url, content, content_hash,
              1 - (embedding <=> $1::vector) AS similarity
       FROM overture_knowledge_chunks
       WHERE publication_status = 'published' AND embedding IS NOT NULL
       ORDER BY embedding <=> $1::vector
       LIMIT $2`,
      [literal, limit]
    );
    const list = Array.isArray(rows) ? rows : [];
    return list.map((row) => {
      const record = row as Record<string, unknown>;
      return {
        chunkId: String(record.chunk_id ?? ""),
        documentId: String(record.document_id ?? ""),
        title: String(record.title ?? ""),
        sourceUrl: String(record.source_url ?? ""),
        content: String(record.content ?? ""),
        contentHash: String(record.content_hash ?? ""),
        score: typeof record.similarity === "number" ? record.similarity : Number(record.similarity ?? 0),
        match: "vector" as const,
      };
    }).filter((passage) => passage.chunkId && passage.sourceUrl.startsWith("https://"));
  } catch {
    return null;
  }
}
