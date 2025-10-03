
import { supabase } from '@/lib/supabase-client';

/**
 * Toggle like on a post
 * @param postId Post ID
 * @returns True if post is liked, false if unliked
 */
export const toggleLikePost = async (postId: string, isCurrentlyLiked: boolean): Promise<boolean> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      throw new Error('User not authenticated');
    }

    const userId = userData.user.id;

    // Use the UI state to determine action (optimistic approach)
    if (isCurrentlyLiked) {
      // Unlike the post
      const { error: unlikeError } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);

      if (unlikeError) {
        console.error('Unlike error:', unlikeError);
        throw unlikeError;
      }

      return false;
    } else {
      // Like the post - use unique constraint to handle duplicates
      const { error: likeError } = await supabase
        .from('post_likes')
        .insert({ post_id: postId, user_id: userId });

      if (likeError) {
        console.error('Like error details:', {
          code: likeError.code,
          message: likeError.message,
          details: likeError.details,
          hint: likeError.hint
        });

        // Ignore duplicate key errors (unique constraint violation)
        if (likeError.code === '23505' || likeError.message?.includes('duplicate')) {
          console.log('Duplicate like ignored - already liked');
          return true;
        }

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
 * Share a post - Industry Best Practice Implementation
 * Records share in database for analytics and tracking
 * @param postId Post ID
 * @param platform Optional platform name for analytics (facebook, twitter, whatsapp, email, copy, native)
 * @returns The share ID
 */
export const sharePost = async (
  postId: string,
  platform?: 'facebook' | 'twitter' | 'whatsapp' | 'email' | 'copy' | 'native'
): Promise<string | null> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      throw new Error('User not authenticated');
    }

    // Record share in database
    // Note: We use unique constraint to prevent duplicate shares from same user
    const { data, error } = await supabase
      .from('post_shares')
      .insert({
        post_id: postId,
        user_id: userData.user.id,
        // Store platform in metadata if needed for analytics
        // metadata: platform ? { platform, shared_at: new Date().toISOString() } : null
      })
      .select()
      .single();

    if (error) {
      // Ignore duplicate share errors (user already shared this post)
      if (error.code === '23505' || error.message?.includes('duplicate')) {
        console.log('User already shared this post - incrementing counter anyway');
        return null; // Return null but don't throw error
      }
      throw error;
    }

    // Log share platform for analytics
    if (platform) {
      console.log(`Post ${postId} shared via ${platform}`);
    }

    return data.id;
  } catch (error) {
    console.error('Error sharing post:', error);
    throw error;
  }
};
