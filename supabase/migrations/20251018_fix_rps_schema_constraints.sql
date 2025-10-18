-- Fix RPS schema to support all extracted parts data
-- Issue: Previous schema had overly strict constraints that prevented importing 46 parts

-- Step 1: Drop the problematic unique constraint on NIIN
ALTER TABLE rps_parts DROP CONSTRAINT rps_parts_niin_key;

-- Step 2: Make NIIN nullable (not all parts have NIINs)
ALTER TABLE rps_parts ALTER COLUMN niin DROP NOT NULL;

-- Step 3: Increase column lengths to accommodate actual data
ALTER TABLE rps_parts ALTER COLUMN niin TYPE VARCHAR(20);
ALTER TABLE rps_parts ALTER COLUMN nsn TYPE VARCHAR(25);
ALTER TABLE rps_parts ALTER COLUMN item_number TYPE VARCHAR(16);
ALTER TABLE rps_parts ALTER COLUMN rps_number TYPE VARCHAR(10);
ALTER TABLE rps_parts ALTER COLUMN group_code TYPE VARCHAR(5);

-- Step 4: Add composite unique constraint on (group_code, item_number)
-- This is the real identifier - unique per manual section and item position
ALTER TABLE rps_parts ADD CONSTRAINT rps_parts_group_item_unique UNIQUE (group_code, item_number);

-- Step 5: Add indexes for NIIN and NSN (for lookup when present)
CREATE INDEX IF NOT EXISTS idx_rps_parts_niin_notnull ON rps_parts(niin) WHERE niin IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_rps_parts_nsn_notnull ON rps_parts(nsn) WHERE nsn IS NOT NULL;

-- Step 6: Update rps_groups schema for consistency
ALTER TABLE rps_groups ALTER COLUMN group_code TYPE VARCHAR(5);
ALTER TABLE rps_groups ALTER COLUMN rps_number TYPE VARCHAR(10);

-- Step 7: Update rps_illustrations schema for consistency
ALTER TABLE rps_illustrations ALTER COLUMN group_code TYPE VARCHAR(5);
ALTER TABLE rps_illustrations ALTER COLUMN rps_number TYPE VARCHAR(10);

-- Step 8: Update table comment to reflect nullable NIIN
COMMENT ON COLUMN rps_parts.niin IS 'National Item Identification Number (format: XX-XXX-XXXX) - nullable for parts without military codification';
