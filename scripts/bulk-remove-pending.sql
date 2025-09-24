-- Bulk Remove "Pending" from Manual Names
-- Run this script to remove "Pending" from all manual titles and filenames

-- Update manual_chunks table
UPDATE manual_chunks
SET manual_title = REPLACE(manual_title, 'Pending ', '')
WHERE manual_title LIKE '%Pending %';

UPDATE manual_chunks
SET manual_title = REPLACE(manual_title, ' Pending', '')
WHERE manual_title LIKE '% Pending';

UPDATE manual_chunks
SET manual_title = REPLACE(manual_title, 'Pending', '')
WHERE manual_title LIKE '%Pending%' AND manual_title NOT LIKE '%Pending %' AND manual_title NOT LIKE '% Pending';

-- Update manuals table (if it has entries)
UPDATE manuals
SET title = REPLACE(title, 'Pending ', ''),
    filename = REPLACE(filename, 'Pending ', ''),
    original_filename = REPLACE(original_filename, 'Pending ', '')
WHERE title LIKE '%Pending %' OR filename LIKE '%Pending %' OR original_filename LIKE '%Pending %';

UPDATE manuals
SET title = REPLACE(title, ' Pending', ''),
    filename = REPLACE(filename, ' Pending', ''),
    original_filename = REPLACE(original_filename, ' Pending', '')
WHERE title LIKE '% Pending' OR filename LIKE '% Pending' OR original_filename LIKE '% Pending';

-- Update manual_metadata table (if it exists and has entries)
UPDATE manual_metadata
SET title = REPLACE(title, 'Pending ', ''),
    filename = REPLACE(filename, 'Pending ', '')
WHERE title LIKE '%Pending %' OR filename LIKE '%Pending %';

UPDATE manual_metadata
SET title = REPLACE(title, ' Pending', ''),
    filename = REPLACE(filename, ' Pending', '')
WHERE title LIKE '% Pending' OR filename LIKE '% Pending';

-- Update processed_manuals table (if it has entries)
UPDATE processed_manuals
SET title = REPLACE(title, 'Pending ', ''),
    filename = REPLACE(filename, 'Pending ', '')
WHERE title LIKE '%Pending %' OR filename LIKE '%Pending %';

UPDATE processed_manuals
SET title = REPLACE(title, ' Pending', ''),
    filename = REPLACE(filename, ' Pending', '')
WHERE title LIKE '% Pending' OR filename LIKE '% Pending';

-- Update pending_manual_uploads table
UPDATE pending_manual_uploads
SET title = REPLACE(title, 'Pending ', ''),
    filename = REPLACE(filename, 'Pending ', '')
WHERE title LIKE '%Pending %' OR filename LIKE '%Pending %';

UPDATE pending_manual_uploads
SET title = REPLACE(title, ' Pending', ''),
    filename = REPLACE(filename, ' Pending', '')
WHERE title LIKE '% Pending' OR filename LIKE '% Pending';

-- Show what was updated
SELECT 'manual_chunks' as table_name, COUNT(*) as updated_count
FROM manual_chunks
WHERE manual_title LIKE '%Pending%'
UNION ALL
SELECT 'manuals' as table_name, COUNT(*) as updated_count
FROM manuals
WHERE title LIKE '%Pending%' OR filename LIKE '%Pending%'
UNION ALL
SELECT 'Check Results' as table_name, 0 as updated_count;