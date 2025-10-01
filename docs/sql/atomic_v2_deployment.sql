-- Atomic V2 Deployment Script
-- This script performs zero-downtime cutover to v2 PDFs
-- Run this ONLY after all v2 PDFs are uploaded and validated

-- Step 1: Pre-deployment validation
DO $$
DECLARE
    v1_count INTEGER;
    expected_count INTEGER := 317;
BEGIN
    -- Count current entries
    SELECT COUNT(*) INTO v1_count
    FROM u435_manual_index
    WHERE storage_url LIKE '%/manuals/%'
      AND storage_url NOT LIKE '%/v2/%';

    -- Verify we have the expected number
    IF v1_count != expected_count THEN
        RAISE EXCEPTION 'Expected % entries, found %. Aborting deployment.', expected_count, v1_count;
    END IF;

    RAISE NOTICE '✅ Pre-deployment check passed: % entries ready for migration', v1_count;
END $$;

-- Step 2: Create backup table
CREATE TABLE IF NOT EXISTS u435_manual_index_v1_backup AS
SELECT * FROM u435_manual_index;

-- Step 3: Add version tracking column
ALTER TABLE u435_manual_index
ADD COLUMN IF NOT EXISTS pdf_version VARCHAR(10) DEFAULT '1.0',
ADD COLUMN IF NOT EXISTS pdf_sha256 VARCHAR(64),
ADD COLUMN IF NOT EXISTS last_validated TIMESTAMP,
ADD COLUMN IF NOT EXISTS validation_status VARCHAR(20) DEFAULT 'pending';

-- Step 4: Begin atomic cutover
BEGIN;

-- Create savepoint for rollback
SAVEPOINT before_v2_cutover;

-- Update all storage URLs to v2
UPDATE u435_manual_index
SET
    storage_url = REPLACE(storage_url, '/manuals/U435_', '/manuals/v2/U435_'),
    storage_url = REPLACE(storage_url, '/manuals/09_', '/manuals/v2/09_'),
    storage_url = REPLACE(storage_url, '/manuals/25_', '/manuals/v2/25_'),
    storage_url = REPLACE(storage_url, '/manuals/29_', '/manuals/v2/29_'),
    storage_url = REPLACE(storage_url, '/manuals/32_', '/manuals/v2/32_'),
    storage_url = REPLACE(storage_url, '/manuals/33_', '/manuals/v2/33_'),
    storage_url = REPLACE(storage_url, '/manuals/35_', '/manuals/v2/35_'),
    storage_url = REPLACE(storage_url, '/manuals/40_', '/manuals/v2/40_'),
    storage_url = REPLACE(storage_url, '/manuals/42_', '/manuals/v2/42_'),
    storage_url = REPLACE(storage_url, '/manuals/43_', '/manuals/v2/43_'),
    storage_url = REPLACE(storage_url, '/manuals/46_', '/manuals/v2/46_'),
    pdf_version = '2.0',
    last_validated = NOW(),
    validation_status = 'migrated',
    is_active = true  -- Re-enable all entries
WHERE storage_url LIKE '%/manuals/%'
  AND storage_url NOT LIKE '%/v2/%';

-- Verify update count
DO $$
DECLARE
    updated_count INTEGER;
    expected_updates INTEGER := 317;
BEGIN
    SELECT COUNT(*) INTO updated_count
    FROM u435_manual_index
    WHERE storage_url LIKE '%/v2/%'
      AND pdf_version = '2.0';

    IF updated_count != expected_updates THEN
        RAISE EXCEPTION 'Expected % updates, got %. Rolling back.', expected_updates, updated_count;
    END IF;

    RAISE NOTICE '✅ Successfully updated % entries to v2', updated_count;
END $$;

-- Step 5: Validate critical entries
DO $$
DECLARE
    cooling_check INTEGER;
    lubrication_check INTEGER;
    brakes_check INTEGER;
BEGIN
    -- Check cooling system entries point to v2
    SELECT COUNT(*) INTO cooling_check
    FROM u435_manual_index
    WHERE term IN ('cooling system', 'radiator', 'thermostat')
      AND storage_url LIKE '%/v2/U435_06_Cooling_System.pdf%'
      AND is_active = true;

    IF cooling_check < 3 THEN
        RAISE EXCEPTION 'Cooling system entries not properly migrated. Rolling back.';
    END IF;

    -- Check lubrication entries
    SELECT COUNT(*) INTO lubrication_check
    FROM u435_manual_index
    WHERE term IN ('oil pump', 'oil filter', 'oil pan')
      AND storage_url LIKE '%/v2/U435_05_Lubrication.pdf%'
      AND is_active = true;

    IF lubrication_check < 2 THEN
        RAISE EXCEPTION 'Lubrication entries not properly migrated. Rolling back.';
    END IF;

    RAISE NOTICE '✅ Critical entries validated successfully';
END $$;

-- Commit the transaction
COMMIT;

-- Step 6: Create canary view for monitoring
CREATE OR REPLACE VIEW v2_deployment_monitor AS
SELECT
    pdf_version,
    COUNT(*) as entry_count,
    COUNT(CASE WHEN is_active THEN 1 END) as active_count,
    COUNT(CASE WHEN storage_url LIKE '%/v2/%' THEN 1 END) as v2_count,
    MIN(last_validated) as earliest_validation,
    MAX(last_validated) as latest_validation
FROM u435_manual_index
GROUP BY pdf_version;

-- Step 7: Log deployment
INSERT INTO deployment_log (
    deployment_id,
    deployment_type,
    deployed_at,
    deployed_by,
    version,
    status,
    notes
) VALUES (
    gen_random_uuid(),
    'manual_pdf_v2',
    NOW(),
    current_user,
    '2.0',
    'success',
    'Atomic cutover from v1 to v2 PDFs with anchor validation'
) ON CONFLICT DO NOTHING;

-- Final validation query
SELECT
    'Deployment Summary' as metric,
    COUNT(*) as total_entries,
    COUNT(CASE WHEN storage_url LIKE '%/v2/%' THEN 1 END) as v2_entries,
    COUNT(CASE WHEN is_active THEN 1 END) as active_entries,
    CASE
        WHEN COUNT(*) = COUNT(CASE WHEN storage_url LIKE '%/v2/%' THEN 1 END)
        THEN '✅ DEPLOYMENT SUCCESSFUL'
        ELSE '❌ DEPLOYMENT INCOMPLETE'
    END as status
FROM u435_manual_index;