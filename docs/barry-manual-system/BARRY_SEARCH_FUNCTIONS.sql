-- Barry Search Functions
-- Implements 3-stage deterministic search pipeline
-- Run this after schema and data population scripts

-- Stage A: Curated Knowledge Search Function
CREATE OR REPLACE FUNCTION search_curated_knowledge(
    user_query text,
    max_results int DEFAULT 3
)
RETURNS TABLE (
    id uuid,
    response_template text,
    manual_references jsonb,
    search_priority int,
    match_type text,
    match_score real
) AS $$
DECLARE
    normalized_query text;
    query_words text[];
BEGIN
    normalized_query := normalize_search_text(user_query);
    query_words := string_to_array(normalized_query, ' ');

    -- Return results from most precise to least precise matching
    RETURN QUERY
    WITH search_results AS (
        -- Exact keyword match (highest priority)
        SELECT
            bkb.id,
            bkb.barry_response_template as response_template,
            bkb.manual_references,
            bkb.search_priority,
            'exact_keyword' as match_type,
            1.0::real as match_score
        FROM barry_knowledge_base bkb
        WHERE bkb.is_active = true
        AND EXISTS (
            SELECT 1 FROM unnest(bkb.norm_keywords) nk
            WHERE nk = ANY(query_words)
        )

        UNION ALL

        -- Alias match
        SELECT
            bkb.id,
            bkb.barry_response_template,
            bkb.manual_references,
            bkb.search_priority,
            'alias_match' as match_type,
            0.9::real as match_score
        FROM barry_knowledge_base bkb
        WHERE bkb.is_active = true
        AND bkb.aliases IS NOT NULL
        AND EXISTS (
            SELECT 1 FROM unnest(bkb.aliases) alias_term
            WHERE normalize_search_text(alias_term) = ANY(query_words)
        )

        UNION ALL

        -- Full-text search
        SELECT
            bkb.id,
            bkb.barry_response_template,
            bkb.manual_references,
            bkb.search_priority,
            'fts_match' as match_type,
            ts_rank_cd(bkb.search_fts, plainto_tsquery('english', user_query)) as match_score
        FROM barry_knowledge_base bkb
        WHERE bkb.is_active = true
        AND bkb.search_fts @@ plainto_tsquery('english', user_query)
    )
    SELECT DISTINCT ON (sr.id)
        sr.id,
        sr.response_template,
        sr.manual_references,
        sr.search_priority,
        sr.match_type,
        sr.match_score
    FROM search_results sr
    WHERE sr.response_template IS NOT NULL
    ORDER BY sr.id, sr.match_score DESC, sr.search_priority DESC
    LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- Stage B: Manual Index Search Function
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

        -- Trigram fuzzy match (lowest priority)
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
            similarity(umi.norm_term, normalized_query) as match_score
        FROM u435_manual_index umi
        WHERE umi.is_active = true
        AND similarity(umi.norm_term, normalized_query) > 0.3
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
$$ LANGUAGE plpgsql;

-- Stage C: Fallback Suggestions Function
CREATE OR REPLACE FUNCTION get_search_suggestions(
    user_query text,
    max_suggestions int DEFAULT 3
)
RETURNS TABLE (
    suggested_term text,
    term_category text,
    usage_count int
) AS $$
DECLARE
    normalized_query text;
BEGIN
    normalized_query := normalize_search_text(user_query);

    RETURN QUERY
    SELECT
        umi.term as suggested_term,
        umi.system_category as term_category,
        1 as usage_count  -- Could be enhanced with actual usage analytics
    FROM u435_manual_index umi
    WHERE umi.is_active = true
    AND (
        umi.system_category IN (
            SELECT DISTINCT umi2.system_category
            FROM u435_manual_index umi2
            WHERE similarity(umi2.norm_term, normalized_query) > 0.2
            LIMIT 2
        )
        OR similarity(umi.norm_term, normalized_query) > 0.15
    )
    ORDER BY umi.search_priority DESC, similarity(umi.norm_term, normalized_query) DESC
    LIMIT max_suggestions;
END;
$$ LANGUAGE plpgsql;

