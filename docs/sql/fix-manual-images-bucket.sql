-- Fix manual-images bucket to be public and set proper limits
UPDATE storage.buckets
SET
  public = true,
  file_size_limit = 10485760,  -- 10MB limit
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
WHERE id = 'manual-images';

-- Verify the fix
SELECT
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE name IN ('manuals', 'manual-images');