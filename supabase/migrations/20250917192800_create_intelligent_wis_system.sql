-- Enable vector extension for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- Component Taxonomy Table - Hierarchical structure of all Unimog components
CREATE TABLE wis_component_taxonomy (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    system_name TEXT NOT NULL, -- 'engine_systems', 'transmission_systems', etc.
    subsystem_name TEXT, -- 'om352_engine', 'g85_transmission', etc.
    component_category TEXT NOT NULL, -- 'Engine Block', 'Pistons', 'Valves', etc.
    parent_category TEXT, -- For hierarchical relationships
    level INTEGER NOT NULL DEFAULT 1, -- Depth in hierarchy (1=system, 2=subsystem, 3=component)
    description TEXT,
    metadata JSONB DEFAULT '{}', -- Additional category metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Parts catalog with semantic embeddings
CREATE TABLE wis_parts_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    part_number TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    system_name TEXT NOT NULL,
    subsystem_name TEXT,

    -- Technical specifications
    weight_kg NUMERIC,
    price_eur NUMERIC,
    availability TEXT,
    compatible_years INTEGER[],
    superseded_by TEXT,
    cross_reference TEXT[],

    -- Technical specs (flexible JSON for different part types)
    technical_specs JSONB DEFAULT '{}',

    -- Related parts and dependencies
    related_parts TEXT[], -- Array of part numbers
    required_with TEXT[], -- Parts that must be replaced together

    -- Vector embedding for semantic search
    description_embedding VECTOR(1536), -- OpenAI embedding dimension

    -- Media references
    media_references JSONB DEFAULT '[]', -- Array of media file references

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Component relationships and dependencies
CREATE TABLE wis_component_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_part_number TEXT NOT NULL,
    target_part_number TEXT NOT NULL,
    relationship_type TEXT NOT NULL, -- 'connects_to', 'requires', 'replaces_with', 'compatible_with'
    description TEXT,
    strength NUMERIC DEFAULT 1.0, -- Relationship strength (0.0-1.0)
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),

    FOREIGN KEY (source_part_number) REFERENCES wis_parts_catalog(part_number),
    FOREIGN KEY (target_part_number) REFERENCES wis_parts_catalog(part_number)
);

-- Intelligent media catalog with semantic understanding
CREATE TABLE wis_media_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name TEXT NOT NULL,
    bucket TEXT NOT NULL,
    media_type TEXT NOT NULL, -- 'photo', 'diagram', 'schematic', 'table', 'chart'

    -- Semantic identification
    component_tags TEXT[], -- Auto-extracted component names
    system_tags TEXT[], -- System-level tags (engine, transmission, etc.)
    part_numbers_shown TEXT[], -- Part numbers visible in this media

    -- Content analysis
    description TEXT,
    auto_generated_description TEXT, -- AI-generated description
    visual_features JSONB DEFAULT '{}', -- Color, shape, size analysis

    -- Embeddings for similarity search
    content_embedding VECTOR(1536), -- Content-based embedding
    visual_embedding VECTOR(512), -- Visual feature embedding

    -- Relationships
    related_procedures TEXT[], -- Procedure IDs this media supports
    similar_media UUID[], -- Visually similar media items

    -- Metadata
    file_size_bytes BIGINT,
    dimensions JSONB, -- width, height for images
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Procedure to media mapping with intelligence
CREATE TABLE wis_procedure_media_mapping (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    procedure_id TEXT NOT NULL,
    media_id UUID NOT NULL,
    step_number INTEGER, -- Which step this media supports
    relevance_score NUMERIC DEFAULT 1.0, -- How relevant this media is (0.0-1.0)
    media_role TEXT, -- 'primary', 'supporting', 'reference', 'warning'
    auto_generated BOOLEAN DEFAULT TRUE, -- Whether mapping was auto-generated

    created_at TIMESTAMPTZ DEFAULT NOW(),

    FOREIGN KEY (media_id) REFERENCES wis_media_catalog(id),
    UNIQUE(procedure_id, media_id)
);

-- Semantic search cache for performance
CREATE TABLE wis_semantic_search_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_text TEXT NOT NULL,
    query_embedding VECTOR(1536),
    search_results JSONB NOT NULL, -- Cached results
    result_count INTEGER,
    cache_expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '1 hour'),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_wis_component_taxonomy_system ON wis_component_taxonomy(system_name);
