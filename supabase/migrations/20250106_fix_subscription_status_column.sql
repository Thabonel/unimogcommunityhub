-- Fix missing subscription_status column
-- This fixes ERROR: 42703: column "subscription_status" does not exist

-- Check if the user_subscriptions table exists and add missing columns
DO $$
BEGIN
    -- First, check if the table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables 
              WHERE table_schema = 'public' 
              AND table_name = 'user_subscriptions') THEN
        
        -- Add subscription_status column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'user_subscriptions' 
                      AND column_name = 'subscription_status') THEN
            ALTER TABLE public.user_subscriptions 
            ADD COLUMN subscription_status TEXT NOT NULL DEFAULT 'active';
            RAISE NOTICE 'Added subscription_status column';
        ELSE
            RAISE NOTICE 'subscription_status column already exists';
        END IF;

        -- Add subscription_type column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'user_subscriptions' 
                      AND column_name = 'subscription_type') THEN
            ALTER TABLE public.user_subscriptions 
            ADD COLUMN subscription_type TEXT NOT NULL DEFAULT 'free';
            RAISE NOTICE 'Added subscription_type column';
        END IF;

        -- Add other potentially missing columns
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'user_subscriptions' 
                      AND column_name = 'stripe_customer_id') THEN
            ALTER TABLE public.user_subscriptions 
            ADD COLUMN stripe_customer_id TEXT;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'user_subscriptions' 
                      AND column_name = 'stripe_subscription_id') THEN
            ALTER TABLE public.user_subscriptions 
            ADD COLUMN stripe_subscription_id TEXT;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'user_subscriptions' 
                      AND column_name = 'trial_ends_at') THEN
            ALTER TABLE public.user_subscriptions 
            ADD COLUMN trial_ends_at TIMESTAMPTZ;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'user_subscriptions' 
                      AND column_name = 'current_period_start') THEN
            ALTER TABLE public.user_subscriptions 
            ADD COLUMN current_period_start TIMESTAMPTZ;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'user_subscriptions' 
                      AND column_name = 'current_period_end') THEN
            ALTER TABLE public.user_subscriptions 
            ADD COLUMN current_period_end TIMESTAMPTZ;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'user_subscriptions' 
                      AND column_name = 'cancel_at_period_end') THEN
            ALTER TABLE public.user_subscriptions 
            ADD COLUMN cancel_at_period_end BOOLEAN DEFAULT false;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'user_subscriptions' 
                      AND column_name = 'created_at') THEN
            ALTER TABLE public.user_subscriptions 
            ADD COLUMN created_at TIMESTAMPTZ DEFAULT now();
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'user_subscriptions' 
                      AND column_name = 'updated_at') THEN
            ALTER TABLE public.user_subscriptions 
            ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();
        END IF;

        RAISE NOTICE 'All columns verified/added to user_subscriptions table';

    ELSE
        -- Table doesn't exist, create it with all columns
        CREATE TABLE public.user_subscriptions (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            subscription_type TEXT NOT NULL DEFAULT 'free',
            subscription_status TEXT NOT NULL DEFAULT 'active',
            stripe_customer_id TEXT,
            stripe_subscription_id TEXT,
            trial_ends_at TIMESTAMPTZ,
            current_period_start TIMESTAMPTZ,
            current_period_end TIMESTAMPTZ,
            cancel_at_period_end BOOLEAN DEFAULT false,
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now(),
            UNIQUE(user_id)
        );
        
        RAISE NOTICE 'Created user_subscriptions table with all columns';
    END IF;
END $$;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON public.user_subscriptions(subscription_status);

-- Enable RLS
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can update own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON public.user_subscriptions;

-- Create RLS policies
CREATE POLICY "Users can view own subscription" ON public.user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" ON public.user_subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all subscriptions" ON public.user_subscriptions
    FOR ALL USING (auth.role() = 'service_role');

-- Grant permissions
GRANT ALL ON public.user_subscriptions TO authenticated;
GRANT ALL ON public.user_subscriptions TO service_role;
GRANT SELECT ON public.user_subscriptions TO anon;

-- Show the current table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'user_subscriptions'
ORDER BY ordinal_position;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Successfully fixed user_subscriptions table structure';
    RAISE NOTICE '✅ Column subscription_status is now available';
    RAISE NOTICE '✅ RLS policies have been applied';
END $$;