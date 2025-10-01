-- Create advanced vector search functions for WIS
-- Migration: 20250112_create_vector_search_functions

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS search_wis_semantic(vector, text, integer, real);
DROP FUNCTION IF EXISTS search_wis_hybrid(text, text, integer, real);
DROP FUNCTION IF EXISTS search_wis_filtered(text, uuid, text, integer, real);
DROP FUNCTION IF EXISTS search_wis_ranked(text, uuid, text, integer);

-- 1. Pure semantic vector search function
CREATE OR REPLACE FUNCTION search_wis_semantic(
    query_embedding vector(1536),
    content_types text DEFAULT 'procedure,part,bulletin',
    search_limit integer DEFAULT 20,
    similarity_threshold real DEFAULT 0.7
)
RETURNS TABLE (
    doc_id uuid,
    doc_type text,
    title text,
    content_summary text,
    reference_number text,
    category text,
    vehicle_model text,
    similarity_score real,
    result_rank integer
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH combined_results AS (
        -- Search procedures
        SELECT 
            p.id as doc_id,
            'procedure'::text as doc_type,
            p.title,
            COALESCE(LEFT(p.description, 200), LEFT(p.content, 200)) as content_summary,
            p.procedure_code as reference_number,
            p.category,
            m.model_name as vehicle_model,
            (1 - (p.embedding <=> query_embedding))::real as similarity_score
        FROM wis_procedures p
        JOIN wis_models m ON p.vehicle_id = m.id
        WHERE p.embedding IS NOT NULL
            AND (1 - (p.embedding <=> query_embedding)) >= similarity_threshold
            AND content_types LIKE '%procedure%'
            
        UNION ALL
        
        -- Search parts
        SELECT 
            p.id as doc_id,
            'part'::text as doc_type,
            p.part_name as title,
            COALESCE(p.description, 'Part: ' || p.part_number) as content_summary,
            p.part_number as reference_number,
            p.category,
            m.model_name as vehicle_model,
            (1 - (p.embedding <=> query_embedding))::real as similarity_score
        FROM wis_parts p
        JOIN wis_models m ON p.vehicle_id = m.id
        WHERE p.embedding IS NOT NULL
            AND (1 - (p.embedding <=> query_embedding)) >= similarity_threshold
            AND content_types LIKE '%part%'
            
        UNION ALL
        
        -- Search bulletins
        SELECT 
            b.id as doc_id,
            'bulletin'::text as doc_type,
            b.title,
            COALESCE(LEFT(b.description, 200), LEFT(b.content, 200)) as content_summary,
            b.bulletin_number as reference_number,
            b.category,
            m.model_name as vehicle_model,
            (1 - (b.embedding <=> query_embedding))::real as similarity_score
        FROM wis_bulletins b
        JOIN wis_models m ON b.vehicle_id = m.id
        WHERE b.embedding IS NOT NULL
            AND (1 - (b.embedding <=> query_embedding)) >= similarity_threshold
            AND content_types LIKE '%bulletin%'
            
        UNION ALL
        
        -- Search chunks (existing data)
        SELECT 
            c.id::uuid as doc_id,
            c.doc_type,
            c.title,
            LEFT(c.content, 200) as content_summary,
            c.ref as reference_number,
            'chunk'::text as category,
            'Various'::text as vehicle_model,
            (1 - (c.embedding <=> query_embedding))::real as similarity_score
        FROM wis_chunks c
        WHERE c.embedding IS NOT NULL
            AND (1 - (c.embedding <=> query_embedding)) >= similarity_threshold
            AND content_types LIKE '%chunk%'
    )
    SELECT 
        r.doc_id,
        r.doc_type,
        r.title,
        r.content_summary,
        r.reference_number,
        r.category,
        r.vehicle_model,
        r.similarity_score,
        ROW_NUMBER() OVER (ORDER BY r.similarity_score DESC)::integer as result_rank
    FROM combined_results r
    ORDER BY r.similarity_score DESC
    LIMIT search_limit;
END;
$$;

-- 2. Hybrid search combining vector and text search
CREATE OR REPLACE FUNCTION search_wis_hybrid(
    search_query text,
    content_types text DEFAULT 'procedure,part,bulletin',
    search_limit integer DEFAULT 20,
    vector_weight real DEFAULT 0.7
)
RETURNS TABLE (
    doc_id uuid,
    doc_type text,
    title text,
    content_summary text,
    reference_number text,
    category text,
    vehicle_model text,
    combined_score real,
    vector_score real,
    text_score real,
    result_rank integer
) 
LANGUAGE plpgsql
AS $$
DECLARE
    text_weight real := 1.0 - vector_weight;
BEGIN
    RETURN QUERY
    WITH combined_results AS (
        -- Hybrid search on procedures
        SELECT 
            p.id as doc_id,
            'procedure'::text as doc_type,
            p.title,
            COALESCE(LEFT(p.description, 200), LEFT(p.content, 200)) as content_summary,
            p.procedure_code as reference_number,
            p.category,
            m.model_name as vehicle_model,
            COALESCE((1 - (p.embedding <=> (SELECT embedding FROM wis_chunks WHERE content ILIKE '%' || search_query || '%' LIMIT 1))), 0)::real as vector_score,
            GREATEST(
                ts_rank(to_tsvector('english', COALESCE(p.title, '')), plainto_tsquery('english', search_query)),
                ts_rank(to_tsvector('english', COALESCE(p.description, '')), plainto_tsquery('english', search_query))
            )::real as text_score
        FROM wis_procedures p
        JOIN wis_models m ON p.vehicle_id = m.id
        WHERE (
            to_tsvector('english', COALESCE(p.title, '')) @@ plainto_tsquery('english', search_query)
            OR to_tsvector('english', COALESCE(p.description, '')) @@ plainto_tsquery('english', search_query)
            OR p.title ILIKE '%' || search_query || '%'
            OR p.category ILIKE '%' || search_query || '%'
        )
        AND content_types LIKE '%procedure%'
        
        UNION ALL
        
        -- Hybrid search on parts
        SELECT 
            p.id as doc_id,
            'part'::text as doc_type,
            p.part_name as title,
            COALESCE(p.description, 'Part: ' || p.part_number) as content_summary,
            p.part_number as reference_number,
            p.category,
            m.model_name as vehicle_model,
            COALESCE((1 - (p.embedding <=> (SELECT embedding FROM wis_chunks WHERE content ILIKE '%' || search_query || '%' LIMIT 1))), 0)::real as vector_score,
            GREATEST(
                (CASE WHEN p.part_number ILIKE '%' || search_query || '%' THEN 1.0 ELSE 0.0 END),
                (CASE WHEN p.part_name ILIKE '%' || search_query || '%' THEN 0.8 ELSE 0.0 END),
                ts_rank(to_tsvector('english', COALESCE(p.description, '')), plainto_tsquery('english', search_query))
            )::real as text_score
        FROM wis_parts p
        JOIN wis_models m ON p.vehicle_id = m.id
        WHERE (
            p.part_number ILIKE '%' || search_query || '%'
            OR p.part_name ILIKE '%' || search_query || '%'
            OR to_tsvector('english', COALESCE(p.description, '')) @@ plainto_tsquery('english', search_query)
            OR p.category ILIKE '%' || search_query || '%'
        )
        AND content_types LIKE '%part%'
    )
    SELECT 
        r.doc_id,
        r.doc_type,
        r.title,
        r.content_summary,
        r.reference_number,
        r.category,
        r.vehicle_model,
        (r.vector_score * vector_weight + r.text_score * text_weight)::real as combined_score,
        r.vector_score,
        r.text_score,
        ROW_NUMBER() OVER (ORDER BY (r.vector_score * vector_weight + r.text_score * text_weight) DESC)::integer as result_rank
    FROM combined_results r
    WHERE r.vector_score > 0 OR r.text_score > 0
    ORDER BY combined_score DESC
    LIMIT search_limit;
END;
$$;

-- 3. Filtered vector search with vehicle and content type filtering
CREATE OR REPLACE FUNCTION search_wis_filtered(
    search_query text,
    vehicle_id_filter uuid DEFAULT NULL,
    category_filter text DEFAULT NULL,
    search_limit integer DEFAULT 20,
    similarity_threshold real DEFAULT 0.6
)
RETURNS TABLE (
    doc_id uuid,
    doc_type text,
    title text,
    content_summary text,
    reference_number text,
    category text,
    vehicle_model text,
    similarity_score real,
    result_rank integer
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH combined_results AS (
        -- Filtered search on procedures
        SELECT 
            p.id as doc_id,
            'procedure'::text as doc_type,
            p.title,
            COALESCE(LEFT(p.description, 200), LEFT(p.content, 200)) as content_summary,
            p.procedure_code as reference_number,
            p.category,
            m.model_name as vehicle_model,
            ts_rank(
                to_tsvector('english', COALESCE(p.title || ' ' || p.description || ' ' || p.content, '')),
                plainto_tsquery('english', search_query)
            )::real as similarity_score
        FROM wis_procedures p
        JOIN wis_models m ON p.vehicle_id = m.id
        WHERE (
            to_tsvector('english', COALESCE(p.title || ' ' || p.description || ' ' || p.content, '')) 
            @@ plainto_tsquery('english', search_query)
            OR p.title ILIKE '%' || search_query || '%'
        )
        AND (vehicle_id_filter IS NULL OR p.vehicle_id = vehicle_id_filter)
        AND (category_filter IS NULL OR p.category ILIKE '%' || category_filter || '%')
        
        UNION ALL
        
        -- Filtered search on parts
        SELECT 
            p.id as doc_id,
            'part'::text as doc_type,
            p.part_name as title,
            COALESCE(p.description, 'Part: ' || p.part_number) as content_summary,
            p.part_number as reference_number,
            p.category,
            m.model_name as vehicle_model,
            GREATEST(
                (CASE WHEN p.part_number ILIKE '%' || search_query || '%' THEN 1.0 ELSE 0.0 END),
                (CASE WHEN p.part_name ILIKE '%' || search_query || '%' THEN 0.8 ELSE 0.0 END),
                ts_rank(to_tsvector('english', COALESCE(p.description, '')), plainto_tsquery('english', search_query))
            )::real as similarity_score
        FROM wis_parts p
        JOIN wis_models m ON p.vehicle_id = m.id
        WHERE (
            p.part_number ILIKE '%' || search_query || '%'
            OR p.part_name ILIKE '%' || search_query || '%'
            OR to_tsvector('english', COALESCE(p.description, '')) @@ plainto_tsquery('english', search_query)
        )
        AND (vehicle_id_filter IS NULL OR p.vehicle_id = vehicle_id_filter)
        AND (category_filter IS NULL OR p.category ILIKE '%' || category_filter || '%')
        
        UNION ALL
        
        -- Filtered search on bulletins
        SELECT 
            b.id as doc_id,
            'bulletin'::text as doc_type,
            b.title,
            COALESCE(LEFT(b.description, 200), LEFT(b.content, 200)) as content_summary,
            b.bulletin_number as reference_number,
            b.category,
            m.model_name as vehicle_model,
            (ts_rank(
                to_tsvector('english', COALESCE(b.title || ' ' || b.description || ' ' || b.content, '')),
                plainto_tsquery('english', search_query)
            ) + (CASE WHEN b.severity = 'critical' THEN 0.2 ELSE 0.0 END))::real as similarity_score
        FROM wis_bulletins b
        JOIN wis_models m ON b.vehicle_id = m.id
        WHERE (
            to_tsvector('english', COALESCE(b.title || ' ' || b.description || ' ' || b.content, '')) 
            @@ plainto_tsquery('english', search_query)
            OR b.title ILIKE '%' || search_query || '%'
        )
        AND (vehicle_id_filter IS NULL OR b.vehicle_id = vehicle_id_filter)
        AND (category_filter IS NULL OR b.category ILIKE '%' || category_filter || '%')
    )
    SELECT 
        r.doc_id,
        r.doc_type,
        r.title,
        r.content_summary,
        r.reference_number,
        r.category,
        r.vehicle_model,
        r.similarity_score,
        ROW_NUMBER() OVER (ORDER BY r.similarity_score DESC)::integer as result_rank
    FROM combined_results r
    WHERE r.similarity_score >= similarity_threshold
    ORDER BY r.similarity_score DESC
    LIMIT search_limit;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION search_wis_semantic(vector, text, integer, real) TO authenticated;
GRANT EXECUTE ON FUNCTION search_wis_hybrid(text, text, integer, real) TO authenticated;
GRANT EXECUTE ON FUNCTION search_wis_filtered(text, uuid, text, integer, real) TO authenticated;