-- Phase 7: Extend RPS tables with comprehensive 930-page index
-- Date: 2025-10-19
-- Purpose: Add page mapping fields and populate all 93 groups

-- Step 1: Add new fields to rps_groups table
ALTER TABLE rps_groups
ADD COLUMN IF NOT EXISTS illustration_pages INTEGER[],
ADD COLUMN IF NOT EXISTS parts_list_pages INTEGER[],
ADD COLUMN IF NOT EXISTS callout_range TEXT,
ADD COLUMN IF NOT EXISTS page_type TEXT CHECK (page_type IN ('single_group', 'multi_page', 'shared_and_dedicated')),
ADD COLUMN IF NOT EXISTS shared_with_groups TEXT[],
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'verified';

-- Step 2: Add CDN URL field to rps_illustrations
ALTER TABLE rps_illustrations
ADD COLUMN IF NOT EXISTS cdn_url TEXT;

-- Step 3: Create indexes for new fields
CREATE INDEX IF NOT EXISTS idx_rps_groups_illustration_pages ON rps_groups USING GIN(illustration_pages);
CREATE INDEX IF NOT EXISTS idx_rps_groups_parts_list_pages ON rps_groups USING GIN(parts_list_pages);
CREATE INDEX IF NOT EXISTS idx_rps_groups_status ON rps_groups(status);

-- Step 4: Add comments
COMMENT ON COLUMN rps_groups.illustration_pages IS 'Array of page numbers containing illustrations for this group';
COMMENT ON COLUMN rps_groups.parts_list_pages IS 'Array of page numbers containing parts lists for this group';
COMMENT ON COLUMN rps_groups.callout_range IS 'Range of callout numbers on illustrations (e.g., "1-31" or "Sheet 1: 1-24, Sheet 2: 25-50")';
COMMENT ON COLUMN rps_groups.page_type IS 'Type of page organization: single_group, multi_page, or shared_and_dedicated';
COMMENT ON COLUMN rps_groups.shared_with_groups IS 'Array of group codes that share illustrations with this group';
COMMENT ON COLUMN rps_illustrations.cdn_url IS 'Full CDN URL to the illustration PNG file';

-- Step 5: Update existing groups with comprehensive page data
-- (These will be populated via a separate data migration script using the JSON files)

-- Note: The actual data population will be done via a Node.js script that reads:
-- - scripts/rps/output/RPS_GROUP_TO_PAGES_COMPLETE.json
-- - scripts/rps/output/RPS_930_MASTER_INDEX.json
--
-- This migration only creates the schema structure.
