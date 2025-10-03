
import { supabase } from '@/lib/supabase-client';
import { Comment } from '@/types/post';

/**
 * Add a comment to a post
 * @param postId Post ID
 * @param content Comment content
 * @returns The created comment
 */
export const addComment = async (postId: string, content: string): Promise<Comment | null> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      throw new Error('User not authenticated');
    }
    
    const userId = userData.user.id;
    
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
 * @returns Array of comments
 */
export const getComments = async (postId: string): Promise<Comment[]> => {
  console.log('[CommentService] Fetching comments for post:', postId);

  try {
    const { data: userData } = await supabase.auth.getUser();
    const currentUserId = userData?.user?.id;
    console.log('[CommentService] Current user ID:', currentUserId);

    // Get comments
    const { data: comments, error: commentsError } = await supabase
      .from('post_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (commentsError) {
      console.error('[CommentService] Error fetching comments:', commentsError);
      throw commentsError;
    }

    console.log('[CommentService] Fetched comments:', comments?.length || 0);
    
    if (!comments || comments.length === 0) {
      return [];
    }
    
    // Get profiles for these comments
    const commentUserIds = comments.map(comment => comment.user_id);
    console.log('[CommentService] Fetching profiles for users:', commentUserIds);

    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, avatar_url, full_name, display_name')
      .in('id', commentUserIds);

    if (profilesError) {
      console.error('[CommentService] Error fetching profiles:', profilesError);
    }
    console.log('[CommentService] Fetched profiles:', profiles?.length || 0);

    // Get likes counts - fetch all likes and count manually
    console.log('[CommentService] Fetching comment likes...');
    const { data: likesData, error: likesError } = await supabase
      .from('comment_likes')
      .select('comment_id')
      .in('comment_id', comments.map(comment => comment.id));

    if (likesError) {
      console.error('[CommentService] Error fetching comment likes:', likesError);
    }
    console.log('[CommentService] Fetched likes:', likesData?.length || 0);

    // Count likes per comment
    const likesCount: Record<string, number> = {};
    if (likesData) {
      likesData.forEach(like => {
        likesCount[like.comment_id] = (likesCount[like.comment_id] || 0) + 1;
      });
    }
    
    // Get current user's likes
    let userLikes: Record<string, boolean> = {};

    if (currentUserId) {
      console.log('[CommentService] Fetching user likes...');
      const { data: userLikesData } = await supabase
        .from('comment_likes')
        .select('comment_id')
        .eq('user_id', currentUserId)
        .in('comment_id', comments.map(comment => comment.id));

      if (userLikesData) {
        userLikesData.forEach(like => {
          userLikes[like.comment_id] = true;
        });
      }
      console.log('[CommentService] User liked comments:', Object.keys(userLikes).length);
    }

    // Combine all data
    console.log('[CommentService] Combining all data...');
    const commentsWithUserData: Comment[] = comments.map(comment => {
      const profile = profiles?.find(p => p.id === comment.user_id) || {
        avatar_url: null,
        full_name: null,
        display_name: null,
      };

      const likes = likesCount[comment.id] || 0;
      
      return {
        ...comment,
        profile,
        likes_count: likes,
        liked_by_user: userLikes[comment.id] || false,
      };
    });

    console.log('[CommentService] Returning comments:', commentsWithUserData.length);
    return commentsWithUserData;
  } catch (error) {
    console.error('[CommentService] FATAL ERROR:', error);
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
