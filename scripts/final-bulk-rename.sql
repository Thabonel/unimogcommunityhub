-- FINAL CORRECTED BULK RENAME SQL
-- Run this in your Supabase SQL Editor

-- Method 1: Using string functions (most reliable)
UPDATE storage.objects
SET name = SUBSTRING(name FROM POSITION('_' IN SUBSTRING(name FROM POSITION('_' IN SUBSTRING(name FROM POSITION('_' IN name) + 1)) + 1)) + LENGTH(SUBSTRING(name FROM POSITION('_' IN SUBSTRING(name FROM POSITION('_' IN name) + 1)))) + 1)
WHERE bucket_id = 'manuals'
  AND name LIKE 'pending_%';

-- If that's too complex, try this simpler approach:
-- Split by underscores and rebuild
UPDATE storage.objects
SET name = SPLIT_PART(name, '_', 4) ||
           CASE WHEN SPLIT_PART(name, '_', 5) != '' THEN '_' || SPLIT_PART(name, '_', 5) ELSE '' END ||
           CASE WHEN SPLIT_PART(name, '_', 6) != '' THEN '_' || SPLIT_PART(name, '_', 6) ELSE '' END ||
           CASE WHEN SPLIT_PART(name, '_', 7) != '' THEN '_' || SPLIT_PART(name, '_', 7) ELSE '' END ||
           CASE WHEN SPLIT_PART(name, '_', 8) != '' THEN '_' || SPLIT_PART(name, '_', 8) ELSE '' END
WHERE bucket_id = 'manuals'
  AND name LIKE 'pending_%';

-- Verify it worked
SELECT COUNT(*) as remaining_pending FROM storage.objects WHERE bucket_id = 'manuals' AND name LIKE 'pending_%';