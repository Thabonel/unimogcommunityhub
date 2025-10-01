-- ========================================
-- COMPLETE SECURITY FIXES - ADMIN REQUIRED
-- All remaining security vulnerabilities requiring admin privileges
-- ========================================

-- =====================================
-- PART 1: FIX FUNCTION SEARCH PATH VULNERABILITIES
-- =====================================

-- Fix all 17 remaining vulnerable functions
-- These require postgres/admin privileges
ALTER FUNCTION public.check_column_exists(table_name text, column_name text) SET search_path = public, pg_temp;
ALTER FUNCTION public.get_group_member_count(group_id_param uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.get_shared_trips(p_user_id uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.is_group_admin(group_id_param uuid, user_id_param uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.is_group_member(group_id_param uuid, user_id_param uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.search_enhanced_manual_chunks(search_query text, content_type_filter text, min_quality numeric, limit_results integer) SET search_path = public, pg_temp;
ALTER FUNCTION public.user_is_group_admin_safe(group_id_param uuid, user_id_param uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.user_is_group_member_safe(group_id_param uuid, user_id_param uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.wis_get_media_urls(document_id text) SET search_path = public, pg_temp;
ALTER FUNCTION public.wis_import_bulletins(payload jsonb) SET search_path = public, pg_temp;
ALTER FUNCTION public.wis_import_parts(payload jsonb) SET search_path = public, pg_temp;
ALTER FUNCTION public.wis_import_procedures(payload jsonb) SET search_path = public, pg_temp;
ALTER FUNCTION public.wis_media_url(bucket text, file_name text, expires_in integer) SET search_path = public, pg_temp;
ALTER FUNCTION public.wis_search(search_query text, result_limit integer) SET search_path = public, pg_temp;
ALTER FUNCTION public.wis_search_by_type(search_query text, type_filter text, result_limit integer) SET search_path = public, pg_temp;
ALTER FUNCTION public.wis_semantic_search(query_embedding vector, similarity_threshold double precision, limit_rows integer) SET search_path = public, pg_temp;
ALTER FUNCTION public.wis_suggest_prefix(prefix text, max_results integer) SET search_path = public, pg_temp;

-- =====================================
-- PART 2: FIX RLS POLICY MISSING ON WIS_CHUNKS
-- =====================================

-- wis_chunks table has RLS enabled but no policies
-- This is WIS (Workshop Information System) technical documentation

-- Drop any existing policies first
DROP POLICY IF EXISTS "Allow authenticated users to read wis_chunks" ON public.wis_chunks;
DROP POLICY IF EXISTS "Allow admins to manage wis_chunks" ON public.wis_chunks;

-- Create read policy for authenticated users
-- WIS content should be accessible to authenticated users
CREATE POLICY "Allow authenticated users to read wis_chunks" ON public.wis_chunks
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create admin management policy for WIS imports and updates
CREATE POLICY "Allow admins to manage wis_chunks" ON public.wis_chunks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = true
        )
    );

-- =====================================
-- PART 3: VECTOR EXTENSION IN PUBLIC SCHEMA
-- =====================================

-- NOTE: Moving vector extension is complex and risky
-- The vector extension is currently in public schema which is not recommended
-- However, moving it requires careful coordination as it may affect existing vector columns

-- Check dependencies first
SELECT
    'Vector extension dependencies:' as info,
    COUNT(*) as dependent_objects
FROM pg_depend
WHERE refobjid = (SELECT oid FROM pg_extension WHERE extname = 'vector');

-- Check for vector columns that might be affected
SELECT
    'Tables with vector columns:' as info,
    schemaname,
    tablename,
    attname as column_name,
    typname as column_type
FROM pg_tables t
JOIN pg_attribute a ON a.attrelid = (t.schemaname||'.'||t.tablename)::regclass
JOIN pg_type pt ON pt.oid = a.atttypid
WHERE pt.typname = 'vector'
AND t.schemaname = 'public';

-- MANUAL ACTION REQUIRED for vector extension:
-- 1. This should be done during a maintenance window
-- 2. Backup all vector columns before attempting
-- 3. Consider recreating vector columns if necessary
-- 4. Test thoroughly after moving

/*
TO MOVE VECTOR EXTENSION (ADVANCED - REQUIRES CAREFUL PLANNING):

1. Create extensions schema:
   CREATE SCHEMA IF NOT EXISTS extensions;

2. The move operation is complex and may require:
   - Dropping dependent objects (vector columns)
   - Moving the extension
   - Recreating dependent objects

3. This is beyond the scope of automated fixes due to risk
*/

RAISE NOTICE 'ℹ️  Vector extension move requires manual planning during maintenance window';

-- =====================================
-- PART 4: VERIFICATION QUERIES
-- =====================================

-- Verify function security fixes
SELECT
    '🔍 Function Security Verification' as check_type,
    p.proname as function_name,
    pg_get_function_identity_arguments(p.oid) as function_signature,
    CASE
        WHEN p.proconfig IS NOT NULL AND array_to_string(p.proconfig, ',') LIKE '%search_path%' THEN '✅ SECURE'
        ELSE '❌ STILL VULNERABLE'
    END as security_status
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname IN (
    'get_shared_trips', 'wis_import_parts', 'wis_import_procedures',
    'get_group_member_count', 'is_group_admin', 'is_group_member',
    'wis_import_bulletins', 'wis_suggest_prefix', 'user_is_group_member_safe',
    'user_is_group_admin_safe', 'wis_search', 'search_enhanced_manual_chunks',
    'wis_search_by_type', 'wis_get_media_urls', 'wis_semantic_search',
    'check_column_exists', 'wis_media_url'
)
AND n.nspname = 'public'
ORDER BY security_status, p.proname;

-- Verify RLS policies on wis_chunks
SELECT
    '🔍 RLS Policy Verification' as check_type,
    policyname as policy_name,
    permissive,
    cmd as command,
    roles
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'wis_chunks'
ORDER BY policyname;

-- Count remaining security issues
WITH security_summary AS (
    SELECT
        'Function vulnerabilities' as issue_type,
        COUNT(CASE WHEN p.proconfig IS NULL OR array_to_string(p.proconfig, ',') NOT LIKE '%search_path%' THEN 1 END) as remaining_count
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE p.proname IN (
        'get_shared_trips', 'wis_import_parts', 'wis_import_procedures',
        'get_group_member_count', 'is_group_admin', 'is_group_member',
        'wis_import_bulletins', 'wis_suggest_prefix', 'user_is_group_member_safe',
        'user_is_group_admin_safe', 'wis_search', 'search_enhanced_manual_chunks',
        'wis_search_by_type', 'wis_get_media_urls', 'wis_semantic_search',
        'check_column_exists', 'wis_media_url'
    )
    AND n.nspname = 'public'

    UNION ALL

    SELECT
        'RLS policy missing' as issue_type,
        CASE WHEN COUNT(*) = 0 THEN 1 ELSE 0 END as remaining_count
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'wis_chunks'

    UNION ALL

    SELECT
        'Vector extension in public' as issue_type,
        COUNT(*) as remaining_count
    FROM pg_extension e
    JOIN pg_namespace n ON e.extnamespace = n.oid
    WHERE e.extname = 'vector' AND n.nspname = 'public'
)
SELECT
    '📊 Security Issues Summary' as summary_type,
    issue_type,
    remaining_count,
    CASE WHEN remaining_count = 0 THEN '✅ RESOLVED' ELSE '⚠️  NEEDS ATTENTION' END as status
FROM security_summary;

-- Final status
SELECT
    CASE
        WHEN (
            -- Check functions are secure
            SELECT COUNT(*) FROM pg_proc p
            JOIN pg_namespace n ON p.pronamespace = n.oid
            WHERE p.proname IN (
                'get_shared_trips', 'wis_import_parts', 'wis_import_procedures',
                'get_group_member_count', 'is_group_admin', 'is_group_member',
                'wis_import_bulletins', 'wis_suggest_prefix', 'user_is_group_member_safe',
                'user_is_group_admin_safe', 'wis_search', 'search_enhanced_manual_chunks',
                'wis_search_by_type', 'wis_get_media_urls', 'wis_semantic_search',
                'check_column_exists', 'wis_media_url'
            )
            AND n.nspname = 'public'
            AND (p.proconfig IS NULL OR array_to_string(p.proconfig, ',') NOT LIKE '%search_path%')
        ) = 0
        AND (
            -- Check RLS policies exist
            SELECT COUNT(*) FROM pg_policies
            WHERE schemaname = 'public' AND tablename = 'wis_chunks'
        ) > 0
        THEN '🎉 CRITICAL SECURITY ISSUES RESOLVED! (Vector extension move still recommended)'
        ELSE '⚠️  Some critical security issues remain'
    END as final_security_status;

-- =====================================
-- POSTGRES VERSION UPGRADE NOTICE
-- =====================================

-- Check current Postgres version
SELECT
    '📋 Postgres Version Information' as info_type,
    version() as current_version,
    'Current version has security patches available' as notice,
    'Upgrade recommended via Supabase dashboard' as action_required;

-- =====================================
-- EXECUTION SUMMARY
-- =====================================

/*
SUMMARY OF FIXES APPLIED:

1. ✅ Function Search Path Vulnerabilities (17 functions)
   - Applied secure search_path to prevent schema injection attacks

2. ✅ RLS Policy Missing on wis_chunks
   - Added read policy for authenticated users
   - Added admin management policy

3. ⚠️  Vector Extension in Public Schema
   - Requires manual intervention during maintenance window
   - Complex operation due to potential dependencies

4. ℹ️  Postgres Version Upgrade
   - Informational - upgrade via Supabase dashboard when convenient

NEXT STEPS:
1. Run this script as admin/postgres user
2. Verify all checks pass
3. Plan vector extension move for maintenance window
4. Schedule Postgres version upgrade
*/