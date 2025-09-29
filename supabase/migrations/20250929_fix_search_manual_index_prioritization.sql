-- Fix search_manual_index function to prioritize maintenance manuals over general chapters
-- This ensures oil change queries return actual maintenance procedures first
-- Date: 2025-09-29
-- Issue: Barry was returning oil cooler content instead of oil change procedures

CREATE OR REPLACE FUNCTION public.search_manual_index(user_query text, max_results integer DEFAULT 5)
RETURNS TABLE(
    id uuid,
    term text,
    page_number integer,
    chapter_filename text,
    pdf_page_number integer,
    storage_url text,
    system_category text,
    search_priority integer,
    has_safety_warning boolean,
    match_type text,
    match_score real
)
LANGUAGE plpgsql
SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
    normalized_query text;
    query_words text[];
BEGIN
    normalized_query := normalize_search_text(user_query);
    query_words := string_to_array(normalized_query, ' ');

    RETURN QUERY
    WITH search_results AS (
        -- Exact term match
        SELECT
            umi.id,
            umi.term,
            umi.page_number,
            umi.chapter_filename,
            umi.pdf_page_number,
            umi.storage_url,
            umi.system_category,
            umi.search_priority,
            umi.has_safety_warning,
            'exact_term' as match_type,
            1.0::real as match_score
        FROM u435_manual_index umi
        WHERE umi.is_active = true
        AND umi.norm_term = normalized_query

        UNION ALL

        -- Alias match
        SELECT
            umi.id,
            umi.term,
            umi.page_number,
            umi.chapter_filename,
            umi.pdf_page_number,
            umi.storage_url,
            umi.system_category,
            umi.search_priority,
            umi.has_safety_warning,
            'alias_match' as match_type,
            0.95::real as match_score
        FROM u435_manual_index umi
        WHERE umi.is_active = true
        AND umi.aliases IS NOT NULL
        AND EXISTS (
            SELECT 1 FROM unnest(umi.aliases) alias_term
            WHERE normalize_search_text(alias_term) = ANY(query_words)
        )

        UNION ALL

        -- Full-text search
        SELECT
            umi.id,
            umi.term,
            umi.page_number,
            umi.chapter_filename,
            umi.pdf_page_number,
            umi.storage_url,
            umi.system_category,
            umi.search_priority,
            umi.has_safety_warning,
            'fts_match' as match_type,
            ts_rank_cd(umi.search_fts, plainto_tsquery('english', user_query)) as match_score
        FROM u435_manual_index umi
        WHERE umi.is_active = true
        AND umi.search_fts @@ plainto_tsquery('english', user_query)

        UNION ALL

        -- Trigram fuzzy match
        SELECT
            umi.id,
            umi.term,
            umi.page_number,
            umi.chapter_filename,
            umi.pdf_page_number,
            umi.storage_url,
            umi.system_category,
            umi.search_priority,
            umi.has_safety_warning,
            'trigram_match' as match_type,
            extensions.similarity(umi.norm_term, normalized_query)::real as match_score
        FROM u435_manual_index umi
        WHERE umi.is_active = true
        AND extensions.similarity(umi.norm_term, normalized_query) > 0.3
    )
    SELECT DISTINCT ON (sr.term, sr.page_number)
        sr.id,
        sr.term,
        sr.page_number,
        sr.chapter_filename,
        sr.pdf_page_number,
        sr.storage_url,
        sr.system_category,
        sr.search_priority,
        sr.has_safety_warning,
        sr.match_type,
        sr.match_score
    FROM search_results sr
    WHERE sr.storage_url IS NOT NULL
    AND sr.pdf_page_number IS NOT NULL
    ORDER BY
        sr.term,
        sr.page_number,
        -- CRITICAL FIX: Prioritize maintenance manuals (containing "Maint_" in filename)
        -- This ensures oil change returns U435_Maint_18_Engine_Lubrication.pdf first
        -- instead of U435_05_Lubrication.pdf (oil cooler content)
        CASE
            WHEN sr.chapter_filename LIKE '%Maint_%' THEN 0
            ELSE 1
        END,
        sr.match_score DESC,
        sr.search_priority DESC,
        length(sr.term)
    LIMIT max_results;
END;
$function$;