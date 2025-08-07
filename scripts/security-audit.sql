-- Supabase Security Audit Script
-- Run this to check your current security status

-- ============================================
-- 1. Check RLS Status for All Tables
-- ============================================
SELECT 
    '🔍 RLS Status Check' as check_type,
    schemaname || '.' || tablename as table_name,
    CASE 
        WHEN rowsecurity THEN '✅ RLS Enabled'
        ELSE '❌ RLS DISABLED - SECURITY RISK!'
    END as status
FROM pg_tables
WHERE schemaname IN ('public', 'auth')
ORDER BY schemaname, tablename;

-- ============================================
-- 2. Check for Tables Without RLS Policies
-- ============================================
SELECT 
    '🔍 Tables Without Policies' as check_type,
    schemaname || '.' || tablename as table_name,
    '⚠️ No RLS policies defined' as status
FROM pg_tables t
WHERE schemaname = 'public'
    AND rowsecurity = true
    AND NOT EXISTS (
        SELECT 1 
        FROM pg_policies p 
        WHERE p.schemaname = t.schemaname 
        AND p.tablename = t.tablename
    );

-- ============================================
-- 3. List All RLS Policies
-- ============================================
SELECT 
    '📋 RLS Policies' as check_type,
    schemaname || '.' || tablename as table_name,
    policyname as policy_name,
    permissive as is_permissive,
    roles,
    cmd as operation
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================
-- 4. Check Storage Buckets Configuration
-- ============================================
SELECT 
    '🗂️ Storage Buckets' as check_type,
    id as bucket_name,
    CASE 
        WHEN public THEN '⚠️ Public Access'
        ELSE '✅ Private'
    END as access_level,
    file_size_limit,
    array_length(allowed_mime_types, 1) as mime_types_count
FROM storage.buckets
ORDER BY id;

-- ============================================
-- 5. Check for Missing Indexes
-- ============================================
SELECT 
    '⚡ Missing Indexes' as check_type,
    schemaname || '.' || tablename as table_name,
    '⚠️ No indexes on foreign keys' as status
FROM pg_tables t
WHERE schemaname = 'public'
    AND tablename IN ('trips', 'tracks', 'comments', 'posts')
    AND NOT EXISTS (
        SELECT 1
        FROM pg_indexes i
        WHERE i.schemaname = t.schemaname
        AND i.tablename = t.tablename
        AND i.indexname LIKE 'idx_%'
    );

-- ============================================
-- 6. Check User Subscriptions Table
-- ============================================
SELECT 
    '💳 Subscriptions Table' as check_type,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_name = 'user_subscriptions'
        ) THEN '✅ Table exists'
        ELSE '❌ Table missing - causing 406 errors'
    END as status;

-- ============================================
-- 7. Check for Exposed Sensitive Columns
-- ============================================
SELECT 
    '🔐 Sensitive Columns' as check_type,
    table_schema || '.' || table_name as table_name,
    column_name,
    CASE 
        WHEN column_name IN ('password', 'api_key', 'secret', 'token', 'private_key')
        THEN '❌ Potentially sensitive column exposed'
        ELSE '✅ OK'
    END as status
FROM information_schema.columns
WHERE table_schema = 'public'
    AND column_name IN ('password', 'api_key', 'secret', 'token', 'private_key', 
                       'stripe_customer_id', 'stripe_subscription_id');

-- ============================================
-- 8. Check Anonymous Access Permissions
-- ============================================
SELECT 
    '👤 Anonymous Access' as check_type,
    schemaname || '.' || tablename as table_name,
    privilege_type
FROM information_schema.role_table_grants
WHERE grantee = 'anon'
    AND schemaname = 'public'
    AND privilege_type NOT IN ('SELECT')
ORDER BY tablename, privilege_type;

-- ============================================
-- 9. Check for Tables with Too Permissive Policies
-- ============================================
SELECT 
    '⚠️ Permissive Policies' as check_type,
    schemaname || '.' || tablename as table_name,
    policyname,
    qual as policy_condition
FROM pg_policies
WHERE schemaname = 'public'
    AND (qual = 'true' OR qual IS NULL)
    AND cmd != 'SELECT';

-- ============================================
-- 10. Summary Report
-- ============================================
WITH security_summary AS (
    SELECT 
        COUNT(*) FILTER (WHERE NOT rowsecurity) as tables_without_rls,
        COUNT(*) FILTER (WHERE rowsecurity) as tables_with_rls,
        (SELECT COUNT(*) FROM storage.buckets WHERE public = true) as public_buckets,
        (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public') as total_policies
    FROM pg_tables
    WHERE schemaname = 'public'
)
SELECT 
    '📊 Security Summary' as report,
    tables_without_rls || ' tables without RLS' as rls_issues,
    tables_with_rls || ' tables with RLS' as rls_ok,
    public_buckets || ' public storage buckets' as storage_status,
    total_policies || ' total RLS policies' as policy_count
FROM security_summary;

-- ============================================
-- Recommendations
-- ============================================
SELECT '💡 Recommendations' as section, recommendation FROM (
    VALUES 
    ('1. Enable RLS on all public tables'),
    ('2. Create appropriate RLS policies for each table'),
    ('3. Use service role keys only on backend'),
    ('4. Regularly audit database permissions'),
    ('5. Add indexes on foreign key columns'),
    ('6. Review and restrict anonymous access'),
    ('7. Use parameterized queries to prevent SQL injection'),
    ('8. Enable SSL for all connections'),
    ('9. Rotate API keys regularly'),
    ('10. Monitor failed authentication attempts')
) AS recommendations(recommendation);