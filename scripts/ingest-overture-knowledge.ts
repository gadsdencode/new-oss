/**
 * Repeatable Overture knowledge ingestion.
 * Re-embeds a chunk only when its content hash changed.
 * Removed documents are marked unpublished. They are not deleted.
 *
 * Usage: npm run knowledge:ingest
 * Requires ICDU_API_KEY and the existing Neon DATABASE_URL family.
 * Apply database/overture-knowledge-schema.sql in the Neon SQL editor first.
 */
import { readFileSync, existsSync } from "node:fs";
import { neon } from "@neondatabase/serverless";
import { resolveDatabaseUrl } from "../lib/database-url";
import { embedIcdUTexts, EmbeddingBatchError } from "../lib/assistant/embeddings";
import { embeddingVersion } from "../lib/assistant/knowledge-store";
import { chunkKnowledgeDocument, hashKnowledgeContent, publishedKnowledgeDocuments } from "../lib/assistant/knowledge/corpus";
import { ICDU_EMBED_MODEL, ICDU_EMBED_MAX_COMBINED_CHARS, ICDU_EMBED_MAX_STRINGS } from "../lib/assistant/constants";
import { loadAssistantConfig } from "../lib/assistant/config";
import { AssistantSpendError } from "../lib/assistant/errors";

loadEnvFile(".env");
loadEnvFile(".env.local");

