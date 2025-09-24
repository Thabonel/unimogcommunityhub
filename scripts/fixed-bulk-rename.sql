-- CORRECTED BULK RENAME SQL
-- Run this in your Supabase SQL Editor

-- First, delete the duplicate Unimog435sm.pdf files (keep only the first one)
DELETE FROM storage.objects
WHERE bucket_id = 'manuals'
  AND name IN (
    'pending_1758524857620_kutm58jzorb_Unimog435sm.pdf',
    'pending_1758576548880_ulvltbjzqp9_Unimog435sm.pdf'
  );

-- Now rename all pending files - CORRECTED VERSION
UPDATE storage.objects
SET name = regexp_replace(name, '^pending_[0-9]+_[a-zA-Z0-9]+_', '')
WHERE bucket_id = 'manuals'
  AND name LIKE 'pending_%';

-- Verify the rename worked (should return 0)
SELECT COUNT(*) as remaining_pending_files
FROM storage.objects
WHERE bucket_id = 'manuals'
  AND name LIKE 'pending_%';

-- Show the cleaned up filenames
SELECT name, created_at
FROM storage.objects
WHERE bucket_id = 'manuals'
  AND name NOT LIKE 'pending_%'
ORDER BY name;