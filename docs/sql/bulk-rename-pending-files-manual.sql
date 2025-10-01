-- BULK RENAME PENDING FILES - MANUAL EXECUTION
-- Copy and paste this SQL into your Supabase SQL Editor
-- This will remove "pending_" prefixes from all uploaded PDF filenames

-- STEP 1: Preview what will be renamed (run this first to verify)
SELECT
    name as current_filename,
    CASE
        WHEN name LIKE 'pending_%' THEN
            substring(name from 'pending_[0-9]+_[^_]+_(.+)')
        ELSE name
    END as new_filename,
    'Will be renamed' as status
FROM storage.objects
WHERE bucket_id = 'manuals'
    AND name LIKE 'pending_%'
ORDER BY name;

-- STEP 2: Execute the bulk rename (uncomment and run after verifying step 1)
/*
UPDATE storage.objects
SET name = substring(name from 'pending_[0-9]+_[^_]+_(.+)')
WHERE bucket_id = 'manuals'
    AND name LIKE 'pending_%'
    AND name ~ 'pending_[0-9]+_[^_]+_.+';
*/

-- STEP 3: Verify the rename worked (uncomment and run after step 2)
/*
SELECT
    name,
    created_at,
    updated_at
FROM storage.objects
WHERE bucket_id = 'manuals'
    AND name NOT LIKE 'pending_%'
ORDER BY name;
*/

-- STEP 4: Check if any pending files remain (should return 0 rows)
/*
SELECT COUNT(*) as remaining_pending_files
FROM storage.objects
WHERE bucket_id = 'manuals'
    AND name LIKE 'pending_%';
*/