-- Emergency Fix: Disable Broken Cooling System Entries
-- Prevents Barry from returning wrong content while we fix the underlying issue

-- Mark cooling system entries as inactive to prevent wrong search results
UPDATE u435_manual_index
SET is_active = false
WHERE chapter_filename = 'U435_06_Cooling_System.pdf'
AND term IN ('cooling system', 'coolant pump', 'radiator', 'thermostat');

-- Verify the fix
SELECT term, chapter_filename, is_active
FROM u435_manual_index
WHERE term IN ('cooling system', 'coolant pump', 'radiator', 'thermostat')
ORDER BY term;