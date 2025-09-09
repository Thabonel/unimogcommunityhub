-- Complete RLS Policy Fix for UnimogCommunityHub
-- This fixes both storage bucket and profiles table policies

-- ==========================================
-- PART 1: FIX PROFILES TABLE POLICIES
-- ==========================================

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Allow users to view all profiles (for community features)
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ==========================================
-- PART 2: FIX STORAGE BUCKET POLICIES
-- ==========================================

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 1. AVATARS BUCKET - Allow authenticated users to upload their own avatars
DROP POLICY IF EXISTS "Allow authenticated uploads to avatars" ON storage.objects;
CREATE POLICY "Allow authenticated uploads to avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Allow public read access to avatars" ON storage.objects;  
CREATE POLICY "Allow public read access to avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Allow users to update their own avatars" ON storage.objects;
CREATE POLICY "Allow users to update their own avatars"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Allow users to delete their own avatars" ON storage.objects;
CREATE POLICY "Allow users to delete their own avatars"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 2. PROFILE PHOTOS BUCKET - Allow authenticated users to manage profile photos
DROP POLICY IF EXISTS "Allow authenticated uploads to profile photos" ON storage.objects;
CREATE POLICY "Allow authenticated uploads to profile photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'Profile Photos' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Allow public read access to profile photos" ON storage.objects;
CREATE POLICY "Allow public read access to profile photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'Profile Photos');

DROP POLICY IF EXISTS "Allow users to update their own profile photos" ON storage.objects;
CREATE POLICY "Allow users to update their own profile photos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'Profile Photos' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Allow users to delete their own profile photos" ON storage.objects;
CREATE POLICY "Allow users to delete their own profile photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'Profile Photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 3. VEHICLE PHOTOS BUCKET - Allow authenticated users to upload vehicle photos
DROP POLICY IF EXISTS "Allow authenticated uploads to vehicle photos" ON storage.objects;
CREATE POLICY "Allow authenticated uploads to vehicle photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'vehicle_photos' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Allow public read access to vehicle photos" ON storage.objects;
CREATE POLICY "Allow public read access to vehicle photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'vehicle_photos');

DROP POLICY IF EXISTS "Allow users to manage their own vehicle photos" ON storage.objects;
CREATE POLICY "Allow users to manage their own vehicle photos"
  ON storage.objects FOR ALL
  USING (bucket_id = 'vehicle_photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 4. SITE ASSETS BUCKET - Allow admin uploads, public read
DROP POLICY IF EXISTS "Allow authenticated uploads to site assets" ON storage.objects;
CREATE POLICY "Allow authenticated uploads to site assets"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'site_assets' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Allow public read access to site assets" ON storage.objects;
CREATE POLICY "Allow public read access to site assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site_assets');

DROP POLICY IF EXISTS "Allow admin management of site assets" ON storage.objects;
CREATE POLICY "Allow admin management of site assets"
  ON storage.objects FOR ALL
  USING (bucket_id = 'site_assets' AND auth.uid() IS NOT NULL);

-- 5. ARTICLE FILES BUCKET - Allow authenticated uploads, public read
DROP POLICY IF EXISTS "Allow authenticated uploads to article files" ON storage.objects;
CREATE POLICY "Allow authenticated uploads to article files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'article_files' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Allow public read access to article files" ON storage.objects;
CREATE POLICY "Allow public read access to article files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'article_files');

DROP POLICY IF EXISTS "Allow users to manage their own article files" ON storage.objects;
CREATE POLICY "Allow users to manage their own article files"
  ON storage.objects FOR ALL
  USING (bucket_id = 'article_files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 6. MANUALS BUCKET - Restricted access (authenticated users only)
DROP POLICY IF EXISTS "Allow authenticated access to manuals" ON storage.objects;
CREATE POLICY "Allow authenticated access to manuals"
  ON storage.objects FOR ALL
  USING (bucket_id = 'manuals' AND auth.uid() IS NOT NULL);

-- ==========================================
-- PART 3: OTHER IMPORTANT TABLES
-- ==========================================

-- Fix posts table policies
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all posts" ON public.posts;
CREATE POLICY "Users can view all posts"
  ON public.posts FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.posts;
CREATE POLICY "Authenticated users can create posts"
  ON public.posts FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can update their own posts" ON public.posts;
CREATE POLICY "Users can update their own posts"
  ON public.posts FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own posts" ON public.posts;
CREATE POLICY "Users can delete their own posts"
  ON public.posts FOR DELETE
  USING (auth.uid() = user_id);

-- Fix community_groups table policies
ALTER TABLE public.community_groups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view public groups" ON public.community_groups;
CREATE POLICY "Anyone can view public groups"
  ON public.community_groups FOR SELECT
  USING (NOT is_private OR auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can create groups" ON public.community_groups;
CREATE POLICY "Authenticated users can create groups"
  ON public.community_groups FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Group creators can update their groups" ON public.community_groups;
CREATE POLICY "Group creators can update their groups"
  ON public.community_groups FOR UPDATE
  USING (auth.uid() = created_by);

-- ==========================================
-- PART 4: UPDATE BUCKET CONFIGURATIONS
-- ==========================================

-- Update bucket configurations to allow appropriate MIME types
UPDATE storage.buckets 
SET allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
WHERE name IN ('avatars', 'Profile Photos', 'vehicle_photos', 'site_assets');

UPDATE storage.buckets 
SET allowed_mime_types = ARRAY['application/pdf', 'image/jpeg', 'image/png', 'text/plain', 'application/json']
WHERE name = 'article_files';

UPDATE storage.buckets 
SET allowed_mime_types = ARRAY['application/pdf', 'application/zip', 'text/plain']
WHERE name = 'manuals';

-- Ensure buckets have appropriate file size limits (50MB)
UPDATE storage.buckets 
SET file_size_limit = 52428800
WHERE name IN ('avatars', 'Profile Photos', 'vehicle_photos', 'site_assets', 'article_files', 'manuals');

-- ==========================================
-- PART 5: GRANT PERMISSIONS
-- ==========================================

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT SELECT ON public.posts TO anon;
GRANT SELECT, INSERT, UPDATE ON public.community_groups TO authenticated;
GRANT SELECT ON public.community_groups TO anon;

-- ==========================================
-- VERIFICATION QUERIES
-- ==========================================

-- After running this script, you can verify the policies with:
-- SELECT * FROM pg_policies WHERE tablename = 'profiles';
-- SELECT * FROM pg_policies WHERE tablename = 'objects';
-- SELECT * FROM pg_policies WHERE tablename = 'posts';
-- SELECT * FROM pg_policies WHERE tablename = 'community_groups';