-- Overture knowledge collection for the website assistant.
-- Non-destructive. Requires the pgvector extension on the existing Neon database.
-- Do not run this from a visitor request. Apply it in the Neon SQL editor, then
-- run: npm run knowledge:ingest

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS overture_knowledge_documents (
  document_id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  source_url TEXT NOT NULL,
  publication_status TEXT NOT NULL CHECK (publication_status IN ('published', 'unpublished')),
  content_hash TEXT NOT NULL,
  embedding_model TEXT,
  embedding_version TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS overture_knowledge_chunks (
  chunk_id TEXT PRIMARY KEY,
  document_id TEXT NOT NULL REFERENCES overture_knowledge_documents (document_id),
  title TEXT NOT NULL,
  source_url TEXT NOT NULL,
  content TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  publication_status TEXT NOT NULL CHECK (publication_status IN ('published', 'unpublished')),
  embedding_model TEXT,
  embedding_version TEXT,
  embedding vector(768),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_overture_knowledge_chunks_status
  ON overture_knowledge_chunks (publication_status);