CREATE INDEX idx_wis_component_taxonomy_category ON wis_component_taxonomy(component_category);
CREATE INDEX idx_wis_component_taxonomy_level ON wis_component_taxonomy(level);

CREATE INDEX idx_wis_parts_catalog_part_number ON wis_parts_catalog(part_number);
CREATE INDEX idx_wis_parts_catalog_category ON wis_parts_catalog(category);
CREATE INDEX idx_wis_parts_catalog_system ON wis_parts_catalog(system_name);
CREATE INDEX idx_wis_parts_catalog_availability ON wis_parts_catalog(availability);
CREATE INDEX idx_wis_parts_catalog_years ON wis_parts_catalog USING GIN(compatible_years);

-- Vector similarity search indexes
CREATE INDEX idx_wis_parts_embedding ON wis_parts_catalog USING ivfflat (description_embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_wis_media_content_embedding ON wis_media_catalog USING ivfflat (content_embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_wis_media_visual_embedding ON wis_media_catalog USING ivfflat (visual_embedding vector_cosine_ops) WITH (lists = 100);

-- GIN indexes for array and JSONB columns
CREATE INDEX idx_wis_parts_related_parts ON wis_parts_catalog USING GIN(related_parts);
CREATE INDEX idx_wis_parts_technical_specs ON wis_parts_catalog USING GIN(technical_specs);
CREATE INDEX idx_wis_media_component_tags ON wis_media_catalog USING GIN(component_tags);
CREATE INDEX idx_wis_media_system_tags ON wis_media_catalog USING GIN(system_tags);
CREATE INDEX idx_wis_media_part_numbers ON wis_media_catalog USING GIN(part_numbers_shown);

-- Text search indexes
CREATE INDEX idx_wis_parts_description_fts ON wis_parts_catalog USING GIN(to_tsvector('english', description));
CREATE INDEX idx_wis_media_description_fts ON wis_media_catalog USING GIN(to_tsvector('english', coalesce(description, '') || ' ' || coalesce(auto_generated_description, '')));

-- Relationship indexes
CREATE INDEX idx_wis_relationships_source ON wis_component_relationships(source_part_number);
CREATE INDEX idx_wis_relationships_target ON wis_component_relationships(target_part_number);
CREATE INDEX idx_wis_relationships_type ON wis_component_relationships(relationship_type);

-- Cache indexes
CREATE INDEX idx_wis_semantic_cache_query ON wis_semantic_search_cache(query_text);
CREATE INDEX idx_wis_semantic_cache_expires ON wis_semantic_search_cache(cache_expires_at);

-- Procedure mapping indexes
CREATE INDEX idx_wis_procedure_mapping_procedure ON wis_procedure_media_mapping(procedure_id);
CREATE INDEX idx_wis_procedure_mapping_media ON wis_procedure_media_mapping(media_id);
CREATE INDEX idx_wis_procedure_mapping_relevance ON wis_procedure_media_mapping(relevance_score);

-- Create views for easy querying
CREATE VIEW wis_parts_with_media AS
SELECT
    p.*,
    COALESCE(
        (SELECT json_agg(
            json_build_object(
                'media_id', m.id,
                'file_name', m.file_name,
                'bucket', m.bucket,
                'media_type', m.media_type,
                'description', m.description
            )
        )
        FROM wis_media_catalog m
        WHERE p.part_number = ANY(m.part_numbers_shown)),
        '[]'::json
    ) as related_media
FROM wis_parts_catalog p;

-- View for component hierarchy
CREATE VIEW wis_component_hierarchy AS
WITH RECURSIVE hierarchy AS (
    -- Base case: top-level categories
    SELECT
        id, system_name, subsystem_name, component_category,
        parent_category, level, description,
        ARRAY[component_category] as category_path,
        component_category as root_category
    FROM wis_component_taxonomy
    WHERE parent_category IS NULL

    UNION ALL

    -- Recursive case: child categories
    SELECT
        t.id, t.system_name, t.subsystem_name, t.component_category,
        t.parent_category, t.level, t.description,
        h.category_path || t.component_category,
        h.root_category
    FROM wis_component_taxonomy t
    JOIN hierarchy h ON t.parent_category = h.component_category
)
SELECT * FROM hierarchy;