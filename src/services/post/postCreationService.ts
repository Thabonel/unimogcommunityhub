
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

    // Create a properly typed object that only includes fields that exist in the database
    const postData = {
      user_id: userData.user.id,
      content,
      image_url: imageUrl || null,
      // We'll store video and link information in the content as we don't have specific columns for them
      // This ensures compatibility with the database schema
    };

    // If we have video url, append it to the content
    if (videoUrl) {
      postData.content += `\n\nVideo: ${videoUrl}`;
    }
    
    // If we have link information, append it to the content
    if (linkInfo?.url) {
      postData.content += `\n\nLink: ${linkInfo.url}`;
      if (linkInfo.title) {
        postData.content += `\nTitle: ${linkInfo.title}`;
      }
      if (linkInfo.description) {
        postData.content += `\nDescription: ${linkInfo.description}`;
      }
    }

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
