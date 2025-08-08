-- Quick fix for storage bucket creation
-- Run this in Supabase SQL Editor to fix storage initialization

-- First, disable RLS temporarily on storage.buckets table
ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;

-- Create the required buckets
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

-- Re-enable RLS
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow bucket listing
CREATE POLICY "Allow public bucket listing" ON storage.buckets
  FOR SELECT USING (true);

-- Ensure objects table has proper policies
CREATE POLICY IF NOT EXISTS "Allow public to view public bucket files" ON storage.objects
  FOR SELECT USING (bucket_id IN ('avatars', 'profile_photos', 'vehicle_photos', 'article_files', 'site_assets'));

CREATE POLICY IF NOT EXISTS "Allow authenticated to upload files" ON storage.objects
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY IF NOT EXISTS "Allow users to update own files" ON storage.objects
  FOR UPDATE USING (auth.uid()::text = owner);

CREATE POLICY IF NOT EXISTS "Allow users to delete own files" ON storage.objects
  FOR DELETE USING (auth.uid()::text = owner);

-- Return success message
SELECT 'Storage buckets created successfully!' as message;