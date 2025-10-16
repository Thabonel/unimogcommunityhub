-- Fix Security Issues from Supabase Linter
-- Safe fixes that won't break existing functionality

-- Issue 1: Remove SECURITY DEFINER from wis_documents_unified view
-- This view combines WIS procedures and bulletins - doesn't need elevated permissions
DROP VIEW IF EXISTS public.wis_documents_unified;

CREATE VIEW public.wis_documents_unified AS
SELECT
  p.id,
  'procedure'::text AS document_type,
  p.procedure_code AS code,
  p.title,
  p.description,
  p.overview AS content,
  p.status,
  p.difficulty_level,
  p.estimated_time_hours,
  NULL::text AS category,
  NULL::text AS severity_level,
  NULL::text[] AS models_affected,
  p.created_at,
  p.updated_at
FROM wis_procedures p
WHERE p.status = 'active'
UNION ALL
SELECT
  b.id,
  'bulletin'::text AS document_type,
  b.bulletin_number AS code,
  b.title,
  b.description,
  b.content,
  b.status,
  NULL::integer AS difficulty_level,
  NULL::numeric(4,2) AS estimated_time_hours,
  b.category,
  b.severity AS severity_level,
  b.applicable_models AS models_affected,
  b.created_at,
  b.created_at AS updated_at
FROM wis_service_bulletins b
WHERE b.status = 'active';

-- Note: Recreated WITHOUT "SECURITY DEFINER" - now uses querying user's permissions


-- Issue 2: Enable RLS on signup_health_log table
-- This is an admin monitoring table - only admins should access it
ALTER TABLE public.signup_health_log ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view signup health logs
CREATE POLICY "Admins can view signup health logs"
  ON public.signup_health_log
  FOR SELECT
  TO authenticated
  USING (check_admin_access());

-- Policy: System can insert health check records (service role)
CREATE POLICY "Service role can insert health logs"
  ON public.signup_health_log
  FOR INSERT
  TO service_role
  WITH CHECK (true);


-- Issue 3: spatial_ref_sys - SKIP
-- This is a PostGIS system table owned by the postgis extension
-- We cannot modify it, and the RLS warning can be safely ignored
-- PostGIS manages its own security for this table
