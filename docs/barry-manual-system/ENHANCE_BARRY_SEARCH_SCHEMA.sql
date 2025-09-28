-- Barry Search Enhancement Schema
-- Implements deterministic 3-stage search pipeline
-- Run this first to add required columns and indexes

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Enhance barry_knowledge_base table
ALTER TABLE barry_knowledge_base
ADD COLUMN IF NOT EXISTS norm_keywords text[],
ADD COLUMN IF NOT EXISTS search_fts tsvector,
ADD COLUMN IF NOT EXISTS aliases text[],
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS search_priority integer DEFAULT 100;

-- Enhance u435_manual_index table
ALTER TABLE u435_manual_index
ADD COLUMN IF NOT EXISTS norm_term text,
ADD COLUMN IF NOT EXISTS search_fts tsvector,
ADD COLUMN IF NOT EXISTS aliases text[],
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS search_priority integer DEFAULT 50,
ADD COLUMN IF NOT EXISTS system_category text,
ADD COLUMN IF NOT EXISTS has_safety_warning boolean DEFAULT false;

-- Create search analytics table
CREATE TABLE IF NOT EXISTS barry_search_analytics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid,
    user_query text NOT NULL,
    normalized_query text NOT NULL,
    search_stage text NOT NULL, -- 'curated', 'manual', 'fallback'
    results_count integer DEFAULT 0,
    top_match_term text,
    top_match_source text, -- 'barry_knowledge_base' or 'u435_manual_index'
    response_time_ms integer,
    created_at timestamp with time zone DEFAULT now()
);

-- Create Barry personality templates table
CREATE TABLE IF NOT EXISTS barry_personality_templates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    template_type text NOT NULL, -- 'assessment', 'pointer', 'safety', 'barryism'
    system_category text, -- 'engine', 'transmission', 'brakes', etc. or NULL for general
    template_text text NOT NULL,
    usage_weight integer DEFAULT 100, -- for random selection weighting
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);

-- Create high-performance indexes for search
CREATE INDEX IF NOT EXISTS idx_barry_kb_norm_keywords
ON barry_knowledge_base USING GIN(norm_keywords);

CREATE INDEX IF NOT EXISTS idx_barry_kb_search_fts
ON barry_knowledge_base USING GIN(search_fts);

CREATE INDEX IF NOT EXISTS idx_barry_kb_aliases
ON barry_knowledge_base USING GIN(aliases);

CREATE INDEX IF NOT EXISTS idx_barry_kb_active_priority
ON barry_knowledge_base(is_active, search_priority DESC)
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_manual_norm_term_trigram
ON u435_manual_index USING GIN(norm_term gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_manual_search_fts
ON u435_manual_index USING GIN(search_fts);

CREATE INDEX IF NOT EXISTS idx_manual_aliases
ON u435_manual_index USING GIN(aliases);

CREATE INDEX IF NOT EXISTS idx_manual_active_priority
ON u435_manual_index(is_active, search_priority DESC, system_category)
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_manual_system_category
ON u435_manual_index(system_category)
WHERE system_category IS NOT NULL;

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_search_analytics_created
ON barry_search_analytics(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_search_analytics_user
ON barry_search_analytics(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_search_analytics_stage
ON barry_search_analytics(search_stage);

-- Personality templates indexes
CREATE INDEX IF NOT EXISTS idx_personality_type_category
ON barry_personality_templates(template_type, system_category)
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_personality_weighted
ON barry_personality_templates(template_type, usage_weight DESC)
WHERE is_active = true;

-- Helper function for text normalization
CREATE OR REPLACE FUNCTION normalize_search_text(input_text text)
RETURNS text AS $$
BEGIN
    RETURN lower(unaccent(trim(input_text)));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Helper function for trigram similarity search
CREATE OR REPLACE FUNCTION trigram_search_similarity(search_term text, target_text text)
RETURNS float AS $$
BEGIN
    RETURN similarity(normalize_search_text(search_term), normalize_search_text(target_text));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Verify schema changes
SELECT 'Schema enhancement complete' as status,
       'barry_knowledge_base columns: ' || array_to_string(ARRAY(
           SELECT column_name
           FROM information_schema.columns
           WHERE table_name = 'barry_knowledge_base'
           AND column_name IN ('norm_keywords', 'search_fts', 'aliases', 'is_active', 'search_priority')
       ), ', ') as kb_columns,
       'u435_manual_index columns: ' || array_to_string(ARRAY(
           SELECT column_name
           FROM information_schema.columns
           WHERE table_name = 'u435_manual_index'
           AND column_name IN ('norm_term', 'search_fts', 'aliases', 'is_active', 'search_priority', 'system_category')
       ), ', ') as manual_columns;