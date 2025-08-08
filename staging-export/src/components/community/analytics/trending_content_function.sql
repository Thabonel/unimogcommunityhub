
-- Function to get trending content
CREATE OR REPLACE FUNCTION public.get_trending_content(
  content_type TEXT,
  time_ago TIMESTAMPTZ,
  result_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  content_id TEXT,
  engagement_count BIGINT
) 
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    (event_data->>'content_id')::TEXT as content_id,
    COUNT(*) as engagement_count
  FROM public.user_activities
  WHERE 
    event_data->>'content_type' = content_type
    AND event_type IN ('post_like', 'post_comment', 'post_share', 'page_view')
    AND timestamp >= time_ago
  GROUP BY event_data->>'content_id'
  ORDER BY engagement_count DESC
  LIMIT result_limit;
$$;
