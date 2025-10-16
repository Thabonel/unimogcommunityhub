-- Disable the noisy signup health monitoring system
-- This alert monitors signup VOLUME (number of signups)
-- but should monitor signup FUNCTIONALITY (can people actually sign up)

-- Option 1: Completely disable the cron job
SELECT cron.unschedule('signup-health-check');

-- Option 2 (Alternative): Keep the job but disable alerts
-- Just run this instead if you want to keep monitoring without emails
/*
CREATE OR REPLACE FUNCTION check_signup_health()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Function disabled - monitoring signup volume is not useful
  -- To properly monitor signup health, we should:
  -- 1. Test actual signup flow periodically with a test account
  -- 2. Monitor error rates in logs
  -- 3. Alert on authentication errors, not lack of signups
  RETURN;
END;
$$;
*/

-- Clean up old alert logs (optional)
-- TRUNCATE TABLE signup_health_log;
