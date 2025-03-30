
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { deleteArticle, moveArticle } from "@/services/articleService";

export function useArticleManagement({
  onArticleDeleted,
  onArticleMoved
}: {
  onArticleDeleted?: (articleId: string) => void;
  onArticleMoved?: (articleId: string) => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const { toast } = useToast();

  const handleDelete = async (articleId: string) => {
    if (isDeleting || !articleId) return;
    
    try {
      setIsDeleting(true);
      
      console.log("Deleting article with ID:", articleId);
      
      // Show toast while deleting
      const pendingToast = toast({
        title: "Deleting article...",
        description: "Please wait while we delete the article and its associated files.",
        duration: 100000 // Long duration to ensure it stays visible during operation
      });
      
      // Start the deletion process
      const result = await deleteArticle(articleId);
      
      // Ensure toast is dismissed regardless of outcome - use the dismiss method instead of trying to update by id
      pendingToast.dismiss();
      
      if (!result.success) {
        // Specific error handling based on error type
        let errorMessage = "Failed to delete the article.";
        
        if (result.dbError) {
          errorMessage = `Database error: ${result.dbError.message || "Unknown database error"}`;
          console.error("Database error during article deletion:", result.dbError);
        } else if (result.error) {
          errorMessage = `Error: ${result.error.message || result.error}`;
        }
        
        // Show file errors if any, but don't fail the operation just because of file errors
        if (result.fileErrors && result.fileErrors.length > 0) {
          console.warn("Some files couldn't be deleted:", result.fileErrors);
          // Only show file errors in toast if the main deletion succeeded
          if (result.success) {
            errorMessage += " Some associated files couldn't be deleted but the article was removed.";
          }
        }
        
        // If it's not a success, throw error to go to catch block
        if (!result.success) {
          throw new Error(errorMessage);
        }
      }
      
      console.log("Article deleted successfully:", result.deletedId);
      
      // Wait a moment to ensure any pending database operations are complete
      // This helps with potential eventual consistency issues
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Notify parent components about deletion with the ID
      if (onArticleDeleted && result.deletedId) {
        console.log("Calling onArticleDeleted with ID:", result.deletedId);
        onArticleDeleted(result.deletedId);
        
        // Show success toast
        toast({
          title: "Article deleted",
          description: "The article has been successfully deleted."
        });
      } else if (!result.deletedId) {
        console.error("Missing deletedId in successful response");
        toast({
          title: "Warning",
          description: "Article may have been deleted but UI couldn't update. Please refresh.",
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error("Error deleting article:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete the article. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMoveArticle = async (articleId: string, targetCategory: string, currentCategory?: string) => {
    if (targetCategory === currentCategory || isMoving) return;
    
    try {
      setIsMoving(true);
      
      console.log("Moving article with ID:", articleId, "to category:", targetCategory);
      
      const result = await moveArticle(articleId, targetCategory);
      
      if (!result.success) {
        throw result.error || new Error("Failed to move article");
      }
      
      console.log("Article moved successfully");
      
      // Wait a moment to ensure database consistency
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Call the callback to notify parent components
      if (onArticleMoved) {
        onArticleMoved(articleId);
      }
      
      toast({
        title: "Article moved",
        description: `The article has been moved to ${targetCategory}.`
      });
      
    } catch (error) {
      console.error("Error moving article:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to move the article. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsMoving(false);
    }
  };

  return {
    isDeleting,
    isMoving,
    handleDelete,
    handleMoveArticle
  };
}
