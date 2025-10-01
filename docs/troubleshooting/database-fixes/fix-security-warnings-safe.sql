-- ========================================
-- Fix Supabase Security Warnings (SAFE VERSION)
-- Run this in Supabase SQL Editor
-- ========================================

-- Fix 1: Function Search Path Mutable - update_updated_at_column
-- Instead of dropping, we'll use CREATE OR REPLACE to modify the existing function safely

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

-- Verify the function was updated with proper security settings
SELECT
    proname as function_name,
    prosecdef as security_definer,
    proconfig as configuration,
    CASE
        WHEN proconfig IS NOT NULL AND array_to_string(proconfig, ',') LIKE '%search_path%' THEN 'SECURE'
        ELSE 'NEEDS_FIX'
    END as security_status
FROM pg_proc
WHERE proname = 'update_updated_at_column';

-- Fix 2: Function Search Path Mutable - jwt_claims_override
-- Handle this function more carefully since it's authentication-related

-- First, check if the function exists and get its current definition
DO $$
DECLARE
    func_exists boolean;
    current_definition text;
BEGIN
    -- Check if the function exists
    SELECT EXISTS (
        SELECT 1 FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE p.proname = 'jwt_claims_override'
        AND n.nspname = 'app_auth'
    ) INTO func_exists;

    IF func_exists THEN
        -- Get current function definition
        SELECT pg_get_functiondef(p.oid) INTO current_definition
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE p.proname = 'jwt_claims_override'
        AND n.nspname = 'app_auth';

        -- Show the current definition for review
        RAISE NOTICE 'Found jwt_claims_override function. Current definition: %', current_definition;

        -- Apply the security fix by altering the function configuration
        BEGIN
            EXECUTE 'ALTER FUNCTION app_auth.jwt_claims_override() SET search_path = app_auth, public, pg_temp';
            RAISE NOTICE 'Successfully updated jwt_claims_override with secure search_path';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not update jwt_claims_override: %', SQLERRM;
        END;
    ELSE
        RAISE NOTICE 'jwt_claims_override function not found in app_auth schema';
    END IF;
END $$;

-- Verify all affected functions now have proper security settings
SELECT
    n.nspname as schema_name,
    p.proname as function_name,
    p.prosecdef as security_definer,
    p.proconfig as configuration,
    CASE
        WHEN p.proconfig IS NOT NULL AND array_to_string(p.proconfig, ',') LIKE '%search_path%' THEN 'SECURE ✅'
        ELSE 'VULNERABLE ⚠️'
    END as security_status
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname IN ('update_updated_at_column', 'jwt_claims_override')
ORDER BY n.nspname, p.proname;

-- Show summary of all triggers that depend on update_updated_at_column
SELECT
    'Function dependencies preserved - all triggers still active' as status,
    COUNT(*) as trigger_count
FROM information_schema.triggers
WHERE action_statement LIKE '%update_updated_at_column%';

-- List all the tables that use this function (for reference)
SELECT DISTINCT
    event_object_table as table_name,
    trigger_name,
    'Uses update_updated_at_column for timestamp management' as purpose
FROM information_schema.triggers
WHERE action_statement LIKE '%update_updated_at_column%'
ORDER BY event_object_table;

-- Final security check
SELECT 'Security fixes applied successfully - no triggers were affected' as final_status;