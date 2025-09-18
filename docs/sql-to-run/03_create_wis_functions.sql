-- Migration: Create WIS Database Functions
-- This migration creates the database functions needed for WIS tree navigation and search

-- Function: Get hierarchical WIS tree structure
CREATE OR REPLACE FUNCTION get_wis_tree(
    model_id UUID DEFAULT NULL,
    search_query TEXT DEFAULT NULL
)
RETURNS TABLE(
    id UUID,
    type TEXT,
    code TEXT,
    name TEXT,
    description TEXT,
    parent_id UUID,
    level INTEGER,
    procedure_count INTEGER,
    estimated_time DECIMAL,
    icon_name TEXT,
    sort_order INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- If search query is provided, return flattened search results
    IF search_query IS NOT NULL AND length(search_query) > 2 THEN
        RETURN QUERY
        SELECT
            p.id,
            'procedure'::TEXT as type,
            p.procedure_code as code,
            p.title as name,
            p.description,
            p.component_id as parent_id,
            4 as level,
            1 as procedure_count,
            p.estimated_time_hours as estimated_time,
            NULL::TEXT as icon_name,
            0 as sort_order
        FROM wis_procedures p
        JOIN wis_components c ON p.component_id = c.id
        JOIN wis_systems s ON c.system_id = s.id
        JOIN wis_models m ON s.model_id = m.id
        WHERE (model_id IS NULL OR m.id = model_id)
        AND p.search_vector @@ plainto_tsquery('english', search_query)
        AND p.status = 'active'
        ORDER BY ts_rank(p.search_vector, plainto_tsquery('english', search_query)) DESC;
        RETURN;
    END IF;

    -- Return hierarchical tree structure
    -- Level 1: Models
    RETURN QUERY
    SELECT
        m.id,
        'model'::TEXT as type,
        m.model_code as code,
        m.model_name as name,
        m.description,
        NULL::UUID as parent_id,
        1 as level,
        COALESCE(model_counts.total_procedures, 0) as procedure_count,
        NULL::DECIMAL as estimated_time,
        NULL::TEXT as icon_name,
        m.sort_order
    FROM wis_models m
    LEFT JOIN (
        SELECT
            m2.id,
            SUM(c.estimated_procedures) as total_procedures
        FROM wis_models m2
        JOIN wis_systems s2 ON m2.id = s2.model_id
        JOIN wis_components c ON s2.id = c.system_id
        GROUP BY m2.id
    ) model_counts ON m.id = model_counts.id
    WHERE (model_id IS NULL OR m.id = model_id)
    AND m.active = true
    ORDER BY m.sort_order;

    -- Level 2: Systems (only if specific model is selected)
    IF model_id IS NOT NULL THEN
        RETURN QUERY
        SELECT
            s.id,
            'system'::TEXT as type,
            s.system_code as code,
            s.system_name as name,
            s.description,
            s.model_id as parent_id,
            2 as level,
            s.estimated_procedures as procedure_count,
            NULL::DECIMAL as estimated_time,
            s.icon_name,
            s.sort_order
        FROM wis_systems s
        WHERE s.model_id = get_wis_tree.model_id
        ORDER BY s.sort_order;

        -- Level 3: Components
        RETURN QUERY
        SELECT
            c.id,
            'component'::TEXT as type,
            c.component_code as code,
            c.component_name as name,
            c.description,
            c.system_id as parent_id,
            3 as level,
            c.estimated_procedures as procedure_count,
            NULL::DECIMAL as estimated_time,
            NULL::TEXT as icon_name,
            c.sort_order
        FROM wis_components c
        JOIN wis_systems s ON c.system_id = s.id
        WHERE s.model_id = get_wis_tree.model_id
        ORDER BY s.sort_order, c.sort_order;

        -- Level 4: Procedures
        RETURN QUERY
        SELECT
            p.id,
            'procedure'::TEXT as type,
            p.procedure_code as code,
            p.title as name,
            p.description,
            p.component_id as parent_id,
            4 as level,
            1 as procedure_count,
            p.estimated_time_hours as estimated_time,
            NULL::TEXT as icon_name,
            0 as sort_order
        FROM wis_procedures p
        JOIN wis_components c ON p.component_id = c.id
        JOIN wis_systems s ON c.system_id = s.id
        WHERE s.model_id = get_wis_tree.model_id
        AND p.status = 'active'
        ORDER BY s.sort_order, c.sort_order, p.procedure_code;
    END IF;
END;
$$;

-- Function: Comprehensive WIS search
CREATE OR REPLACE FUNCTION wis_comprehensive_search(
    search_query TEXT,
    search_type TEXT DEFAULT 'all',
    model_id UUID DEFAULT NULL,
    system_id UUID DEFAULT NULL,
    limit_results INTEGER DEFAULT 50
)
RETURNS TABLE(
    result_type TEXT,
    id UUID,
    title TEXT,
    description TEXT,
    code TEXT,
    model_code TEXT,
    system_code TEXT,
    component_code TEXT,
    rank REAL
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Search procedures
    IF search_type IN ('all', 'procedures') THEN
        RETURN QUERY
        SELECT
            'procedure'::TEXT as result_type,
            p.id,
            p.title,
            p.description,
            p.procedure_code as code,
            m.model_code,
            s.system_code,
            c.component_code,
            ts_rank(p.search_vector, plainto_tsquery('english', search_query)) as rank
        FROM wis_procedures p
        JOIN wis_components c ON p.component_id = c.id
        JOIN wis_systems s ON c.system_id = s.id
        JOIN wis_models m ON s.model_id = m.id
        WHERE p.search_vector @@ plainto_tsquery('english', search_query)
          AND (wis_comprehensive_search.model_id IS NULL OR m.id = wis_comprehensive_search.model_id)
          AND (wis_comprehensive_search.system_id IS NULL OR s.id = wis_comprehensive_search.system_id)
          AND p.status = 'active'
        ORDER BY rank DESC
        LIMIT limit_results;
    END IF;

    -- Search service bulletins
    IF search_type IN ('all', 'bulletins') THEN
        RETURN QUERY
        SELECT
            'bulletin'::TEXT as result_type,
            b.id,
            b.title,
            b.description,
            b.bulletin_number as code,
            NULL::TEXT as model_code,
            NULL::TEXT as system_code,
            NULL::TEXT as component_code,
            ts_rank(b.search_vector, plainto_tsquery('english', search_query)) as rank
        FROM wis_service_bulletins b
        WHERE b.search_vector @@ plainto_tsquery('english', search_query)
        AND b.status = 'active'
        ORDER BY rank DESC
        LIMIT limit_results;
    END IF;

    -- Search by part number
    IF search_type IN ('all', 'parts') THEN
        RETURN QUERY
        SELECT
            'part'::TEXT as result_type,
            pp.procedure_id as id,
            ('Part: ' || pt.description)::TEXT as title,
            pt.mercedes_part_number as description,
            pt.mercedes_part_number as code,
            m.model_code,
            s.system_code,
            c.component_code,
            1.0::REAL as rank
        FROM wis_parts pt
        JOIN wis_procedure_parts pp ON pt.id = pp.part_id
        JOIN wis_procedures p ON pp.procedure_id = p.id
        JOIN wis_components c ON p.component_id = c.id
        JOIN wis_systems s ON c.system_id = s.id
        JOIN wis_models m ON s.model_id = m.id
        WHERE (pt.mercedes_part_number ILIKE ('%' || search_query || '%')
           OR pt.description ILIKE ('%' || search_query || '%'))
        AND (wis_comprehensive_search.model_id IS NULL OR m.id = wis_comprehensive_search.model_id)
        AND (wis_comprehensive_search.system_id IS NULL OR s.id = wis_comprehensive_search.system_id)
        AND p.status = 'active'
        ORDER BY pt.mercedes_part_number
        LIMIT limit_results;
    END IF;
END;
$$;

-- Function: Get procedure with full details
CREATE OR REPLACE FUNCTION get_wis_procedure_details(
    procedure_id UUID
)
RETURNS TABLE(
    id UUID,
    procedure_code TEXT,
    title TEXT,
    description TEXT,
    estimated_time_hours DECIMAL,
    difficulty_level INTEGER,
    labor_category TEXT,
    overview TEXT,
    safety_warnings TEXT[],
    special_notes TEXT[],
    version TEXT,
    status TEXT,
    model_code TEXT,
    model_name TEXT,
    system_code TEXT,
    system_name TEXT,
    component_code TEXT,
    component_name TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.procedure_code::TEXT,
        p.title::TEXT,
        p.description::TEXT,
        p.estimated_time_hours,
        p.difficulty_level,
        p.labor_category::TEXT,
        p.overview::TEXT,
        p.safety_warnings,
        p.special_notes,
        p.version::TEXT,
        p.status::TEXT,
        m.model_code::TEXT,
        m.model_name::TEXT,
        s.system_code::TEXT,
        s.system_name::TEXT,
        c.component_code::TEXT,
        c.component_name::TEXT,
        p.created_at,
        p.updated_at
    FROM wis_procedures p
    JOIN wis_components c ON p.component_id = c.id
    JOIN wis_systems s ON c.system_id = s.id
    JOIN wis_models m ON s.model_id = m.id
    WHERE p.id = procedure_id;
END;
$$;

-- Function: Get related procedures
CREATE OR REPLACE FUNCTION get_related_procedures(
    procedure_id UUID,
    relationship_types procedure_relationship_type[] DEFAULT NULL
)
RETURNS TABLE(
    id UUID,
    procedure_code TEXT,
    title TEXT,
    description TEXT,
    estimated_time_hours DECIMAL,
    relationship_type procedure_relationship_type,
    relationship_description TEXT,
    sequence_order INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.procedure_code::TEXT,
        p.title::TEXT,
        p.description::TEXT,
        p.estimated_time_hours,
        pr.relationship_type,
        pr.relationship_description::TEXT,
        pr.sequence_order
    FROM wis_procedure_relationships pr
    JOIN wis_procedures p ON pr.target_procedure_id = p.id
    WHERE pr.source_procedure_id = get_related_procedures.procedure_id
    AND (relationship_types IS NULL OR pr.relationship_type = ANY(relationship_types))
    AND p.status = 'active'
    ORDER BY
        CASE pr.relationship_type
            WHEN 'prerequisite' THEN 1
            WHEN 'part_of_series' THEN 2
            WHEN 'follow_up' THEN 3
            WHEN 'related' THEN 4
            WHEN 'alternative' THEN 5
            WHEN 'see_also' THEN 6
            ELSE 7
        END,
        pr.sequence_order NULLS LAST,
        p.procedure_code;
END;
$$;

-- Function: Get procedures that reference this one
CREATE OR REPLACE FUNCTION get_referencing_procedures(
    procedure_id UUID
)
RETURNS TABLE(
    id UUID,
    procedure_code TEXT,
    title TEXT,
    relationship_type procedure_relationship_type,
    relationship_description TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.procedure_code::TEXT,
        p.title::TEXT,
        pr.relationship_type,
        pr.relationship_description::TEXT
    FROM wis_procedure_relationships pr
    JOIN wis_procedures p ON pr.source_procedure_id = p.id
    WHERE pr.target_procedure_id = get_referencing_procedures.procedure_id
    AND p.status = 'active'
    ORDER BY p.procedure_code;
END;
$$;

-- Function: Get procedure parts with details
CREATE OR REPLACE FUNCTION get_procedure_parts(
    procedure_id UUID
)
RETURNS TABLE(
    id UUID,
    mercedes_part_number TEXT,
    description TEXT,
    category TEXT,
    quantity INTEGER,
    usage_note TEXT,
    required BOOLEAN,
    step_numbers INTEGER[],
    specifications JSONB,
    status TEXT,
    alternative_parts TEXT[]
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.mercedes_part_number::TEXT,
        p.description::TEXT,
        p.category::TEXT,
        pp.quantity,
        pp.usage_note::TEXT,
        pp.required,
        pp.step_numbers,
        p.specifications,
        p.status::TEXT,
        p.alternative_parts
    FROM wis_procedure_parts pp
    JOIN wis_parts p ON pp.part_id = p.id
    WHERE pp.procedure_id = get_procedure_parts.procedure_id
    ORDER BY pp.required DESC, p.mercedes_part_number;
END;
$$;

-- Function: Get procedure tools with details
CREATE OR REPLACE FUNCTION get_procedure_tools(
    procedure_id UUID
)
RETURNS TABLE(
    id UUID,
    tool_name TEXT,
    tool_type TEXT,
    mercedes_tool_number TEXT,
    description TEXT,
    required BOOLEAN,
    usage_note TEXT,
    step_numbers INTEGER[],
    specifications JSONB,
    alternative_tools TEXT[]
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.id,
        t.tool_name::TEXT,
        t.tool_type::TEXT,
        t.mercedes_tool_number::TEXT,
        t.description::TEXT,
        pt.required,
        pt.usage_note::TEXT,
        pt.step_numbers,
        t.specifications,
        t.alternative_tools
    FROM wis_procedure_tools pt
    JOIN wis_tools t ON pt.tool_id = t.id
    WHERE pt.procedure_id = get_procedure_tools.procedure_id
    ORDER BY
        CASE t.tool_type
            WHEN 'safety' THEN 1
            WHEN 'special' THEN 2
            WHEN 'standard' THEN 3
            ELSE 4
        END,
        pt.required DESC,
        t.tool_name;
END;
$$;

-- Function: Get service bulletins for procedure
CREATE OR REPLACE FUNCTION get_procedure_bulletins(
    procedure_id UUID
)
RETURNS TABLE(
    id UUID,
    bulletin_number TEXT,
    title TEXT,
    description TEXT,
    content TEXT,
    effective_date DATE,
    severity TEXT,
    category TEXT,
    relationship_type TEXT,
    notes TEXT,
    pdf_url TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        b.id,
        b.bulletin_number::TEXT,
        b.title::TEXT,
        b.description::TEXT,
        b.content::TEXT,
        b.effective_date,
        b.severity::TEXT,
        b.category::TEXT,
        bp.relationship_type::TEXT,
        bp.notes::TEXT,
        b.pdf_url::TEXT
    FROM wis_bulletin_procedures bp
    JOIN wis_service_bulletins b ON bp.bulletin_id = b.id
    WHERE bp.procedure_id = get_procedure_bulletins.procedure_id
    AND b.status = 'active'
    ORDER BY
        CASE b.severity
            WHEN 'critical' THEN 1
            WHEN 'important' THEN 2
            WHEN 'info' THEN 3
            ELSE 4
        END,
        b.effective_date DESC;
END;
$$;