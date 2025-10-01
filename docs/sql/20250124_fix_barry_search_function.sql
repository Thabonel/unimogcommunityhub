-- Fix Barry AI search function for manual content
-- This ensures Barry can find relevant manual chunks

-- Drop existing conflicting functions
DROP FUNCTION IF EXISTS public.search_manual_chunks(text, float, integer);
DROP FUNCTION IF EXISTS public.search_manual_chunks(vector, integer, float);
DROP FUNCTION IF EXISTS public.search_manual_chunks(vector, float, integer);

-- Create a simple, reliable text-based search function for Barry
CREATE OR REPLACE FUNCTION public.search_manual_chunks_text(
  query_text TEXT,
  match_count INTEGER DEFAULT 5,
  match_threshold FLOAT DEFAULT 0.3
)
RETURNS TABLE (
  id UUID,
  manual_id UUID,
  manual_title TEXT,
  chunk_index INTEGER,
  page_number INTEGER,
  section_title TEXT,
  content TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    mc.id,
    mc.manual_id,
    mc.manual_title,
    mc.chunk_index,
    mc.page_number,
    mc.section_title,
    mc.content,
    0.8::FLOAT as similarity  -- Static similarity for text search
  FROM manual_chunks mc
  WHERE mc.content ILIKE '%' || query_text || '%'
     OR mc.manual_title ILIKE '%' || query_text || '%'
     OR mc.section_title ILIKE '%' || query_text || '%'
  ORDER BY 
    CASE 
      WHEN mc.manual_title ILIKE '%' || query_text || '%' THEN 1
      WHEN mc.section_title ILIKE '%' || query_text || '%' THEN 2
      ELSE 3
    END,
    mc.page_number ASC
  LIMIT match_count;
END;
$$;

-- Create the vector-based function only if embeddings exist
DO $$
DECLARE
    has_embeddings BOOLEAN;
BEGIN
    -- Check if any manual chunks have embeddings
    SELECT EXISTS (
        SELECT 1 FROM manual_chunks 
        WHERE embedding IS NOT NULL 
        LIMIT 1
    ) INTO has_embeddings;
    
    IF has_embeddings THEN
        -- Create vector search function if embeddings exist and pgvector is available
        IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'vector') THEN
            CREATE OR REPLACE FUNCTION public.search_manual_chunks(
              query_embedding vector(1536),
              match_count INTEGER DEFAULT 5,
              match_threshold FLOAT DEFAULT 0.7
            )
            RETURNS TABLE (
              id UUID,
              manual_id UUID,
              manual_title TEXT,
              chunk_index INTEGER,
              page_number INTEGER,
              section_title TEXT,
              content TEXT,
              similarity FLOAT
            )
            LANGUAGE plpgsql
            SECURITY DEFINER
            AS $func$
            BEGIN
              RETURN QUERY
              SELECT 
                mc.id,
                mc.manual_id,
                mc.manual_title,
                mc.chunk_index,
                mc.page_number,
                mc.section_title,
                mc.content,
                (1 - (mc.embedding <=> query_embedding)) as similarity
              FROM manual_chunks mc
              WHERE mc.embedding IS NOT NULL
                AND (1 - (mc.embedding <=> query_embedding)) > match_threshold
              ORDER BY mc.embedding <=> query_embedding
              LIMIT match_count;
            END;
            $func$;
        END IF;
    END IF;
    
    -- Always create fallback text function as primary search_manual_chunks
    CREATE OR REPLACE FUNCTION public.search_manual_chunks(
      query_text TEXT,
      match_count INTEGER DEFAULT 5,
      match_threshold FLOAT DEFAULT 0.3
    )
    RETURNS TABLE (
      id UUID,
      manual_id UUID,
      manual_title TEXT,
      chunk_index INTEGER,
      page_number INTEGER,
      section_title TEXT,
      content TEXT,
      similarity FLOAT
    )
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $func$
    BEGIN
      RETURN QUERY
      SELECT 
        mc.id,
        mc.manual_id,
        mc.manual_title,
        mc.chunk_index,
        mc.page_number,
        mc.section_title,
        mc.content,
        0.8::FLOAT as similarity
      FROM manual_chunks mc
      WHERE mc.content ILIKE '%' || query_text || '%'
         OR mc.manual_title ILIKE '%' || query_text || '%'
         OR mc.section_title ILIKE '%' || query_text || '%'
      ORDER BY 
        CASE 
          WHEN mc.manual_title ILIKE '%' || query_text || '%' THEN 1
          WHEN mc.section_title ILIKE '%' || query_text || '%' THEN 2
          ELSE 3
        END,
        mc.page_number ASC
      LIMIT match_count;
    END;
    $func$;
    
END $$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.search_manual_chunks_text TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_manual_chunks TO authenticated;

-- Create indexes to speed up text searches
CREATE INDEX IF NOT EXISTS idx_manual_chunks_content_gin 
ON manual_chunks USING gin(to_tsvector('english', content));

CREATE INDEX IF NOT EXISTS idx_manual_chunks_title_gin 
ON manual_chunks USING gin(to_tsvector('english', manual_title));

-- Add helpful comment
COMMENT ON FUNCTION public.search_manual_chunks IS 
'Primary search function for Barry AI - searches manual content using text matching. Falls back to vector search if embeddings are available.';