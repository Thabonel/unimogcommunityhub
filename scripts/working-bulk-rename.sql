-- WORKING BULK RENAME SQL - TESTED AND VERIFIED
-- Copy and paste this into Supabase SQL Editor

-- First, remove duplicate Unimog435sm.pdf files (optional)
DELETE FROM storage.objects
WHERE bucket_id = 'manuals'
  AND name IN (
    'pending_1758524857620_kutm58jzorb_Unimog435sm.pdf',
    'pending_1758576548880_ulvltbjzqp9_Unimog435sm.pdf'
  );

-- BULK RENAME: Remove pending prefixes (TESTED - THIS WORKS)
UPDATE storage.objects
SET name = regexp_replace(name, 'pending_[0-9]+_[a-zA-Z0-9]+_', '')
WHERE bucket_id = 'manuals'
  AND name LIKE 'pending_%';

-- Verify success (should return 0 remaining pending files)
SELECT COUNT(*) as remaining_pending_files
FROM storage.objects
WHERE bucket_id = 'manuals'
  AND name LIKE 'pending_%';

-- Show all cleaned filenames
SELECT name, created_at
FROM storage.objects
WHERE bucket_id = 'manuals'
ORDER BY name;