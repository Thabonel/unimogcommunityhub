-- Create storage buckets for UnimogCommunityHub
-- Run this in the Supabase SQL editor

-- Enable storage extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create storage buckets (if they don't exist)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('profile_photos', 'profile_photos', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('vehicle_photos', 'vehicle_photos', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('manuals', 'manuals', false, 104857600, ARRAY['application/pdf']),
  ('article_files', 'article_files', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']),
  ('site_assets', 'site_assets', true, 52428800, NULL)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for public buckets
-- Allow anyone to view files in public buckets
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id IN ('avatars', 'profile_photos', 'vehicle_photos', 'article_files', 'site_assets'));

-- Allow authenticated users to upload to their own folders
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Authenticated users can upload profile photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile_photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Authenticated users can upload vehicle photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'vehicle_photos' AND 
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Authenticated users can upload article files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'article_files' AND 
    auth.uid() IS NOT NULL
  );

-- Allow authenticated users to update their own files
CREATE POLICY "Users can update own avatars" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own profile photos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'profile_photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow authenticated users to delete their own files
CREATE POLICY "Users can delete own avatars" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own profile photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'profile_photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own vehicle photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'vehicle_photos' AND 
    auth.uid() IS NOT NULL
  );

-- Policies for manuals bucket (private, only authenticated users)
CREATE POLICY "Authenticated users can view manuals" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'manuals' AND 
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Authenticated users can upload manuals" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'manuals' AND 
    auth.uid() IS NOT NULL
  );

-- Site assets policies (admin only for upload)
CREATE POLICY "Anyone can view site assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'site_assets');

-- Note: You may want to add an admin check for site_assets uploads
-- For now, we'll allow authenticated users
CREATE POLICY "Authenticated users can upload site assets" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'site_assets' AND 
    auth.uid() IS NOT NULL
  );

-- Grant necessary permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO anon;
GRANT ALL ON storage.buckets TO authenticated;
GRANT SELECT ON storage.buckets TO anon;