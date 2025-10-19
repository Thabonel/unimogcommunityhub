-- 1) Core tables present
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'wis_procedures','wis_procedure_steps','wis_procedure_parts',
    'wis_parts','wis_parts_catalog',
    'wis_bulletins','wis_service_bulletins',
    'wis_chunks',
    'wis_plan_items','wis_ingest_jobs','wis_ingest_errors','wis_etl_logs','wis_schema_versions','wis_samples',
    'app_settings','ai_routing_logs','canonical_access_logs'
  )
ORDER BY 1;

-- 2) wis_procedures columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'wis_procedures'
ORDER BY ordinal_position;

-- 3) ETL provenance fields on wis_procedures
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'wis_procedures'
  AND column_name IN ('source_path','source_url','source_fingerprint');

-- 4) Constraints/Indexes for idempotency on wis_procedures
SELECT c.conname AS constraint_name, pg_get_constraintdef(c.oid) AS definition
FROM pg_constraint c
JOIN pg_class t ON c.conrelid = t.oid
JOIN pg_namespace n ON n.oid = t.relnamespace
WHERE n.nspname = 'public'
  AND t.relname = 'wis_procedures'
  AND c.contype IN ('u','x');

SELECT indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename = 'wis_procedures'
  AND indexname ILIKE '%source%';

-- 5) wis_chunks columns (chunker target)
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'wis_chunks'
ORDER BY ordinal_position;

-- 6) ETL plan/ops + samples tables present (if using gating)
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('wis_plan_items','wis_ingest_jobs','wis_ingest_errors','wis_etl_logs','wis_schema_versions','wis_samples')
ORDER BY 1;

-- 7) Functions used by search/chunker/ETL
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
    'wis_search','wis_media_url',
    'wis_upsert_plan_item','wis_create_plan_release',
    'wis_start_ingest_job','wis_update_ingest_job','wis_record_ingest_error',
    'wis_create_samples'
  )
ORDER BY 1;

-- 8) Quick counts
SELECT
  (SELECT COUNT(*) FROM public.wis_procedures) AS procedures,
  (SELECT COUNT(*) FROM public.wis_parts)      AS parts,
  (SELECT COUNT(*) FROM public.wis_bulletins)  AS bulletins,
  (SELECT COUNT(*) FROM public.wis_chunks)     AS chunks;

-- 9) Ready but unchunked candidates
SELECT p.id, p.procedure_code, p.title, p.source_url
FROM public.wis_procedures p
WHERE p.source_url IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.wis_chunks c
    WHERE c.doc_id = 'procedure_' || p.id::text
  )
ORDER BY p.created_at DESC
LIMIT 50;

SELECT b.id, b.bulletin_number, b.title
FROM public.wis_bulletins b
WHERE NOT EXISTS (
  SELECT 1 FROM public.wis_chunks c
  WHERE c.doc_id = 'bulletin_' || b.id::text
)
ORDER BY b.created_at DESC
LIMIT 50;

SELECT b.id, b.bulletin_number, b.title
FROM public.wis_service_bulletins b
WHERE NOT EXISTS (
  SELECT 1 FROM public.wis_chunks c
  WHERE c.doc_id = 'bulletin_' || b.id::text
)
ORDER BY b.created_at DESC
LIMIT 50;

-- 10) RLS policies on key tables
SELECT policyname AS policy_name,
       schemaname,
       tablename,
       cmd,
       permissive,
       roles,
       qual,
       with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('wis_procedures','wis_parts','wis_bulletins','wis_service_bulletins','wis_chunks')
ORDER BY tablename, policyname;
