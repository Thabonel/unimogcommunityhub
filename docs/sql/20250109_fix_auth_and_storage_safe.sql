-- Safe Fix Auth and Storage Issues Migration
-- This version handles existing objects and type casting properly

-- ====================================
-- 1. FIX STORAGE BUCKETS (SAFE VERSION)
-- ====================================

-- Ensure storage schema exists
CREATE SCHEMA IF NOT EXISTS storage;

-- Temporarily disable RLS on storage.buckets table if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'storage' AND table_name = 'buckets') THEN
    ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create or update storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES 
  ('avatars', 'avatars', true, 52428800),
  ('profile_photos', 'profile_photos', true, 52428800),
  ('vehicle_photos', 'vehicle_photos', true, 52428800),
  ('manuals', 'manuals', false, 104857600),
  ('article_files', 'article_files', true, 52428800),
  ('site_assets', 'site_assets', true, 52428800)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit;

-- Re-enable RLS on storage.buckets
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'storage' AND table_name = 'buckets') THEN
    ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create bucket policies if they don't exist
DO $$ 
BEGIN
  -- Drop and recreate policy for bucket listing
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'buckets' AND policyname = 'Allow public bucket listing') THEN
    DROP POLICY "Allow public bucket listing" ON storage.buckets;
  END IF;
  
  CREATE POLICY "Allow public bucket listing" ON storage.buckets
    FOR SELECT USING (true);
END $$;

-- ====================================
-- 2. FIX STORAGE OBJECT POLICIES (SAFE VERSION)
-- ====================================

DO $$ 
BEGIN
  -- Drop existing policies if they exist
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Allow public to view public bucket files') THEN
    DROP POLICY "Allow public to view public bucket files" ON storage.objects;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Allow authenticated to upload files') THEN
    DROP POLICY "Allow authenticated to upload files" ON storage.objects;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Allow users to update own files') THEN
    DROP POLICY "Allow users to update own files" ON storage.objects;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Allow users to delete own files') THEN
    DROP POLICY "Allow users to delete own files" ON storage.objects;
  END IF;
END $$;

-- Create new storage object policies with proper type casting
CREATE POLICY "Allow public to view public bucket files" ON storage.objects
  FOR SELECT USING (bucket_id IN ('avatars', 'profile_photos', 'vehicle_photos', 'article_files', 'site_assets'));

CREATE POLICY "Allow authenticated to upload files" ON storage.objects
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Use proper type casting for owner comparison
CREATE POLICY "Allow users to update own files" ON storage.objects
  FOR UPDATE USING (owner IS NOT NULL AND owner = auth.uid()::text);

CREATE POLICY "Allow users to delete own files" ON storage.objects
  FOR DELETE USING (owner IS NOT NULL AND owner = auth.uid()::text);

-- ====================================
-- 3. FIX PROFILES TABLE (SAFE VERSION)
-- ====================================

-- Check if profiles table exists before altering
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    -- Add missing columns only if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'country') THEN
      ALTER TABLE profiles ADD COLUMN country VARCHAR(2);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'language') THEN
      ALTER TABLE profiles ADD COLUMN language VARCHAR(5) DEFAULT 'en';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'bio') THEN
      ALTER TABLE profiles ADD COLUMN bio TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'location') THEN
      ALTER TABLE profiles ADD COLUMN location TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'website') THEN
      ALTER TABLE profiles ADD COLUMN website TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'social_links') THEN
      ALTER TABLE profiles ADD COLUMN social_links JSONB DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'preferences') THEN
      ALTER TABLE profiles ADD COLUMN preferences JSONB DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'subscription_status') THEN
      ALTER TABLE profiles ADD COLUMN subscription_status TEXT DEFAULT 'free';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'subscription_end_date') THEN
      ALTER TABLE profiles ADD COLUMN subscription_end_date TIMESTAMP WITH TIME ZONE;
    END IF;
  END IF;
END $$;

-- Fix profiles RLS policies (safe version)
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Profiles are viewable by everyone') THEN
    DROP POLICY "Profiles are viewable by everyone" ON profiles;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can insert their own profile') THEN
    DROP POLICY "Users can insert their own profile" ON profiles;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can update own profile') THEN
    DROP POLICY "Users can update own profile" ON profiles;
  END IF;
  
  -- Create new policies
  CREATE POLICY "Profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

  CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

  CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);
END $$;

-- ====================================
-- 4. FIX USER_ACTIVITIES TABLE (SAFE VERSION)
-- ====================================

-- Create user_activities table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  event_type TEXT NOT NULL,
  event_data JSONB,
  page TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_activities if not already enabled
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;

