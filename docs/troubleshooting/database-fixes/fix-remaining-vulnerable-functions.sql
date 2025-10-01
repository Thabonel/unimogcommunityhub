-- ========================================
-- FIX REMAINING VULNERABLE FUNCTIONS
-- Targeted fix for functions that still need security updates
-- ========================================

-- =====================================
-- STEP 1: IDENTIFY FUNCTION SIGNATURES
-- =====================================

-- Check all function signatures for the vulnerable functions
SELECT
    p.proname as function_name,
    pg_get_function_identity_arguments(p.oid) as function_signature,
    p.oid,
    CASE
        WHEN p.proconfig IS NOT NULL AND array_to_string(p.proconfig, ',') LIKE '%search_path%' THEN '✅ SECURE'
        ELSE '⚠️  VULNERABLE'
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
ORDER BY p.proname, function_signature;

-- =====================================
-- STEP 2: FIX FUNCTIONS WITH SPECIFIC SIGNATURES
-- =====================================

-- Fix each vulnerable function individually with proper signature handling
DO $$
DECLARE
    func_record RECORD;
    fix_count INTEGER := 0;
    error_count INTEGER := 0;
BEGIN
    RAISE NOTICE '🔧 Starting targeted function security fixes...';

    -- Loop through all vulnerable functions
    FOR func_record IN
        SELECT
            p.proname as function_name,
            p.oid,
            pg_get_function_identity_arguments(p.oid) as function_signature
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
        AND (p.proconfig IS NULL OR array_to_string(p.proconfig, ',') NOT LIKE '%search_path%')
    LOOP
        BEGIN
            -- Fix the function using its OID for precise targeting
            EXECUTE format(
                'ALTER FUNCTION %s SET search_path = public, pg_temp',
                func_record.oid::regprocedure
            );

            RAISE NOTICE '✅ Fixed: %(%)', func_record.function_name, func_record.function_signature;
            fix_count := fix_count + 1;

        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE '❌ Error fixing %(%): %',
                func_record.function_name,
                func_record.function_signature,
                SQLERRM;
            error_count := error_count + 1;
        END;
    END LOOP;

    RAISE NOTICE '📊 Targeted fix complete: % functions fixed, % errors', fix_count, error_count;
END $$;

-- =====================================
-- STEP 3: VERIFICATION
-- =====================================

-- Verify all functions are now secure
SELECT
    '🔍 Final Security Verification' as check_type,
    p.proname as function_name,
    pg_get_function_identity_arguments(p.oid) as function_signature,
    CASE
        WHEN p.proconfig IS NOT NULL AND array_to_string(p.proconfig, ',') LIKE '%search_path%' THEN '✅ SECURE'
        ELSE '❌ STILL VULNERABLE'
    END as security_status,
    p.proconfig as configuration
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
ORDER BY security_status, p.proname, function_signature;

-- Count remaining vulnerabilities
SELECT
    '📊 Security Summary' as summary_type,
    COUNT(CASE WHEN p.proconfig IS NULL OR array_to_string(p.proconfig, ',') NOT LIKE '%search_path%' THEN 1 END) as still_vulnerable,
    COUNT(CASE WHEN p.proconfig IS NOT NULL AND array_to_string(p.proconfig, ',') LIKE '%search_path%' THEN 1 END) as now_secure,
    COUNT(*) as total_functions
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
AND n.nspname = 'public';

-- Final result
SELECT
    CASE
        WHEN (
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
        THEN '🎉 ALL FUNCTION SECURITY VULNERABILITIES FIXED!'
        ELSE '⚠️  Some functions may need alternative approaches'
    END as final_status;

-- =====================================
-- ALTERNATIVE APPROACH FOR STUBBORN FUNCTIONS
-- =====================================

-- If some functions still can't be fixed, show manual commands
SELECT
    '📝 Manual Fix Commands' as manual_section,
    'Run these commands individually if needed:' as instructions;

-- Generate individual ALTER commands for any remaining vulnerable functions
SELECT
    'Manual command: ' || 'ALTER FUNCTION ' || p.oid::regprocedure || ' SET search_path = public, pg_temp;' as manual_fix_command
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
AND (p.proconfig IS NULL OR array_to_string(p.proconfig, ',') NOT LIKE '%search_path%');