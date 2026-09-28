-- Non-destructive ICDU assistant limits.
-- Adds an hourly visitor-message window and a server-side turn record.
-- Do not run this from application code. Apply in the Neon SQL editor
-- after database/assistant-spend-schema.sql.

ALTER TABLE assistant_rate_windows DROP CONSTRAINT IF EXISTS assistant_rate_windows_window_type_check;
ALTER TABLE assistant_rate_windows
  ADD CONSTRAINT assistant_rate_windows_window_type_check
  CHECK (window_type IN ('minute', 'hour', 'day'));

CREATE TABLE IF NOT EXISTS assistant_visitor_turns (
  client_hash TEXT NOT NULL,
  namespace TEXT NOT NULL,
  turn_key TEXT NOT NULL,
  hour_start TIMESTAMPTZ NOT NULL,
  model_calls INTEGER NOT NULL DEFAULT 0 CHECK (model_calls >= 0),
  tool_events INTEGER NOT NULL DEFAULT 0 CHECK (tool_events >= 0),
  model_in_flight BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (client_hash, namespace, turn_key, hour_start)
);

ALTER TABLE assistant_visitor_turns
  ADD COLUMN IF NOT EXISTS model_in_flight BOOLEAN NOT NULL DEFAULT FALSE;

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
  retry_seconds INTEGER;
BEGIN
  retry_seconds := CASE
    WHEN p_window_type = 'minute' THEN 60
    WHEN p_window_type = 'hour' THEN 3600
    ELSE 86400
  END;

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
    RETURN QUERY SELECT FALSE, COALESCE(new_count, p_limit), retry_seconds;
    RETURN;
  END IF;

  RETURN QUERY SELECT TRUE, new_count, 0;
END;
$$;

