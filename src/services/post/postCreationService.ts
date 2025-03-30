
import { supabase } from '@/integrations/supabase/client';
import { Post } from '@/types/post';

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
