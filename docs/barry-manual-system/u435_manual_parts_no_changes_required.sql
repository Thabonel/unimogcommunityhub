SELECT id, part_number, slug, title, start_page, end_page
FROM u435_manual_parts
WHERE manual_type = 'workshop'
ORDER BY part_number;
