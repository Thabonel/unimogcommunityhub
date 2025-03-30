
import { supabase } from '@/integrations/supabase/client';
import { PostWithUser } from '@/types/post';

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
