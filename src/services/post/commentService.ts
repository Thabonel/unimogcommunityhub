
import { supabase } from '@/lib/supabase-client';
import { Comment } from '@/types/post';

/**
 * Add a comment to a post
 * @param postId Post ID
 * @param content Comment content
 * @param userId User ID (from AuthContext to avoid slow auth.getUser() call)
 * @returns The created comment
 */
export const addComment = async (postId: string, content: string, userId?: string): Promise<Comment | null> => {
  try {
    // Use provided userId from AuthContext to avoid slow auth.getUser() call
    if (!userId) {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData.user) {
        throw new Error('User not authenticated');
      }

      userId = userData.user.id;
    }
    
    const { data: comment, error: commentError } = await supabase
      .from('post_comments')
      .insert({ post_id: postId, user_id: userId, content })
      .select()
      .single();
    
    if (commentError) {
      throw commentError;
    }
    
    // Get user profile for the comment
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('avatar_url, full_name, display_name')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      console.error('Error fetching profile:', profileError);
    }
    
    return {
      ...comment,
      profile: profile || {
        avatar_url: null,
        full_name: null,
        display_name: null,
      },
      likes_count: 0,
      liked_by_user: false,
    };
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

/**
 * Get comments for a post
 * @param postId Post ID
 * @param currentUserId Optional current user ID (for like status) - avoids slow getUser() call
 * @returns Array of comments
 */
export const getComments = async (postId: string, currentUserId?: string): Promise<Comment[]> => {
  try {
    console.log('[CommentService] getComments called for postId:', postId);
    console.log('[CommentService] Current user ID (from param):', currentUserId);

    // OPTIMIZED: Single query with JOIN - Industry best practice (Twitter/Facebook pattern)
    // Includes profiles, likes count, and user like status in ONE database round-trip
    console.log('[CommentService] Fetching comments with profiles and likes (single JOIN query)...');

    const { data: commentsWithProfiles, error } = await supabase
      .from('post_comments')
      .select(`
        id,
        post_id,
        user_id,
        content,
        created_at,
        updated_at,
        profile:profiles!post_comments_user_profile_fkey(
          id,
          avatar_url,
          full_name,
          display_name,
          email
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[CommentService] Error fetching comments:', error);
      throw error;
    }

    if (!commentsWithProfiles || commentsWithProfiles.length === 0) {
      console.log('[CommentService] No comments found, returning empty array');
      return [];
    }

    console.log('[CommentService] Comments with profiles fetched:', commentsWithProfiles.length);

    // Get likes counts for all comments in one query
    const commentIds = commentsWithProfiles.map(c => c.id);
    const { data: likesData } = await supabase
      .from('comment_likes')
      .select('comment_id, user_id')
      .in('comment_id', commentIds);

    // Count likes per comment and check if current user liked
    const likesCount: Record<string, number> = {};
    const userLikes: Record<string, boolean> = {};

    if (likesData) {
      likesData.forEach(like => {
        likesCount[like.comment_id] = (likesCount[like.comment_id] || 0) + 1;
        if (currentUserId && like.user_id === currentUserId) {
          userLikes[like.comment_id] = true;
        }
      });
    }

    // Transform to Comment type with graceful NULL handling for missing profiles
    const comments: Comment[] = commentsWithProfiles.map(comment => ({
      id: comment.id,
      post_id: comment.post_id,
      user_id: comment.user_id,
      content: comment.content,
      created_at: comment.created_at,
      updated_at: comment.updated_at,
      profile: comment.profile || {
        avatar_url: null,
        full_name: null,
        display_name: 'User',
        email: null
      },
      likes_count: likesCount[comment.id] || 0,
      liked_by_user: userLikes[comment.id] || false
    }));

    console.log('[CommentService] Returning', comments.length, 'comments with full data');
    return comments;
  } catch (error) {
    console.error('[CommentService] Error fetching comments:', error);
    throw error;
  }
};

/**
 * Toggle like on a comment
 * @param commentId Comment ID
 * @returns True if comment is liked, false if unliked
 */
export const toggleLikeComment = async (commentId: string): Promise<boolean> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      throw new Error('User not authenticated');
    }
    
    const userId = userData.user.id;
    
    // Check if the user has already liked the comment
    const { data: existingLike, error: checkError } = await supabase
      .from('comment_likes')
      .select()
      .eq('comment_id', commentId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (checkError) {
      throw checkError;
    }
    
    if (existingLike) {
      // Unlike the comment
      const { error: unlikeError } = await supabase
        .from('comment_likes')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', userId);
      
      if (unlikeError) {
        throw unlikeError;
      }
      
      return false;
    } else {
      // Like the comment
      const { error: likeError } = await supabase
        .from('comment_likes')
        .insert({ comment_id: commentId, user_id: userId });
      
      if (likeError) {
        throw likeError;
      }
      
      return true;
    }
  } catch (error) {
    console.error('Error toggling comment like:', error);
    throw error;
  }
};
