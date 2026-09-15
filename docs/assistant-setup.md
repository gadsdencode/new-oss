# Assistant setup and Gemini trial

This stage keeps CopilotKit 1.10.6, the local `/api/copilotkit` runtime, and existing website behavior. It prepares a controlled trial of `gemini-2.5-flash-lite` without changing cloud settings.

## Server keys

Set one server-side key. Visitors never enter a key.

1. `GEMINI_API_KEY` (preferred)
2. `GOOGLE_API_KEY` (used only when `GEMINI_API_KEY` is unset)

Copy `.env.example` to `.env.local` for local/preview. Do not commit real values.

## Model selection and rollback

The app does not rewrite `GEMINI_MODEL` or deploy-environment settings.

| Setting | Model | When to use |
| --- | --- | --- |
| Unset | `gemini-2.5-flash` | Production default and rollback |
| `GEMINI_MODEL=gemini-2.5-flash-lite` | Trial candidate | Local/preview only for this stage |
| `GEMINI_MODEL=gemini-2.5-flash` | Rollback | Explicit rollback if an override was set |

Rollback procedure:

1. Set `GEMINI_MODEL=gemini-2.5-flash`, or remove `GEMINI_MODEL` so the default applies.
2. Restart the local process. Do not change Vercel/host model settings during this stage.
3. Leave CopilotKit at 1.10.6 and keep `runtimeUrl="/api/copilotkit"`.

An existing non-trial `GEMINI_MODEL` value is preserved. It is not silently replaced with Flash or Flash-Lite.

## Limits

Defaults, overridable with validated integers:

- `ASSISTANT_MAX_INPUT_TOKENS=16000` — assembled input, including system instructions, page context, tool schemas, and history
- `ASSISTANT_MAX_OUTPUT_TOKENS=1024` — provider-side generated tokens per model call
- `ASSISTANT_GENERATION_TIMEOUT_MS=30000`
- `ASSISTANT_ENABLED=true`

There is no automatic model fallback and no extra retry loop. Each model call, including calls after tool execution, is counted in operational logs.

## Checks

Mocked:

```bash
npx tsx --test lib/assistant/config.test.ts lib/assistant/provider-limits.test.ts lib/assistant/streaming-tools.test.ts lib/assistant/missing-key.test.ts lib/assistant/live-provider.test.ts lib/assistant/spend-controls.test.ts lib/assistant/copilot-request.test.ts lib/assistant/client-id.test.ts lib/assistant/pricing.test.ts lib/assistant/copilotkit-route.test.ts
```

Real Gemini evidence is separate and opt-in. It is skipped unless `ASSISTANT_LIVE_CHECK=1` is set with a server key.

## Failure state

If the assistant cannot run, visitors see a contact-page message only. Configuration, provider errors, and keys are not included in that copy.

## Spend controls

`/api/copilotkit` generation requests are metered before each provider call, including retries and calls after tool results. Contact-form rate limiting is separate and is not reused: it fail-opens and trusts spoofable forwarding headers, which is not acceptable for paid model access.

### What is enforced

- CopilotKit 1.10.6 `generateCopilotResponse` bodies only. Metadata operations (`availableAgents`, `loadAgentState`, `hello`) do not spend budget. Unknown operations are rejected.
- Request body, user-message, and tool-result size limits. Tool-result continuations remain valid traffic.
- 10 generation requests/minute and 100/day per trusted client identifier (configurable).
- Global modeled-charge budgets, initially **$1/UTC day** and **$10/UTC calendar month**, namespaced by `production`, `preview`, and `development`.
- Conservative atomic reservation using bounded input tokens and `maxOutputTokens` before `ChatGoogleGenerativeAI.stream`. Concurrent requests cannot oversubscribe the remaining balance.
- Unknown models or missing prices fail closed. They do not bypass enforcement.
- If enforcement storage fails, new paid generations stop and visitors are directed to `/contact`.

This is an **application budget for modeled Gemini API charges**. It is not a guaranteed cap on the full Google or Vercel invoice. Provider billing alerts are not spending caps.

### Identifiers and storage

On Vercel, client identifiers are derived from platform metadata (`x-vercel-forwarded-for`, `x-real-ip`, `x-vercel-ja4-digest`) and stored as a hash. Arbitrary `x-forwarded-for` values and client session IDs are not trusted as the only protection. Raw IPs are not written to usage records.

Production and preview require the existing Neon `DATABASE_URL` family. In-memory storage is allowed only for local development (`NODE_ENV=development` and not on Vercel).

### Operator procedure (do not run from the app)

1. Review `database/assistant-spend-schema.sql`. Do not execute it from application code or against production from this checkout.
2. In the Neon SQL editor for **preview**, apply the file. Confirm the functions `assistant_reserve_spend`, `assistant_reconcile_spend`, and `assistant_hit_rate_limit` exist.
3. Repeat for **production** after preview looks correct. Vercel already uses Neon for contact/payments; no new service is required.
4. Optional env overrides are listed in `.env.example`. Restart the process after changing them.
5. Inspect usage in SQL when needed. There is no public usage or admin endpoint.

```sql
SELECT call_id, created_at, environment, namespace, model, pricing_version,
       input_tokens, output_tokens, reasoning_tokens, usage_source,
       estimated_cost_nanos, latency_ms, outcome
FROM assistant_generation_usage
ORDER BY created_at DESC
LIMIT 100;
```

Until the schema is applied, production and preview generation requests fail closed (contact fallback). That is intentional.

### Pricing table

Verified 2026-09-15 against https://ai.google.dev/gemini-api/docs/pricing (standard paid tier, text). Output price includes thinking tokens.

| Model | Input | Output (includes thinking) |
| --- | --- | --- |
| `gemini-2.5-flash` | $0.30 / 1M | $2.50 / 1M |
| `gemini-2.5-flash-lite` | $0.10 / 1M | $0.40 / 1M |

Version id: `google-ai-2026-09-15`.
