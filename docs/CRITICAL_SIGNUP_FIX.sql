-- ============================================================================
-- CRITICAL SIGNUP FAILURE FIX
-- ============================================================================
-- Issue: User signups broken since October 4th, 2025
-- Error: "Database error saving new user"
-- Root Cause: Notification trigger functions missing SECURITY DEFINER
-- Impact: ALL new user registrations failing (running ads with no conversions!)
-- ============================================================================

-- SOLUTION: Add SECURITY DEFINER to notification trigger functions
-- This allows them to bypass RLS and execute with elevated privileges

-- ----------------------------------------------------------------------------
-- Fix 1: Make notify_new_user function SECURITY DEFINER
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.notify_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER  -- CRITICAL: Added to fix signup failure
SET search_path TO 'public'  -- CRITICAL: Added for security
AS $function$
BEGIN
  PERFORM queue_admin_sms(
    'new_user',
    NEW.id,
    '🆕 New user signup: ' || COALESCE(NEW.email, 'Unknown')
  );
  RETURN NEW;
END;
$function$;

-- ----------------------------------------------------------------------------
-- Fix 2: Make notify_new_user_email function SECURITY DEFINER
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.notify_new_user_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER  -- CRITICAL: Added to fix signup failure
SET search_path TO 'public'  -- CRITICAL: Added for security
AS $function$
BEGIN
  PERFORM queue_admin_email(
    'new_user',
    NEW.id,
    '🆕 New User Signup - Unimog Community Hub',
    'New user signed up: ' || COALESCE(NEW.email, 'Unknown') || E'\n\n' ||
    'Time: ' || NOW()::TEXT || E'\n' ||
    'View in admin panel: https://unimogcommunityhub.com/admin'
  );
  RETURN NEW;
END;
$function$;

-- ============================================================================
-- VERIFICATION QUERIES (Run after applying fix)
-- ============================================================================

-- 1. Verify functions are now SECURITY DEFINER
SELECT
    proname as function_name,
    prosecdef as is_security_definer,
    proconfig as settings
FROM pg_proc
WHERE proname IN ('notify_new_user', 'notify_new_user_email');
-- Expected: Both should show is_security_definer = true

-- 2. Test signup flow (try signing up with test email)
-- Expected: User should be created successfully

-- 3. Verify new user has all required records
SELECT
    u.id,
    u.email,
    u.created_at,
    p.id as has_profile,
    us.id as has_subscription
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN user_subscriptions us ON u.id = us.user_id
ORDER BY u.created_at DESC
LIMIT 1;
-- Expected: New user should have both profile and subscription

-- ============================================================================
-- EMERGENCY ALTERNATIVE: Disable notifications temporarily
-- ============================================================================
-- Only use this if you need signups working IMMEDIATELY while investigating
-- CAUTION: This will disable admin notifications for new signups

-- DROP TRIGGER IF EXISTS trigger_notify_new_user ON auth.users;
-- DROP TRIGGER IF EXISTS trigger_notify_new_user_email ON auth.users;

-- To re-enable notifications later, recreate triggers:
-- CREATE TRIGGER trigger_notify_new_user
--   AFTER INSERT ON auth.users
--   FOR EACH ROW
--   EXECUTE FUNCTION notify_new_user();

-- CREATE TRIGGER trigger_notify_new_user_email
--   AFTER INSERT ON auth.users
--   FOR EACH ROW
--   EXECUTE FUNCTION notify_new_user_email();

-- ============================================================================
-- ROOT CAUSE ANALYSIS
-- ============================================================================
-- Timeline:
-- - Oct 2-3: Signups working ✅ (4 successful users: cameron.mansell, janeknowak554, etc.)
-- - Oct 4: Admin notification system added (first log entries created)
-- - Oct 5: All signups failing ❌
--
-- The Problem:
-- 1. When user signs up, auth.users INSERT triggers 4 functions
-- 2. handle_new_user() and handle_new_user_subscription() are SECURITY DEFINER ✅
-- 3. notify_new_user() and notify_new_user_email() were NOT SECURITY DEFINER ❌
-- 4. Without SECURITY DEFINER, triggers run with authenticated user's permissions
-- 5. During signup, user doesn't exist yet, causing permission errors
-- 6. Transaction rolls back, blocking entire signup
--
-- The Fix:
-- Adding SECURITY DEFINER to notification functions allows them to run with
-- postgres role privileges, bypassing RLS and permission issues
-- ============================================================================
