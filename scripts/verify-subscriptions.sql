-- Verify user_subscriptions table is working correctly

-- 1. Check table structure
SELECT 
    '✅ Table Structure' as check,
    COUNT(*) as column_count,
    'Should be 12 columns' as expected
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'user_subscriptions';

-- 2. Check RLS is enabled
SELECT 
    '🔒 RLS Status' as check,
    CASE 
        WHEN rowsecurity THEN '✅ RLS Enabled'
        ELSE '❌ RLS DISABLED'
    END as status
FROM pg_tables
WHERE schemaname = 'public' 
AND tablename = 'user_subscriptions';

-- 3. Check RLS policies exist
SELECT 
    '📋 RLS Policies' as check,
    COUNT(*) as policy_count,
    string_agg(policyname, ', ') as policies
FROM pg_policies
WHERE schemaname = 'public' 
AND tablename = 'user_subscriptions';

-- 4. Check constraints
SELECT 
    '✔️ Constraints' as check,
    conname as constraint_name,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'public.user_subscriptions'::regclass
AND contype = 'c';

-- 5. Check indexes
SELECT 
    '⚡ Indexes' as check,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public' 
AND tablename = 'user_subscriptions';

-- 6. Check if all users have subscriptions
SELECT 
    '👥 User Coverage' as check,
    (SELECT COUNT(*) FROM auth.users) as total_users,
    (SELECT COUNT(*) FROM public.user_subscriptions) as users_with_subscriptions,
    (SELECT COUNT(*) FROM auth.users u WHERE NOT EXISTS (
        SELECT 1 FROM public.user_subscriptions s WHERE s.user_id = u.id
    )) as users_without_subscriptions;

-- 7. Create missing subscriptions for existing users
INSERT INTO public.user_subscriptions (user_id, subscription_type, subscription_status)
SELECT 
    u.id,
    'free',
    'active'
FROM auth.users u
WHERE NOT EXISTS (
    SELECT 1 FROM public.user_subscriptions s WHERE s.user_id = u.id
)
ON CONFLICT (user_id) DO NOTHING;

-- 8. Check subscription distribution
SELECT 
    '📊 Subscription Distribution' as report,
    subscription_type,
    subscription_status,
    COUNT(*) as count
FROM public.user_subscriptions
GROUP BY subscription_type, subscription_status
ORDER BY count DESC;

-- 9. Final status
SELECT 
    '🎉 Final Status' as status,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_tables 
            WHERE schemaname = 'public' 
            AND tablename = 'user_subscriptions' 
            AND rowsecurity = true
        ) 
        AND EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE schemaname = 'public' 
            AND tablename = 'user_subscriptions'
        )
        AND NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'user_subscriptions' 
            AND column_name IN ('status', 'tier', 'subscription_level', 'is_active')
        )
        THEN '✅ Table is clean and secure!'
        ELSE '⚠️ Some issues remain'
    END as result,
    'No duplicate columns, RLS enabled, policies in place' as details;