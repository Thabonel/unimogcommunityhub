
import { supabase } from '@/integrations/supabase/client';
import { Post, PostWithUser, Comment } from '@/types/post';
import { toast } from '@/hooks/use-toast';

// Create a new post
export const createPost = async (content: string, imageUrl?: string, videoUrl?: string, linkInfo?: {
  url: string;
  title?: string;
  description?: string;
  image?: string;
}): Promise<string | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const postData: Partial<Post> = {
      content,
      user_id: user.id,
      image_url: imageUrl,
      video_url: videoUrl,
    };

    if (linkInfo) {
      postData.link_url = linkInfo.url;
      postData.link_title = linkInfo.title;
      postData.link_description = linkInfo.description;
      postData.link_image = linkInfo.image;
    }

    const { data, error } = await supabase
      .from('posts')
      .insert(postData)
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    return data.id;
  } catch (error) {
    console.error('Error creating post:', error);
    toast({
      title: 'Error',
      description: 'Could not create post. Please try again.',
      variant: 'destructive',
    });
    return null;
  }
};

// Get posts with user information, like counts, and comment counts
export const getPosts = async (limit = 10, page = 0): Promise<PostWithUser[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const startIndex = page * limit;
    
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        *,
        profile:profiles!posts_user_id_fkey(
          avatar_url,
          full_name,
          display_name,
          unimog_model,
          location,
          online
        )
      `)
      .order('created_at', { ascending: false })
      .range(startIndex, startIndex + limit - 1);

    if (error) {
      throw error;
    }

    if (!posts || posts.length === 0) {
      return [];
    }

    // Get likes for these posts
    const postIds = posts.map(post => post.id);
    
    const { data: likeCounts } = await supabase
      .from('post_likes')
      .select('post_id, count', { count: 'exact', head: false })
      .in('post_id', postIds)
      .group('post_id');

    const { data: commentCounts } = await supabase
      .from('comments')
      .select('post_id, count', { count: 'exact', head: false })
      .in('post_id', postIds)
      .group('post_id');

    const { data: shareCounts } = await supabase
      .from('post_shares')
      .select('post_id, count', { count: 'exact', head: false })
      .in('post_id', postIds)
      .group('post_id');

    // Get user's likes and shares if authenticated
    let userLikes: Record<string, boolean> = {};
    let userShares: Record<string, boolean> = {};
    
    if (user) {
      const { data: userLikesData } = await supabase
        .from('post_likes')
        .select('post_id')
        .in('post_id', postIds)
        .eq('user_id', user.id);
        
      if (userLikesData) {
        userLikes = userLikesData.reduce((acc, curr) => {
          acc[curr.post_id] = true;
          return acc;
        }, {} as Record<string, boolean>);
      }
      
      const { data: userSharesData } = await supabase
        .from('post_shares')
        .select('post_id')
        .in('post_id', postIds)
        .eq('user_id', user.id);
        
      if (userSharesData) {
        userShares = userSharesData.reduce((acc, curr) => {
          acc[curr.post_id] = true;
          return acc;
        }, {} as Record<string, boolean>);
      }
    }

    // Map counts to posts
    const likeCountsMap = (likeCounts || []).reduce((acc, curr) => {
      acc[curr.post_id] = parseInt(curr.count);
      return acc;
    }, {} as Record<string, number>);

    const commentCountsMap = (commentCounts || []).reduce((acc, curr) => {
      acc[curr.post_id] = parseInt(curr.count);
      return acc;
    }, {} as Record<string, number>);

    const shareCountsMap = (shareCounts || []).reduce((acc, curr) => {
      acc[curr.post_id] = parseInt(curr.count);
      return acc;
    }, {} as Record<string, number>);

    return posts.map(post => ({
      ...post,
      likes_count: likeCountsMap[post.id] || 0,
      comments_count: commentCountsMap[post.id] || 0,
      shares_count: shareCountsMap[post.id] || 0,
      liked_by_user: userLikes[post.id] || false,
      shared_by_user: userShares[post.id] || false
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

// Like or unlike a post
export const toggleLikePost = async (postId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: 'Not logged in',
        description: 'Please log in to like posts.',
        variant: 'default',
      });
      return false;
    }

    // Check if the user has already liked this post
    const { data: existingLike } = await supabase
      .from('post_likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .maybeSingle();

    let liked: boolean;
    
    if (existingLike) {
      // Unlike
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);

      if (error) throw error;
      liked = false;
    } else {
      // Like
      const { error } = await supabase
        .from('post_likes')
        .insert({ post_id: postId, user_id: user.id });

      if (error) throw error;
      liked = true;
    }

    return liked;
  } catch (error) {
    console.error('Error toggling like:', error);
    toast({
      title: 'Error',
      description: 'Could not process your like. Please try again.',
      variant: 'destructive',
    });
    return false;
  }
};

// Share a post
export const sharePost = async (postId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: 'Not logged in',
        description: 'Please log in to share posts.',
        variant: 'default',
      });
      return false;
    }

    // Check if user has already shared this post
    const { data: existingShare } = await supabase
      .from('post_shares')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingShare) {
      toast({
        title: 'Already shared',
        description: 'You have already shared this post.',
        variant: 'default',
      });
      return false;
    }

    const { error } = await supabase
      .from('post_shares')
      .insert({ post_id: postId, user_id: user.id });

    if (error) throw error;

    toast({
      title: 'Success',
      description: 'Post shared successfully.',
      variant: 'default',
    });
    return true;
  } catch (error) {
    console.error('Error sharing post:', error);
    toast({
      title: 'Error',
      description: 'Could not share post. Please try again.',
      variant: 'destructive',
    });
    return false;
  }
};

// Add a comment to a post
export const addComment = async (postId: string, content: string): Promise<Comment | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: 'Not logged in',
        description: 'Please log in to comment.',
        variant: 'default',
      });
      return null;
    }

    const { data, error } = await supabase
      .from('comments')
      .insert({ post_id: postId, user_id: user.id, content })
      .select('*, profile:profiles!comments_user_id_fkey(avatar_url, full_name, display_name)')
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error adding comment:', error);
    toast({
      title: 'Error',
      description: 'Could not add comment. Please try again.',
      variant: 'destructive',
    });
    return null;
  }
};

// Get comments for a post
export const getComments = async (postId: string, limit = 10, offset = 0): Promise<Comment[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profile:profiles!comments_user_id_fkey(
          avatar_url,
          full_name,
          display_name
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    if (!data) return [];

    // Get like counts for these comments
    const commentIds = data.map(comment => comment.id);
    
    const { data: likeCounts } = await supabase
      .from('comment_likes')
      .select('comment_id, count', { count: 'exact', head: false })
      .in('comment_id', commentIds)
      .group('comment_id');

    // Get user likes if authenticated
    let userLikes: Record<string, boolean> = {};
    
    if (user) {
      const { data: userLikesData } = await supabase
        .from('comment_likes')
        .select('comment_id')
        .in('comment_id', commentIds)
        .eq('user_id', user.id);
        
      if (userLikesData) {
        userLikes = userLikesData.reduce((acc, curr) => {
          acc[curr.comment_id] = true;
          return acc;
        }, {} as Record<string, boolean>);
      }
    }

    // Map counts to comments
    const likeCountsMap = (likeCounts || []).reduce((acc, curr) => {
      acc[curr.comment_id] = parseInt(curr.count);
      return acc;
    }, {} as Record<string, number>);

    return data.map(comment => ({
      ...comment,
      likes_count: likeCountsMap[comment.id] || 0,
      liked_by_user: userLikes[comment.id] || false,
    }));
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};

// Toggle like on a comment
export const toggleLikeComment = async (commentId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: 'Not logged in',
        description: 'Please log in to like comments.',
        variant: 'default',
      });
      return false;
    }

    // Check if the user has already liked this comment
    const { data: existingLike } = await supabase
      .from('comment_likes')
      .select('*')
      .eq('comment_id', commentId)
      .eq('user_id', user.id)
      .maybeSingle();

    let liked: boolean;
    
    if (existingLike) {
      // Unlike
      const { error } = await supabase
        .from('comment_likes')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', user.id);

      if (error) throw error;
      liked = false;
    } else {
      // Like
      const { error } = await supabase
        .from('comment_likes')
        .insert({ comment_id: commentId, user_id: user.id });

      if (error) throw error;
      liked = true;
    }

    return liked;
  } catch (error) {
    console.error('Error toggling comment like:', error);
    toast({
      title: 'Error',
      description: 'Could not process your like. Please try again.',
      variant: 'destructive',
    });
    return false;
  }
};