-- Create policies for user_activities (safe version)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_activities' AND policyname = 'Users can view own activities') THEN
    DROP POLICY "Users can view own activities" ON user_activities;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_activities' AND policyname = 'Users can insert own activities') THEN
    DROP POLICY "Users can insert own activities" ON user_activities;
  END IF;
  
  CREATE POLICY "Users can view own activities" ON user_activities
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

  CREATE POLICY "Users can insert own activities" ON user_activities
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
END $$;

-- ====================================
-- 5. FIX VEHICLES TABLE (SAFE VERSION)
-- ====================================

-- Ensure vehicles table has proper indexes and policies
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'vehicles') THEN
    -- Create indexes if they don't exist
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND tablename = 'vehicles' AND indexname = 'idx_vehicles_user_id') THEN
      CREATE INDEX idx_vehicles_user_id ON vehicles(user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND tablename = 'vehicles' AND indexname = 'idx_vehicles_created_at') THEN
      CREATE INDEX idx_vehicles_created_at ON vehicles(created_at DESC);
    END IF;
    
    -- Drop existing policies if they exist
    IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'vehicles' AND policyname = 'Users can view own vehicles') THEN
      DROP POLICY "Users can view own vehicles" ON vehicles;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'vehicles' AND policyname = 'Users can insert own vehicles') THEN
      DROP POLICY "Users can insert own vehicles" ON vehicles;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'vehicles' AND policyname = 'Users can update own vehicles') THEN
      DROP POLICY "Users can update own vehicles" ON vehicles;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'vehicles' AND policyname = 'Users can delete own vehicles') THEN
      DROP POLICY "Users can delete own vehicles" ON vehicles;
    END IF;
    
    -- Create new policies
    CREATE POLICY "Users can view own vehicles" ON vehicles
      FOR SELECT USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert own vehicles" ON vehicles
      FOR INSERT WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update own vehicles" ON vehicles
      FOR UPDATE USING (auth.uid() = user_id);

    CREATE POLICY "Users can delete own vehicles" ON vehicles
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- ====================================
-- 6. CREATE USER_SUBSCRIPTIONS TABLE (SAFE VERSION)
-- ====================================

CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies (safe version)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_subscriptions' AND policyname = 'Users can view own subscriptions') THEN
    DROP POLICY "Users can view own subscriptions" ON user_subscriptions;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_subscriptions' AND policyname = 'Users can update own subscriptions') THEN
    DROP POLICY "Users can update own subscriptions" ON user_subscriptions;
  END IF;
  
  CREATE POLICY "Users can view own subscriptions" ON user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

  CREATE POLICY "Users can update own subscriptions" ON user_subscriptions
    FOR UPDATE USING (auth.uid() = user_id);
END $$;

-- ====================================
-- 7. FIX COMMUNITY_ARTICLES TABLE (SAFE VERSION)
-- ====================================

DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_articles') THEN
    -- Allow null author_id for system articles
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_articles' AND column_name = 'author_id' AND is_nullable = 'NO') THEN
      ALTER TABLE community_articles ALTER COLUMN author_id DROP NOT NULL;
    END IF;
    
    -- Add system flag if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_articles' AND column_name = 'is_system') THEN
      ALTER TABLE community_articles ADD COLUMN is_system BOOLEAN DEFAULT false;
    END IF;
  END IF;
END $$;

-- ====================================
-- 8. GRANT NECESSARY PERMISSIONS (SAFE VERSION)
-- ====================================

-- Grant usage on schemas
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT USAGE ON SCHEMA storage TO anon, authenticated;

-- Grant permissions on all existing tables in public schema
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant permissions on storage tables if they exist
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'storage' AND table_name = 'buckets') THEN
    GRANT SELECT ON storage.buckets TO anon;
    GRANT ALL ON storage.buckets TO authenticated;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'storage' AND table_name = 'objects') THEN
    GRANT SELECT ON storage.objects TO anon;
    GRANT ALL ON storage.objects TO authenticated;
  END IF;
END $$;

-- Grant permissions on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ====================================
-- 9. FINAL VERIFICATION
-- ====================================

-- Verify critical tables exist
DO $$ 
BEGIN
  -- Check profiles table
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    RAISE NOTICE 'WARNING: profiles table does not exist';
  ELSE
    RAISE NOTICE 'SUCCESS: profiles table exists';
  END IF;
  
  -- Check user_activities table
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_activities') THEN
    RAISE NOTICE 'WARNING: user_activities table does not exist';
  ELSE
    RAISE NOTICE 'SUCCESS: user_activities table exists';
  END IF;
  
  -- Check storage.buckets table
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'storage' AND table_name = 'buckets') THEN
    RAISE NOTICE 'WARNING: storage.buckets table does not exist';
  ELSE
    RAISE NOTICE 'SUCCESS: storage.buckets table exists';
  END IF;
END $$;

-- Output success message
SELECT 'Migration completed successfully!' as status;