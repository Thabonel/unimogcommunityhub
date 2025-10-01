-- Fix Mixed PDF Content Mapping Issues
-- Problem: PDFs contain mixed content from multiple chapters
-- U435_06_Cooling_System.pdf contains oil pan content (18.8) instead of cooling system (20.8)

-- Step 1: Identify the scope of the problem
-- List all cooling system entries that are pointing to wrong content
SELECT
  term,
  page_number,
  pdf_page_number,
  chapter_filename,
  storage_url
FROM u435_manual_index
WHERE chapter_filename = 'U435_06_Cooling_System.pdf'
ORDER BY pdf_page_number;

-- Expected results show these are pointing to oil pan content instead of cooling content

-- Step 2: Emergency fix - Disable broken cooling system entries
-- This prevents Barry from returning oil pan content for cooling system queries
UPDATE u435_manual_index
SET is_active = false
WHERE chapter_filename = 'U435_06_Cooling_System.pdf'
  AND term IN ('cooling system', 'coolant pump', 'radiator', 'thermostat');

-- Add a note to track why they were disabled
UPDATE u435_manual_index
SET
  is_active = false,
  system_category = 'disabled_mixed_content'
WHERE chapter_filename = 'U435_06_Cooling_System.pdf';

-- Step 3: Check if correct cooling content exists elsewhere
-- The cooling content (20.8) might be on pages 15-17 of U435_06_Cooling_System.pdf
-- But it's mixed with other content, making it unreliable

-- Step 4: Verify the changes
SELECT
  term,
  chapter_filename,
  is_active,
  system_category
FROM u435_manual_index
WHERE term IN ('cooling system', 'coolant pump', 'radiator', 'thermostat')
ORDER BY term, is_active DESC;

-- Step 5: Create audit trail of disabled entries
INSERT INTO manual_processing_issues (
  issue_date,
  chapter_filename,
  issue_description,
  resolution_status
)
VALUES (
  NOW(),
  'U435_06_Cooling_System.pdf',
  'PDF contains oil pan content (18.8) instead of cooling system content (20.8). Pages 15-17 have some cooling content but mixed with clutch content.',
  'Entries disabled pending re-processing'
)
ON CONFLICT DO NOTHING;

-- Step 6: Summary of what Barry will now do
-- When users ask about cooling system, radiator, or thermostat:
-- Barry will respond "I don't have that specific procedure in my available manual index"
-- This is better than returning wrong oil pan procedures

-- To fully fix this issue:
-- 1. Locate the original U435 manual PDF
-- 2. Extract pages 159-162 (cooling system chapter per documentation)
-- 3. Create a clean U435_Cooling_System_Corrected.pdf with only cooling content
-- 4. Upload to Supabase storage
-- 5. Re-enable entries with correct PDF reference

-- Alternative: Check if cooling content exists in maintenance manual
SELECT
  term,
  page_number,
  chapter_filename,
  storage_url
FROM u435_manual_index
WHERE term ILIKE '%cool%'
  AND chapter_filename NOT LIKE '%06_Cooling%'
ORDER BY chapter_filename, page_number;