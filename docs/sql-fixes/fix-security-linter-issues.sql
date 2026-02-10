-- Fix Supabase Security Linter Issues
-- Date: 2026-02-10
-- Issues: 6 Security Definer Views + 4 Tables without RLS

BEGIN;

-- =====================================================
-- PART 1: Fix Security Definer Views (6 issues)
-- =====================================================

-- These views currently use SECURITY DEFINER which executes with creator's privileges
-- We'll change them to SECURITY INVOKER for better security

-- 1. Fix barry_openclaw_metrics_summary
DROP VIEW IF EXISTS public.barry_openclaw_metrics_summary;
CREATE VIEW public.barry_openclaw_metrics_summary
WITH (security_invoker = true) AS
SELECT
  COUNT(*) as total_requests,
  AVG(confidence_score) as avg_confidence,
  COUNT(CASE WHEN status = 'success' THEN 1 END) as successful_requests,
  COUNT(CASE WHEN status = 'error' THEN 1 END) as failed_requests,
  DATE_TRUNC('day', created_at) as request_date
FROM barry_openclaw_logs
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY request_date DESC;

-- 2. Fix barry_knowledge_analytics
DROP VIEW IF EXISTS public.barry_knowledge_analytics;
CREATE VIEW public.barry_knowledge_analytics
WITH (security_invoker = true) AS
SELECT
  kb.id,
  kb.question_hash,
  kb.answer,
  kb.confidence_score,
  kb.created_at,
  COUNT(bf.id) as feedback_count,
  AVG(CASE WHEN bf.is_positive THEN 1.0 ELSE 0.0 END) as positive_feedback_ratio
FROM barry_knowledge_base kb
LEFT JOIN barry_answer_feedback bf ON kb.id = bf.knowledge_base_id
GROUP BY kb.id, kb.question_hash, kb.answer, kb.confidence_score, kb.created_at;

-- 3. Fix barry_skill_execution_stats
DROP VIEW IF EXISTS public.barry_skill_execution_stats;
CREATE VIEW public.barry_skill_execution_stats
WITH (security_invoker = true) AS
SELECT
  skill_name,
  COUNT(*) as execution_count,
  AVG(execution_time_ms) as avg_execution_time,
  COUNT(CASE WHEN status = 'success' THEN 1 END) as success_count,
  COUNT(CASE WHEN status = 'error' THEN 1 END) as error_count,
  MAX(created_at) as last_execution
FROM barry_skill_logs
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY skill_name
ORDER BY execution_count DESC;

-- 4. Fix vw_recent_wis_properties
DROP VIEW IF EXISTS public.vw_recent_wis_properties;
CREATE VIEW public.vw_recent_wis_properties
WITH (security_invoker = true) AS
SELECT
  wp.id,
  wp.property_name,
  wp.property_value,
  wp.model_code,
  wp.updated_at,
  wm.model_name
FROM wis_properties wp
JOIN wis_models wm ON wp.model_code = wm.model_code
WHERE wp.updated_at >= NOW() - INTERVAL '30 days'
ORDER BY wp.updated_at DESC
LIMIT 1000;

-- 5. Fix vw_pending_synonyms
DROP VIEW IF EXISTS public.vw_pending_synonyms;
CREATE VIEW public.vw_pending_synonyms
WITH (security_invoker = true) AS
SELECT
  rs.id,
  rs.original_term,
  rs.suggested_synonym,
  rs.confidence_score,
  rs.created_at,
  rs.status
FROM rps_synonyms rs
WHERE rs.status = 'pending'
  AND rs.created_at >= NOW() - INTERVAL '90 days'
ORDER BY rs.confidence_score DESC, rs.created_at DESC;

-- 6. Fix wis_documents_unified
DROP VIEW IF EXISTS public.wis_documents_unified;
CREATE VIEW public.wis_documents_unified
WITH (security_invoker = true) AS
SELECT
  wd.id,
  wd.document_type,
  wd.title,
  wd.content,
  wd.model_code,
  wd.language_code,
  wd.created_at,
  wm.model_name,
  wm.series
FROM wis_documents wd
LEFT JOIN wis_models wm ON wd.model_code = wm.model_code
WHERE wd.is_active = true
ORDER BY wd.created_at DESC;

-- =====================================================
-- PART 2: Fix Tables without RLS (4 issues)
-- =====================================================

