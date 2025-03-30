
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash2, MoreVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ArticleDeleteDialog } from "./ArticleDeleteDialog";
import { ArticleMoveMenu } from "./ArticleMoveMenu";
import { deleteArticle, moveArticle } from "@/services/articleService";

interface AdminArticleControlsProps {
  articleId: string;
  onArticleDeleted?: (articleId: string) => void;
  onArticleMoved?: (articleId: string) => void;
  category?: string;
}

export function AdminArticleControls({ 
  articleId, 
  onArticleDeleted,
  onArticleMoved,
  category
}: AdminArticleControlsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (isDeleting) return;
    
    try {
      setIsDeleting(true);
      // Close dialog before database operation
      setIsDeleteDialogOpen(false);
      
      console.log("Deleting article with ID:", articleId);
      
      const result = await deleteArticle(articleId);
      
      if (!result.success) {
        throw result.error || new Error("Failed to delete article");
      }
      
      console.log("Article deleted successfully");
      
      // Notify parent components about deletion with the ID
      if (onArticleDeleted) {
        console.log("Calling onArticleDeleted with ID:", articleId);
        onArticleDeleted(articleId);
      }
      
      // Show success toast after callback
      toast({
        title: "Article deleted",
        description: "The article has been successfully deleted."
      });
      
    } catch (error) {
      console.error("Error deleting article:", error);
      toast({
        title: "Error",
        description: "Failed to delete the article. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMoveArticle = async (targetCategory: string) => {
    if (targetCategory === category || isMoving) return;
    
    try {
      setIsMoving(true);
      
      console.log("Moving article with ID:", articleId, "to category:", targetCategory);
      
      const result = await moveArticle(articleId, targetCategory);
      
      if (!result.success) {
        throw result.error || new Error("Failed to move article");
      }
      
      console.log("Article moved successfully");
      
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
        description: "Failed to move the article. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsMoving(false);
    }
  };
  
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Admin Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            className="text-destructive focus:text-destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={isDeleting}
          >
            <Trash2 size={16} className="mr-2" />
            {isDeleting ? "Deleting..." : "Delete Article"}
          </DropdownMenuItem>
          
          <ArticleMoveMenu
            currentCategory={category}
            isMoving={isMoving}
            onMove={handleMoveArticle}
          />
        </DropdownMenuContent>
      </DropdownMenu>

      <ArticleDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
