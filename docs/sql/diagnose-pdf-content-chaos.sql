-- Diagnose PDF Content Chaos
-- Check for content inconsistencies across all PDFs

-- Count entries per PDF to identify abnormal distributions
SELECT
  chapter_filename,
  COUNT(*) as entry_count,
  MIN(pdf_page_number) as min_page,
  MAX(pdf_page_number) as max_page,
  MAX(pdf_page_number) - MIN(pdf_page_number) + 1 as page_span
FROM u435_manual_index
GROUP BY chapter_filename
ORDER BY entry_count DESC;

-- Check for system category mismatches within same PDF
SELECT
  chapter_filename,
  system_category,
  COUNT(*) as category_count
FROM u435_manual_index
WHERE system_category IS NOT NULL
GROUP BY chapter_filename, system_category
HAVING COUNT(*) > 0
ORDER BY chapter_filename, category_count DESC;

-- Find potential cross-contamination examples
SELECT
  chapter_filename,
  term,
  pdf_page_number,
  system_category
FROM u435_manual_index
WHERE (
  (chapter_filename ILIKE '%cooling%' AND term NOT ILIKE '%cool%' AND term NOT ILIKE '%radiator%' AND term NOT ILIKE '%thermostat%')
  OR
  (chapter_filename ILIKE '%lubrication%' AND term NOT ILIKE '%oil%' AND term NOT ILIKE '%lubric%')
  OR
  (chapter_filename ILIKE '%brake%' AND term NOT ILIKE '%brake%' AND term NOT ILIKE '%pad%' AND term NOT ILIKE '%caliper%')
)
ORDER BY chapter_filename, pdf_page_number
LIMIT 20;