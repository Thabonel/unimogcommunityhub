
import { supabase } from "@/integrations/supabase/client";
import { deleteFileFromStorage } from "@/utils/fileStorage";

interface Article {
  id: string;
  cover_image?: string | null;
  original_file_url?: string | null;
  category?: string;
}

/**
 * Deletes an article and its associated files from Supabase
 */
export async function deleteArticle(articleId: string): Promise<{ success: boolean; error?: any }> {
  try {
    // First get the article details to find associated files
    const { data: article, error: fetchError } = await supabase
      .from('community_articles')
      .select('cover_image, original_file_url')
      .eq('id', articleId)
      .single();
    
    if (fetchError) {
      console.error("Error fetching article details:", fetchError);
      throw fetchError;
    }

    // Delete associated files if they exist
    if (article) {
      // Delete cover image if it exists
      if (article.cover_image) {
        await deleteFileFromStorage(article.cover_image);
      }

      // Delete original file if it exists
      if (article.original_file_url) {
        await deleteFileFromStorage(article.original_file_url);
      }
    }
    
    // Delete the article record from the database
    const { error } = await supabase
      .from('community_articles')
      .delete()
      .eq('id', articleId);
    
    if (error) {
      console.error("Error deleting article record:", error);
      return { success: false, error };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error in deleteArticle:", error);
    return { success: false, error };
  }
}

/**
 * Moves an article to a different category
 */
export async function moveArticle(
  articleId: string, 
  targetCategory: string
): Promise<{ success: boolean; error?: any }> {
  try {
    const { error } = await supabase
      .from('community_articles')
      .update({ category: targetCategory })
      .eq('id', articleId);
      
    if (error) {
      console.error("Error moving article:", error);
      return { success: false, error };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error in moveArticle:", error);
    return { success: false, error };
  }
}
