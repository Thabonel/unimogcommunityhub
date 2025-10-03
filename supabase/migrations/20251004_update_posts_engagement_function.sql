-- Migration: Update get_posts_with_engagement function to work with new foreign keys
-- Issue: Function was created before foreign key migrations, still referencing old schema
-- Fix: Update function to work with auth.users instead of profiles
-- Date: 2025-10-04

-- ============================================
-- FORWARD MIGRATION
-- ============================================

-- Drop the old function
DROP FUNCTION IF EXISTS get_posts_with_engagement(INT, INT);

-- Create updated function that works with new foreign key structure
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
    -- Fixed: Check against auth.users(id) instead of profiles(id)
    EXISTS(
      SELECT 1
      FROM post_likes
      WHERE post_id = cp.id
        AND user_id = auth.uid()
    ) as user_has_liked
  FROM community_posts cp
  LEFT JOIN profiles p ON cp.author_id = p.id
  ORDER BY cp.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_posts_with_engagement(INT, INT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_posts_with_engagement(INT, INT) TO anon;

-- Add comment explaining the function
COMMENT ON FUNCTION get_posts_with_engagement(INT, INT) IS
'Fetches community posts with engagement metrics (likes, comments, shares) and user interaction state. Updated to work with auth.users foreign keys.';

-- ============================================
-- VERIFICATION QUERY (Run separately to check)
-- ============================================
-- Test the function returns data correctly:
-- SELECT * FROM get_posts_with_engagement(5, 0);
--
-- Check if user_has_liked works:
-- SELECT id, title, likes_count, user_has_liked
-- FROM get_posts_with_engagement(10, 0);

-- ============================================
-- ROLLBACK SCRIPT (Run if migration fails)
-- ============================================
-- DROP FUNCTION IF EXISTS get_posts_with_engagement(INT, INT);
--
-- Restore original function (from 20251003_create_posts_engagement_function.sql):
-- CREATE OR REPLACE FUNCTION get_posts_with_engagement(p_limit INT DEFAULT 10, p_offset INT DEFAULT 0)
-- RETURNS TABLE (...)
-- AS $$ ... $$;
