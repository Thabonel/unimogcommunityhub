-- Security Fix: Diagnostic First Approach
-- Date: 2026-02-10
-- Purpose: Check what actually exists, then fix only real issues

-- =====================================================
-- STEP 1: DIAGNOSTIC - What actually exists?
-- =====================================================

-- Check which views from the security report actually exist
SELECT
  'VIEW' as object_type,
  schemaname,
  viewname as name,
  'EXISTS' as status
FROM pg_views
WHERE schemaname = 'public'
  AND viewname IN (
    'barry_openclaw_metrics_summary',
    'barry_knowledge_analytics',
    'barry_skill_execution_stats',
    'vw_recent_wis_properties',
    'vw_pending_synonyms',
    'wis_documents_unified'
  )
UNION ALL
-- Check which tables from the security report actually exist
SELECT
  'TABLE' as object_type,
  schemaname,
  tablename as name,
  'EXISTS' as status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'manual_chunks_rps_phantom_backup',
    'rps_groups_backup_20260118',
    'manual_chunks_backup_20260126',
    'spatial_ref_sys'
  )
ORDER BY object_type, name;

-- Check which security definer views actually exist
SELECT
  schemaname,
  viewname,
  definition
FROM pg_views
WHERE schemaname = 'public'
  AND definition ILIKE '%security definer%'
ORDER BY viewname;

-- Check tables without RLS in public schema
SELECT
  schemaname,
  tablename,
  rowsecurity as has_rls
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = false
ORDER BY tablename;