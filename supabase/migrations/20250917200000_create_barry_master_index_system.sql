-- Enable pgvector extension for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- Master index table - Barry's central catalog of all available content
CREATE TABLE IF NOT EXISTS wis_master_index (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type TEXT NOT NULL CHECK (content_type IN ('part', 'procedure', 'bulletin', 'chunk')),
    content_id TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    description TEXT,
    keywords TEXT[],
    media_count INTEGER DEFAULT 0,
    has_photos BOOLEAN DEFAULT FALSE,
    has_diagrams BOOLEAN DEFAULT FALSE,
    has_schematics BOOLEAN DEFAULT FALSE,
    has_tables BOOLEAN DEFAULT FALSE,
    has_charts BOOLEAN DEFAULT FALSE,
    search_vector TSVECTOR,
    embedding VECTOR(1536),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(content_type, content_id)
);

-- Content relationships - how parts/procedures/bulletins relate to each other
CREATE TABLE IF NOT EXISTS wis_content_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_type TEXT NOT NULL,
    source_id TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    relationship_type TEXT NOT NULL CHECK (relationship_type IN (
        'part_used_in_procedure',
        'procedure_references_part',
        'bulletin_affects_part',
        'part_supersedes_part',
        'related_parts',
        'procedure_prerequisite',
        'component_assembly',
        'troubleshooting_guide'
    )),
    strength FLOAT DEFAULT 1.0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(source_type, source_id, target_type, target_id, relationship_type)
);

-- Smart media catalog with context tags
CREATE TABLE IF NOT EXISTS wis_media_index (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type TEXT NOT NULL,
    content_id TEXT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('photo', 'diagram', 'schematic', 'table', 'chart')),
    bucket_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    thumbnail_path TEXT,
    description TEXT,
    context_tags TEXT[],
    categories TEXT[],
    view_priority INTEGER DEFAULT 0,
    file_size_bytes BIGINT,
    width_px INTEGER,
    height_px INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (content_type, content_id) REFERENCES wis_master_index(content_type, content_id) ON DELETE CASCADE,
    UNIQUE(bucket_name, file_path)
);

-- Pre-computed search cache for common queries
CREATE TABLE IF NOT EXISTS wis_search_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_hash TEXT NOT NULL UNIQUE,
    query_text TEXT NOT NULL,
    query_type TEXT NOT NULL CHECK (query_type IN ('semantic', 'keyword', 'category', 'media')),
    results JSONB NOT NULL,
    result_count INTEGER NOT NULL,
    cache_hit_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '24 hours',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Barry's knowledge graph for intelligent recommendations
CREATE TABLE IF NOT EXISTS wis_knowledge_graph (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    entity_name TEXT NOT NULL,
    context_cluster TEXT,
    importance_score FLOAT DEFAULT 0.0,
    connection_count INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMPTZ,
    access_frequency INTEGER DEFAULT 0,
    embedding VECTOR(1536),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(entity_type, entity_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_wis_master_index_content_type ON wis_master_index(content_type);
CREATE INDEX IF NOT EXISTS idx_wis_master_index_category ON wis_master_index(category, subcategory);
CREATE INDEX IF NOT EXISTS idx_wis_master_index_search ON wis_master_index USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_wis_master_index_embedding ON wis_master_index USING ivfflat(embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_wis_content_relationships_source ON wis_content_relationships(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_wis_content_relationships_target ON wis_content_relationships(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_wis_content_relationships_type ON wis_content_relationships(relationship_type);

CREATE INDEX IF NOT EXISTS idx_wis_media_index_content ON wis_media_index(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_wis_media_index_type ON wis_media_index(media_type);
CREATE INDEX IF NOT EXISTS idx_wis_media_index_priority ON wis_media_index(view_priority DESC);
CREATE INDEX IF NOT EXISTS idx_wis_media_index_tags ON wis_media_index USING GIN(context_tags);

CREATE INDEX IF NOT EXISTS idx_wis_search_cache_hash ON wis_search_cache(query_hash);
CREATE INDEX IF NOT EXISTS idx_wis_search_cache_expires ON wis_search_cache(expires_at);

CREATE INDEX IF NOT EXISTS idx_wis_knowledge_graph_entity ON wis_knowledge_graph(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_wis_knowledge_graph_cluster ON wis_knowledge_graph(context_cluster);
CREATE INDEX IF NOT EXISTS idx_wis_knowledge_graph_embedding ON wis_knowledge_graph USING ivfflat(embedding vector_cosine_ops) WITH (lists = 50);

-- Views for Barry's intelligent queries
CREATE OR REPLACE VIEW barry_content_catalog AS
SELECT
    mi.id,
    mi.content_type,
    mi.content_id,
    mi.title,
    mi.category,
    mi.subcategory,
    mi.description,
    mi.keywords,
    mi.media_count,
    mi.has_photos,
    mi.has_diagrams,
    mi.has_schematics,
    COALESCE(rel_count.count, 0) as relationship_count,
    COALESCE(media_types.types, ARRAY[]::TEXT[]) as available_media_types
FROM wis_master_index mi
LEFT JOIN (
    SELECT
        source_type as content_type,
        source_id as content_id,
        COUNT(*) as count
    FROM wis_content_relationships
    GROUP BY source_type, source_id
    UNION ALL
    SELECT
        target_type as content_type,
        target_id as content_id,
        COUNT(*) as count
    FROM wis_content_relationships
    GROUP BY target_type, target_id
) rel_count ON mi.content_type = rel_count.content_type AND mi.content_id = rel_count.content_id
LEFT JOIN (
    SELECT
        content_type,
        content_id,
        ARRAY_AGG(DISTINCT media_type) as types
    FROM wis_media_index
    GROUP BY content_type, content_id
) media_types ON mi.content_type = media_types.content_type AND mi.content_id = media_types.content_id;

-- Function to update search vectors
CREATE OR REPLACE FUNCTION update_wis_master_index_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(array_to_string(NEW.keywords, ' '), '')), 'C') ||
        setweight(to_tsvector('english', COALESCE(NEW.category, '')), 'D') ||
        setweight(to_tsvector('english', COALESCE(NEW.subcategory, '')), 'D');

    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_wis_master_index_search_vector
    BEFORE INSERT OR UPDATE ON wis_master_index
    FOR EACH ROW EXECUTE FUNCTION update_wis_master_index_search_vector();

-- Function to clean expired cache entries
CREATE OR REPLACE FUNCTION cleanup_expired_search_cache()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM wis_search_cache WHERE expires_at < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;