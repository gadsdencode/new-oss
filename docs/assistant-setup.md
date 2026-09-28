# Overture assistant setup

The website assistant is the Overture Systems Solutions assistant. ICDU is the model provider. The public site is not icdu.ai, and the model endpoint does not search the icdu.ai knowledge database.

The browser only calls the same-origin route `POST /api/copilotkit`. The server owns the provider, model, base URL, and API key.

## ICDU provider

Required server settings:

```bash
ASSISTANT_PROVIDER=icdu
ICDU_API_BASE_URL=https://icdu-api.uterpi.com/v1
ICDU_MODEL=icdu
ICDU_API_KEY=<deployment secret>
```

`ICDU_API_KEY` is a server secret. Do not put it in `NEXT_PUBLIC_*`, browser code, logs, committed files, or this example. On Vercel, add it in Project Settings → Environment Variables for Production and Preview, then redeploy. Leave it unset in the repository.

The server calls OpenAI-compatible Chat Completions at `{ICDU_API_BASE_URL}/chat/completions` with Bearer authentication. It does not use the OpenAI Responses API. Embeddings, used only by the ingestion command and optional retrieval, call `{ICDU_API_BASE_URL}/embeddings` with model `icdu-embed-v1` and 768 dimensions.

If `ASSISTANT_PROVIDER` is omitted, the server still selects ICDU. A missing `ICDU_API_KEY` returns the public unavailable state. A configured `GEMINI_API_KEY` does not become a fallback.

The shared gateway allows one active chat or embedding request, 2,048 output tokens, a 96 KiB request body, 100 messages, and 32 tools. Busy responses are HTTP 429 with `Retry-After`. The app does not retry those responses or replay a partial stream.

## Gemini rollback

Set this only when you intend to pay for Gemini. It is not selected automatically.

```bash
ASSISTANT_PROVIDER=gemini
GEMINI_API_KEY=<deployment secret>
# GEMINI_MODEL=gemini-2.5-flash
```

`GOOGLE_API_KEY` is read only when `GEMINI_API_KEY` is unset and the provider is explicitly `gemini`. The allowlisted models are `gemini-2.5-flash` and `gemini-2.5-flash-lite`.

## Knowledge

Published page copy in this repository is the source for factual answers. Retrieval combines keyword matching with a 768-dimension vector search when the Neon index is available. If embeddings or the index are unavailable, keyword retrieval still runs and the model is told that limitation.

Apply these files in the Neon SQL editor, in order, before relying on shared limits or vector search. Do not run them from application code.

1. `database/assistant-spend-schema.sql` if the spend tables are not already present.
2. `database/assistant-icdu-migration.sql` for the hourly visitor allowance and turn accounting.
3. `database/overture-knowledge-schema.sql` after confirming `CREATE EXTENSION vector` is allowed on the Neon project.

Then ingest from a trusted shell that already has `DATABASE_URL` and `ICDU_API_KEY`. The command prints counts, not content or secrets. Re-running it re-embeds changed chunks and marks removed pages unpublished.

```bash
npm run knowledge:ingest
```

## Local development

```bash
cp .env.example .env.local
```

Put `ICDU_API_KEY` in `.env.local`, which is gitignored. Start the app with `npm run dev` and open the assistant from the header. Without the key, the sidebar shows the public unavailable message.

## Visitor limits

ICDU is recorded as a self-hosted model with no external per-token provider charge. That is not a statement that infrastructure or hosting is cost-free. Abuse protection still applies:

- 10 visitor messages per minute and 100 per day.
- 25 visitor messages per hour, with the remaining allowance and reset time in the response.
- A visitor message counts once for retries and tool continuations of the same turn.
- At most 4 model calls and 6 tool events in that turn. The last allowed model call must answer in prose.
- Production and Vercel preview fail closed when the shared Neon store is unavailable.

Gemini dollar budgets remain in force only when `ASSISTANT_PROVIDER=gemini`.

## Verification

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
```

`ASSISTANT_LIVE_CHECK=1` runs one short Gemini request and requires `ASSISTANT_PROVIDER=gemini`. It is not part of `npm test`. A live ICDU browser conversation requires `ICDU_API_KEY` in the server environment and is not claimed by the mocked tests.
