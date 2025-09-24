-- Create vector similarity search functions for intelligent manual content retrieval

-- Function: Semantic search using vector similarity
CREATE OR REPLACE FUNCTION search_manual_chunks_semantic(
    query_embedding vector(768),
    user_model TEXT DEFAULT NULL,
    similarity_threshold FLOAT DEFAULT 0.7,
    max_results INTEGER DEFAULT 10
)
RETURNS TABLE (
    chunk_id UUID,
    manual_title TEXT,
    section_title TEXT,
    page_number INTEGER,
    content TEXT,
    page_image_url TEXT,
    has_visual_elements BOOLEAN,
    visual_content_type TEXT,
    similarity_score FLOAT,
    extraction_quality NUMERIC
) AS $$
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
        mc.visual_content_type,
        (1 - (mc.embedding <=> query_embedding)) as similarity_score,
        mc.extraction_quality
    FROM manual_chunks mc
    WHERE
        mc.embedding IS NOT NULL
        AND (1 - (mc.embedding <=> query_embedding)) >= similarity_threshold
        AND (user_model IS NULL OR mc.manual_title ILIKE '%' || user_model || '%')
    ORDER BY mc.embedding <=> query_embedding
    LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- Function: Hybrid search combining vector similarity with full-text search
CREATE OR REPLACE FUNCTION search_manual_chunks_hybrid(
    query_text TEXT,
    query_embedding vector(768),
    user_model TEXT DEFAULT NULL,
    similarity_threshold FLOAT DEFAULT 0.6,
    text_boost FLOAT DEFAULT 0.3,
    vector_boost FLOAT DEFAULT 0.7,
    max_results INTEGER DEFAULT 15
)
RETURNS TABLE (
    chunk_id UUID,
    manual_title TEXT,
    section_title TEXT,
    page_number INTEGER,
    content TEXT,
    page_image_url TEXT,
    has_visual_elements BOOLEAN,
    visual_content_type TEXT,
    combined_score FLOAT,
    vector_similarity FLOAT,
    text_rank FLOAT,
    extraction_quality NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    WITH vector_search AS (
        SELECT
            mc.id,
            mc.manual_title,
            mc.section_title,
            mc.page_number,
            mc.content,
            mc.page_image_url,
            mc.has_visual_elements,
            mc.visual_content_type,
            (1 - (mc.embedding <=> query_embedding)) as vec_similarity,
            mc.extraction_quality
        FROM manual_chunks mc
        WHERE
            mc.embedding IS NOT NULL
            AND (1 - (mc.embedding <=> query_embedding)) >= similarity_threshold
            AND (user_model IS NULL OR mc.manual_title ILIKE '%' || user_model || '%')
    ),
    text_search AS (
        SELECT
            mc.id,
            ts_rank(mc.content_tsv, plainto_tsquery('english', query_text)) as txt_rank
        FROM manual_chunks mc
        WHERE
            mc.content_tsv @@ plainto_tsquery('english', query_text)
            AND (user_model IS NULL OR mc.manual_title ILIKE '%' || user_model || '%')
    )
    SELECT
        vs.id,
        vs.manual_title,
        vs.section_title,
        vs.page_number,
        vs.content,
        vs.page_image_url,
        vs.has_visual_elements,
        vs.visual_content_type,
        (vs.vec_similarity * vector_boost + COALESCE(ts.txt_rank, 0) * text_boost) as combined_score,
        vs.vec_similarity,
        COALESCE(ts.txt_rank, 0),
        vs.extraction_quality
    FROM vector_search vs
    LEFT JOIN text_search ts ON vs.id = ts.id
    ORDER BY combined_score DESC
    LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- Function: Intelligent manual title matching with fuzzy search
CREATE OR REPLACE FUNCTION find_manual_by_fuzzy_title(
    partial_title TEXT,
    similarity_threshold FLOAT DEFAULT 0.4
)
RETURNS TABLE (
    manual_title TEXT,
    similarity_score FLOAT,
    chunk_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        DISTINCT mc.manual_title,
        similarity(mc.manual_title, partial_title) as sim_score,
        COUNT(*) as chunk_count
    FROM manual_chunks mc
    WHERE similarity(mc.manual_title, partial_title) >= similarity_threshold
    GROUP BY mc.manual_title
    ORDER BY sim_score DESC, chunk_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Function: Get contextual content for specific page with surrounding pages
CREATE OR REPLACE FUNCTION get_manual_page_context(
    target_manual_title TEXT,
    target_page INTEGER,
    context_pages INTEGER DEFAULT 2
)
RETURNS TABLE (
    chunk_id UUID,
    manual_title TEXT,
    section_title TEXT,
    page_number INTEGER,
    content TEXT,
    page_image_url TEXT,
    has_visual_elements BOOLEAN,
    visual_content_type TEXT,
    is_target_page BOOLEAN,
    extraction_quality NUMERIC
) AS $$
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
        mc.visual_content_type,
        (mc.page_number = target_page) as is_target_page,
        mc.extraction_quality
    FROM manual_chunks mc
    WHERE
        similarity(mc.manual_title, target_manual_title) > 0.8
        AND mc.page_number BETWEEN (target_page - context_pages) AND (target_page + context_pages)
    ORDER BY mc.page_number;
END;
$$ LANGUAGE plpgsql;

-- Function: Smart fallback search for low-confidence matches
CREATE OR REPLACE FUNCTION search_manual_chunks_fallback(
    query_text TEXT,
    user_model TEXT DEFAULT NULL,
    min_extraction_quality NUMERIC DEFAULT 0.5
)
RETURNS TABLE (
    chunk_id UUID,
    manual_title TEXT,
    section_title TEXT,
    page_number INTEGER,
    content TEXT,
    page_image_url TEXT,
    has_visual_elements BOOLEAN,
    match_type TEXT,
    relevance_score FLOAT
) AS $$
BEGIN
    RETURN QUERY
    -- Try keyword matching first
    SELECT
        mc.id,
        mc.manual_title,
        mc.section_title,
        mc.page_number,
        mc.content,
        mc.page_image_url,
        mc.has_visual_elements,
        'keyword' as match_type,
        ts_rank(mc.content_tsv, plainto_tsquery('english', query_text)) as relevance_score
    FROM manual_chunks mc
    WHERE
        mc.content_tsv @@ plainto_tsquery('english', query_text)
        AND (user_model IS NULL OR mc.manual_title ILIKE '%' || user_model || '%')
        AND mc.extraction_quality >= min_extraction_quality

    UNION ALL

    -- Try section title matching
    SELECT
        mc.id,
        mc.manual_title,
        mc.section_title,
        mc.page_number,
        mc.content,
        mc.page_image_url,
        mc.has_visual_elements,
        'section_title' as match_type,
        similarity(mc.section_title, query_text) as relevance_score
    FROM manual_chunks mc
    WHERE
        similarity(mc.section_title, query_text) > 0.3
        AND (user_model IS NULL OR mc.manual_title ILIKE '%' || user_model || '%')
        AND mc.extraction_quality >= min_extraction_quality

    ORDER BY relevance_score DESC
    LIMIT 20;
END;
$$ LANGUAGE plpgsql;

-- Function: Get manual statistics and coverage
CREATE OR REPLACE FUNCTION get_manual_coverage_stats()
RETURNS TABLE (
    manual_title TEXT,
    total_chunks BIGINT,
    chunks_with_embeddings BIGINT,
    embedding_coverage FLOAT,
    avg_extraction_quality NUMERIC,
    pages_with_visuals BIGINT,
    unique_sections BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        mc.manual_title,
        COUNT(*) as total_chunks,
        COUNT(mc.embedding) as chunks_with_embeddings,
        (COUNT(mc.embedding)::FLOAT / COUNT(*)::FLOAT * 100) as embedding_coverage,
        AVG(mc.extraction_quality) as avg_extraction_quality,
        COUNT(CASE WHEN mc.has_visual_elements THEN 1 END) as pages_with_visuals,
        COUNT(DISTINCT mc.section_title) as unique_sections
    FROM manual_chunks mc
    GROUP BY mc.manual_title
    ORDER BY embedding_coverage DESC, total_chunks DESC;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_manual_chunks_embedding_cosine ON manual_chunks
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_manual_chunks_manual_title_gin ON manual_chunks
USING gin (manual_title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_manual_chunks_section_title_gin ON manual_chunks
USING gin (section_title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_manual_chunks_page_manual ON manual_chunks (manual_title, page_number);

CREATE INDEX IF NOT EXISTS idx_manual_chunks_quality ON manual_chunks (extraction_quality);

-- Enable trigram extension for fuzzy matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;