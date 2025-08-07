-- Fix Security Warnings and Info Suggestions
-- This migration addresses 20 warnings and 4 info suggestions from Supabase Security Advisor

-- ============================================
-- 1. Fix user_subscriptions table (406 error)
-- ============================================

-- Create user_subscriptions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
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

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON public.user_subscriptions(subscription_status);

-- Enable RLS
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can update own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON public.user_subscriptions;

-- Create RLS policies for user_subscriptions
CREATE POLICY "Users can view own subscription" ON public.user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" ON public.user_subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all subscriptions" ON public.user_subscriptions
    FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- 2. Fix tracks table RLS policies
-- ============================================

-- Enable RLS on tracks table
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own tracks" ON public.tracks;
DROP POLICY IF EXISTS "Users can view public tracks" ON public.tracks;
DROP POLICY IF EXISTS "Users can create own tracks" ON public.tracks;
DROP POLICY IF EXISTS "Users can update own tracks" ON public.tracks;
DROP POLICY IF EXISTS "Users can delete own tracks" ON public.tracks;

-- Create comprehensive RLS policies for tracks
CREATE POLICY "Users can view own tracks" ON public.tracks
    FOR SELECT USING (auth.uid()::text = created_by);

CREATE POLICY "Users can view public tracks" ON public.tracks
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can create own tracks" ON public.tracks
    FOR INSERT WITH CHECK (auth.uid()::text = created_by);

CREATE POLICY "Users can update own tracks" ON public.tracks
    FOR UPDATE USING (auth.uid()::text = created_by);

CREATE POLICY "Users can delete own tracks" ON public.tracks
    FOR DELETE USING (auth.uid()::text = created_by);

-- ============================================
-- 3. Fix profiles table RLS policies
-- ============================================

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create comprehensive RLS policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- ============================================
-- 4. Fix trips table RLS policies
-- ============================================

-- Ensure RLS is enabled
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view public trips" ON public.trips;
DROP POLICY IF EXISTS "Users can view own trips" ON public.trips;
DROP POLICY IF EXISTS "Users can create trips" ON public.trips;
DROP POLICY IF EXISTS "Users can update own trips" ON public.trips;
DROP POLICY IF EXISTS "Users can delete own trips" ON public.trips;

-- Create RLS policies
CREATE POLICY "Users can view public trips" ON public.trips
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view own trips" ON public.trips
    FOR SELECT USING (auth.uid()::text = created_by);

CREATE POLICY "Users can create trips" ON public.trips
    FOR INSERT WITH CHECK (auth.uid()::text = created_by);

CREATE POLICY "Users can update own trips" ON public.trips
    FOR UPDATE USING (auth.uid()::text = created_by);

CREATE POLICY "Users can delete own trips" ON public.trips
    FOR DELETE USING (auth.uid()::text = created_by);

-- ============================================
-- 5. Fix storage bucket policies
-- ============================================