-- 1. Move backup tables to backup schema (recommended approach)
CREATE SCHEMA IF NOT EXISTS backup;

-- Move backup tables to backup schema to remove from public access
ALTER TABLE IF EXISTS public.manual_chunks_rps_phantom_backup
SET SCHEMA backup;

ALTER TABLE IF EXISTS public.rps_groups_backup_20260118
SET SCHEMA backup;

ALTER TABLE IF EXISTS public.manual_chunks_backup_20260126
SET SCHEMA backup;

-- 2. Handle spatial_ref_sys (PostGIS system table)
-- This is a system table that should not have RLS - move to extensions schema
CREATE SCHEMA IF NOT EXISTS extensions;
ALTER TABLE IF EXISTS public.spatial_ref_sys SET SCHEMA extensions;

-- =====================================================
-- PART 3: Add RLS policies to views (if needed)
-- =====================================================

-- Ensure RLS is enabled on any tables that these views depend on
-- (This is defensive - most should already have RLS)

-- Enable RLS on barry tables if not already enabled
ALTER TABLE barry_openclaw_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE barry_knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE barry_answer_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE barry_skill_logs ENABLE ROW LEVEL SECURITY;

-- Enable RLS on wis tables if not already enabled
ALTER TABLE wis_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE wis_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE wis_documents ENABLE ROW LEVEL SECURITY;

-- Enable RLS on rps tables if not already enabled
ALTER TABLE rps_synonyms ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PART 4: Create RLS policies for admin access
-- =====================================================

-- Barry tables - admin only access
DO $$
BEGIN
  -- barry_openclaw_logs policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'barry_openclaw_logs'
    AND policyname = 'Admin can view all barry openclaw logs'
  ) THEN
    CREATE POLICY "Admin can view all barry openclaw logs"
    ON barry_openclaw_logs FOR ALL
    TO authenticated
    USING (check_admin_access());
  END IF;

  -- barry_knowledge_base policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'barry_knowledge_base'
    AND policyname = 'Admin can manage barry knowledge base'
  ) THEN
    CREATE POLICY "Admin can manage barry knowledge base"
    ON barry_knowledge_base FOR ALL
    TO authenticated
    USING (check_admin_access());
  END IF;

  -- barry_answer_feedback policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'barry_answer_feedback'
    AND policyname = 'Admin can view all barry feedback'
  ) THEN
    CREATE POLICY "Admin can view all barry feedback"
    ON barry_answer_feedback FOR ALL
    TO authenticated
    USING (check_admin_access());
  END IF;

  -- barry_skill_logs policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'barry_skill_logs'
    AND policyname = 'Admin can view all barry skill logs'
  ) THEN
    CREATE POLICY "Admin can view all barry skill logs"
    ON barry_skill_logs FOR ALL
    TO authenticated
    USING (check_admin_access());
  END IF;

END $$;

-- =====================================================
-- PART 5: Verification queries
-- =====================================================

-- Check that views are now using security_invoker
SELECT
  schemaname,
  viewname,
  definition
FROM pg_views
WHERE schemaname = 'public'
  AND viewname IN (
    'barry_openclaw_metrics_summary',
    'barry_knowledge_analytics',
    'barry_skill_execution_stats',
    'vw_recent_wis_properties',
    'vw_pending_synonyms',
    'wis_documents_unified'
  );

-- Check that backup tables are moved to backup schema
SELECT schemaname, tablename
FROM pg_tables
WHERE schemaname = 'backup';

-- Check RLS status on remaining public tables
SELECT
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename NOT LIKE '%backup%'
  AND tablename != 'spatial_ref_sys'
ORDER BY tablename;

COMMIT;

-- =====================================================
-- Summary of changes:
-- =====================================================
-- 1. ✅ Fixed 6 Security Definer Views → Security Invoker
-- 2. ✅ Moved 3 backup tables to backup schema (out of public)
-- 3. ✅ Moved spatial_ref_sys to extensions schema
-- 4. ✅ Ensured RLS is enabled on all related tables
-- 5. ✅ Added admin-only RLS policies for Barry analytics
-- 6. ✅ Added verification queries
--
-- Security improvements:
-- - Views now execute with caller's permissions (more secure)
-- - Backup tables are no longer publicly accessible
-- - System tables properly isolated
-- - All analytics data requires admin access
-- =====================================================