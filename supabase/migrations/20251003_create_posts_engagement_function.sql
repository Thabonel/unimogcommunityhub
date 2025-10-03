CREATE OR REPLACE FUNCTION get_posts_with_engagement(
  p_limit INT DEFAULT 10,
  p_offset INT DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  author_id UUID,
  title TEXT,
  content TEXT,
  image_url TEXT,
  category TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  visibility TEXT,
  avatar_url TEXT,
  full_name TEXT,
  display_name TEXT,
  unimog_model TEXT,
  location TEXT,
  online BOOLEAN,
  likes_count BIGINT,
  comments_count BIGINT,
  shares_count BIGINT,
  user_has_liked BOOLEAN
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT
    cp.id,
    cp.author_id,
    cp.title,
    cp.content,
    cp.image_url,
    cp.category,
    cp.tags,
    cp.created_at,
    cp.updated_at,
    cp.visibility,
    p.avatar_url,
    p.full_name,
    p.display_name,
    p.unimog_model,
    p.location,
    p.online,
    (SELECT COUNT(*) FROM post_likes WHERE post_id = cp.id)::BIGINT as likes_count,
    (SELECT COUNT(*) FROM post_comments WHERE post_id = cp.id)::BIGINT as comments_count,
    (SELECT COUNT(*) FROM post_shares WHERE post_id = cp.id)::BIGINT as shares_count,
    EXISTS(SELECT 1 FROM post_likes WHERE post_id = cp.id AND user_id = auth.uid()) as user_has_liked
  FROM community_posts cp
  LEFT JOIN profiles p ON cp.author_id = p.id
  ORDER BY cp.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
$$;
