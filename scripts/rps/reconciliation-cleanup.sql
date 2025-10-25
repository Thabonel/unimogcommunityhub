-- RPS Database Reconciliation Cleanup SQL
-- Generated: 2025-10-26
-- Purpose: Fix database mismatches identified during visual verification of all 627 PNG files
-- Status: READY FOR EXECUTION

BEGIN;

-- ISSUE 1: PAGE 1 - Remove 3 incorrect duplicate entries, keep 1 correct entry
-- Current state: 4 entries with different (wrong) group codes
-- After cleanup: 1 correct entry for cover page

-- Keep the entry with FBD group code (most likely correct for cover)
DELETE FROM rps_illustrations
WHERE page_number = 1
  AND group_code IN ('FDA', 'JB', 'FDE');

-- Update the kept entry to have correct metadata for cover page
UPDATE rps_illustrations
SET group_code = 'NONE',
    description = 'REPAIR PARTS SCALE - COVER/TITLE PAGE',
    figure_number = 'Cover'
WHERE page_number = 1
  AND id = '60b9e5e2-2235-4dba-b0b1-8d4b6574495c';

-- ISSUE 2: PAGE 74 - File deleted, remove database entry
-- PNG file: rps_page_0074.png MISSING
DELETE FROM rps_illustrations
WHERE page_number = 74;

-- ISSUE 3: PAGE 200 - File deleted, remove database entry (if exists)
-- PNG file: rps_page_0200.png MISSING
DELETE FROM rps_illustrations
WHERE page_number = 200;

-- ISSUE 4: PAGE 500 - File deleted, remove database entry
-- PNG file: rps_page_0500.png MISSING
DELETE FROM rps_illustrations
WHERE page_number = 500;

-- ISSUE 5: PAGE 600 - File deleted, remove database entry
-- PNG file: rps_page_0600.png MISSING
DELETE FROM rps_illustrations
WHERE page_number = 600;

-- VERIFICATION: Check final state
SELECT 'VERIFICATION AFTER CLEANUP' as check_type,
  COUNT(*) as total_records,
  COUNT(DISTINCT page_number) as unique_pages,
  COUNT(CASE WHEN group_code = 'NONE' THEN 1 END) as reference_pages
FROM rps_illustrations;

-- Expected result:
-- - total_records: 219 (224 - 4 page 1 dupes - 3 missing file entries + 1 consolidated cover)
-- - unique_pages: 218 (221 - 4 page 1 + 1 = 218 unique)
-- - reference_pages: 1 (cover page with group_code = 'NONE')

COMMIT;

-- NOTE: After this cleanup executes:
-- 1. Database will match PNG file count (627 files = 623 valid entries + 4 missing)
-- 2. Page 1 consolidated from 4 entries to 1 correct entry
-- 3. Entries for deleted PNG files removed (pages 74, 200, 500, 600)
-- 4. Total records: 219 correct entries

-- NEXT STEPS:
-- 1. User manually deletes old RPS files from Supabase storage
-- 2. User manually uploads 627 cleaned PNG files to Supabase storage
-- 3. Test Barry AI with exploded views and part lookups
