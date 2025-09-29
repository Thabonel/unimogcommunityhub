-- Emergency Fix: Disable Broken Cooling System Entries
-- Run this in Supabase SQL Editor to prevent Barry from returning wrong content
-- Date: 2025-09-28
-- Issue: U435_06_Cooling_System.pdf contains oil pan content instead of cooling system content

-- Step 1: Disable the specific broken cooling system entries
UPDATE u435_manual_index
SET is_active = false
WHERE chapter_filename = 'U435_06_Cooling_System.pdf'
AND term IN ('cooling system', 'coolant pump', 'radiator', 'thermostat');

-- Step 2: Mark all entries in this PDF as having mixed content issues
UPDATE u435_manual_index
SET system_category = 'disabled_mixed_content'
WHERE chapter_filename = 'U435_06_Cooling_System.pdf'
AND is_active = false;

-- Step 3: Verify the changes
SELECT
  term,
  chapter_filename,
  is_active,
  system_category,
  page_number,
  pdf_page_number
FROM u435_manual_index
WHERE chapter_filename = 'U435_06_Cooling_System.pdf'
ORDER BY pdf_page_number;

-- Step 4: Check if cooling content exists elsewhere in the manual
SELECT
  term,
  page_number,
  chapter_filename,
  storage_url,
  is_active
FROM u435_manual_index
WHERE term ILIKE '%cool%'
  AND chapter_filename NOT LIKE '%06_Cooling%'
  AND is_active = true
ORDER BY chapter_filename, page_number;

-- Expected result: Barry will now respond "I don't have that specific procedure"
-- for cooling system queries instead of returning wrong oil pan procedures