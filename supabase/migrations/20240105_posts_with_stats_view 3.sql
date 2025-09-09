-- Create optimized view for posts with user info and stats
-- This eliminates N+1 queries by joining all required data in a single query

CREATE OR REPLACE VIEW public.posts_with_stats AS
SELECT 
  p.id,
  p.user_id,
  p.content,
  p.image_url,
  p.video_url,
  p.post_type,
  p.created_at,
  p.updated_at,
  p.visibility,
  p.metadata,
  -- User profile data
  profiles.avatar_url,
  profiles.full_name,
  profiles.display_name,
  profiles.unimog_model,
  profiles.location,
  profiles.online,
  -- Aggregate counts
  COALESCE(likes.count, 0)::integer as likes_count,
  COALESCE(comments.count, 0)::integer as comments_count,
  COALESCE(shares.count, 0)::integer as shares_count,
  -- Current user interaction status
  EXISTS(
    SELECT 1 FROM post_likes 
    WHERE post_likes.post_id = p.id 
    AND post_likes.user_id = auth.uid()
  ) as user_has_liked,
  EXISTS(
    SELECT 1 FROM post_shares 
    WHERE post_shares.post_id = p.id 
    AND post_shares.user_id = auth.uid()
  ) as user_has_shared
FROM posts p
LEFT JOIN profiles ON profiles.id = p.user_id
LEFT JOIN LATERAL (
  SELECT COUNT(*) as count 
  FROM post_likes 
  WHERE post_likes.post_id = p.id
) likes ON true
LEFT JOIN LATERAL (
  SELECT COUNT(*) as count 
  FROM comments 
  WHERE comments.post_id = p.id
) comments ON true
LEFT JOIN LATERAL (
  SELECT COUNT(*) as count 
  FROM post_shares 
  WHERE post_shares.post_id = p.id
) shares ON true;

-- Grant permissions
GRANT SELECT ON public.posts_with_stats TO authenticated;

-- Create indexes to optimize the view performance
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_visibility ON posts(visibility);

CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);

CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);

CREATE INDEX IF NOT EXISTS idx_post_shares_post_id ON post_shares(post_id);
CREATE INDEX IF NOT EXISTS idx_post_shares_user_id ON post_shares(user_id);

-- Create a function for cursor-based pagination
CREATE OR REPLACE FUNCTION public.get_posts_cursor(
  p_cursor timestamptz DEFAULT NULL,
  p_limit integer DEFAULT 10,
  p_user_id uuid DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  content text,
  image_url text,
  video_url text,
  post_type text,
  created_at timestamptz,
  updated_at timestamptz,
  visibility text,
  metadata jsonb,
  avatar_url text,
  full_name text,
  display_name text,
  unimog_model text,
  location text,
  online boolean,
  likes_count integer,
  comments_count integer,
  shares_count integer,
  user_has_liked boolean,
  user_has_shared boolean
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pws.id,
    pws.user_id,
    pws.content,
    pws.image_url,
    pws.video_url,
    pws.post_type,
    pws.created_at,
    pws.updated_at,
    pws.visibility,
    pws.metadata,
    pws.avatar_url,
    pws.full_name,
    pws.display_name,
    pws.unimog_model,
    pws.location,
    pws.online,
    pws.likes_count,
    pws.comments_count,
    pws.shares_count,
    pws.user_has_liked,
    pws.user_has_shared
  FROM posts_with_stats pws
  WHERE 
    (p_cursor IS NULL OR pws.created_at < p_cursor)
    AND (p_user_id IS NULL OR pws.user_id = p_user_id)
    AND pws.visibility = 'public'
  ORDER BY pws.created_at DESC
  LIMIT p_limit;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_posts_cursor TO authenticated;

-- Add comment explaining the optimization
COMMENT ON VIEW public.posts_with_stats IS 
'Optimized view that joins posts with user profiles and aggregates likes, comments, and shares counts. This eliminates N+1 queries by fetching all required data in a single query.';