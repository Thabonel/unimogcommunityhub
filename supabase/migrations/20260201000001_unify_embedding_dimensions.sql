-- Unify Embedding Dimensions to 1536
-- This migration standardizes all embeddings to 1536 dimensions (OpenAI text-embedding-3-small)

-- Step 1: Update search_manual_chunks_semantic to use 1536d input
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
DECLARE
    embedding_dim integer;
BEGIN
    embedding_dim := array_length(string_to_array(trim(both '[]' from query_embedding), ','), 1);
    IF embedding_dim IS NULL OR embedding_dim < 768 THEN
        RAISE EXCEPTION 'Invalid embedding dimension: expected 1536, got %', embedding_dim;
    END IF;

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

-- Step 2: Update search_manual_chunks_hybrid to use 1536d input
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
DECLARE
    embedding_dim integer;
BEGIN
    embedding_dim := array_length(string_to_array(trim(both '[]' from query_embedding), ','), 1);
    IF embedding_dim IS NULL OR embedding_dim < 768 THEN
        RAISE EXCEPTION 'Invalid embedding dimension: expected 1536, got %', embedding_dim;
    END IF;

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

-- Step 3: Update match_manual_images to use 1536d input
CREATE OR REPLACE FUNCTION match_manual_images(
    query_embedding text,
    match_threshold float DEFAULT 0.7,
    match_count int DEFAULT 5
)
RETURNS TABLE(
    id uuid,
    manual_id uuid,
    section_title text,
    page_number integer,
    page_image_url text,
    similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        mc.id,
        mc.manual_id,
        mc.section_title,
        mc.page_number,
        mc.page_image_url,
        (1 - (mc.embedding <=> query_embedding::vector))::float as similarity
    FROM manual_chunks mc
    WHERE
        mc.has_visual_elements = true
        AND mc.page_image_url IS NOT NULL
        AND mc.embedding IS NOT NULL
        AND (1 - (mc.embedding <=> query_embedding::vector)) > match_threshold
    ORDER BY similarity DESC
    LIMIT match_count;
END;
$$;

-- Step 4: Create helper function to check embedding dimensions
CREATE OR REPLACE FUNCTION check_embedding_dimension(embedding_text text)
RETURNS integer
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
    dim integer;
BEGIN
    dim := array_length(string_to_array(trim(both '[]' from embedding_text), ','), 1);
    RETURN COALESCE(dim, 0);
END;
$$;

-- Step 5: Add comment documenting the standard dimension
COMMENT ON COLUMN manual_chunks.embedding IS 'Vector embedding (1536 dimensions from text-embedding-3-small)';