CREATE OR REPLACE FUNCTION assistant_admit_visitor_message(
  p_client_hash TEXT,
  p_namespace TEXT,
  p_turn_key TEXT,
  p_hour TIMESTAMPTZ,
  p_minute TIMESTAMPTZ,
  p_day TIMESTAMPTZ,
  p_minute_limit INTEGER,
  p_hour_limit INTEGER,
  p_day_limit INTEGER
) RETURNS TABLE (
  ok BOOLEAN,
  already_seen BOOLEAN,
  blocked_window TEXT,
  retry_after_seconds INTEGER,
  hour_count INTEGER,
  hour_limit INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
  minute_hit RECORD;
  hour_hit RECORD;
  day_hit RECORD;
BEGIN
  PERFORM 1
  FROM assistant_visitor_turns
  WHERE client_hash = p_client_hash
    AND namespace = p_namespace
    AND turn_key = p_turn_key
    AND hour_start = p_hour;

  IF FOUND THEN
    RETURN QUERY SELECT TRUE, TRUE, NULL::TEXT, 0, 0, p_hour_limit;
    RETURN;
  END IF;

  SELECT * INTO minute_hit FROM assistant_hit_rate_limit(p_client_hash, p_namespace, 'minute', p_minute, p_minute_limit);
  IF NOT minute_hit.allowed THEN
    RETURN QUERY SELECT FALSE, FALSE, 'minute'::TEXT, minute_hit.retry_after_seconds, 0, p_hour_limit;
    RETURN;
  END IF;

  SELECT * INTO hour_hit FROM assistant_hit_rate_limit(p_client_hash, p_namespace, 'hour', p_hour, p_hour_limit);
  IF NOT hour_hit.allowed THEN
    RETURN QUERY SELECT FALSE, FALSE, 'hour'::TEXT, hour_hit.retry_after_seconds, COALESCE(hour_hit.count, p_hour_limit), p_hour_limit;
    RETURN;
  END IF;

  SELECT * INTO day_hit FROM assistant_hit_rate_limit(p_client_hash, p_namespace, 'day', p_day, p_day_limit);
  IF NOT day_hit.allowed THEN
    RETURN QUERY SELECT FALSE, FALSE, 'day'::TEXT, day_hit.retry_after_seconds, hour_hit.count, p_hour_limit;
    RETURN;
  END IF;

  INSERT INTO assistant_visitor_turns (client_hash, namespace, turn_key, hour_start, model_calls, tool_events)
  VALUES (p_client_hash, p_namespace, p_turn_key, p_hour, 0, 0)
  ON CONFLICT (client_hash, namespace, turn_key, hour_start) DO NOTHING;

  RETURN QUERY SELECT TRUE, FALSE, NULL::TEXT, 0, hour_hit.count, p_hour_limit;
END;
$$;

DROP FUNCTION IF EXISTS assistant_consume_turn_model_call(TEXT, TEXT, TEXT, TIMESTAMPTZ, INTEGER, INTEGER, INTEGER);

CREATE OR REPLACE FUNCTION assistant_consume_turn_model_call(
  p_client_hash TEXT,
  p_namespace TEXT,
  p_turn_key TEXT,
  p_hour TIMESTAMPTZ,
  p_max_calls INTEGER,
  p_tool_events INTEGER,
  p_max_tools INTEGER,
  p_deadline_ms INTEGER,
  p_inflight_stale_ms INTEGER,
  p_final_reserve_ms INTEGER
) RETURNS TABLE (ok BOOLEAN, call_number INTEGER, answer_only BOOLEAN, tool_events INTEGER, reason TEXT)
LANGUAGE plpgsql
AS $$
DECLARE
  rec assistant_visitor_turns%ROWTYPE;
  elapsed_ms INTEGER;
  remaining_ms INTEGER;
BEGIN
  INSERT INTO assistant_visitor_turns (client_hash, namespace, turn_key, hour_start, model_calls, tool_events)
  VALUES (p_client_hash, p_namespace, p_turn_key, p_hour, 0, 0)
  ON CONFLICT (client_hash, namespace, turn_key, hour_start) DO NOTHING;

  SELECT * INTO rec
  FROM assistant_visitor_turns
  WHERE client_hash = p_client_hash
    AND namespace = p_namespace
    AND turn_key = p_turn_key
    AND hour_start = p_hour
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 0, FALSE, 0, 'store_error'::TEXT;
    RETURN;
  END IF;

  elapsed_ms := GREATEST(0, FLOOR(EXTRACT(EPOCH FROM (clock_timestamp() - rec.created_at)) * 1000))::INTEGER;
  remaining_ms := p_deadline_ms - elapsed_ms;
  IF remaining_ms <= 0 THEN
    RETURN QUERY SELECT FALSE, rec.model_calls, TRUE, rec.tool_events, 'turn_deadline'::TEXT;
    RETURN;
  END IF;

  IF rec.model_in_flight
     AND rec.updated_at > clock_timestamp() - make_interval(secs => p_inflight_stale_ms / 1000.0) THEN
    RETURN QUERY SELECT FALSE, rec.model_calls, FALSE, rec.tool_events, 'duplicate'::TEXT;
    RETURN;
  END IF;

  IF rec.model_calls >= p_max_calls THEN
    RETURN QUERY SELECT FALSE, rec.model_calls, TRUE, rec.tool_events, 'model_call_limit'::TEXT;
    RETURN;
  END IF;

  UPDATE assistant_visitor_turns
  SET model_calls = rec.model_calls + 1,
      tool_events = GREATEST(rec.tool_events, p_tool_events),
      model_in_flight = TRUE,
      updated_at = clock_timestamp()
  WHERE client_hash = p_client_hash
    AND namespace = p_namespace
    AND turn_key = p_turn_key
    AND hour_start = p_hour
  RETURNING * INTO rec;

  RETURN QUERY SELECT
    TRUE,
    rec.model_calls,
    rec.model_calls >= p_max_calls OR rec.tool_events >= p_max_tools OR remaining_ms <= p_final_reserve_ms,
    rec.tool_events,
    NULL::TEXT;
END;
$$;

CREATE OR REPLACE FUNCTION assistant_release_turn_model_call(
  p_client_hash TEXT,
  p_namespace TEXT,
  p_turn_key TEXT,
  p_hour TIMESTAMPTZ
) RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE assistant_visitor_turns
  SET model_in_flight = FALSE
  WHERE client_hash = p_client_hash
    AND namespace = p_namespace
    AND turn_key = p_turn_key
    AND hour_start = p_hour;
END;
$$;
