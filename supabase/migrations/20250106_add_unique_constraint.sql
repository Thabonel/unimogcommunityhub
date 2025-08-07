-- Fix: Add unique constraint on user_id column
-- This fixes ERROR: 42P10: there is no unique or exclusion constraint matching the ON CONFLICT specification

-- First, check if there are any duplicate user_ids
DO $$
DECLARE
    duplicate_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO duplicate_count
    FROM (
        SELECT user_id, COUNT(*) as cnt
        FROM public.user_subscriptions
        GROUP BY user_id
        HAVING COUNT(*) > 1
    ) duplicates;
    
    IF duplicate_count > 0 THEN
        RAISE NOTICE 'Found % users with duplicate subscriptions. Cleaning up...', duplicate_count;
        
        -- Keep only the most recent subscription for each user
        DELETE FROM public.user_subscriptions
        WHERE id NOT IN (
            SELECT DISTINCT ON (user_id) id
            FROM public.user_subscriptions
            ORDER BY user_id, updated_at DESC
        );
        
        RAISE NOTICE 'Duplicate subscriptions removed';
    END IF;
END $$;

-- Add unique constraint on user_id
ALTER TABLE public.user_subscriptions 
DROP CONSTRAINT IF EXISTS user_subscriptions_user_id_key;

ALTER TABLE public.user_subscriptions 
ADD CONSTRAINT user_subscriptions_user_id_key UNIQUE (user_id);

-- Verify the constraint was added
SELECT 
    '✅ Unique Constraint Added' as status,
    conname as constraint_name,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'public.user_subscriptions'::regclass
AND contype = 'u';

-- Now we can safely create subscriptions for users who don't have them
INSERT INTO public.user_subscriptions (
    user_id, 
    subscription_type, 
    subscription_status,
    created_at,
    updated_at
)
SELECT 
    u.id,
    'free',
    'active',
    COALESCE(u.created_at, now()),
    now()
FROM auth.users u
WHERE NOT EXISTS (
    SELECT 1 FROM public.user_subscriptions s WHERE s.user_id = u.id
)
ON CONFLICT (user_id) DO NOTHING;

-- Update the handle_new_user_subscription function to handle conflicts properly
CREATE OR REPLACE FUNCTION handle_new_user_subscription()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_subscriptions (
        user_id,
        subscription_type,
        subscription_status,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        'free',
        'active',
        now(),
        now()
    ) ON CONFLICT (user_id) DO UPDATE
    SET 
        updated_at = now()
    WHERE public.user_subscriptions.subscription_type = 'free';
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created_subscription ON auth.users;
CREATE TRIGGER on_auth_user_created_subscription
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user_subscription();

-- Show current status
SELECT 
    '📊 Final Status' as report,
    (SELECT COUNT(*) FROM auth.users) as total_users,
    (SELECT COUNT(*) FROM public.user_subscriptions) as users_with_subscriptions,
    (SELECT COUNT(DISTINCT user_id) FROM public.user_subscriptions) as unique_subscriptions;

-- List all constraints on the table
SELECT 
    '📋 All Constraints' as section,
    conname as constraint_name,
    CASE contype
        WHEN 'p' THEN 'PRIMARY KEY'
        WHEN 'u' THEN 'UNIQUE'
        WHEN 'c' THEN 'CHECK'
        WHEN 'f' THEN 'FOREIGN KEY'
    END as constraint_type,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'public.user_subscriptions'::regclass
ORDER BY contype, conname;

DO $$
BEGIN
    RAISE NOTICE '✅ Unique constraint added successfully!';
    RAISE NOTICE '✅ All users now have subscriptions';
    RAISE NOTICE '✅ ON CONFLICT will now work properly';
END $$;