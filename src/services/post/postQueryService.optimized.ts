import { supabase } from '@/lib/supabase-client';
import { PostWithUser } from '@/types/post';

/**
 * Optimized query service that uses JOINs and aggregates to avoid N+1 queries
 */

// Create a view in the database for optimized post queries
export const createPostsView = `
CREATE OR REPLACE VIEW public.posts_with_stats AS
SELECT 
  p.*,
  profiles.avatar_url,
  profiles.full_name,
  profiles.display_name,
  profiles.unimog_model,
  profiles.location,
  profiles.online,
  COALESCE(likes.count, 0) as likes_count,
  COALESCE(comments.count, 0) as comments_count,
  COALESCE(shares.count, 0) as shares_count,
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
`;

/**
 * Get posts with pagination using optimized view
 * @param limit Number of posts to get
 * @param page Page number (0-based)
 * @returns Array of posts with user info and stats
 */
export const getPostsOptimized = async (limit: number = 10, page: number = 0): Promise<PostWithUser[]> => {
  try {
    // Single query to get all data
    const { data: posts, error } = await supabase
      .from('posts_with_stats')
      .select('*')
      .order('created_at', { ascending: false })
      .range(page * limit, (page + 1) * limit - 1);
    
    if (error) {
      throw error;
    }
    
    if (!posts || posts.length === 0) {
      return [];
    }
    
    // Transform the data to match the expected format
    return posts.map(post => ({
      id: post.id,
      user_id: post.user_id,
      content: post.content,
      image_url: post.image_url,
      video_url: post.video_url,
      post_type: post.post_type,
      created_at: post.created_at,
      updated_at: post.updated_at,
      visibility: post.visibility,
      metadata: post.metadata,
      user: {
        id: post.user_id,
        avatar_url: post.avatar_url,
        full_name: post.full_name,
        display_name: post.display_name,
        unimog_model: post.unimog_model,
        location: post.location,
        online: post.online
      },
      likes_count: post.likes_count,
      comments_count: post.comments_count,
      shares_count: post.shares_count,
      user_has_liked: post.user_has_liked,
      user_has_shared: post.user_has_shared
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

/**
 * Get posts by user ID with optimized query
 * @param userId User ID to filter by
 * @param limit Number of posts to get
 * @param page Page number (0-based)
 * @returns Array of posts with user info and stats
 */
export const getUserPostsOptimized = async (
  userId: string, 
  limit: number = 10, 
  page: number = 0
): Promise<PostWithUser[]> => {
  try {
    const { data: posts, error } = await supabase
      .from('posts_with_stats')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(page * limit, (page + 1) * limit - 1);
    
    if (error) {
      throw error;
    }
    
    return posts.map(post => ({
      id: post.id,
      user_id: post.user_id,
      content: post.content,
      image_url: post.image_url,
      video_url: post.video_url,
      post_type: post.post_type,
      created_at: post.created_at,
      updated_at: post.updated_at,
      visibility: post.visibility,
      metadata: post.metadata,
      user: {
        id: post.user_id,
        avatar_url: post.avatar_url,
        full_name: post.full_name,
        display_name: post.display_name,
        unimog_model: post.unimog_model,
        location: post.location,
        online: post.online
      },
      likes_count: post.likes_count,
      comments_count: post.comments_count,
      shares_count: post.shares_count,
      user_has_liked: post.user_has_liked,
      user_has_shared: post.user_has_shared
    }));
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return [];
  }
};

/**
 * Search posts with optimized query
 * @param searchTerm Search term
 * @param limit Number of posts to get
 * @returns Array of posts matching search
 */
export const searchPostsOptimized = async (
  searchTerm: string, 
  limit: number = 20
): Promise<PostWithUser[]> => {
  try {
    const { data: posts, error } = await supabase
      .from('posts_with_stats')
      .select('*')
      .ilike('content', `%${searchTerm}%`)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      throw error;
    }
    
    return posts.map(post => ({
      id: post.id,
      user_id: post.user_id,
      content: post.content,
      image_url: post.image_url,
      video_url: post.video_url,
      post_type: post.post_type,
      created_at: post.created_at,
      updated_at: post.updated_at,
      visibility: post.visibility,
      metadata: post.metadata,
      user: {
        id: post.user_id,
        avatar_url: post.avatar_url,
        full_name: post.full_name,
        display_name: post.display_name,
        unimog_model: post.unimog_model,
        location: post.location,
        online: post.online
      },
      likes_count: post.likes_count,
      comments_count: post.comments_count,
      shares_count: post.shares_count,
      user_has_liked: post.user_has_liked,
      user_has_shared: post.user_has_shared
    }));
  } catch (error) {
    console.error('Error searching posts:', error);
    return [];
  }
};