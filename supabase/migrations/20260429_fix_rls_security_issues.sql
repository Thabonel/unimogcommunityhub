-- Fix 1: barry_tool_stats view - recreate with security_invoker so it
-- respects the calling user's RLS rather than the view creator's permissions.
DROP VIEW IF EXISTS public.barry_tool_stats;

CREATE VIEW public.barry_tool_stats
WITH (security_invoker = true)
AS
SELECT
  tool_name,
  COUNT(*) AS total_calls,
  ROUND(AVG(latency_ms)) AS avg_latency_ms,
  SUM(CASE WHEN success THEN 1 ELSE 0 END)::float / NULLIF(COUNT(*), 0) AS success_rate,
  SUM(CASE WHEN was_cited THEN 1 ELSE 0 END)::float / NULLIF(COUNT(*), 0) AS citation_rate,
  MIN(created_at) AS first_seen,
  MAX(created_at) AS last_seen
FROM barry_tool_executions
GROUP BY tool_name
ORDER BY total_calls DESC;

-- Note: spatial_ref_sys is a PostGIS extension table owned by Supabase.
-- RLS cannot be enabled on it (not the table owner). Supabase re-applies
-- grants on every extension update, so REVOKE does not persist.
-- The table contains only geographic reference data (coordinate systems) —
-- no user data. The Supabase advisor lint for this table is a known false positive.
