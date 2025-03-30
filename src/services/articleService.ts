
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
export async function deleteArticle(articleId: string): Promise<{ 
  success: boolean; 
  error?: any; 
  deletedId?: string;
  fileErrors?: Array<{type: string, error: any}>;
  dbError?: any;
}> {
  try {
    if (!articleId) {
      console.error("Invalid article ID provided");
      return { success: false, error: "Invalid article ID" };
    }

    // First get the article details to find associated files
    const { data: article, error: fetchError } = await supabase
      .from('community_articles')
      .select('cover_image, original_file_url')
      .eq('id', articleId)
      .single();
    
    if (fetchError) {
      console.error("Error fetching article details:", fetchError);
      return { success: false, error: fetchError };
    }

    if (!article) {
      console.error("Article not found");
      return { success: false, error: "Article not found" };
    }
    
    // Track any file deletion errors but continue the process
    const fileErrors = [];

    // Delete associated files if they exist
    if (article) {
      // Delete cover image if it exists
      if (article.cover_image) {
        try {
          const { success, error } = await deleteFileFromStorage(article.cover_image);
          if (!success) {
            console.warn("Warning: Failed to delete cover image:", error);
            fileErrors.push({ type: 'cover_image', error });
          }
        } catch (err) {
          console.warn("Exception when deleting cover image:", err);
          fileErrors.push({ type: 'cover_image', error: err });
        }
      }

      // Delete original file if it exists
      if (article.original_file_url) {
        try {
          const { success, error } = await deleteFileFromStorage(article.original_file_url);
          if (!success) {
            console.warn("Warning: Failed to delete original file:", error);
            fileErrors.push({ type: 'original_file', error });
          }
        } catch (err) {
          console.warn("Exception when deleting original file:", err);
          fileErrors.push({ type: 'original_file', error: err });
        }
      }
    }
    
    // Delete the article record from the database
    const { error: dbError } = await supabase
      .from('community_articles')
      .delete()
      .eq('id', articleId);
    
    if (dbError) {
      console.error("Error deleting article record:", dbError);
      return { 
        success: false, 
        error: dbError, 
        dbError,
        fileErrors: fileErrors.length > 0 ? fileErrors : undefined
      };
    }
    
    // Return the deleted article ID and any file errors for informational purposes
    return { 
      success: true, 
      deletedId: articleId,
      // Include non-critical file errors if any occurred
      ...(fileErrors.length > 0 && { fileErrors })
    };
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
    if (!articleId) {
      return { success: false, error: "Invalid article ID" };
    }
    
    if (!targetCategory) {
      return { success: false, error: "Invalid target category" };
    }

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
