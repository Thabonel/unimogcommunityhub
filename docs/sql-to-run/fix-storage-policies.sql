-- Fix Storage Bucket Policies
-- This script addresses the RLS policy issues preventing file uploads

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create comprehensive policies for storage buckets

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

-- Additional policy for admin override on all buckets
DROP POLICY IF EXISTS "Allow admin full access to all buckets" ON storage.objects;
CREATE POLICY "Allow admin full access to all buckets"
  ON storage.objects FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE is_admin = true
    )
  );

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

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO anon;