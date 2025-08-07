-- Clean up user_subscriptions table - remove duplicate columns
-- This fixes the messy table structure with redundant columns

-- First, let's create a backup of the data
CREATE TABLE IF NOT EXISTS public.user_subscriptions_backup AS 
SELECT * FROM public.user_subscriptions;

-- Update the main columns with data from redundant columns before dropping them
UPDATE public.user_subscriptions
SET 
    subscription_status = COALESCE(subscription_status, status, CASE WHEN is_active THEN 'active' ELSE 'inactive' END, 'active'),
    subscription_type = COALESCE(subscription_type, subscription_level, tier, 'free')
WHERE subscription_status IS NULL OR subscription_type IS NULL;

-- Now drop the redundant columns
ALTER TABLE public.user_subscriptions 
DROP COLUMN IF EXISTS status,
DROP COLUMN IF EXISTS subscription_level,
DROP COLUMN IF EXISTS tier,
DROP COLUMN IF EXISTS is_active,
DROP COLUMN IF EXISTS starts_at,
DROP COLUMN IF EXISTS expires_at;

-- Add any missing essential columns
DO $$
BEGIN
    -- Ensure we have all needed columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'user_subscriptions' 
                  AND column_name = 'subscription_status') THEN
        ALTER TABLE public.user_subscriptions 
        ADD COLUMN subscription_status TEXT NOT NULL DEFAULT 'active';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'user_subscriptions' 
                  AND column_name = 'subscription_type') THEN
        ALTER TABLE public.user_subscriptions 
        ADD COLUMN subscription_type TEXT NOT NULL DEFAULT 'free';
    END IF;
END $$;

-- Add check constraints to ensure valid values
ALTER TABLE public.user_subscriptions
DROP CONSTRAINT IF EXISTS check_subscription_status,
DROP CONSTRAINT IF EXISTS check_subscription_type;

ALTER TABLE public.user_subscriptions
ADD CONSTRAINT check_subscription_status 
    CHECK (subscription_status IN ('active', 'inactive', 'canceled', 'past_due', 'trialing', 'paused')),
ADD CONSTRAINT check_subscription_type 
    CHECK (subscription_type IN ('free', 'basic', 'pro', 'premium', 'enterprise', 'trial'));

-- Ensure indexes exist
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON public.user_subscriptions(subscription_status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_type ON public.user_subscriptions(subscription_type);

-- Update the updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_user_subscriptions_updated_at ON public.user_subscriptions;
CREATE TRIGGER update_user_subscriptions_updated_at
    BEFORE UPDATE ON public.user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Recreate clean RLS policies
DROP POLICY IF EXISTS "Users can view own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can update own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can insert own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON public.user_subscriptions;

CREATE POLICY "Users can view own subscription" ON public.user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" ON public.user_subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription" ON public.user_subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all subscriptions" ON public.user_subscriptions
    FOR ALL USING (auth.role() = 'service_role');

-- Grant permissions
GRANT ALL ON public.user_subscriptions TO authenticated;
GRANT ALL ON public.user_subscriptions TO service_role;
GRANT SELECT ON public.user_subscriptions TO anon;

-- Show the cleaned table structure
SELECT 
    '✅ Cleaned Table Structure' as status,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'user_subscriptions'
ORDER BY ordinal_position;

-- Create or replace function to handle new user subscriptions
CREATE OR REPLACE FUNCTION handle_new_user_subscription()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_subscriptions (
        user_id,
        subscription_type,
        subscription_status
    ) VALUES (
        NEW.id,
        'free',
        'active'
    ) ON CONFLICT (user_id) DO UPDATE
    SET updated_at = now();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure trigger exists for new users
DROP TRIGGER IF EXISTS on_auth_user_created_subscription ON auth.users;
CREATE TRIGGER on_auth_user_created_subscription
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user_subscription();

-- Final message
DO $$
BEGIN
    RAISE NOTICE '✅ Successfully cleaned user_subscriptions table';
    RAISE NOTICE '✅ Removed duplicate columns: status, subscription_level, tier, is_active';
    RAISE NOTICE '✅ Standardized on: subscription_status and subscription_type';
    RAISE NOTICE '✅ Added check constraints for valid values';
    RAISE NOTICE '✅ Table is now clean and consistent';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Standard columns now:';
    RAISE NOTICE '  - subscription_status: active, inactive, canceled, past_due, trialing, paused';
    RAISE NOTICE '  - subscription_type: free, basic, pro, premium, enterprise, trial';
END $$;