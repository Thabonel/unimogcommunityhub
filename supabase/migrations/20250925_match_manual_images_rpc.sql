-- Create RPC function for matching manual images using vector similarity
-- This function finds relevant manual pages with visual content based on semantic similarity

CREATE OR REPLACE FUNCTION match_manual_images(
  query_embedding vector(768),
  match_count int,
  manual_ids text[]
)
RETURNS TABLE(
  id text,
  manual_id text,
  section_title text,
  page_number int,
  page_image_url text,
  similarity float
)
LANGUAGE sql STABLE AS $$
  SELECT
    id::text,
    manual_id::text,
    section_title,
    page_number,
    page_image_url,
    1 - (embedding <=> query_embedding) as similarity
  FROM manual_chunks
  WHERE has_visual_elements = true
    AND page_image_url IS NOT NULL
    AND embedding IS NOT NULL
    AND (manual_ids IS NULL OR manual_id = ANY(manual_ids))
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION match_manual_images TO authenticated;
GRANT EXECUTE ON FUNCTION match_manual_images TO service_role;