-- Direct SQL to create storage buckets in Supabase
-- Run this in the SQL Editor in your Supabase Dashboard

-- Enable the required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Temporarily disable RLS on storage.buckets to allow insertion
ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;

-- Delete any existing buckets with the same names (optional - uncomment if needed)
-- DELETE FROM storage.buckets WHERE name IN ('avatars', 'profile_photos', 'vehicle_photos', 'manuals', 'article_files', 'site_assets');

-- Create all required storage buckets
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

-- Create RLS policy to allow listing buckets
DROP POLICY IF EXISTS "Allow public to list buckets" ON storage.buckets;
CREATE POLICY "Allow public to list buckets" ON storage.buckets
  FOR SELECT USING (true);

-- Now set up RLS policies for storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to avoid conflicts
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

-- Create new consolidated policies
-- Allow anyone to view files in public buckets
CREATE POLICY "Anyone can view public files" ON storage.objects
  FOR SELECT USING (bucket_id IN ('avatars', 'profile_photos', 'vehicle_photos', 'article_files', 'site_assets'));

-- Allow authenticated users to upload to any bucket
CREATE POLICY "Authenticated can upload" ON storage.objects
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Allow users to update their own files (based on the owner field)
CREATE POLICY "Users can update own files" ON storage.objects
  FOR UPDATE USING (auth.uid()::text = owner);

-- Allow users to delete their own files
CREATE POLICY "Users can delete own files" ON storage.objects
  FOR DELETE USING (auth.uid()::text = owner);

-- Special policy for manuals (private bucket)
CREATE POLICY "Authenticated can view manuals" ON storage.objects
  FOR SELECT USING (bucket_id = 'manuals' AND auth.uid() IS NOT NULL);

-- Verify the buckets were created
SELECT 
  name, 
  public, 
  file_size_limit,
  created_at
FROM storage.buckets 
ORDER BY name;

-- Return success message
SELECT 'Storage buckets created successfully!' as message;