-- Fix Function Search Path Security Issues
-- Sets search_path for all functions to prevent security vulnerabilities
-- Uses correct function signatures from database

-- Barry search functions
ALTER FUNCTION search_curated_knowledge(text, integer) SET search_path = public, pg_temp;
ALTER FUNCTION search_manual_index(text, integer) SET search_path = public, pg_temp;
ALTER FUNCTION get_search_suggestions(text, integer) SET search_path = public, pg_temp;
ALTER FUNCTION barry_search_pipeline(text, uuid) SET search_path = public, pg_temp;
ALTER FUNCTION barry_search_with_personality(text, uuid) SET search_path = public, pg_temp;
ALTER FUNCTION build_barry_response(text, text, jsonb, boolean) SET search_path = public, pg_temp;
ALTER FUNCTION get_barry_personality(text, text) SET search_path = public, pg_temp;

-- Manual search functions (multiple overloads)
ALTER FUNCTION search_manual_chunks_semantic(text, text, double precision, integer) SET search_path = public, pg_temp;
ALTER FUNCTION search_manual_chunks_semantic(vector, text, double precision, integer) SET search_path = public, pg_temp;
ALTER FUNCTION search_manual_chunks_hybrid(text, text, text, double precision, integer) SET search_path = public, pg_temp;
ALTER FUNCTION search_manual_chunks_hybrid(text, vector, text, double precision, double precision, double precision, integer) SET search_path = public, pg_temp;
ALTER FUNCTION search_manual_chunks_fallback(text, text, numeric) SET search_path = public, pg_temp;
ALTER FUNCTION search_manual_content(text, uuid, text[], integer, integer, integer) SET search_path = public, pg_temp;
ALTER FUNCTION search_u435_manuals(text) SET search_path = public, pg_temp;

-- Utility functions
ALTER FUNCTION normalize_search_text(text) SET search_path = public, pg_temp;
ALTER FUNCTION trigram_search_similarity(text, text) SET search_path = public, pg_temp;
ALTER FUNCTION match_manual_images(vector, integer, uuid[]) SET search_path = public, pg_temp;
ALTER FUNCTION find_manual_by_fuzzy_title(text, double precision) SET search_path = public, pg_temp;

-- Manual management functions
ALTER FUNCTION get_manual_page_context(text, integer, integer) SET search_path = public, pg_temp;
ALTER FUNCTION get_manual_coverage_stats() SET search_path = public, pg_temp;

-- Trigger functions
ALTER FUNCTION update_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION update_barry_knowledge_updated_at() SET search_path = public, pg_temp;

-- Move unaccent extension from public schema to extensions schema
CREATE SCHEMA IF NOT EXISTS extensions;
ALTER EXTENSION unaccent SET SCHEMA extensions;

SELECT 'Function search path security issues fixed successfully' as status;