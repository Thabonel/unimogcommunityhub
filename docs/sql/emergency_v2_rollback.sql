-- Emergency V2 Rollback Script
-- Use this ONLY if v2 deployment causes issues
-- This will instantly revert to v1 PDFs

-- Step 1: Confirm rollback intention
DO $$
BEGIN
    RAISE NOTICE '⚠️  WARNING: This will rollback to v1 PDFs';
    RAISE NOTICE '⚠️  Make sure you understand why v2 failed before proceeding';
    -- Uncomment the next line to proceed with rollback
    -- RAISE NOTICE 'Proceeding with rollback...';
END $$;

-- Step 2: Begin rollback transaction
BEGIN;

-- Create savepoint
SAVEPOINT before_rollback;

-- Step 3: Revert storage URLs to v1
UPDATE u435_manual_index
SET
    storage_url = REPLACE(storage_url, '/manuals/v2/', '/manuals/'),
    pdf_version = '1.0',
    last_validated = NOW(),
    validation_status = 'rolled_back'
WHERE storage_url LIKE '%/v2/%';

-- Step 4: Verify rollback
DO $$
DECLARE
    v1_count INTEGER;
    v2_count INTEGER;
    expected_v1 INTEGER := 317;
BEGIN
    -- Count v1 entries
    SELECT COUNT(*) INTO v1_count
    FROM u435_manual_index
    WHERE storage_url LIKE '%/manuals/%'
      AND storage_url NOT LIKE '%/v2/%';

    -- Count remaining v2 entries (should be 0)
    SELECT COUNT(*) INTO v2_count
    FROM u435_manual_index
    WHERE storage_url LIKE '%/v2/%';

    IF v2_count > 0 THEN
        RAISE EXCEPTION 'Rollback incomplete: % entries still point to v2', v2_count;
    END IF;

    IF v1_count != expected_v1 THEN
        RAISE WARNING 'Expected % v1 entries, found %', expected_v1, v1_count;
    END IF;

    RAISE NOTICE '✅ Rollback successful: % entries reverted to v1', v1_count;
END $$;

-- Step 5: Re-apply any critical fixes (e.g., disable broken cooling entries)
UPDATE u435_manual_index
SET is_active = false
WHERE chapter_filename = 'U435_06_Cooling_System.pdf'
  AND term IN ('cooling system', 'coolant pump', 'radiator', 'thermostat');

-- Commit rollback
COMMIT;

-- Step 6: Log rollback
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
    'manual_pdf_rollback',
    NOW(),
    current_user,
    '1.0',
    'rollback',
    'Emergency rollback from v2 to v1 PDFs'
) ON CONFLICT DO NOTHING;

-- Step 7: Purge CDN cache (manual step required)
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '📢 IMPORTANT: Manual CDN cache purge required!';
    RAISE NOTICE '   Run: SELECT purge_cdn_cache(''manuals/*'');';
    RAISE NOTICE '   Or purge via Supabase dashboard';
    RAISE NOTICE '';
END $$;

-- Final status check
SELECT
    'Rollback Summary' as metric,
    COUNT(*) as total_entries,
    COUNT(CASE WHEN storage_url NOT LIKE '%/v2/%' THEN 1 END) as v1_entries,
    COUNT(CASE WHEN storage_url LIKE '%/v2/%' THEN 1 END) as v2_entries,
    COUNT(CASE WHEN is_active THEN 1 END) as active_entries,
    CASE
        WHEN COUNT(CASE WHEN storage_url LIKE '%/v2/%' THEN 1 END) = 0
        THEN '✅ ROLLBACK COMPLETE'
        ELSE '❌ ROLLBACK FAILED'
    END as status
FROM u435_manual_index;