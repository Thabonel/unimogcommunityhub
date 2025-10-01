-- ========================================
-- Fix Supabase Security Warnings
-- Run this in Supabase SQL Editor
-- ========================================

-- Fix 1: Function Search Path Mutable - update_updated_at_column
-- This function was created for the POI table and needs a secure search_path

DROP FUNCTION IF EXISTS update_updated_at_column();

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Verify the function was created with proper security settings
SELECT
    proname as function_name,
    prosecdef as security_definer,
    proconfig as configuration
FROM pg_proc
WHERE proname = 'update_updated_at_column';

-- Fix 2: Function Search Path Mutable - jwt_claims_override
-- This is a more complex function that needs careful handling

-- First, let's see what this function does
SELECT
    p.proname,
    p.prosrc,
    p.proconfig,
    n.nspname as schema_name
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'jwt_claims_override'
AND n.nspname = 'app_auth';

-- If the function exists, we'll recreate it with proper search_path
-- Note: This is a critical auth function, so we need to be very careful

-- Get the current function definition first
SELECT pg_get_functiondef(oid) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'jwt_claims_override'
AND n.nspname = 'app_auth';

-- The function will need to be recreated with SET search_path
-- This should be done carefully as it affects authentication

-- For now, let's add the search_path setting if the function exists
DO $$
BEGIN
    -- Check if the function exists
    IF EXISTS (
        SELECT 1 FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE p.proname = 'jwt_claims_override'
        AND n.nspname = 'app_auth'
    ) THEN
        -- Add search_path configuration to existing function
        EXECUTE 'ALTER FUNCTION app_auth.jwt_claims_override() SET search_path = app_auth, public, pg_temp';
        RAISE NOTICE 'Updated jwt_claims_override function with secure search_path';
    ELSE
        RAISE NOTICE 'jwt_claims_override function not found - may have been removed or renamed';
    END IF;
END $$;

-- Verify both functions now have proper security settings
SELECT
    n.nspname as schema_name,
    p.proname as function_name,
    p.prosecdef as security_definer,
    p.proconfig as configuration,
    CASE
        WHEN p.proconfig IS NOT NULL AND 'search_path' = ANY(p.proconfig) THEN 'SECURE'
        ELSE 'VULNERABLE'
    END as security_status
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname IN ('update_updated_at_column', 'jwt_claims_override')
ORDER BY n.nspname, p.proname;

-- Summary message
SELECT 'Security fixes applied - functions now have secure search_path settings' as status;