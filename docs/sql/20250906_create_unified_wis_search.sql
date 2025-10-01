-- Create unified WIS search function for enterprise-grade performance
-- Migration: 20250906_create_unified_wis_search.sql

-- Drop function if exists (for redeployment)
DROP FUNCTION IF EXISTS search_wis_procedures(text, text, integer);

-- Create optimized search function for procedures
CREATE OR REPLACE FUNCTION search_wis_procedures(
    search_query text,
    model_filter text DEFAULT '',
    search_limit integer DEFAULT 20
)
RETURNS TABLE (
    id UUID,
    vehicle_id UUID,
    procedure_code TEXT,
    title TEXT,
    category TEXT,
    subcategory TEXT,
    description TEXT,
    content TEXT,
    difficulty_level INTEGER,
    estimated_time_minutes INTEGER,
    tools_required TEXT[],
    updated_at TIMESTAMP WITH TIME ZONE,
    search_score REAL
) 
LANGUAGE plpgsql
AS $$
DECLARE
    base_query text;
    where_clause text;
BEGIN
    -- Build base query with full-text search scoring
    base_query := '
        SELECT 
            p.id,
            p.vehicle_id,
            p.procedure_code,
            p.title,
            p.category,
            p.subcategory,
            p.description,
            p.content,
            p.difficulty_level,
            p.estimated_time_minutes,
            p.tools_required,
            p.updated_at,
            (
                ts_rank(to_tsvector(''english'', COALESCE(p.title, '''')), plainto_tsquery(''english'', $1)) * 4.0 +
                ts_rank(to_tsvector(''english'', COALESCE(p.description, '''')), plainto_tsquery(''english'', $1)) * 2.0 +
                ts_rank(to_tsvector(''english'', COALESCE(p.content, '''')), plainto_tsquery(''english'', $1)) * 1.0 +
                (CASE WHEN p.title ILIKE ''%'' || $1 || ''%'' THEN 2.0 ELSE 0.0 END) +
                (CASE WHEN p.category ILIKE ''%'' || $1 || ''%'' THEN 1.5 ELSE 0.0 END)
            ) AS search_score
        FROM wis_procedures p
        WHERE (
            to_tsvector(''english'', COALESCE(p.title, '''')) @@ plainto_tsquery(''english'', $1)
            OR to_tsvector(''english'', COALESCE(p.description, '''')) @@ plainto_tsquery(''english'', $1)
            OR to_tsvector(''english'', COALESCE(p.content, '''')) @@ plainto_tsquery(''english'', $1)
            OR p.title ILIKE ''%'' || $1 || ''%''
            OR p.category ILIKE ''%'' || $1 || ''%''
            OR p.procedure_code ILIKE ''%'' || $1 || ''%''
        )';
    
    -- Add model filter if provided
    IF model_filter != '' THEN
        where_clause := ' AND ' || REPLACE(model_filter, 'AND ', '');
        base_query := base_query || where_clause;
    END IF;
    
    -- Add ordering and limit
    base_query := base_query || ' ORDER BY search_score DESC, p.title ASC LIMIT $2';
    
    -- Execute dynamic query
    RETURN QUERY EXECUTE base_query USING search_query, search_limit;
END;
$$;

-- Create search function for parts
CREATE OR REPLACE FUNCTION search_wis_parts(
    search_query text,
    model_filter text DEFAULT '',
    search_limit integer DEFAULT 20
)
RETURNS TABLE (
    id UUID,
    vehicle_id UUID,
    part_number TEXT,
    part_name TEXT,
    category TEXT,
    subcategory TEXT,
    description TEXT,
    price_estimate DECIMAL(10,2),
    availability_status TEXT,
    superseded_by TEXT,
    notes TEXT,
    updated_at TIMESTAMP WITH TIME ZONE,
    search_score REAL
) 
LANGUAGE plpgsql
AS $$
DECLARE
    base_query text;
    where_clause text;
BEGIN
    base_query := '
        SELECT 
            p.id,
            p.vehicle_id,
            p.part_number,
            p.part_name,
            p.category,
            p.subcategory,
            p.description,
            p.price_estimate,
            p.availability_status,
            p.superseded_by,
            p.notes,
            p.updated_at,
            (
                (CASE WHEN p.part_number ILIKE ''%'' || $1 || ''%'' THEN 5.0 ELSE 0.0 END) +
                (CASE WHEN p.part_name ILIKE ''%'' || $1 || ''%'' THEN 3.0 ELSE 0.0 END) +
                ts_rank(to_tsvector(''english'', COALESCE(p.description, '''')), plainto_tsquery(''english'', $1)) * 2.0 +
                (CASE WHEN p.category ILIKE ''%'' || $1 || ''%'' THEN 1.5 ELSE 0.0 END)
            ) AS search_score
        FROM wis_parts p
        WHERE (
            p.part_number ILIKE ''%'' || $1 || ''%''
            OR p.part_name ILIKE ''%'' || $1 || ''%''
            OR to_tsvector(''english'', COALESCE(p.description, '''')) @@ plainto_tsquery(''english'', $1)
            OR p.category ILIKE ''%'' || $1 || ''%''
            OR p.subcategory ILIKE ''%'' || $1 || ''%''
        )';
    
    IF model_filter != '' THEN
        where_clause := ' AND ' || REPLACE(model_filter, 'AND ', '');
        base_query := base_query || where_clause;
    END IF;
    
    base_query := base_query || ' ORDER BY search_score DESC, p.part_number ASC LIMIT $2';
    
    RETURN QUERY EXECUTE base_query USING search_query, search_limit;
END;
$$;

-- Create search function for bulletins
CREATE OR REPLACE FUNCTION search_wis_bulletins(
    search_query text,
    model_filter text DEFAULT '',
    search_limit integer DEFAULT 20
)
RETURNS TABLE (
    id UUID,
    vehicle_id UUID,
    bulletin_number TEXT,
    title TEXT,
    category TEXT,
    severity TEXT,
    description TEXT,
    content TEXT,
    date_issued DATE,
    date_updated DATE,
    status TEXT,
    updated_at TIMESTAMP WITH TIME ZONE,
    search_score REAL
) 
LANGUAGE plpgsql
AS $$
DECLARE
    base_query text;
    where_clause text;
BEGIN
    base_query := '
        SELECT 
            b.id,
            b.vehicle_id,
            b.bulletin_number,
            b.title,
            b.category,
            b.severity,
            b.description,
            b.content,
            b.date_issued,
            b.date_updated,
            b.status,
            b.updated_at,
            (
                ts_rank(to_tsvector(''english'', COALESCE(b.title, '''')), plainto_tsquery(''english'', $1)) * 4.0 +
                ts_rank(to_tsvector(''english'', COALESCE(b.description, '''')), plainto_tsquery(''english'', $1)) * 2.0 +
                ts_rank(to_tsvector(''english'', COALESCE(b.content, '''')), plainto_tsquery(''english'', $1)) * 1.0 +
                (CASE WHEN b.bulletin_number ILIKE ''%'' || $1 || ''%'' THEN 3.0 ELSE 0.0 END) +
                (CASE WHEN b.severity = ''critical'' THEN 1.0 ELSE 0.0 END)
            ) AS search_score
        FROM wis_bulletins b
        WHERE (
            to_tsvector(''english'', COALESCE(b.title, '''')) @@ plainto_tsquery(''english'', $1)
            OR to_tsvector(''english'', COALESCE(b.description, '''')) @@ plainto_tsquery(''english'', $1)
            OR to_tsvector(''english'', COALESCE(b.content, '''')) @@ plainto_tsquery(''english'', $1)
            OR b.bulletin_number ILIKE ''%'' || $1 || ''%''
            OR b.category ILIKE ''%'' || $1 || ''%''
        )';
    
    IF model_filter != '' THEN
        where_clause := ' AND ' || REPLACE(model_filter, 'AND ', '');
        base_query := base_query || where_clause;
    END IF;
    
    base_query := base_query || ' ORDER BY search_score DESC, b.date_issued DESC LIMIT $2';
    
    RETURN QUERY EXECUTE base_query USING search_query, search_limit;
END;
$$;

-- Create comprehensive unified search function (Mitchell1 pattern)
CREATE OR REPLACE FUNCTION unified_wis_search(
    search_query text,
    model_id UUID DEFAULT NULL,
    search_limit integer DEFAULT 50
)
RETURNS TABLE (
    doc_id UUID,
    doc_type TEXT,
    title TEXT,
    content_summary TEXT,
    reference_number TEXT,
    category TEXT,
    vehicle_model TEXT,
    search_score REAL,
    result_rank INTEGER
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH ranked_results AS (
        -- Procedures
        SELECT 
            p.id as doc_id,
            'procedure'::text as doc_type,
            p.title,
            COALESCE(p.description, LEFT(p.content, 200)) as content_summary,
            p.procedure_code as reference_number,
            p.category,
            m.model_name as vehicle_model,
            (
                ts_rank(to_tsvector('english', COALESCE(p.title, '')), plainto_tsquery('english', search_query)) * 4.0 +
                ts_rank(to_tsvector('english', COALESCE(p.description, '')), plainto_tsquery('english', search_query)) * 2.0 +
                (CASE WHEN p.title ILIKE '%' || search_query || '%' THEN 2.0 ELSE 0.0 END)
            ) as search_score
        FROM wis_procedures p
        JOIN wis_models m ON p.vehicle_id = m.id
        WHERE (
            to_tsvector('english', COALESCE(p.title, '')) @@ plainto_tsquery('english', search_query)
            OR to_tsvector('english', COALESCE(p.description, '')) @@ plainto_tsquery('english', search_query)
            OR p.title ILIKE '%' || search_query || '%'
            OR p.category ILIKE '%' || search_query || '%'
        )
        AND (model_id IS NULL OR p.vehicle_id = model_id)
        
        UNION ALL
        
        -- Parts
        SELECT 
            p.id as doc_id,
            'part'::text as doc_type,
            p.part_name as title,
            COALESCE(p.description, 'Part number: ' || p.part_number) as content_summary,
            p.part_number as reference_number,
            p.category,
            m.model_name as vehicle_model,
            (
                (CASE WHEN p.part_number ILIKE '%' || search_query || '%' THEN 5.0 ELSE 0.0 END) +
                (CASE WHEN p.part_name ILIKE '%' || search_query || '%' THEN 3.0 ELSE 0.0 END) +
                ts_rank(to_tsvector('english', COALESCE(p.description, '')), plainto_tsquery('english', search_query)) * 2.0
            ) as search_score
        FROM wis_parts p
        JOIN wis_models m ON p.vehicle_id = m.id
        WHERE (
            p.part_number ILIKE '%' || search_query || '%'
            OR p.part_name ILIKE '%' || search_query || '%'
            OR to_tsvector('english', COALESCE(p.description, '')) @@ plainto_tsquery('english', search_query)
            OR p.category ILIKE '%' || search_query || '%'
        )
        AND (model_id IS NULL OR p.vehicle_id = model_id)
        
        UNION ALL
        
        -- Bulletins
        SELECT 
            b.id as doc_id,
            'bulletin'::text as doc_type,
            b.title,
            COALESCE(b.description, LEFT(b.content, 200)) as content_summary,
            b.bulletin_number as reference_number,
            b.category,
            m.model_name as vehicle_model,
            (
                ts_rank(to_tsvector('english', COALESCE(b.title, '')), plainto_tsquery('english', search_query)) * 4.0 +
                ts_rank(to_tsvector('english', COALESCE(b.description, '')), plainto_tsquery('english', search_query)) * 2.0 +
                (CASE WHEN b.severity = 'critical' THEN 1.0 ELSE 0.0 END)
            ) as search_score
        FROM wis_bulletins b
        JOIN wis_models m ON b.vehicle_id = m.id
        WHERE (
            to_tsvector('english', COALESCE(b.title, '')) @@ plainto_tsquery('english', search_query)
            OR to_tsvector('english', COALESCE(b.description, '')) @@ plainto_tsquery('english', search_query)
            OR b.bulletin_number ILIKE '%' || search_query || '%'
            OR b.category ILIKE '%' || search_query || '%'
        )
        AND (model_id IS NULL OR b.vehicle_id = model_id)
    )
    SELECT 
        r.doc_id,
        r.doc_type,
        r.title,
        r.content_summary,
        r.reference_number,
        r.category,
        r.vehicle_model,
        r.search_score,
        ROW_NUMBER() OVER (ORDER BY r.search_score DESC, r.title ASC)::INTEGER as result_rank
    FROM ranked_results r
    WHERE r.search_score > 0
    ORDER BY r.search_score DESC, r.title ASC
    LIMIT search_limit;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION search_wis_procedures(text, text, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION search_wis_parts(text, text, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION search_wis_bulletins(text, text, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION unified_wis_search(text, UUID, integer) TO authenticated;