-- ============================================================================
-- IMMEDIATE SIGNUP MONITORING INSTALLATION
-- ============================================================================
-- Run this RIGHT NOW in Supabase SQL Editor to prevent future disasters
-- ============================================================================

-- Step 1: Create signup health check view
CREATE OR REPLACE VIEW signup_health_check AS
SELECT
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '1 hour') as signups_last_hour,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '6 hours') as signups_last_6h,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours') as signups_last_24h,
    MAX(created_at) as last_signup_time,
    EXTRACT(EPOCH FROM (NOW() - MAX(created_at))) / 3600 as hours_since_last_signup,
    CASE
        WHEN MAX(created_at) IS NULL THEN '🚨 CRITICAL: NO SIGNUPS EVER'
        WHEN EXTRACT(EPOCH FROM (NOW() - MAX(created_at))) / 3600 > 12 THEN '🚨 CRITICAL: No signups in 12+ hours'
        WHEN EXTRACT(EPOCH FROM (NOW() - MAX(created_at))) / 3600 > 6 THEN '⚠️ WARNING: No signups in 6+ hours'
        WHEN EXTRACT(EPOCH FROM (NOW() - MAX(created_at))) / 3600 > 2 THEN '⚡ NOTICE: No signups in 2+ hours'
        ELSE '✅ OK: Recent signup activity'
    END as health_status
FROM auth.users;

-- Step 2: Test it works
SELECT * FROM signup_health_check;

-- Expected output:
-- | signups_last_hour | signups_last_6h | signups_last_24h | last_signup_time | hours_since_last_signup | health_status |
-- |-------------------|-----------------|------------------|------------------|-------------------------|---------------|
-- | ...               | ...             | ...              | 2025-10-05...    | 0.xx                    | ✅ OK...      |

-- ============================================================================
-- Step 3: Install trigger test function
-- ============================================================================
CREATE OR REPLACE FUNCTION test_signup_triggers()
RETURNS TABLE(trigger_name text, status text, error_message text) AS $$
DECLARE
  test_user_id uuid := gen_random_uuid();
  test_email text := 'trigger-test-' || gen_random_uuid() || '@test.com';
BEGIN
  -- Test 1: handle_new_user
  BEGIN
    INSERT INTO profiles (id, email, full_name, created_at)
    VALUES (test_user_id, test_email, test_email, NOW());
    RETURN QUERY SELECT 'handle_new_user'::text, 'PASS'::text, NULL::text;
    DELETE FROM profiles WHERE id = test_user_id;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 'handle_new_user'::text, 'FAIL'::text, SQLERRM;
  END;

  -- Test 2: handle_new_user_subscription
  BEGIN
    INSERT INTO user_subscriptions (user_id, subscription_type, subscription_status, created_at, updated_at)
    VALUES (test_user_id, 'free', 'active', NOW(), NOW());
    RETURN QUERY SELECT 'handle_new_user_subscription'::text, 'PASS'::text, NULL::text;
    DELETE FROM user_subscriptions WHERE user_id = test_user_id;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 'handle_new_user_subscription'::text, 'FAIL'::text, SQLERRM;
  END;

  -- Test 3: queue_admin_sms
  BEGIN
    PERFORM queue_admin_sms('new_user', test_user_id, 'Test');
    RETURN QUERY SELECT 'queue_admin_sms'::text, 'PASS'::text, NULL::text;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 'queue_admin_sms'::text, 'FAIL'::text, SQLERRM;
  END;

  -- Test 4: queue_admin_email
  BEGIN
    PERFORM queue_admin_email('new_user', test_user_id, 'Test', 'Test');
    RETURN QUERY SELECT 'queue_admin_email'::text, 'PASS'::text, NULL::text;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 'queue_admin_email'::text, 'FAIL'::text, SQLERRM;
  END;

  -- Test 5: Full simulation
  BEGIN
    INSERT INTO profiles (id, email, full_name, created_at)
    VALUES (test_user_id, test_email, test_email, NOW());
    INSERT INTO user_subscriptions (user_id, subscription_type, subscription_status, created_at, updated_at)
    VALUES (test_user_id, 'free', 'active', NOW(), NOW());
    PERFORM queue_admin_sms('new_user', test_user_id, 'Full test');
    PERFORM queue_admin_email('new_user', test_user_id, 'Test', 'Full test');
    RETURN QUERY SELECT 'full_signup_simulation'::text, 'PASS'::text, NULL::text;
    DELETE FROM user_subscriptions WHERE user_id = test_user_id;
    DELETE FROM profiles WHERE id = test_user_id;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 'full_signup_simulation'::text, 'FAIL'::text, SQLERRM;
    BEGIN
      DELETE FROM user_subscriptions WHERE user_id = test_user_id;
      DELETE FROM profiles WHERE id = test_user_id;
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;
  END;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Run trigger tests now
SELECT * FROM test_signup_triggers();

-- Expected: All tests show PASS
-- ❌ If ANY show FAIL, investigate immediately!

-- ============================================================================
-- Step 5: Verify all trigger functions have SECURITY DEFINER
-- ============================================================================
SELECT
    proname as function_name,
    prosecdef as is_security_definer,
    CASE
        WHEN prosecdef = false THEN '❌ MISSING SECURITY DEFINER - FIX THIS!'
        ELSE '✅ OK'
    END as status
FROM pg_proc
WHERE proname IN (
    'handle_new_user',
    'handle_new_user_subscription',
    'notify_new_user',
    'notify_new_user_email',
    'queue_admin_sms',
    'queue_admin_email'
);

-- Expected: All should show ✅ OK
-- ❌ If any show MISSING, run the CRITICAL_SIGNUP_FIX.sql

-- ============================================================================
-- DONE! Monitoring installed.
-- ============================================================================
-- Next steps:
-- 1. Check signup health daily: SELECT * FROM signup_health_check;
-- 2. Before database changes: SELECT * FROM test_signup_triggers();
-- 3. After deployments: Test signup manually
-- ============================================================================