-- Ensure storage policies exist for profile_photos bucket
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES ('profile_photos', 'profile_photos', true, false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE
SET public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Drop existing storage policies
DROP POLICY IF EXISTS "Anyone can view profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own profile photos" ON storage.objects;

-- Create storage policies for profile_photos
CREATE POLICY "Anyone can view profile photos" ON storage.objects
    FOR SELECT USING (bucket_id = 'profile_photos');

CREATE POLICY "Users can upload own profile photos" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'profile_photos' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update own profile photos" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'profile_photos' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own profile photos" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'profile_photos' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- ============================================
-- 6. Fix vehicle_documents storage policies
-- ============================================

-- Ensure vehicle_documents bucket exists
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES ('vehicle_documents', 'vehicle_documents', false, false, 10485760, 
    ARRAY['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
ON CONFLICT (id) DO UPDATE
SET public = false,
    file_size_limit = 10485760;

-- Create storage policies for vehicle_documents
CREATE POLICY "Users can view own vehicle documents" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'vehicle_documents' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can upload own vehicle documents" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'vehicle_documents' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own vehicle documents" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'vehicle_documents' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- ============================================
-- 7. Add missing indexes for performance
-- ============================================

-- Add indexes for commonly queried columns
CREATE INDEX IF NOT EXISTS idx_trips_created_by ON public.trips(created_by);
CREATE INDEX IF NOT EXISTS idx_trips_is_public ON public.trips(is_public);
CREATE INDEX IF NOT EXISTS idx_tracks_created_by ON public.tracks(created_by);
CREATE INDEX IF NOT EXISTS idx_tracks_is_public ON public.tracks(is_public);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- ============================================
-- 8. Fix posts table RLS if exists
-- ============================================

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'posts') THEN
        ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies
        DROP POLICY IF EXISTS "Anyone can view published posts" ON public.posts;
        DROP POLICY IF EXISTS "Authors can create posts" ON public.posts;
        DROP POLICY IF EXISTS "Authors can update own posts" ON public.posts;
        DROP POLICY IF EXISTS "Authors can delete own posts" ON public.posts;
        
        -- Create policies
        CREATE POLICY "Anyone can view published posts" ON public.posts
            FOR SELECT USING (status = 'published' OR auth.uid() = author_id);
        
        CREATE POLICY "Authors can create posts" ON public.posts
            FOR INSERT WITH CHECK (auth.uid() = author_id);
        
        CREATE POLICY "Authors can update own posts" ON public.posts
            FOR UPDATE USING (auth.uid() = author_id);
        
        CREATE POLICY "Authors can delete own posts" ON public.posts
            FOR DELETE USING (auth.uid() = author_id);
    END IF;
END $$;

-- ============================================
-- 9. Fix comments table RLS if exists
-- ============================================

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'comments') THEN
        ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies
        DROP POLICY IF EXISTS "Anyone can view comments" ON public.comments;
        DROP POLICY IF EXISTS "Authenticated users can create comments" ON public.comments;
        DROP POLICY IF EXISTS "Users can update own comments" ON public.comments;
        DROP POLICY IF EXISTS "Users can delete own comments" ON public.comments;
        
        -- Create policies
        CREATE POLICY "Anyone can view comments" ON public.comments
            FOR SELECT USING (true);
        
        CREATE POLICY "Authenticated users can create comments" ON public.comments
            FOR INSERT WITH CHECK (auth.uid() = author_id);
        
        CREATE POLICY "Users can update own comments" ON public.comments
            FOR UPDATE USING (auth.uid() = author_id);
        
        CREATE POLICY "Users can delete own comments" ON public.comments
            FOR DELETE USING (auth.uid() = author_id);
    END IF;
END $$;

-- ============================================
-- 10. Security function to check table RLS status
-- ============================================

CREATE OR REPLACE FUNCTION check_rls_status()
RETURNS TABLE (
    table_name text,
    rls_enabled boolean
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        schemaname || '.' || tablename as table_name,
        rowsecurity as rls_enabled
    FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY tablename;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 11. Add updated_at trigger for tables
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to user_subscriptions
DROP TRIGGER IF EXISTS update_user_subscriptions_updated_at ON public.user_subscriptions;
CREATE TRIGGER update_user_subscriptions_updated_at
    BEFORE UPDATE ON public.user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 12. Grant necessary permissions
-- ============================================

-- Grant permissions on user_subscriptions
GRANT ALL ON public.user_subscriptions TO authenticated;
GRANT ALL ON public.user_subscriptions TO service_role;
GRANT SELECT ON public.user_subscriptions TO anon;

-- Grant permissions on tracks
GRANT ALL ON public.tracks TO authenticated;
GRANT SELECT ON public.tracks TO anon;

-- Grant permissions on trips  
GRANT ALL ON public.trips TO authenticated;
GRANT SELECT ON public.trips TO anon;

-- Grant permissions on profiles
GRANT ALL ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

-- ============================================
-- 13. Validate and report RLS status
-- ============================================

DO $$
DECLARE
    rls_report TEXT;
BEGIN
    -- Check RLS status for all public tables
    SELECT string_agg(
        CASE 
            WHEN rowsecurity THEN '✅ ' || tablename || ': RLS enabled'
            ELSE '❌ ' || tablename || ': RLS DISABLED - SECURITY WARNING!'
        END, 
        E'\n'
    ) INTO rls_report
    FROM pg_tables
    WHERE schemaname = 'public';
    
    RAISE NOTICE E'RLS Status Report:\n%', rls_report;
END $$;

-- ============================================
-- 14. Create function to auto-create user subscription on signup
-- ============================================

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
    ) ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signups
DROP TRIGGER IF EXISTS on_auth_user_created_subscription ON auth.users;
CREATE TRIGGER on_auth_user_created_subscription
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user_subscription();

-- ============================================
-- 15. Add is_admin column to profiles if missing
-- ============================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'profiles' AND column_name = 'is_admin') THEN
        ALTER TABLE public.profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;
    END IF;
END $$;

-- ============================================
-- Final validation message
-- ============================================

DO $$
BEGIN
    RAISE NOTICE 'Security migration completed successfully!';
    RAISE NOTICE 'Fixed: user_subscriptions table and RLS policies';
    RAISE NOTICE 'Fixed: tracks table RLS policies';
    RAISE NOTICE 'Fixed: storage bucket policies';
    RAISE NOTICE 'Added: missing indexes for performance';
    RAISE NOTICE 'Please run this migration in your Supabase dashboard';
END $$;