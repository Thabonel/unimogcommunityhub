-- Fix the broken match_manual_images function with correct vector dimensions
-- The function was created with vector(384) but database embeddings are vector(768)

DROP FUNCTION IF EXISTS public.match_manual_images(vector, int, uuid[]);

CREATE OR REPLACE FUNCTION public.match_manual_images(
  query_embedding vector(768),
  match_count int,
  manual_ids uuid[] DEFAULT NULL
)
RETURNS TABLE(
  id uuid,
  manual_id uuid,
  section_title text,
  page_number int,
  page_image_url text,
  similarity float4
)
LANGUAGE sql STABLE AS $$
  SELECT
    mc.id,
    mc.manual_id,
    mc.section_title,
    mc.page_number,
    mc.page_image_url,
    (1 - (mc.embedding <=> query_embedding))::float4 as similarity
  FROM public.manual_chunks mc
  WHERE mc.has_visual_elements = true
    AND mc.page_image_url IS NOT NULL
    AND (manual_ids IS NULL OR mc.manual_id = ANY(manual_ids))
  ORDER BY mc.embedding <=> query_embedding
  LIMIT GREATEST(1, match_count);
$$;

GRANT EXECUTE ON FUNCTION match_manual_images TO authenticated;
GRANT EXECUTE ON FUNCTION match_manual_images TO service_role;