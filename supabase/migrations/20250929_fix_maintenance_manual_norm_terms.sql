-- Fix NULL norm_term values for maintenance manual entries
-- This ensures the search function can find maintenance manual entries
-- Date: 2025-09-29
-- Issue: Maintenance manual entries have NULL norm_term, preventing them from being found

-- Update all entries where norm_term is NULL to use the normalized version of their term
UPDATE u435_manual_index
SET norm_term = normalize_search_text(term)
WHERE norm_term IS NULL;

-- Specifically ensure oil change maintenance entry has correct norm_term
UPDATE u435_manual_index
SET norm_term = 'oil change'
WHERE term = 'oil change'
AND chapter_filename = 'U435_Maint_18_Engine_Lubrication.pdf';

-- Also update the full-text search column for all entries with NULL search_fts
UPDATE u435_manual_index
SET search_fts = to_tsvector('english', term)
WHERE search_fts IS NULL;