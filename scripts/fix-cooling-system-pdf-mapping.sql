-- Fix Cooling System PDF Mapping Issue
-- Problem: U435_06_Cooling_System.pdf contains oil pan content instead of cooling system content
-- Solution: Identify the correct PDF file containing cooling system content and update mappings

-- Step 1: Identify all entries pointing to the wrong cooling system PDF
SELECT
  term,
  page_number,
  pdf_page_number,
  chapter_filename,
  storage_url
FROM u435_manual_index
WHERE chapter_filename = 'U435_06_Cooling_System.pdf'
ORDER BY pdf_page_number;

-- Expected results: These entries point to oil pan content instead of cooling system content:
-- cooling system (page 159 -> pdf page 1)
-- coolant pump (page 160 -> pdf page 2)
-- radiator (page 161 -> pdf page 3)
-- thermostat (page 162 -> pdf page 4)

-- Step 2: Find the correct cooling system content
-- Check other PDF files for actual cooling system content
-- This needs manual verification by opening PDFs

-- Step 3: Update database to point to correct PDF (PLACEHOLDER - needs correct filename)
-- UPDATE u435_manual_index
-- SET
--   chapter_filename = 'CORRECT_COOLING_SYSTEM_PDF.pdf',
--   storage_url = REPLACE(storage_url, 'U435_06_Cooling_System.pdf', 'CORRECT_COOLING_SYSTEM_PDF.pdf')
-- WHERE chapter_filename = 'U435_06_Cooling_System.pdf';

-- Step 4: Verify the fix by checking updated entries
-- SELECT term, chapter_filename, storage_url
-- FROM u435_manual_index
-- WHERE term IN ('cooling system', 'radiator', 'thermostat', 'coolant pump');