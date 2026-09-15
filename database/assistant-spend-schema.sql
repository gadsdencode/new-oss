-- Assistant spend controls
-- Application budget for modeled Gemini API charges. Not a Google/Vercel invoice cap.
-- Do not execute this file against production from application code.
-- Operator: run in Neon SQL editor for preview/production after review.

CREATE TABLE IF NOT EXISTS assistant_spend_budgets (
  namespace TEXT NOT NULL,
  period_type TEXT NOT NULL CHECK (period_type IN ('day', 'month')),
  period_start DATE NOT NULL,
  reserved_nanos BIGINT NOT NULL DEFAULT 0 CHECK (reserved_nanos >= 0),
  committed_nanos BIGINT NOT NULL DEFAULT 0 CHECK (committed_nanos >= 0),
  limit_nanos BIGINT NOT NULL CHECK (limit_nanos >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (namespace, period_type, period_start)
);

CREATE TABLE IF NOT EXISTS assistant_spend_reservations (
  reservation_id UUID PRIMARY KEY,
  request_id TEXT NOT NULL,
  call_index INTEGER NOT NULL CHECK (call_index >= 1),
  namespace TEXT NOT NULL,
  day_start DATE NOT NULL,
  month_start DATE NOT NULL,
  reserved_nanos BIGINT NOT NULL CHECK (reserved_nanos >= 0),
  committed_nanos BIGINT,
  status TEXT NOT NULL CHECK (status IN ('reserved', 'committed', 'retained')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reconciled_at TIMESTAMPTZ,
  UNIQUE (request_id, call_index)
);

CREATE INDEX IF NOT EXISTS idx_assistant_spend_reservations_request
  ON assistant_spend_reservations (request_id);

CREATE TABLE IF NOT EXISTS assistant_rate_windows (
  client_hash TEXT NOT NULL,
  namespace TEXT NOT NULL,
  window_type TEXT NOT NULL CHECK (window_type IN ('minute', 'day')),
  window_start TIMESTAMPTZ NOT NULL,
  count INTEGER NOT NULL DEFAULT 0 CHECK (count >= 0),
  PRIMARY KEY (client_hash, namespace, window_type, window_start)
);

CREATE TABLE IF NOT EXISTS assistant_generation_usage (
  call_id TEXT PRIMARY KEY,
  request_id TEXT NOT NULL,
  call_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  environment TEXT NOT NULL,
  namespace TEXT NOT NULL,
  model TEXT NOT NULL,
  pricing_version TEXT NOT NULL,
  input_tokens INTEGER,
  output_tokens INTEGER,
  reasoning_tokens INTEGER,
  usage_source TEXT NOT NULL CHECK (usage_source IN ('provider', 'estimated', 'unknown')),
  estimated_cost_nanos BIGINT NOT NULL,
  latency_ms INTEGER,
  outcome TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_assistant_generation_usage_created
  ON assistant_generation_usage (created_at);

CREATE OR REPLACE FUNCTION assistant_reserve_spend(
  p_namespace TEXT,
  p_day DATE,
  p_month DATE,
  p_day_limit BIGINT,
  p_month_limit BIGINT,
  p_reserve BIGINT,
  p_reservation_id UUID,
  p_request_id TEXT,
  p_call_index INTEGER
) RETURNS TABLE (ok BOOLEAN, reason TEXT, reservation_id UUID)
LANGUAGE plpgsql
AS $$
DECLARE
  day_used BIGINT;
  month_used BIGINT;
BEGIN
  IF p_reserve < 0 THEN
    RETURN QUERY SELECT FALSE, 'invalid_reserve', NULL::UUID;
    RETURN;
  END IF;

  INSERT INTO assistant_spend_reservations (
    reservation_id, request_id, call_index, namespace, day_start, month_start,
    reserved_nanos, status
  ) VALUES (
    p_reservation_id, p_request_id, p_call_index, p_namespace, p_day, p_month,
    p_reserve, 'reserved'
  )
  ON CONFLICT (request_id, call_index) DO NOTHING;

  IF NOT FOUND THEN
    RETURN QUERY
      SELECT TRUE, 'existing', r.reservation_id
      FROM assistant_spend_reservations r
      WHERE r.request_id = p_request_id AND r.call_index = p_call_index;
    RETURN;
  END IF;

  INSERT INTO assistant_spend_budgets (namespace, period_type, period_start, reserved_nanos, committed_nanos, limit_nanos)
  VALUES
    (p_namespace, 'day', p_day, 0, 0, p_day_limit),
    (p_namespace, 'month', p_month, 0, 0, p_month_limit)
  ON CONFLICT (namespace, period_type, period_start)
  DO UPDATE SET limit_nanos = EXCLUDED.limit_nanos;

  SELECT reserved_nanos + committed_nanos INTO day_used
  FROM assistant_spend_budgets
  WHERE namespace = p_namespace AND period_type = 'day' AND period_start = p_day
  FOR UPDATE;

  SELECT reserved_nanos + committed_nanos INTO month_used
  FROM assistant_spend_budgets
  WHERE namespace = p_namespace AND period_type = 'month' AND period_start = p_month
  FOR UPDATE;

  IF day_used + p_reserve > p_day_limit OR month_used + p_reserve > p_month_limit THEN
    DELETE FROM assistant_spend_reservations WHERE assistant_spend_reservations.reservation_id = p_reservation_id;
    RETURN QUERY SELECT FALSE, 'budget_exhausted', NULL::UUID;
    RETURN;
  END IF;

  UPDATE assistant_spend_budgets
  SET reserved_nanos = reserved_nanos + p_reserve, updated_at = CURRENT_TIMESTAMP
  WHERE namespace = p_namespace
    AND (
      (period_type = 'day' AND period_start = p_day)
      OR (period_type = 'month' AND period_start = p_month)
    );

  RETURN QUERY SELECT TRUE, 'reserved', p_reservation_id;
END;
$$;

CREATE OR REPLACE FUNCTION assistant_reconcile_spend(
  p_reservation_id UUID,
  p_commit_nanos BIGINT,
  p_status TEXT
) RETURNS TABLE (ok BOOLEAN, committed_nanos BIGINT, already_reconciled BOOLEAN)
LANGUAGE plpgsql
AS $$
DECLARE
  rec assistant_spend_reservations%ROWTYPE;
  refund BIGINT;
BEGIN
  SELECT * INTO rec
  FROM assistant_spend_reservations
  WHERE reservation_id = p_reservation_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 0::BIGINT, FALSE;
    RETURN;
  END IF;

  IF rec.status IN ('committed', 'retained') THEN
    RETURN QUERY SELECT TRUE, COALESCE(rec.committed_nanos, rec.reserved_nanos), TRUE;
    RETURN;
  END IF;

  refund := rec.reserved_nanos - p_commit_nanos;
  IF refund < 0 THEN
    refund := 0;
    p_commit_nanos := rec.reserved_nanos;
  END IF;

  UPDATE assistant_spend_reservations
  SET committed_nanos = p_commit_nanos,
      status = p_status,
      reconciled_at = CURRENT_TIMESTAMP
  WHERE reservation_id = p_reservation_id;

  UPDATE assistant_spend_budgets
  SET reserved_nanos = reserved_nanos - rec.reserved_nanos,
      committed_nanos = committed_nanos + p_commit_nanos,
      updated_at = CURRENT_TIMESTAMP
  WHERE namespace = rec.namespace
    AND (
      (period_type = 'day' AND period_start = rec.day_start)
      OR (period_type = 'month' AND period_start = rec.month_start)
    );

  RETURN QUERY SELECT TRUE, p_commit_nanos, FALSE;
END;
$$;

CREATE OR REPLACE FUNCTION assistant_hit_rate_limit(
  p_client_hash TEXT,
  p_namespace TEXT,
  p_window_type TEXT,
  p_window_start TIMESTAMPTZ,
  p_limit INTEGER
) RETURNS TABLE (allowed BOOLEAN, count INTEGER, retry_after_seconds INTEGER)
LANGUAGE plpgsql
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  INSERT INTO assistant_rate_windows (client_hash, namespace, window_type, window_start, count)
  VALUES (p_client_hash, p_namespace, p_window_type, p_window_start, 1)
  ON CONFLICT (client_hash, namespace, window_type, window_start)
  DO UPDATE SET count = assistant_rate_windows.count + 1
  WHERE assistant_rate_windows.count < p_limit
  RETURNING assistant_rate_windows.count INTO new_count;

  IF new_count IS NULL THEN
    SELECT assistant_rate_windows.count INTO new_count
    FROM assistant_rate_windows
    WHERE client_hash = p_client_hash
      AND namespace = p_namespace
      AND window_type = p_window_type
      AND window_start = p_window_start;
    RETURN QUERY SELECT FALSE, new_count, CASE WHEN p_window_type = 'minute' THEN 60 ELSE 86400 END;
    RETURN;
  END IF;

  RETURN QUERY SELECT TRUE, new_count, 0;
END;
$$;
