BEGIN;

UPDATE u435_manual_parts
SET end_page = 173
WHERE id = 6 AND part_number = 6 AND slug = '06_Cooling_System';

SELECT id, part_number, slug, title, start_page, end_page
FROM u435_manual_parts
WHERE id = 6;

COMMIT;
