SQL MIGRATION READY FOR EXECUTION

File: docs/barry-manual-system/20251017_fix_u435_manual_parts_page_ranges.sql

What it does:
Fixes Cooling System end_page from 162 to 173 in u435_manual_parts table.
This enables Barry to find radiator removal procedure on pages 170-171.

How to execute:
1. Go to: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new
2. Copy entire contents of this SQL file
3. Paste into SQL editor
4. Click Execute
5. Should show: id=6, end_page=173

SQL Contents:
BEGIN;
CREATE TABLE u435_manual_parts_backup_20251017 AS
SELECT * FROM u435_manual_parts;
UPDATE u435_manual_parts
SET end_page = 173
WHERE id = 6 AND part_number = 6 AND slug = '06_Cooling_System';
SELECT id, part_number, slug, title, start_page, end_page
FROM u435_manual_parts
WHERE id = 6;
COMMIT;
