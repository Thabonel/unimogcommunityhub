-- CRITICAL FIX: Shared Supabase database has broken search functions
-- Both staging and production fail because they use the same database
-- Functions reference 'embeddings' (plural) but column is 'embedding' (singular)

-- Fix search_manual_chunks_semantic function
CREATE OR REPLACE FUNCTION search_manual_chunks_semantic(
    query_embedding text,
    user_model text DEFAULT NULL::text,
    similarity_threshold double precision DEFAULT 0.7,
    max_results integer DEFAULT 8
)
RETURNS TABLE(
    chunk_id uuid,
    manual_title text,
    section_title text,
    page_number integer,
    content text,
    page_image_url text,
    has_visual_elements boolean,
    similarity_score double precision
)
LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        mc.id,
        mc.manual_title,
        mc.section_title,
        mc.page_number,
        mc.content,
        mc.page_image_url,
        mc.has_visual_elements,
        (1 - (mc.embedding <=> query_embedding::vector))::double precision as similarity_score
    FROM manual_chunks mc
    WHERE
        mc.embedding IS NOT NULL
        AND (user_model IS NULL OR mc.manual_title ILIKE '%' || user_model || '%')
        AND (1 - (mc.embedding <=> query_embedding::vector)) >= similarity_threshold
    ORDER BY similarity_score DESC
    LIMIT max_results;
END;
$function$;

-- Fix search_manual_chunks_hybrid function
CREATE OR REPLACE FUNCTION search_manual_chunks_hybrid(
    query_text text,
    query_embedding text,
    user_model text DEFAULT NULL::text,
    similarity_threshold double precision DEFAULT 0.6,
    max_results integer DEFAULT 10
)
RETURNS TABLE(
    chunk_id uuid,
    manual_title text,
    section_title text,
    page_number integer,
    content text,
    page_image_url text,
    has_visual_elements boolean,
    similarity_score double precision,
    combined_score double precision
)
LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        mc.id,
        mc.manual_title,
        mc.section_title,
        mc.page_number,
        mc.content,
        mc.page_image_url,
        mc.has_visual_elements,
        (1 - (mc.embedding <=> query_embedding::vector))::double precision as similarity_score,
        (
            0.7 * (1 - (mc.embedding <=> query_embedding::vector)) +
            0.3 * ts_rank(mc.content_tsv, plainto_tsquery('english', query_text))
        )::double precision as combined_score
    FROM manual_chunks mc
    WHERE
        mc.embedding IS NOT NULL
        AND (user_model IS NULL OR mc.manual_title ILIKE '%' || user_model || '%')
        AND (1 - (mc.embedding <=> query_embedding::vector)) >= similarity_threshold
    ORDER BY combined_score DESC
    LIMIT max_results;
END;
$function$;