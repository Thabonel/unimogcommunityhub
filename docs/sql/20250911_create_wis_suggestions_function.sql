-- Create WIS suggestion function for predictive search
-- This searches actual WIS procedures, parts, and bulletins for human users

CREATE OR REPLACE FUNCTION wis_suggest_titles(
    search_query TEXT,
    model_filter TEXT DEFAULT NULL,
    limit_rows INTEGER DEFAULT 10
)
RETURNS TABLE (
    suggestion TEXT,
    doc_type TEXT,
    reference_number TEXT,
    relevance_score FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    WITH suggestions AS (
        -- Procedures
        SELECT DISTINCT
            p.title as suggestion,
            'procedure'::TEXT as doc_type,
            p.procedure_code as reference_number,
            CASE 
                WHEN p.title ILIKE (search_query || '%') THEN 3.0
                WHEN p.title ILIKE ('%' || search_query || '%') THEN 2.0
                WHEN p.category ILIKE ('%' || search_query || '%') THEN 1.5
                ELSE 1.0
            END as relevance_score
        FROM wis_procedures p
        LEFT JOIN wis_models m ON p.vehicle_id = m.id
        WHERE (
            p.title ILIKE ('%' || search_query || '%')
            OR p.category ILIKE ('%' || search_query || '%')
            OR p.procedure_code ILIKE ('%' || search_query || '%')
        )
        AND (model_filter IS NULL OR m.model_name ILIKE ('%' || model_filter || '%'))
        
        UNION ALL
        
        -- Parts
        SELECT DISTINCT
            p.part_name as suggestion,
            'part'::TEXT as doc_type,
            p.part_number as reference_number,
            CASE 
                WHEN p.part_name ILIKE (search_query || '%') THEN 3.0
                WHEN p.part_number ILIKE ('%' || search_query || '%') THEN 2.5
                WHEN p.part_name ILIKE ('%' || search_query || '%') THEN 2.0
                WHEN p.category ILIKE ('%' || search_query || '%') THEN 1.5
                ELSE 1.0
            END as relevance_score
        FROM wis_parts p
        LEFT JOIN wis_models m ON p.vehicle_id = m.id
        WHERE (
            p.part_name ILIKE ('%' || search_query || '%')
            OR p.part_number ILIKE ('%' || search_query || '%')
            OR p.category ILIKE ('%' || search_query || '%')
        )
        AND (model_filter IS NULL OR m.model_name ILIKE ('%' || model_filter || '%'))
        
        UNION ALL
        
        -- Bulletins
        SELECT DISTINCT
            b.title as suggestion,
            'bulletin'::TEXT as doc_type,
            b.bulletin_number as reference_number,
            CASE 
                WHEN b.title ILIKE (search_query || '%') THEN 3.0
                WHEN b.title ILIKE ('%' || search_query || '%') THEN 2.0
                WHEN b.category ILIKE ('%' || search_query || '%') THEN 1.5
                ELSE 1.0
            END as relevance_score
        FROM wis_bulletins b
        LEFT JOIN wis_models m ON b.vehicle_id = m.id
        WHERE (
            b.title ILIKE ('%' || search_query || '%')
            OR b.category ILIKE ('%' || search_query || '%')
            OR b.bulletin_number ILIKE ('%' || search_query || '%')
        )
        AND (model_filter IS NULL OR m.model_name ILIKE ('%' || model_filter || '%'))
    )
    SELECT 
        s.suggestion,
        s.doc_type,
        s.reference_number,
        s.relevance_score
    FROM suggestions s
    WHERE s.relevance_score > 0
    ORDER BY s.relevance_score DESC, LENGTH(s.suggestion) ASC
    LIMIT limit_rows;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION wis_suggest_titles(TEXT, TEXT, INTEGER) TO authenticated;

-- Add comment
COMMENT ON FUNCTION wis_suggest_titles IS 
'Provides predictive search suggestions from WIS procedures, parts, and bulletins for human users';