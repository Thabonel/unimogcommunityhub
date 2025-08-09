
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
      .from('comments')
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
  try {
    const { data: userData } = await supabase.auth.getUser();
    const currentUserId = userData?.user?.id;
    
    // Get comments
    const { data: comments, error: commentsError } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    
    if (commentsError) {
      throw commentsError;
    }
    
    if (!comments || comments.length === 0) {
      return [];
    }
    
    // Get profiles for these comments
    const commentUserIds = comments.map(comment => comment.user_id);
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, avatar_url, full_name, display_name')
      .in('id', commentUserIds);
    
    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
    }
    
    // Get likes counts using count aggregate
    const { data: likesCount, error: likesError } = await supabase
      .from('comment_likes')
      .select('comment_id, count()', { count: 'exact' })
      .in('comment_id', comments.map(comment => comment.id));
    
    if (likesError) {
      console.error('Error fetching comment likes:', likesError);
    }
    
    // Get current user's likes
    let userLikes: Record<string, boolean> = {};
    
    if (currentUserId) {
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
    }
    
    // Helper function to find count for a specific comment_id
    const findCount = (countData: any[] | null, commentId: string): number => {
      if (!countData) return 0;
      const item = countData.find(item => item.comment_id === commentId);
      return item ? parseInt(item.count, 10) : 0;
    };
    
    // Combine all data
    const commentsWithUserData: Comment[] = comments.map(comment => {
      const profile = profiles?.find(p => p.id === comment.user_id) || {
        avatar_url: null,
        full_name: null,
        display_name: null,
      };
      
      const likes = findCount(likesCount, comment.id);
      
      return {
        ...comment,
        profile,
        likes_count: likes,
        liked_by_user: userLikes[comment.id] || false,
      };
    });
    
    return commentsWithUserData;
  } catch (error) {
    console.error('Error fetching comments:', error);
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
