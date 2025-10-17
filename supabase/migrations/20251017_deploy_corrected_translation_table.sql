-- Migration: Deploy corrected translation table to Supabase
-- Date: October 17, 2025
-- Purpose: Fix 5 incorrect page ranges in u435_manual_index table
-- Critical Fix: Cooling System (06) - Pages 159-173 includes radiator removal (170-171)

BEGIN;

-- Backup existing data before making changes
CREATE TABLE IF NOT EXISTS u435_manual_parts_backup_20251017 AS
SELECT * FROM u435_manual_parts;

-- Apply all 5 corrections to u435_manual_parts table
UPDATE u435_manual_parts SET end_page = 173 WHERE part_number = 6 AND title = 'Cooling System';

UPDATE u435_manual_parts SET end_page = 128 WHERE part_number = 9 AND title LIKE '%Air Filter%';

UPDATE u435_manual_parts SET end_page = 461 WHERE part_number = 29 AND title LIKE '%Pedal%';

UPDATE u435_manual_parts SET end_page = 616 WHERE part_number = 32 AND title LIKE '%Front Suspension%';

UPDATE u435_manual_parts SET end_page = 966 WHERE part_number = 46 AND title LIKE '%Steering%';

-- Verify corrections were applied
SELECT
  part_number,
  title,
  start_page,
  end_page,
  filename,
  CASE
    WHEN part_number = 6 AND end_page = 173 THEN '✅ RADIATOR FIX VERIFIED'
    WHEN part_number = 9 AND end_page = 128 THEN '✅ AIR FILTER FIX VERIFIED'
    WHEN part_number = 29 AND end_page = 461 THEN '✅ PEDAL LINKAGE FIX VERIFIED'
    WHEN part_number = 32 AND end_page = 616 THEN '✅ FRONT SUSPENSION FIX VERIFIED'
    WHEN part_number = 46 AND end_page = 966 THEN '✅ STEERING LS7F FIX VERIFIED'
    ELSE '⚠️ NOT IN CORRECTION LIST'
  END as status
FROM u435_manual_parts
WHERE part_number IN (6, 9, 29, 32, 46)
ORDER BY part_number;

COMMIT;
