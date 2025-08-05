import { supabase } from '@/integrations/supabase/client';
import { PostWithUser } from '@/types/post';

/**
 * Get posts with pagination using optimized view
 * This replaces multiple queries with a single query to the posts_with_stats view
 * @param limit Number of posts to get
 * @param page Page number (0-based)
 * @returns Array of posts with user info
 */
export const getPosts = async (limit: number = 10, page: number = 0): Promise<PostWithUser[]> => {
  try {
    // Single optimized query using the view
    const { data: posts, error } = await supabase
      .from('posts_with_stats')
      .select('*')
      .eq('visibility', 'public')
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
 * @returns Array of posts with user info
 */
export const getUserPosts = async (
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
    
    if (!posts || posts.length === 0) {
      return [];
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
export const searchPosts = async (
  searchTerm: string, 
  limit: number = 20
): Promise<PostWithUser[]> => {
  try {
    const { data: posts, error } = await supabase
      .from('posts_with_stats')
      .select('*')
      .eq('visibility', 'public')
      .ilike('content', `%${searchTerm}%`)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      throw error;
    }
    
    if (!posts || posts.length === 0) {
      return [];
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

/**
 * Get posts using cursor-based pagination for better performance
 * @param cursor The created_at timestamp to start from
 * @param limit Number of posts to get
 * @returns Array of posts with user info
 */
export const getPostsWithCursor = async (
  cursor?: string,
  limit: number = 10
): Promise<{ posts: PostWithUser[], nextCursor?: string }> => {
  try {
    const { data, error } = await supabase
      .rpc('get_posts_cursor', {
        p_cursor: cursor || null,
        p_limit: limit + 1 // Get one extra to determine if there are more
      });
    
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      return { posts: [] };
    }
    
    // Check if there are more posts
    const hasMore = data.length > limit;
    const posts = hasMore ? data.slice(0, -1) : data;
    const nextCursor = hasMore ? posts[posts.length - 1].created_at : undefined;
    
    // Transform the data
    const transformedPosts = posts.map((post: any) => ({
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
    
    return { posts: transformedPosts, nextCursor };
  } catch (error) {
    console.error('Error fetching posts with cursor:', error);
    return { posts: [] };
  }
};