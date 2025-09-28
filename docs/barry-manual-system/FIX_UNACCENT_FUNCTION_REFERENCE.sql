-- Fix Extension Function References in Barry Search Pipeline
-- Both unaccent and pg_trgm extensions moved to extensions schema

-- Update normalize_search_text function to use the correct schema reference
CREATE OR REPLACE FUNCTION normalize_search_text(input_text text)
RETURNS text AS $$
BEGIN
    RETURN lower(extensions.unaccent(trim(input_text)));
END;
$$ LANGUAGE plpgsql IMMUTABLE SET search_path = public, pg_temp;

-- Update trigram_search_similarity function to use the correct schema reference
CREATE OR REPLACE FUNCTION trigram_search_similarity(search_term text, target_text text)
RETURNS real AS $$
BEGIN
    RETURN extensions.similarity(normalize_search_text(search_term), normalize_search_text(target_text));
END;
$$ LANGUAGE plpgsql IMMUTABLE SET search_path = public, pg_temp;

-- Update search_manual_index function to use correct similarity schema reference
CREATE OR REPLACE FUNCTION search_manual_index(
    user_query text,
    max_results int DEFAULT 5
)
RETURNS TABLE (
    id uuid,
    term text,
    page_number int,
    chapter_filename text,
    pdf_page_number int,
    storage_url text,
    system_category text,
    search_priority int,
    has_safety_warning boolean,
    match_type text,
    match_score real
) AS $$
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

        -- Trigram fuzzy match (lowest priority) - FIXED with correct schema
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
            extensions.similarity(umi.norm_term, normalized_query) as match_score
        FROM u435_manual_index umi
        WHERE umi.is_active = true
        AND extensions.similarity(umi.norm_term, normalized_query) > 0.3
    )
    SELECT DISTINCT ON (sr.id)
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
    ORDER BY sr.id, sr.match_score DESC, sr.search_priority DESC, length(sr.term)
    LIMIT max_results;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

-- Test the fix by running a search that should work
SELECT 'Testing Barry search pipeline...' as status;

-- This should now find air tank entries
SELECT
    term,
    chapter_filename,
    pdf_page_number,
    storage_url,
    match_type,
    match_score
FROM search_manual_index('air tank replacement', 5);

SELECT 'Barry search pipeline fix complete - test air tank query now!' as status;