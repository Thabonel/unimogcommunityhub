-- Fix Function Security Warnings - 20 Issues from Database Linter
-- Adds search_path protection to functions and secures materialized views

-- ============================================================================
-- STEP 1: Fix Mutable Search Path on Functions (16 functions)
-- Security: Prevents schema hijacking attacks by locking search_path
-- ============================================================================

-- RPS Functions (4)
ALTER FUNCTION public.get_rps_group_candidates(text) SET search_path = public, pg_temp;
ALTER FUNCTION public.get_rps_exploded_view_v2(text) SET search_path = public, pg_temp;
ALTER FUNCTION public.get_rps_exploded_view(text) SET search_path = public, pg_temp;
ALTER FUNCTION public.normalize_component_phrase(text) SET search_path = public, pg_temp;

-- Barry AI Functions (2)
ALTER FUNCTION public.match_manual_chunks(vector(1536), int, float) SET search_path = public, pg_temp;
ALTER FUNCTION public.search_manual_hybrid(text, float, int, int) SET search_path = public, pg_temp;

-- Utility Functions (4)
ALTER FUNCTION public.immutable_lower_unaccent(text) SET search_path = public, pg_temp;
ALTER FUNCTION public.immutable_unaccent(text) SET search_path = public, pg_temp;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public, pg_temp;
ALTER FUNCTION public.generate_order_number() SET search_path = public, pg_temp;

-- Trigger Functions (4)
ALTER FUNCTION public.dreamlit_auth_users_trigger_fn() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_vehicle_views_count() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_vehicle_likes_count() SET search_path = public, pg_temp;
ALTER FUNCTION public.increment_product_clicks() SET search_path = public, pg_temp;

-- Admin/Timestamp Triggers (2)
ALTER FUNCTION public.update_affiliate_products_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_rps_illustration_reviews_updated_at() SET search_path = public, pg_temp;

-- ============================================================================
-- STEP 2: Secure Materialized Views - Remove Public API Access (2 views)
-- Admin diagnostic views shouldn't be accessible via public API
-- ============================================================================

-- Revoke from anon and authenticated users (admin role retains access)
REVOKE SELECT ON public.rps_existing_pages FROM anon, authenticated;
REVOKE SELECT ON public.rps_missing_storage FROM anon, authenticated;

-- ============================================================================
-- STEP 3: Extensions in Public Schema - SKIPPED (Too Risky)
-- ============================================================================

-- Note: postgis and citext extensions remain in public schema
-- Reason: Moving extensions is complex and high-risk:
--   - postgis has 1000+ objects (types, functions, tables)
--   - citext is used in existing table columns (emails)
--   - Risk of breaking production outweighs security benefit
--
-- These 2 warnings are acceptable and will remain.

-- ============================================================================
-- VERIFICATION QUERIES
-- Run these after migration to confirm fixes:
-- ============================================================================

-- 1. Check functions still have mutable search_path (should return 0)
-- SELECT p.proname
-- FROM pg_proc p
-- JOIN pg_namespace n ON p.pronamespace = n.oid
-- WHERE n.nspname = 'public'
-- AND p.proname IN (
--   'get_rps_group_candidates', 'get_rps_exploded_view_v2',
--   'get_rps_exploded_view', 'normalize_component_phrase',
--   'match_manual_chunks', 'search_manual_hybrid',
--   'immutable_lower_unaccent', 'immutable_unaccent',
--   'update_updated_at_column', 'generate_order_number',
--   'dreamlit_auth_users_trigger_fn', 'update_vehicle_views_count',
--   'update_vehicle_likes_count', 'increment_product_clicks',
--   'update_affiliate_products_updated_at', 'update_rps_illustration_reviews_updated_at'
-- )
-- AND prosecdef = false
-- AND 'search_path' != ANY(proconfig);

-- 2. Verify materialized views are secured (should return 2 rows with has_select = false)
-- SELECT
--   c.relname,
--   has_table_privilege('anon', c.oid, 'SELECT') as anon_has_select,
--   has_table_privilege('authenticated', c.oid, 'SELECT') as auth_has_select
-- FROM pg_class c
-- JOIN pg_namespace n ON c.relnamespace = n.oid
-- WHERE n.nspname = 'public'
-- AND c.relname IN ('rps_existing_pages', 'rps_missing_storage')
-- AND c.relkind = 'm';
