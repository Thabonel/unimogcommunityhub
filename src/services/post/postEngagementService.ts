
import { supabase } from '@/lib/supabase-client';
import { withSupabaseRetry } from '@/utils/database-retry';

/**
 * Toggle like on a post
 * @param postId Post ID
 * @returns True if post is liked, false if unliked
 */
export const toggleLikePost = async (postId: string): Promise<boolean> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      throw new Error('User not authenticated');
    }
    
    const userId = userData.user.id;
    
    // Check if the user has already liked the post
    const { data: existingLike, error: checkError } = await withSupabaseRetry(() =>
      supabase
        .from('post_likes')
        .select()
        .eq('post_id', postId)
        .eq('user_id', userId)
        .maybeSingle()
    );
    
    if (checkError) {
      throw checkError;
    }
    
    if (existingLike) {
      // Unlike the post
      const { error: unlikeError } = await withSupabaseRetry(() =>
        supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId)
      );
      
      if (unlikeError) {
        throw unlikeError;
      }
      
      return false;
    } else {
      // Like the post
      const { error: likeError } = await withSupabaseRetry(() =>
        supabase
          .from('post_likes')
          .insert({ post_id: postId, user_id: userId })
      );
      
      if (likeError) {
        throw likeError;
      }
      
      return true;
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};

/**
 * Share a post
 * @param postId Post ID
 * @returns The share ID
 */
export const sharePost = async (postId: string): Promise<string | null> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await withSupabaseRetry(() =>
      supabase
        .from('post_shares')
        .insert({ post_id: postId, user_id: userData.user.id })
        .select()
        .single()
    );
    
    if (error) {
      throw error;
    }
    
    return data.id;
  } catch (error) {
    console.error('Error sharing post:', error);
    throw error;
  }
};
