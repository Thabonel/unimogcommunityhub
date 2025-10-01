-- Safe SQL to create storage buckets in Supabase (handles existing policies)
-- Run this in the SQL Editor in your Supabase Dashboard

-- Enable the required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Temporarily disable RLS on storage.buckets to allow insertion
ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;

-- Create all required storage buckets (or update if they exist)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('profile_photos', 'profile_photos', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('vehicle_photos', 'vehicle_photos', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('manuals', 'manuals', false, 104857600, ARRAY['application/pdf']),
  ('article_files', 'article_files', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']),
  ('site_assets', 'site_assets', true, 52428800, NULL)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Re-enable RLS on storage.buckets
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Create RLS policy to allow listing buckets (drop first to avoid conflicts)
DROP POLICY IF EXISTS "Allow public to list buckets" ON storage.buckets;
CREATE POLICY "Allow public to list buckets" ON storage.buckets
  FOR SELECT USING (true);

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Clean up ALL existing policies to avoid conflicts
DO $$ 
BEGIN
    -- Get all policies on storage.objects and drop them
    EXECUTE (
        SELECT string_agg('DROP POLICY IF EXISTS "' || policyname || '" ON storage.objects;', ' ')
        FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects'
    );
EXCEPTION
    WHEN OTHERS THEN
        -- If the query fails, manually drop known policies
        DROP POLICY IF EXISTS "Public Access" ON storage.objects;
        DROP POLICY IF EXISTS "Allow public to view public bucket files" ON storage.objects;
        DROP POLICY IF EXISTS "Allow authenticated to upload files" ON storage.objects;
        DROP POLICY IF EXISTS "Allow users to update own files" ON storage.objects;
        DROP POLICY IF EXISTS "Allow users to delete own files" ON storage.objects;
        DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
        DROP POLICY IF EXISTS "Authenticated users can upload profile photos" ON storage.objects;
        DROP POLICY IF EXISTS "Authenticated users can upload vehicle photos" ON storage.objects;
        DROP POLICY IF EXISTS "Authenticated users can upload article files" ON storage.objects;
        DROP POLICY IF EXISTS "Users can update own avatars" ON storage.objects;
        DROP POLICY IF EXISTS "Users can update own profile photos" ON storage.objects;
        DROP POLICY IF EXISTS "Users can delete own avatars" ON storage.objects;
        DROP POLICY IF EXISTS "Users can delete own profile photos" ON storage.objects;
        DROP POLICY IF EXISTS "Users can delete own vehicle photos" ON storage.objects;
        DROP POLICY IF EXISTS "Authenticated users can view manuals" ON storage.objects;
        DROP POLICY IF EXISTS "Authenticated users can upload manuals" ON storage.objects;
        DROP POLICY IF EXISTS "Anyone can view site assets" ON storage.objects;
        DROP POLICY IF EXISTS "Authenticated users can upload site assets" ON storage.objects;
        DROP POLICY IF EXISTS "Anyone can view public files" ON storage.objects;
        DROP POLICY IF EXISTS "Authenticated can upload" ON storage.objects;
        DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
        DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;
        DROP POLICY IF EXISTS "Authenticated can view manuals" ON storage.objects;
END $$;

-- Now create fresh policies
-- 1. Allow anyone to view files in public buckets
CREATE POLICY "Anyone can view public files" ON storage.objects
  FOR SELECT USING (bucket_id IN ('avatars', 'profile_photos', 'vehicle_photos', 'article_files', 'site_assets'));

-- 2. Allow authenticated users to upload to any bucket
CREATE POLICY "Authenticated can upload" ON storage.objects
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 3. Allow users to update their own files
CREATE POLICY "Users can update own files" ON storage.objects
  FOR UPDATE USING (auth.uid()::text = owner);

-- 4. Allow users to delete their own files
CREATE POLICY "Users can delete own files" ON storage.objects
  FOR DELETE USING (auth.uid()::text = owner);

-- 5. Special policy for manuals (private bucket - authenticated users only)
CREATE POLICY "Authenticated can view manuals" ON storage.objects
  FOR SELECT USING (bucket_id = 'manuals' AND auth.uid() IS NOT NULL);

-- Verify the buckets were created
SELECT 
  name, 
  CASE WHEN public THEN '✅ Public' ELSE '🔒 Private' END as access,
  pg_size_pretty(file_size_limit::bigint) as max_size,
  created_at
FROM storage.buckets 
ORDER BY name;

-- Count existing policies
SELECT COUNT(*) as policy_count, 'storage.objects' as table_name
FROM pg_policies 
WHERE schemaname = 'storage' AND tablename = 'objects';

-- Return success message
SELECT '✅ Storage buckets created/updated successfully!' as status,
       '✅ All conflicting policies removed and recreated!' as policies;