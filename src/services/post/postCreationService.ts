
import { supabase } from '@/lib/supabase-client';
import { Post } from '@/types/post';
import { withSupabaseRetry } from '@/utils/database-retry';

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

    // Create a properly typed object that matches the database schema
    const postData = {
      author_id: userData.user.id, // Database expects author_id, not user_id
      title: content.slice(0, 100) + (content.length > 100 ? '...' : ''), // Extract title from content
      content,
      image_url: imageUrl || null,
      category: 'general',
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

    const { data, error } = await withSupabaseRetry(() =>
      supabase
        .from('community_posts')
        .insert(postData)
        .select()
        .single()
    );

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
 * Delete a post (only if user is the author)
 * @param postId The ID of the post to delete
 * @returns True if successful, false otherwise
 */
export const deletePost = async (postId: string): Promise<boolean> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      throw new Error('User not authenticated');
    }

    // Delete the post - RLS policy will ensure user can only delete their own posts
    const { error } = await withSupabaseRetry(() =>
      supabase
        .from('community_posts')
        .delete()
        .eq('id', postId)
        .eq('author_id', userData.user.id) // Double-check user owns this post
    );

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};
