-- Complete SQL to fix storage buckets - RUN THIS ENTIRE SCRIPT
-- Do not run partial sections - copy and paste everything below

-- Step 1: Create buckets first
ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;

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

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Step 2: Create bucket listing policy
DROP POLICY IF EXISTS "Allow public to list buckets" ON storage.buckets;
CREATE POLICY "Allow public to list buckets" ON storage.buckets
  FOR SELECT USING (true);

-- Step 3: Clean up ALL old policies on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop all possible existing policies (comprehensive list)
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
DROP POLICY IF EXISTS "Authenticated can view manuals" ON storage.objects;

-- Step 4: Create new clean policies
CREATE POLICY "Anyone can view public files" ON storage.objects
  FOR SELECT USING (bucket_id IN ('avatars', 'profile_photos', 'vehicle_photos', 'article_files', 'site_assets'));

CREATE POLICY "Authenticated can upload" ON storage.objects
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own files" ON storage.objects
  FOR UPDATE USING (auth.uid()::text = owner);

CREATE POLICY "Users can delete own files" ON storage.objects
  FOR DELETE USING (auth.uid()::text = owner);

CREATE POLICY "Authenticated can view manuals" ON storage.objects
  FOR SELECT USING (bucket_id = 'manuals' AND auth.uid() IS NOT NULL);

-- Step 5: Verify everything worked
SELECT 
  name as bucket_name, 
  CASE WHEN public THEN '✅ Public' ELSE '🔒 Private' END as access_type
FROM storage.buckets 
ORDER BY name;

-- Done!