function loadEnvFile(path: string): void {
  if (!existsSync(path)) {
    return;
  }
  for (const line of readFileSync(path, "utf8").split(/\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }
    const separator = trimmed.indexOf("=");
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, "");
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

async function main(): Promise<void> {
  const databaseUrl = resolveDatabaseUrl();
  if (!databaseUrl) {
    fail(
      "Knowledge ingestion needs the existing Neon DATABASE_URL (or POSTGRES_URL) used by this project. Set it in the host environment or .env.local, apply database/overture-knowledge-schema.sql in the Neon SQL editor, then re-run npm run knowledge:ingest."
    );
  }

  const loaded = loadAssistantConfig();
  if (!loaded.ok || loaded.config.provider !== "icdu" || !loaded.config.baseUrl) {
    fail(
      "Knowledge ingestion embeds with the ICDU provider. Set ASSISTANT_PROVIDER=icdu and ICDU_API_KEY in the server environment. Do not paste the key into chat or commit it."
    );
  }

  const sql = neon(databaseUrl);
  try {
    const extensions = await sql.query("SELECT extname FROM pg_extension WHERE extname = 'vector'");
    const rows = Array.isArray(extensions) ? extensions : [];
    if (rows.length === 0) {
      fail(
        "pgvector is not enabled on this Neon database. In the Neon SQL editor, run database/overture-knowledge-schema.sql (it starts with CREATE EXTENSION IF NOT EXISTS vector). If the extension is blocked for this project, enable pgvector in the Neon console first, then re-run npm run knowledge:ingest."
      );
    }
    await sql.query("SELECT document_id FROM overture_knowledge_documents LIMIT 1");
  } catch (error) {
    const message = error instanceof Error ? error.message : "query failed";
    if (/overture_knowledge_documents/i.test(message) || /does not exist/i.test(message)) {
      fail(
        "The Overture knowledge tables are not installed. Apply database/overture-knowledge-schema.sql in the Neon SQL editor, then re-run npm run knowledge:ingest."
      );
    }
    fail(`Could not read the knowledge schema: ${message}`);
  }

  const documents = publishedKnowledgeDocuments();
  const chunks = documents.flatMap(chunkKnowledgeDocument);
  const activeIds = new Set(chunks.map((chunk) => chunk.chunkId));
  const activeDocuments = new Set(documents.map((document) => document.documentId));

  const existing = await sql.query(
    "SELECT chunk_id, content_hash, publication_status FROM overture_knowledge_chunks"
  );
  const existingRows = (Array.isArray(existing) ? existing : []) as Array<{
    chunk_id: string;
    content_hash: string;
    publication_status: string;
  }>;
  const existingById = new Map(existingRows.map((row) => [row.chunk_id, row]));

  for (const document of documents) {
    const hash = hashKnowledgeContent(document.content);
    await sql.query(
      `INSERT INTO overture_knowledge_documents (
         document_id, title, source_url, publication_status, content_hash, embedding_model, embedding_version, updated_at
       ) VALUES ($1,$2,$3,'published',$4,$5,$6,CURRENT_TIMESTAMP)
       ON CONFLICT (document_id) DO UPDATE SET
         title = EXCLUDED.title,
         source_url = EXCLUDED.source_url,
         publication_status = 'published',
         content_hash = EXCLUDED.content_hash,
         embedding_model = EXCLUDED.embedding_model,
         embedding_version = EXCLUDED.embedding_version,
         updated_at = CURRENT_TIMESTAMP`,
      [document.documentId, document.title, document.sourceUrl, hash, ICDU_EMBED_MODEL, embeddingVersion()]
    );
  }

  const staleDocuments = await sql.query("SELECT document_id FROM overture_knowledge_documents");
  for (const row of (Array.isArray(staleDocuments) ? staleDocuments : []) as Array<{ document_id: string }>) {
    if (!activeDocuments.has(row.document_id)) {
      await sql.query(
        `UPDATE overture_knowledge_documents
         SET publication_status = 'unpublished', updated_at = CURRENT_TIMESTAMP
         WHERE document_id = $1`,
        [row.document_id]
      );
    }
  }

  for (const row of existingRows) {
    if (!activeIds.has(row.chunk_id) && row.publication_status !== "unpublished") {
      await sql.query(
        `UPDATE overture_knowledge_chunks
         SET publication_status = 'unpublished', embedding = NULL, updated_at = CURRENT_TIMESTAMP
         WHERE chunk_id = $1`,
        [row.chunk_id]
      );
      console.log(`unpublished ${row.chunk_id}`);
    }
  }

  const pending = chunks.filter((chunk) => {
    const current = existingById.get(chunk.chunkId);
    return !current || current.content_hash !== chunk.contentHash || current.publication_status !== "published";
  });

  console.log(`${chunks.length} chunks, ${pending.length} to embed`);
  for (const batch of packBatches(pending.map((chunk) => chunk.content))) {
    const slice = pending.splice(0, batch.length);
    let vectors: number[][];
    try {
      vectors = await embedIcdUTexts(slice.map((chunk) => chunk.content), {
        apiKey: loaded.config.apiKey,
        baseUrl: loaded.config.baseUrl,
      });
    } catch (error) {
      if (error instanceof AssistantSpendError) {
        fail(`The embedding gateway is busy. Retry after ${error.retryAfterSeconds ?? 5} seconds. Ingestion was not retried automatically.`);
      }
      if (error instanceof EmbeddingBatchError) {
        fail(error.message);
      }
      fail("Embedding failed. No visitor traffic was involved. Fix ICDU_API_KEY or the gateway and re-run; unchanged chunks will be skipped.");
    }

    for (let index = 0; index < slice.length; index += 1) {
      const chunk = slice[index];
      const vector = vectors[index];
      if (!chunk || !vector) {
        continue;
      }
      await sql.query(
        `INSERT INTO overture_knowledge_chunks (
           chunk_id, document_id, title, source_url, content, content_hash, publication_status,
           embedding_model, embedding_version, embedding, updated_at
         ) VALUES ($1,$2,$3,$4,$5,$6,'published',$7,$8,$9::vector,CURRENT_TIMESTAMP)
         ON CONFLICT (chunk_id) DO UPDATE SET
           document_id = EXCLUDED.document_id,
           title = EXCLUDED.title,
           source_url = EXCLUDED.source_url,
           content = EXCLUDED.content,
           content_hash = EXCLUDED.content_hash,
           publication_status = 'published',
           embedding_model = EXCLUDED.embedding_model,
           embedding_version = EXCLUDED.embedding_version,
           embedding = EXCLUDED.embedding,
           updated_at = CURRENT_TIMESTAMP`,
        [
          chunk.chunkId,
          chunk.documentId,
          chunk.title,
          chunk.sourceUrl,
          chunk.content,
          chunk.contentHash,
          ICDU_EMBED_MODEL,
          embeddingVersion(),
          `[${vector.join(",")}]`,
        ]
      );
      console.log(`embedded ${chunk.chunkId}`);
    }
  }

  console.log("Ingestion finished.");
}

function packBatches(texts: string[]): string[][] {
  const batches: string[][] = [];
  let current: string[] = [];
  let combined = 0;
  for (const text of texts) {
    if (current.length >= ICDU_EMBED_MAX_STRINGS || combined + text.length > ICDU_EMBED_MAX_COMBINED_CHARS) {
      if (current.length > 0) {
        batches.push(current);
      }
      current = [];
      combined = 0;
    }
    current.push(text);
    combined += text.length;
  }
  if (current.length > 0) {
    batches.push(current);
  }
  return batches;
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "ingestion failed";
  fail(message);
});
