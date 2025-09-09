-- Increase avatar file size limit to handle modern phone photos
-- iPhone photos can be 5-10MB, so we'll increase to 10MB

UPDATE storage.buckets 
SET file_size_limit = 10485760  -- 10MB in bytes
WHERE id = 'avatars';

-- Also update allowed MIME types to include HEIC/HEIF (iPhone format)
UPDATE storage.buckets 
SET allowed_mime_types = ARRAY[
    'image/jpeg', 
    'image/png', 
    'image/gif', 
    'image/webp',
    'image/heic',
    'image/heif',
    'image/heic-sequence',
    'image/heif-sequence'
]
WHERE id = 'avatars';

-- Verify the change
SELECT 
    id,
    name,
    file_size_limit,
    file_size_limit / 1024 / 1024 as size_limit_mb,
    allowed_mime_types
FROM storage.buckets
WHERE id = 'avatars';