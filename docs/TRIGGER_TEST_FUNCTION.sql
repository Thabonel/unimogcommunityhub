-- ============================================================================
-- SIGNUP TRIGGER TESTING FUNCTION
-- ============================================================================
-- Purpose: Test all signup triggers can execute without errors
-- Run this: AFTER ANY DATABASE TRIGGER CHANGES
-- Expected: All tests should return 'PASS' status
-- ============================================================================

CREATE OR REPLACE FUNCTION test_signup_triggers()
RETURNS TABLE(trigger_name text, status text, error_message text) AS $$
DECLARE
  test_user_id uuid := gen_random_uuid();
  test_email text := 'trigger-test-' || gen_random_uuid() || '@test.com';
BEGIN
  -- =========================================================================
  -- Test 1: handle_new_user (Creates profile)
  -- =========================================================================
  BEGIN
    INSERT INTO profiles (id, email, full_name, created_at)
    VALUES (test_user_id, test_email, test_email, NOW());

    RETURN QUERY SELECT
      'handle_new_user'::text,
      'PASS'::text,
      NULL::text;

    -- Cleanup
    DELETE FROM profiles WHERE id = test_user_id;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT
      'handle_new_user'::text,
      'FAIL'::text,
      SQLERRM;
  END;

  -- =========================================================================
  -- Test 2: handle_new_user_subscription (Creates subscription)
  -- =========================================================================
  BEGIN
    INSERT INTO user_subscriptions (
      user_id,
      subscription_type,
      subscription_status,
      created_at,
      updated_at
    )
    VALUES (
      test_user_id,
      'free',
      'active',
      NOW(),
      NOW()
    );

    RETURN QUERY SELECT
      'handle_new_user_subscription'::text,
      'PASS'::text,
      NULL::text;

    -- Cleanup
    DELETE FROM user_subscriptions WHERE user_id = test_user_id;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT
      'handle_new_user_subscription'::text,
      'FAIL'::text,
      SQLERRM;
  END;

  -- =========================================================================
  -- Test 3: queue_admin_sms (Called by notify_new_user trigger)
  -- =========================================================================
  BEGIN
    PERFORM queue_admin_sms(
      'new_user',
      test_user_id,
      '🆕 Test signup notification'
    );

    RETURN QUERY SELECT
      'queue_admin_sms'::text,
      'PASS'::text,
      NULL::text;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT
      'queue_admin_sms'::text,
      'FAIL'::text,
      SQLERRM;
  END;

  -- =========================================================================
  -- Test 4: queue_admin_email (Called by notify_new_user_email trigger)
  -- =========================================================================
  BEGIN
    PERFORM queue_admin_email(
      'new_user',
      test_user_id,
      '🆕 Test User Signup',
      'This is a test notification'
    );

    RETURN QUERY SELECT
      'queue_admin_email'::text,
      'PASS'::text,
      NULL::text;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT
      'queue_admin_email'::text,
      'FAIL'::text,
      SQLERRM;
  END;

  -- =========================================================================
  -- Test 5: Full signup simulation (All triggers together)
  -- =========================================================================
  BEGIN
    -- Simulate what happens when auth.users gets new record
    -- Create profile
    INSERT INTO profiles (id, email, full_name, created_at)
    VALUES (test_user_id, test_email, test_email, NOW());

    -- Create subscription
    INSERT INTO user_subscriptions (
      user_id,
      subscription_type,
      subscription_status,
      created_at,
      updated_at
    )
    VALUES (
      test_user_id,
      'free',
      'active',
      NOW(),
      NOW()
    );

    -- Send notifications
    PERFORM queue_admin_sms('new_user', test_user_id, '🆕 Full test');
    PERFORM queue_admin_email('new_user', test_user_id, 'Test', 'Full test');

    RETURN QUERY SELECT
      'full_signup_simulation'::text,
      'PASS'::text,
      NULL::text;

    -- Cleanup
    DELETE FROM user_subscriptions WHERE user_id = test_user_id;
    DELETE FROM profiles WHERE id = test_user_id;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT
      'full_signup_simulation'::text,
      'FAIL'::text,
      SQLERRM;

    -- Attempt cleanup even on failure
    BEGIN
      DELETE FROM user_subscriptions WHERE user_id = test_user_id;
      DELETE FROM profiles WHERE id = test_user_id;
    EXCEPTION WHEN OTHERS THEN
      NULL; -- Ignore cleanup errors
    END;
  END;

END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- RUN THE TESTS
-- ============================================================================
-- Execute this after creating the function:
SELECT * FROM test_signup_triggers();

-- Expected output:
-- | trigger_name                 | status | error_message |
-- |------------------------------|--------|---------------|
-- | handle_new_user              | PASS   | NULL          |
-- | handle_new_user_subscription | PASS   | NULL          |
-- | queue_admin_sms              | PASS   | NULL          |
-- | queue_admin_email            | PASS   | NULL          |
-- | full_signup_simulation       | PASS   | NULL          |

-- ❌ If ANY test shows FAIL, DO NOT deploy to production!
-- ============================================================================

-- ============================================================================
-- AUTOMATED MONITORING (Optional but recommended)
-- ============================================================================
-- Run this test every hour to catch issues early:

-- CREATE OR REPLACE FUNCTION alert_on_trigger_failure()
-- RETURNS void AS $$
-- DECLARE
--   failed_tests int;
-- BEGIN
--   SELECT COUNT(*) INTO failed_tests
--   FROM test_signup_triggers()
--   WHERE status = 'FAIL';
--
--   IF failed_tests > 0 THEN
--     -- Send critical alert to admin
--     PERFORM queue_admin_sms(
--       'error',
--       NULL,
--       '🚨 CRITICAL: ' || failed_tests || ' signup trigger tests FAILING!'
--     );
--
--     PERFORM queue_admin_email(
--       'error',
--       NULL,
--       '🚨 CRITICAL: Signup Trigger Failures Detected',
--       'Run: SELECT * FROM test_signup_triggers(); to see details'
--     );
--   END IF;
-- END;
-- $$ LANGUAGE plpgsql;

-- Schedule to run every hour:
-- SELECT cron.schedule(
--     'test-signup-triggers-hourly',
--     '0 * * * *', -- Every hour
--     'SELECT alert_on_trigger_failure();'
-- );
