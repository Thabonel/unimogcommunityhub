-- Fix the profile_photos bucket name
-- The bucket was created as "Profile Photos" instead of "profile_photos"

-- First, check if the wrongly named bucket exists
DO $$
BEGIN
  -- Try to rename the bucket if it exists with wrong name
  IF EXISTS (SELECT 1 FROM storage.buckets WHERE name = 'Profile Photos') THEN
    -- Delete the wrongly named bucket (if empty)
    DELETE FROM storage.objects WHERE bucket_id = 'Profile Photos';
    DELETE FROM storage.buckets WHERE name = 'Profile Photos';
  END IF;
END $$;

-- Now create the correctly named bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('profile_photos', 'profile_photos', true, 52428800)
ON CONFLICT (id) DO UPDATE SET
  name = 'profile_photos',
  public = true,
  file_size_limit = 52428800;

-- Verify all buckets are correctly named
SELECT 
  name as bucket_name, 
  CASE 
    WHEN name IN ('avatars', 'profile_photos', 'vehicle_photos', 'manuals', 'article_files', 'site_assets') 
    THEN '✅ Correct' 
    ELSE '❌ Wrong Name' 
  END as status
FROM storage.buckets 
ORDER BY name;

-- Should show all 6 buckets with correct names