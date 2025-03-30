
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

/**
 * Delete an article by its title
 * @param title The title of the article to delete
 * @returns Promise with the deletion result
 */
export const deleteArticleByTitle = async (title: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('community_articles')
      .delete()
      .eq('title', title);
      
    if (error) {
      console.error("Error deleting article:", error);
      toast({
        title: "Error",
        description: `Failed to delete article: ${error.message}`,
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Success",
      description: `Article "${title}" has been deleted successfully`,
      variant: "default",
    });
    
    return true;
  } catch (err) {
    console.error("Error in deletion process:", err);
    toast({
      title: "Error",
      description: "An unexpected error occurred while deleting the article",
      variant: "destructive",
    });
    return false;
  }
};
