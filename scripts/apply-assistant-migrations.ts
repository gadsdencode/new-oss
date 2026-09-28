/**
 * Apply the assistant SQL files to this project's Neon database.
 * Uses resolveDatabaseUrl(), records a checksum, and skips a file when that
 * checksum is already recorded. Does not print the connection string.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { Pool } from "@neondatabase/serverless";
import { resolveDatabaseUrl } from "../lib/database-url";

loadEnvFile(".env");
loadEnvFile(".env.local");

const FILES = [
  "database/assistant-spend-schema.sql",
  "database/assistant-icdu-migration.sql",
  "database/overture-knowledge-schema.sql",
];

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

function safeError(error: unknown): string {
  const message = error instanceof Error ? error.message : "migration failed";
  return message.replace(/postgres(?:ql)?:\/\/\S+/gi, "[redacted-url]");
}

async function main(): Promise<void> {
  const databaseUrl = resolveDatabaseUrl();
  if (!databaseUrl) {
    throw new Error("This project has no DATABASE_URL family value. Refusing to choose another database.");
  }

  const pool = new Pool({ connectionString: databaseUrl });
  const client = await pool.connect();
  try {
    const contactBefore = await client.query("SELECT COUNT(*)::int AS count FROM contact_submissions");
    const contactCount = contactBefore.rows[0]?.count ?? 0;

    await client.query(`
      CREATE TABLE IF NOT EXISTS overture_schema_migrations (
        filename TEXT PRIMARY KEY,
        checksum TEXT NOT NULL,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    for (const file of FILES) {
      const sql = readFileSync(file, "utf8");
      const checksum = createHash("sha256").update(sql).digest("hex");
      const existing = await client.query(
        "SELECT checksum FROM overture_schema_migrations WHERE filename = $1",
        [file]
      );
      if (existing.rows[0]?.checksum === checksum) {
        console.log(`unchanged ${file}`);
        continue;
      }
      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query(
          `INSERT INTO overture_schema_migrations (filename, checksum)
           VALUES ($1, $2)
           ON CONFLICT (filename) DO UPDATE
           SET checksum = EXCLUDED.checksum, applied_at = CURRENT_TIMESTAMP`,
          [file, checksum]
        );
        await client.query("COMMIT");
        console.log(`applied ${file}`);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }

    const contactAfter = await client.query("SELECT COUNT(*)::int AS count FROM contact_submissions");
    if ((contactAfter.rows[0]?.count ?? 0) !== contactCount) {
      throw new Error("contact_submissions row count changed during assistant migrations.");
    }

    const extensions = await client.query(
      "SELECT extversion FROM pg_extension WHERE extname = 'vector'"
    );
    const tables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN (
          'assistant_spend_budgets',
          'assistant_spend_reservations',
          'assistant_rate_windows',
          'assistant_generation_usage',
          'assistant_visitor_turns',
          'overture_knowledge_documents',
          'overture_knowledge_chunks',
          'contact_submissions'
        )
      ORDER BY table_name
    `);
    const functions = await client.query(`
      SELECT p.proname
      FROM pg_proc p
      JOIN pg_namespace n ON n.oid = p.pronamespace
      WHERE n.nspname = 'public'
        AND p.proname IN (
          'assistant_reserve_spend',
          'assistant_reconcile_spend',
          'assistant_hit_rate_limit',
          'assistant_admit_visitor_message',
          'assistant_consume_turn_model_call',
          'assistant_release_turn_model_call'
        )
      ORDER BY p.proname
    `);
    const vectorColumn = await client.query(`
      SELECT format_type(a.atttypid, a.atttypmod) AS type_name
      FROM pg_attribute a
      JOIN pg_class c ON c.oid = a.attrelid
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public'
        AND c.relname = 'overture_knowledge_chunks'
        AND a.attname = 'embedding'
        AND NOT a.attisdropped
    `);
    const indexes = await client.query(`
      SELECT indexname
      FROM pg_indexes
      WHERE schemaname = 'public'
        AND indexname IN (
          'idx_assistant_spend_reservations_request',
          'idx_assistant_generation_usage_created',
          'idx_overture_knowledge_chunks_status'
        )
      ORDER BY indexname
    `);

    const privileges = await client.query(`
      SELECT table_name, privilege_type
      FROM information_schema.table_privileges
      WHERE table_schema = 'public'
        AND grantee = current_user
        AND table_name IN (
          'assistant_visitor_turns',
          'overture_knowledge_documents',
          'overture_knowledge_chunks'
        )
      ORDER BY table_name, privilege_type
    `);
    const turnColumn = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'assistant_visitor_turns'
        AND column_name = 'model_in_flight'
    `);
    const windowCheck = await client.query(`
      SELECT pg_get_constraintdef(oid) AS definition
      FROM pg_constraint
      WHERE conname = 'assistant_rate_windows_window_type_check'
    `);
    const hourFunction = await client.query(`
      SELECT position('3600' in pg_get_functiondef(p.oid)) > 0 AS hour_retry
      FROM pg_proc p
      JOIN pg_namespace n ON n.oid = p.pronamespace
      WHERE n.nspname = 'public'
        AND p.proname = 'assistant_hit_rate_limit'
    `);

    console.log(JSON.stringify({
      contactSubmissions: contactCount,
      vectorVersion: extensions.rows[0]?.extversion ?? null,
      tables: tables.rows.map((row) => row.table_name),
      functions: functions.rows.map((row) => row.proname),
      embeddingType: vectorColumn.rows[0]?.type_name ?? null,
      indexes: indexes.rows.map((row) => row.indexname),
      modelInFlight: turnColumn.rows[0]?.column_name ?? null,
      windowCheck: windowCheck.rows[0]?.definition ?? null,
      hourRateLimit: hourFunction.rows[0]?.hour_retry ?? false,
      privileges: privileges.rows,
    }));
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(safeError(error));
  process.exit(1);
});
