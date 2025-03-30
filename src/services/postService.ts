
import { supabase } from '@/integrations/supabase/client';
import { Comment, Post, PostWithUser } from '@/types/post';

/**
 * Create a new post
 * @param content The post content
 * @param imageUrl Optional image URL
 * @param videoUrl Optional video URL
 * @param linkInfo Optional link information
 * @returns The created post
 */
export const createPost = async (
  content: string, 
  imageUrl?: string,
  videoUrl?: string,
  linkInfo?: { url: string; title?: string; description?: string; image?: string }
): Promise<Post | null> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      throw new Error('User not authenticated');
    }

    // Create a properly typed object that matches the expected schema
    const postData = {
      user_id: userData.user.id,
      content,
      image_url: imageUrl || null,
      video_url: videoUrl || null,
      link_url: linkInfo?.url || null,
      link_title: linkInfo?.title || null,
      link_description: linkInfo?.description || null,
      link_image: linkInfo?.image || null
    };

    const { data, error } = await supabase
      .from('posts')
      .insert(postData)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as Post;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

/**
 * Get posts with pagination
 * @param limit Number of posts to get
 * @param page Page number (0-based)
 * @returns Array of posts with user info
 */
export const getPosts = async (limit: number = 10, page: number = 0): Promise<PostWithUser[]> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const currentUserId = userData?.user?.id;
    
    // First, get posts with pagination
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .range(page * limit, (page + 1) * limit - 1);
    
    if (postsError) {
      throw postsError;
    }
    
    if (!posts || posts.length === 0) {
      return [];
    }
    
    // Get profiles for these posts
    const postUserIds = posts.map(post => post.user_id);
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, avatar_url, full_name, display_name, unimog_model, location, online')
      .in('id', postUserIds);
    
    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      // Continue with partial data
    }
    
    // Get likes counts using count aggregate
    const { data: likesCount, error: likesError } = await supabase
      .from('post_likes')
      .select('post_id, count()', { count: 'exact' })
      .in('post_id', posts.map(post => post.id));
    
    if (likesError) {
      console.error('Error fetching likes:', likesError);
    }
    
    // Get comments counts using count aggregate
    const { data: commentsCount, error: commentsError } = await supabase
      .from('comments')
      .select('post_id, count()', { count: 'exact' })
      .in('post_id', posts.map(post => post.id));
    
    if (commentsError) {
      console.error('Error fetching comments:', commentsError);
    }
    
    // Get shares counts using count aggregate
    const { data: sharesCount, error: sharesError } = await supabase
      .from('post_shares')
      .select('post_id, count()', { count: 'exact' })
      .in('post_id', posts.map(post => post.id));
    
    if (sharesError) {
      console.error('Error fetching shares:', sharesError);
    }
    
    // Get current user's likes
    let userLikes: Record<string, boolean> = {};
    let userShares: Record<string, boolean> = {};
    
    if (currentUserId) {
      const { data: userLikesData } = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('user_id', currentUserId)
        .in('post_id', posts.map(post => post.id));
      
      if (userLikesData) {
        userLikesData.forEach(like => {
          userLikes[like.post_id] = true;
        });
      }
      
      const { data: userSharesData } = await supabase
        .from('post_shares')
        .select('post_id')
        .eq('user_id', currentUserId)
        .in('post_id', posts.map(post => post.id));
      
      if (userSharesData) {
        userSharesData.forEach(share => {
          userShares[share.post_id] = true;
        });
      }
    }
    
    // Helper function to find count for a specific post_id
    const findCount = (countData: any[] | null, postId: string): number => {
      if (!countData) return 0;
      const item = countData.find(item => item.post_id === postId);
      return item ? parseInt(item.count, 10) : 0;
    };
    
    // Combine all data
    const postsWithUserData: PostWithUser[] = posts.map(post => {
      const profile = profiles?.find(p => p.id === post.user_id) || {
        avatar_url: null,
        full_name: null,
        display_name: null,
        unimog_model: null,
        location: null,
        online: false
      };
      
      const likes = findCount(likesCount, post.id);
      const comments = findCount(commentsCount, post.id);
      const shares = findCount(sharesCount, post.id);
      
      return {
        ...post,
        profile,
        likes_count: likes,
        comments_count: comments,
        shares_count: shares,
        liked_by_user: userLikes[post.id] || false,
        shared_by_user: userShares[post.id] || false
      };
    });
    
    return postsWithUserData;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

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
    const { data: existingLike, error: checkError } = await supabase
      .from('post_likes')
      .select()
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (checkError) {
      throw checkError;
    }
    
    if (existingLike) {
      // Unlike the post
      const { error: unlikeError } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);
      
      if (unlikeError) {
        throw unlikeError;
      }
      
      return false;
    } else {
      // Like the post
      const { error: likeError } = await supabase
        .from('post_likes')
        .insert({ post_id: postId, user_id: userId });
      
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
    
    const { data, error } = await supabase
      .from('post_shares')
      .insert({ post_id: postId, user_id: userData.user.id })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data.id;
  } catch (error) {
    console.error('Error sharing post:', error);
    throw error;
  }
};

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
