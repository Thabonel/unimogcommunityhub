-- Fix Barry Search Priority Issue
-- This update ensures maintenance questions return maintenance manual results
-- and repair questions return repair manual results

-- UPDATE: Set maintenance manual entries to priority 70 (higher than repair priority 50)
UPDATE u435_manual_index
SET search_priority = 70
WHERE chapter_filename LIKE 'U435_Maint_%';

-- VERIFICATION: Check the priority distribution after update
-- This query shows the count of entries by priority level
SELECT
  search_priority,
  CASE
    WHEN chapter_filename LIKE 'U435_Maint_%' THEN 'Maintenance'
    ELSE 'Repair'
  END as manual_type,
  COUNT(*) as entry_count
FROM u435_manual_index
GROUP BY search_priority, manual_type
ORDER BY search_priority DESC, manual_type;

-- TEST CASE: Check specific "oil change" entries after update
SELECT
  term,
  chapter_filename,
  search_priority,
  page_number,
  CASE
    WHEN chapter_filename LIKE 'U435_Maint_%' THEN 'Maintenance'
    ELSE 'Repair'
  END as manual_type
FROM u435_manual_index
WHERE term = 'oil change'
ORDER BY search_priority DESC, page_number;