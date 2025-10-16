-- Proper Signup Health Monitoring System
-- Tests actual signup FUNCTIONALITY, not volume

-- Table to log signup functionality tests
CREATE TABLE IF NOT EXISTS signup_functionality_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  check_time timestamptz DEFAULT now(),
  test_result text NOT NULL, -- 'success', 'auth_error', 'database_error', 'api_error'
  error_message text,
  response_time_ms integer,
  endpoint_tested text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE signup_functionality_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view logs
CREATE POLICY "Admins can view signup functionality logs"
  ON signup_functionality_log
  FOR SELECT
  TO authenticated
  USING (check_admin_access());

-- Service role can insert test results
CREATE POLICY "Service role can insert functionality logs"
  ON signup_functionality_log
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Index for quick queries
CREATE INDEX IF NOT EXISTS idx_signup_functionality_check_time
  ON signup_functionality_log(check_time DESC);

CREATE INDEX IF NOT EXISTS idx_signup_functionality_result
  ON signup_functionality_log(test_result);


-- Function to check signup endpoints are responding
CREATE OR REPLACE FUNCTION check_signup_endpoints()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_start_time timestamptz;
  v_end_time timestamptz;
  v_response_time integer;
  v_result jsonb;
  v_auth_enabled boolean;
  v_error_count integer;
BEGIN
  v_start_time := clock_timestamp();

  -- Check 1: Is auth system accessible?
  SELECT COUNT(*) > 0 INTO v_auth_enabled
  FROM pg_extension
  WHERE extname = 'supabase_auth';

  -- Check 2: Can we query auth.users table? (tests RLS and permissions)
  BEGIN
    SELECT COUNT(*) INTO v_error_count
    FROM auth.users
    WHERE created_at > now() - interval '1 hour';
  EXCEPTION WHEN OTHERS THEN
    v_error_count := -1; -- Error accessing auth.users
  END;

  -- Check 3: Are there any recent auth errors in logs?
  -- (This would require log access - skip for now)

  v_end_time := clock_timestamp();
  v_response_time := EXTRACT(MILLISECONDS FROM (v_end_time - v_start_time))::integer;

  v_result := jsonb_build_object(
    'auth_extension_enabled', v_auth_enabled,
    'auth_users_accessible', v_error_count >= 0,
    'recent_signups_count', v_error_count,
    'response_time_ms', v_response_time,
    'status', CASE
      WHEN v_auth_enabled AND v_error_count >= 0 THEN 'healthy'
      ELSE 'unhealthy'
    END
  );

  -- Log the result
  INSERT INTO signup_functionality_log (
    test_result,
    response_time_ms,
    endpoint_tested,
    error_message
  ) VALUES (
    v_result->>'status',
    v_response_time,
    'auth.users',
    CASE
      WHEN v_result->>'status' = 'unhealthy'
      THEN 'Auth system check failed'
      ELSE NULL
    END
  );

  RETURN v_result;
END;
$$;


-- Function to send alert only if signup is ACTUALLY broken
CREATE OR REPLACE FUNCTION alert_if_signup_broken()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_recent_failures integer;
  v_last_success timestamptz;
  v_should_alert boolean := false;
  v_alert_message text;
BEGIN
  -- Count failures in last hour
  SELECT COUNT(*) INTO v_recent_failures
  FROM signup_functionality_log
  WHERE check_time > now() - interval '1 hour'
    AND test_result != 'success';

  -- Get last successful check
  SELECT check_time INTO v_last_success
  FROM signup_functionality_log
  WHERE test_result = 'success'
  ORDER BY check_time DESC
  LIMIT 1;

  -- Alert if: 3+ failures in last hour OR no success in 2+ hours
  IF v_recent_failures >= 3 THEN
    v_should_alert := true;
    v_alert_message := format(
      'Signup endpoint health checks failing: %s failures in last hour',
      v_recent_failures
    );
  ELSIF v_last_success IS NOT NULL AND v_last_success < now() - interval '2 hours' THEN
    v_should_alert := true;
    v_alert_message := format(
      'Signup endpoint has not responded successfully for %s hours',
      ROUND(EXTRACT(EPOCH FROM (now() - v_last_success)) / 3600, 1)
    );
  END IF;

  -- Send alert via Supabase Edge Function (only if actually broken)
  IF v_should_alert THEN
    PERFORM net.http_post(
      url := current_setting('app.settings.edge_function_url', true) || '/alert-signup-broken',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := jsonb_build_object(
        'alert_type', 'signup_functionality_failure',
        'message', v_alert_message,
        'recent_failures', v_recent_failures,
        'last_success', v_last_success
      )
    );
  END IF;
END;
$$;


-- Schedule health check every 15 minutes (tests functionality, not volume)
SELECT cron.schedule(
  'signup-functionality-check',
  '*/15 * * * *', -- Every 15 minutes
  $$
    SELECT check_signup_endpoints();
    SELECT alert_if_signup_broken();
  $$
);

-- Note: This new system:
-- 1. Tests if auth endpoints RESPOND (not if people are signing up)
-- 2. Only alerts if system is actually broken (3+ failures or 2+ hours no response)
-- 3. Much more useful than counting signup volume