-- Main Search Orchestrator Function
CREATE OR REPLACE FUNCTION barry_search_pipeline(
    user_query text,
    user_id_param uuid DEFAULT NULL
)
RETURNS TABLE (
    search_stage text,
    result_count int,
    results jsonb,
    suggestions jsonb,
    response_time_ms int
) AS $$
DECLARE
    start_time timestamp;
    end_time timestamp;
    curated_results jsonb;
    manual_results jsonb;
    fallback_suggestions jsonb;
    result_stage text;
    total_results int;
BEGIN
    start_time := clock_timestamp();

    -- Stage A: Try curated knowledge first
    SELECT jsonb_agg(row_to_json(ck.*))
    INTO curated_results
    FROM search_curated_knowledge(user_query, 3) ck;

    IF curated_results IS NOT NULL AND jsonb_array_length(curated_results) > 0 THEN
        result_stage := 'curated';
        total_results := jsonb_array_length(curated_results);
        manual_results := NULL;
        fallback_suggestions := NULL;
    ELSE
        -- Stage B: Search manual index
        SELECT jsonb_agg(row_to_json(mi.*))
        INTO manual_results
        FROM search_manual_index(user_query, 5) mi;

        IF manual_results IS NOT NULL AND jsonb_array_length(manual_results) > 0 THEN
            result_stage := 'manual';
            total_results := jsonb_array_length(manual_results);
            curated_results := NULL;
            fallback_suggestions := NULL;
        ELSE
            -- Stage C: Provide suggestions
            SELECT jsonb_agg(row_to_json(gs.*))
            INTO fallback_suggestions
            FROM get_search_suggestions(user_query, 3) gs;

            result_stage := 'fallback';
            total_results := 0;
            curated_results := NULL;
            manual_results := NULL;
        END IF;
    END IF;

    end_time := clock_timestamp();

    -- Log analytics
    INSERT INTO barry_search_analytics (
        user_id, user_query, normalized_query, search_stage,
        results_count, response_time_ms
    ) VALUES (
        user_id_param,
        user_query,
        normalize_search_text(user_query),
        result_stage,
        total_results,
        EXTRACT(milliseconds FROM (end_time - start_time))::int
    );

    -- Return results
    RETURN QUERY
    SELECT
        result_stage as search_stage,
        total_results as result_count,
        COALESCE(curated_results, manual_results) as results,
        fallback_suggestions as suggestions,
        EXTRACT(milliseconds FROM (end_time - start_time))::int as response_time_ms;
END;
$$ LANGUAGE plpgsql;

-- PDF Link Validation Function
CREATE OR REPLACE FUNCTION validate_pdf_links()
RETURNS TABLE (
    total_entries int,
    valid_entries int,
    invalid_entries int,
    invalid_details jsonb
) AS $$
BEGIN
    RETURN QUERY
    WITH validation_check AS (
        SELECT
            COUNT(*) as total,
            COUNT(*) FILTER (
                WHERE storage_url IS NOT NULL
                AND pdf_page_number IS NOT NULL
                AND pdf_page_number > 0
                AND storage_url LIKE '%u435-chapters%'
            ) as valid,
            COUNT(*) FILTER (
                WHERE storage_url IS NULL
                OR pdf_page_number IS NULL
                OR pdf_page_number <= 0
                OR storage_url NOT LIKE '%u435-chapters%'
            ) as invalid,
            jsonb_agg(
                jsonb_build_object(
                    'term', term,
                    'storage_url', storage_url,
                    'pdf_page_number', pdf_page_number
                )
            ) FILTER (
                WHERE storage_url IS NULL
                OR pdf_page_number IS NULL
                OR pdf_page_number <= 0
            ) as invalid_list
        FROM u435_manual_index
        WHERE is_active = true
    )
    SELECT
        vc.total::int,
        vc.valid::int,
        vc.invalid::int,
        vc.invalid_list
    FROM validation_check vc;
END;
$$ LANGUAGE plpgsql;

-- Test the search pipeline
SELECT 'Search functions created successfully' as status;

-- Test search with air compressor
SELECT
    search_stage,
    result_count,
    response_time_ms
FROM barry_search_pipeline('air compressor replacement');

-- Test search with brake system
SELECT
    search_stage,
    result_count,
    response_time_ms
FROM barry_search_pipeline('brake system troubleshooting');