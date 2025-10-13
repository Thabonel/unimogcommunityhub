-- WIS Pilot Inserts (FIXED - uses correct UNIQUE constraints)
-- Run in Supabase Studio SQL editor.
--
-- FIXES:
-- - wis_procedures now uses source_fingerprint (has UNIQUE constraint)
-- - wis_service_bulletins uses bulletin_number (already correct)
-- - wis_parts uses mercedes_part_number (already correct)

-- ============================================================================
-- 1) Procedure: 25.20.02
-- Uses source_fingerprint for idempotent upserts (UNIQUE constraint exists)
-- ============================================================================
WITH upd AS (
  UPDATE public.wis_procedures
  SET
    title = 'Unimog 400 - Engine Oil Change',
    description = 'Engine oil change procedure for Unimog 400 series.',
    overview = 'Imported via pilot staging.',
    status = 'active',
    procedure_code = '25.20.02',
    updated_at = now()
  WHERE source_fingerprint = 'pilot-25.20.02'
  RETURNING id
),
ins AS (
  INSERT INTO public.wis_procedures (
    procedure_code,
    title,
    description,
    overview,
    status,
    source_fingerprint,
    source_path
  )
  SELECT
    '25.20.02',
    'Unimog 400 - Engine Oil Change',
    'Engine oil change procedure for Unimog 400 series.',
    'Imported via pilot staging.',
    'active',
    'pilot-25.20.02',
    'manual/pilot/25.20.02'
  WHERE NOT EXISTS (SELECT 1 FROM upd)
  RETURNING id
)
SELECT coalesce(
  (SELECT id FROM upd),
  (SELECT id FROM ins)
) AS procedure_id;

-- ============================================================================
-- 2) Bulletin: TSB-2020-001
-- Uses bulletin_number (UNIQUE constraint exists) ✅ Already correct
-- ============================================================================
WITH upd AS (
  UPDATE public.wis_service_bulletins
  SET
    title = 'Portal Axle Seal Leakage Update',
    description = 'Technical Service Bulletin for portal axle seal maintenance.',
    content = 'Portal axle seal leakage TSB imported via pilot. Applies to U400/U500 series Unimogs with portal axles.',
    status = 'active',
    category = 'maintenance',
    severity = 'medium'
  WHERE bulletin_number = 'TSB-2020-001'
  RETURNING id
),
ins AS (
  INSERT INTO public.wis_service_bulletins (
    bulletin_number,
    title,
    description,
    content,
    status,
    category,
    severity
  )
  SELECT
    'TSB-2020-001',
    'Portal Axle Seal Leakage Update',
    'Technical Service Bulletin for portal axle seal maintenance.',
    'Portal axle seal leakage TSB imported via pilot. Applies to U400/U500 series Unimogs with portal axles.',
    'active',
    'maintenance',
    'medium'
  WHERE NOT EXISTS (SELECT 1 FROM upd)
  RETURNING id
)
SELECT coalesce(
  (SELECT id FROM upd),
  (SELECT id FROM ins)
) AS bulletin_id;

-- ============================================================================
-- 3) Part: A4353501268
-- Uses mercedes_part_number (UNIQUE constraint exists) ✅ Already correct
-- ============================================================================
WITH upd AS (
  UPDATE public.wis_parts
  SET
    description = 'Portal Axle Seal Kit',
    category = 'seal',
    status = 'available'
  WHERE mercedes_part_number = 'A4353501268'
  RETURNING id
),
ins AS (
  INSERT INTO public.wis_parts (
    mercedes_part_number,
    description,
    category,
    status
  )
  SELECT
    'A4353501268',
    'Portal Axle Seal Kit',
    'seal',
    'available'
  WHERE NOT EXISTS (SELECT 1 FROM upd)
  RETURNING id
)
SELECT coalesce(
  (SELECT id FROM upd),
  (SELECT id FROM ins)
) AS part_id;

-- ============================================================================
-- Verification Queries (uncomment to check results)
-- ============================================================================

-- Check procedure inserted correctly
-- SELECT procedure_code, title, source_fingerprint, status
-- FROM public.wis_procedures
-- WHERE source_fingerprint = 'pilot-25.20.02';

-- Check bulletin inserted correctly
-- SELECT bulletin_number, title, severity, status
-- FROM public.wis_service_bulletins
-- WHERE bulletin_number = 'TSB-2020-001';

-- Check part inserted correctly
-- SELECT mercedes_part_number, description, category, status
-- FROM public.wis_parts
-- WHERE mercedes_part_number = 'A4353501268';

-- Count all pilot data
-- SELECT
--   (SELECT count(*) FROM wis_procedures WHERE source_fingerprint LIKE 'pilot-%') as procedures,
--   (SELECT count(*) FROM wis_service_bulletins WHERE bulletin_number LIKE 'TSB-%') as bulletins,
--   (SELECT count(*) FROM wis_parts WHERE mercedes_part_number = 'A4353501268') as parts;
