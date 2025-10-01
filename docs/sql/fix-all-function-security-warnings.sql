-- ========================================
-- FIX ALL REMAINING FUNCTION SECURITY WARNINGS
-- UnimogCommunityHub Database - Comprehensive Security Fix
-- ========================================

-- =====================================
-- PART 1: FIX ALL FUNCTION SEARCH PATH VULNERABILITIES
-- =====================================

-- List of all vulnerable functions that need secure search_path:
-- 1. get_shared_trips
-- 2. wis_import_parts
-- 3. wis_import_procedures
-- 4. get_group_member_count
-- 5. is_group_admin
-- 6. is_group_member
-- 7. wis_import_bulletins
-- 8. wis_suggest_prefix
-- 9. user_is_group_member_safe
-- 10. user_is_group_admin_safe
-- 11. wis_search
-- 12. search_enhanced_manual_chunks
-- 13. wis_search_by_type
-- 14. wis_get_media_urls
-- 15. wis_semantic_search
-- 16. check_column_exists
-- 17. wis_media_url

-- Apply secure search_path to all vulnerable functions
DO $$
DECLARE
    func_name text;
    func_names text[] := ARRAY[
        'get_shared_trips',
        'wis_import_parts',
        'wis_import_procedures',
        'get_group_member_count',
        'is_group_admin',
        'is_group_member',
        'wis_import_bulletins',
        'wis_suggest_prefix',
        'user_is_group_member_safe',
        'user_is_group_admin_safe',
        'wis_search',
        'search_enhanced_manual_chunks',
        'wis_search_by_type',
        'wis_get_media_urls',
        'wis_semantic_search',
        'check_column_exists',
        'wis_media_url'
    ];
    success_count integer := 0;
    error_count integer := 0;
BEGIN
    RAISE NOTICE '🔧 Starting security fixes for % functions...', array_length(func_names, 1);

    FOREACH func_name IN ARRAY func_names
    LOOP
        BEGIN
            -- Check if function exists first
            IF EXISTS (
                SELECT 1 FROM pg_proc p
                JOIN pg_namespace n ON p.pronamespace = n.oid
                WHERE p.proname = func_name AND n.nspname = 'public'
            ) THEN
                -- Apply secure search_path
                EXECUTE format('ALTER FUNCTION public.%I() SET search_path = public, pg_temp', func_name);
                RAISE NOTICE '✅ Fixed: %', func_name;
                success_count := success_count + 1;
            ELSE
                RAISE NOTICE '⚠️  Function not found: %', func_name;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE '❌ Error fixing %: %', func_name, SQLERRM;
            error_count := error_count + 1;
        END;
    END LOOP;

    RAISE NOTICE '📊 Summary: % functions fixed, % errors', success_count, error_count;
END $$;

-- =====================================
-- PART 2: FIX EXTENSION IN PUBLIC SCHEMA
-- =====================================

-- Move vector extension from public schema to extensions schema
-- Note: This is a more complex operation and might affect existing functionality

DO $$
BEGIN
    -- Check if vector extension exists in public schema
    IF EXISTS (
        SELECT 1 FROM pg_extension
        WHERE extname = 'vector'
        AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    ) THEN
        RAISE NOTICE '⚠️  Vector extension found in public schema';
        RAISE NOTICE '🔧 Creating extensions schema if it doesn''t exist...';

        -- Create extensions schema if it doesn't exist
        CREATE SCHEMA IF NOT EXISTS extensions;

        -- Note: Moving extensions between schemas is complex and risky
        -- For now, we'll document this as requiring manual intervention
        RAISE NOTICE '⚠️  MANUAL ACTION REQUIRED:';
        RAISE NOTICE '   The vector extension should be moved from public to extensions schema';
        RAISE NOTICE '   This requires careful coordination and might affect existing vector columns';
        RAISE NOTICE '   Consider doing this during a maintenance window';

    ELSE
        RAISE NOTICE '✅ Vector extension not found in public schema';
    END IF;
END $$;

-- =====================================
-- PART 3: VERIFICATION
-- =====================================

-- Check which functions now have secure search_path
SELECT
    '🔍 Security Status Check' as check_type,
    p.proname as function_name,
    n.nspname as schema_name,
    CASE
        WHEN p.proconfig IS NOT NULL AND array_to_string(p.proconfig, ',') LIKE '%search_path%' THEN '✅ SECURE'
        ELSE '⚠️  VULNERABLE'
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
ORDER BY
    CASE WHEN p.proconfig IS NOT NULL AND array_to_string(p.proconfig, ',') LIKE '%search_path%' THEN 0 ELSE 1 END,
    p.proname;

-- Check extension location
SELECT
    '🔍 Extension Status Check' as check_type,
    e.extname as extension_name,
    n.nspname as schema_name,
    CASE
        WHEN n.nspname = 'public' THEN '⚠️  IN PUBLIC (needs moving)'
        ELSE '✅ PROPER LOCATION'
    END as status
FROM pg_extension e
JOIN pg_namespace n ON e.extnamespace = n.oid
WHERE e.extname = 'vector';

-- Summary count of remaining security issues
SELECT
    '📊 Final Security Summary' as summary_type,
    COUNT(CASE WHEN p.proconfig IS NULL OR array_to_string(p.proconfig, ',') NOT LIKE '%search_path%' THEN 1 END) as vulnerable_functions,
    COUNT(CASE WHEN p.proconfig IS NOT NULL AND array_to_string(p.proconfig, ',') LIKE '%search_path%' THEN 1 END) as secure_functions
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

-- Final status message
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
        ELSE '⚠️  Some functions still need manual review'
    END as final_result;

-- =====================================
-- NOTES FOR VECTOR EXTENSION
-- =====================================

/*
IMPORTANT: Vector Extension in Public Schema

The vector extension is currently in the public schema, which is not recommended.
However, moving it is complex because:

1. Existing vector columns might reference the extension
2. Dependencies need to be carefully managed
3. This should be done during a maintenance window

To manually fix this later:
1. Check all dependencies: SELECT * FROM pg_depend WHERE refobjid = (SELECT oid FROM pg_extension WHERE extname = 'vector');
2. Plan the migration carefully
3. Consider recreating vector columns if necessary
4. Move during low-traffic period

For now, the function security issues are the higher priority and have been fixed.
*/