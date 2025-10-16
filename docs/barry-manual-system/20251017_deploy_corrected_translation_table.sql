-- Migration: Deploy corrected translation table to Supabase
-- Date: October 17, 2025
-- Purpose: Fix 5 incorrect page ranges in u435_manual_index table
-- Critical Fix: Cooling System (06) - Pages 159-173 includes radiator removal (170-171)

BEGIN;

-- Backup existing data before making changes
CREATE TABLE u435_manual_index_backup_20251017 AS
SELECT * FROM u435_manual_index;

-- Apply all 5 corrections to u435_manual_index table
UPDATE u435_manual_index SET orig_end_page = 173 WHERE section_code = '06' AND section_title = 'Cooling System';

UPDATE u435_manual_index SET orig_end_page = 128 WHERE section_code = '09' AND section_title = 'Air Filter System';

UPDATE u435_manual_index SET orig_end_page = 461 WHERE section_code = '29' AND section_title = 'Pedal Linkage';

UPDATE u435_manual_index SET orig_end_page = 616 WHERE section_code = '32' AND section_title = 'Front Suspension';

UPDATE u435_manual_index SET orig_end_page = 966 WHERE section_code = '46' AND section_title = 'Steering LS7F';

-- Verify corrections were applied
SELECT
  section_code,
  section_title,
  orig_start_page,
  orig_end_page,
  chapter_pdf_filename,
  CASE
    WHEN section_code = '06' AND orig_end_page = 173 THEN '✅ RADIATOR FIX VERIFIED'
    WHEN section_code = '09' AND orig_end_page = 128 THEN '✅ AIR FILTER FIX VERIFIED'
    WHEN section_code = '29' AND orig_end_page = 461 THEN '✅ PEDAL LINKAGE FIX VERIFIED'
    WHEN section_code = '32' AND orig_end_page = 616 THEN '✅ FRONT SUSPENSION FIX VERIFIED'
    WHEN section_code = '46' AND orig_end_page = 966 THEN '✅ STEERING LS7F FIX VERIFIED'
    ELSE '⚠️ NOT IN CORRECTION LIST'
  END as status
FROM u435_manual_index
WHERE section_code IN ('06', '09', '29', '32', '46')
ORDER BY section_code;

COMMIT;
