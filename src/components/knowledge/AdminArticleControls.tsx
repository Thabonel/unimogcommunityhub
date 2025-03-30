
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash2, Move, MoreVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

      // Delete any associated files from storage
      if (article) {
        // Delete cover image if it exists
        if (article.cover_image) {
          try {
            const coverImagePath = extractFilePathFromUrl(article.cover_image);
            if (coverImagePath) {
              console.log("Deleting cover image:", coverImagePath);
              const { error: coverDeleteError } = await supabase.storage
                .from('article_images')
                .remove([coverImagePath]);
                
              if (coverDeleteError) {
                console.error("Error deleting cover image:", coverDeleteError);
                // Continue with deletion even if file deletion fails
              }
            }
          } catch (fileError) {
            console.error("Error processing cover image URL:", fileError);
            // Continue with deletion even if file deletion fails
          }
        }

        // Delete original file if it exists
        if (article.original_file_url) {
          try {
            const originalFilePath = extractFilePathFromUrl(article.original_file_url);
            if (originalFilePath) {
              console.log("Deleting original file:", originalFilePath);
              const { error: fileDeleteError } = await supabase.storage
                .from('article_files')
                .remove([originalFilePath]);
                
              if (fileDeleteError) {
                console.error("Error deleting original file:", fileDeleteError);
                // Continue with deletion even if file deletion fails
              }
            }
          } catch (fileError) {
            console.error("Error processing original file URL:", fileError);
            // Continue with deletion even if file deletion fails
          }
        }
      }
      
      // Delete the article record from the database
      const { error } = await supabase
        .from('community_articles')
        .delete()
        .eq('id', articleId);
      
      if (error) throw error;
      
      console.log("Article deleted successfully");
      
      // Notify parent components about deletion
      if (onArticleDeleted) {
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

  // Helper function to extract the file path from a Supabase storage URL
  const extractFilePathFromUrl = (url: string): string | null => {
    try {
      // For URLs like https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/article_images/file.jpg
      // We need to extract the file.jpg part
      const matches = url.match(/\/([^/]+)\/([^/]+)$/);
      if (matches && matches.length > 2) {
        return matches[2];
      }
      return null;
    } catch (e) {
      console.error("Error extracting file path from URL:", e);
      return null;
    }
  };

  const moveArticle = async (targetCategory: string) => {
    if (targetCategory === category || isMoving) return;
    
    try {
      setIsMoving(true);
      
      console.log("Moving article with ID:", articleId, "to category:", targetCategory);
      const { error } = await supabase
        .from('community_articles')
        .update({ category: targetCategory })
        .eq('id', articleId);
        
      if (error) throw error;
      
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
  
  const categories = ["Maintenance", "Repair", "Adventures", "Modifications", "Tyres"];

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
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Move to category</DropdownMenuLabel>
          
          {categories.map((cat) => (
            <DropdownMenuItem 
              key={cat}
              disabled={cat === category || isMoving}
              onClick={() => moveArticle(cat)}
            >
              <Move size={16} className="mr-2" />
              {cat}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this article?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The article will be permanently deleted along with any associated files.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
