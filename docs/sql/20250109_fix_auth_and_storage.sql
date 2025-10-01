-- Fix Auth and Storage Issues Migration
-- This migration fixes Invalid API key errors and storage bucket issues

-- ====================================
-- 1. FIX STORAGE BUCKETS
-- ====================================

-- Temporarily disable RLS on storage.buckets table
ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;

-- Create missing storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('profile_photos', 'profile_photos', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('vehicle_photos', 'vehicle_photos', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('manuals', 'manuals', false, 104857600, ARRAY['application/pdf']),
  ('article_files', 'article_files', true, 52428800, NULL),
  ('site_assets', 'site_assets', true, 52428800, NULL)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Re-enable RLS on storage.buckets
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Create bucket policies if they don't exist
DROP POLICY IF EXISTS "Allow public bucket listing" ON storage.buckets;
CREATE POLICY "Allow public bucket listing" ON storage.buckets
  FOR SELECT USING (true);

-- ====================================
-- 2. FIX STORAGE OBJECT POLICIES
-- ====================================

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Allow public to view public bucket files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to upload files" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete own files" ON storage.objects;

-- Create new storage object policies
CREATE POLICY "Allow public to view public bucket files" ON storage.objects
  FOR SELECT USING (bucket_id IN ('avatars', 'profile_photos', 'vehicle_photos', 'article_files', 'site_assets'));

CREATE POLICY "Allow authenticated to upload files" ON storage.objects
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow users to update own files" ON storage.objects
  FOR UPDATE USING (owner = auth.uid()::text);

CREATE POLICY "Allow users to delete own files" ON storage.objects
  FOR DELETE USING (owner = auth.uid()::text);

-- ====================================
-- 3. FIX PROFILES TABLE
-- ====================================

-- Add missing columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS country VARCHAR(2),
ADD COLUMN IF NOT EXISTS language VARCHAR(5) DEFAULT 'en',
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP WITH TIME ZONE;

-- Fix profiles RLS policies
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- ====================================
-- 4. FIX USER_ACTIVITIES TABLE
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

-- Enable RLS on user_activities
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;

-- Create policies for user_activities
DROP POLICY IF EXISTS "Users can view own activities" ON user_activities;
DROP POLICY IF EXISTS "Users can insert own activities" ON user_activities;

CREATE POLICY "Users can view own activities" ON user_activities
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own activities" ON user_activities
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- ====================================
-- 5. FIX VEHICLES TABLE
-- ====================================

-- Ensure vehicles table has proper indexes and policies
CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON vehicles(user_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_created_at ON vehicles(created_at DESC);

-- Fix vehicles RLS policies
DROP POLICY IF EXISTS "Users can view own vehicles" ON vehicles;
DROP POLICY IF EXISTS "Users can insert own vehicles" ON vehicles;
DROP POLICY IF EXISTS "Users can update own vehicles" ON vehicles;
DROP POLICY IF EXISTS "Users can delete own vehicles" ON vehicles;

CREATE POLICY "Users can view own vehicles" ON vehicles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vehicles" ON vehicles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vehicles" ON vehicles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vehicles" ON vehicles
  FOR DELETE USING (auth.uid() = user_id);

-- ====================================
-- 6. CREATE USER_SUBSCRIPTIONS TABLE
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

-- Create policies
DROP POLICY IF EXISTS "Users can view own subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can update own subscriptions" ON user_subscriptions;

CREATE POLICY "Users can view own subscriptions" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- ====================================
-- 7. FIX COMMUNITY_ARTICLES TABLE
-- ====================================

-- Allow null author_id for system articles
ALTER TABLE community_articles 
ALTER COLUMN author_id DROP NOT NULL;

-- Add system flag if it doesn't exist
ALTER TABLE community_articles
ADD COLUMN IF NOT EXISTS is_system BOOLEAN DEFAULT false;

-- ====================================
-- 8. GRANT NECESSARY PERMISSIONS
-- ====================================

-- Grant usage on schemas
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;

-- Grant permissions on tables
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON storage.buckets TO anon;
GRANT ALL ON storage.buckets TO authenticated;
GRANT SELECT ON storage.objects TO anon;
GRANT ALL ON storage.objects TO authenticated;

-- Grant permissions on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ====================================
-- 9. REFRESH SCHEMA CACHE
-- ====================================

-- Notify PostgREST to reload the schema cache
NOTIFY pgrst, 'reload schema';