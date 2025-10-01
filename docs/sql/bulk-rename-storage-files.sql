-- Bulk rename pending files in Supabase Storage
-- This updates the storage.objects table directly

-- Preview the renaming operation first
SELECT
    name as old_name,
    CASE
        WHEN name LIKE 'pending_%' THEN
            -- Extract everything after the third underscore
            substring(name from 'pending_[0-9]+_[^_]+_(.+)')
        ELSE name
    END as new_name
FROM storage.objects
WHERE bucket_id = 'manuals'
    AND name LIKE 'pending_%'
ORDER BY name;

-- Uncomment the lines below to perform the actual rename
-- WARNING: This will modify the storage objects table directly

/*
-- Update the storage objects to remove pending prefix
UPDATE storage.objects
SET name = substring(name from 'pending_[0-9]+_[^_]+_(.+)')
WHERE bucket_id = 'manuals'
    AND name LIKE 'pending_%'
    AND name ~ 'pending_[0-9]+_[^_]+_.+';

-- Show the updated files
SELECT name FROM storage.objects
WHERE bucket_id = 'manuals'
ORDER BY name;
*/