-- Fix Row Level Security policies for community_articles and profiles

-- First, ensure RLS is enabled on the tables
ALTER TABLE community_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies on community_articles if they exist
DROP POLICY IF EXISTS "Public articles are viewable by everyone" ON community_articles;
DROP POLICY IF EXISTS "Authors can create articles" ON community_articles;
DROP POLICY IF EXISTS "Authors can update own articles" ON community_articles;
DROP POLICY IF EXISTS "Authors can delete own articles" ON community_articles;
DROP POLICY IF EXISTS "Enable read access for all users" ON community_articles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON community_articles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON community_articles;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON community_articles;

-- Create new policies for community_articles
-- Allow everyone to read approved articles
CREATE POLICY "Anyone can read approved articles" ON community_articles
  FOR SELECT
  USING (is_approved = true OR auth.uid() = author_id);

-- Allow authenticated users to create articles
CREATE POLICY "Authenticated users can create articles" ON community_articles
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Allow users to update their own articles
CREATE POLICY "Users can update own articles" ON community_articles
  FOR UPDATE
  USING (auth.uid() = author_id);

-- Allow users to delete their own articles
CREATE POLICY "Users can delete own articles" ON community_articles
  FOR DELETE
  USING (auth.uid() = author_id);

-- Fix profiles table policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Create comprehensive policies for profiles
CREATE POLICY "Anyone can view profiles" ON profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile" ON profiles
  FOR DELETE
  USING (auth.uid() = id);

-- Ensure the profile_photos bucket exists and has proper policies
-- This needs to be done in the Supabase dashboard under Storage policies

-- Return success message
SELECT 'RLS policies updated successfully' as message;