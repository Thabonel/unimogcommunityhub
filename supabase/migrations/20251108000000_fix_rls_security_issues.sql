-- Fix RLS Security Issues - 30 Errors from Database Linter
-- Safe migration: No impact on users or functionality

-- ============================================================================
-- STEP 1: Drop Old Backup Tables (7 tables)
-- Safe: These are dated backups from Oct-Nov 2025, not used by the app
-- ============================================================================

DROP TABLE IF EXISTS public.rps_illustrations_backup_20251020;
DROP TABLE IF EXISTS public.rps_illustrations_backup_20251027;
DROP TABLE IF EXISTS public.rps_illustrations_backup_2025_11_01;
DROP TABLE IF EXISTS public.u435_manual_parts_backup_20251017;
DROP TABLE IF EXISTS public.rps_groups_backup_illustrations_2025_11_01;

-- ============================================================================
-- STEP 2: Enable RLS on Dreamlit Schema Tables (3 tables)
-- Safe: Policies already exist, just enabling RLS to activate them
-- ============================================================================

ALTER TABLE dreamlit.error_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE dreamlit.event_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE dreamlit.version ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 3: Enable Public Read-Only RLS for System Tables
-- Safe: Users can still read data, but can't modify via API
-- Edge functions use service role key and bypass RLS
-- ============================================================================

-- Barry AI System Tables
ALTER TABLE public.answer_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_only" ON public.answer_cache FOR SELECT USING (true);

ALTER TABLE public.rps_synonym_suggestions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_only" ON public.rps_synonym_suggestions FOR SELECT USING (true);

ALTER TABLE public.rps_component_synonyms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_only" ON public.rps_component_synonyms FOR SELECT USING (true);

ALTER TABLE public.rps_components ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_only" ON public.rps_components FOR SELECT USING (true);

-- WIS/Document Tables
ALTER TABLE public.wis_properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_only" ON public.wis_properties FOR SELECT USING (true);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_only" ON public.documents FOR SELECT USING (true);

ALTER TABLE public.document_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_only" ON public.document_content FOR SELECT USING (true);

ALTER TABLE public.document_index ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_only" ON public.document_index FOR SELECT USING (true);

-- Ontology Tables (Barry Knowledge Base)
ALTER TABLE public.components ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_only" ON public.components FOR SELECT USING (true);

ALTER TABLE public.component_synonyms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_only" ON public.component_synonyms FOR SELECT USING (true);

ALTER TABLE public.attributes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_only" ON public.attributes FOR SELECT USING (true);

ALTER TABLE public.attribute_synonyms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_only" ON public.attribute_synonyms FOR SELECT USING (true);

ALTER TABLE public.component_task_refs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_only" ON public.component_task_refs FOR SELECT USING (true);

-- Admin/Logging Tables
ALTER TABLE public.reference_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_only" ON public.reference_requests FOR SELECT USING (true);

ALTER TABLE public.validation_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_only" ON public.validation_reports FOR SELECT USING (true);

-- PostGIS System Table
ALTER TABLE public.spatial_ref_sys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_only" ON public.spatial_ref_sys FOR SELECT USING (true);

-- ============================================================================
-- VERIFICATION QUERIES
-- Run these after migration to confirm all issues are fixed:
-- ============================================================================

-- Check for tables with RLS disabled (should return 0 rows):
-- SELECT schemaname, tablename FROM pg_tables
-- WHERE schemaname IN ('public', 'dreamlit')
-- AND rowsecurity = false
-- AND tablename NOT LIKE '%backup%';

-- Check for policies without RLS enabled (should return 0 rows):
-- SELECT schemaname, tablename FROM pg_policies
-- WHERE schemaname IN ('public', 'dreamlit')
-- AND tablename NOT IN (
--   SELECT tablename FROM pg_tables WHERE rowsecurity = true
-- );
