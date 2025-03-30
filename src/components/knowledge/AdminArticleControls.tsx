
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
            // Extract the bucket name and path from the URL
            const storageUrl = new URL(article.cover_image);
            const pathParts = storageUrl.pathname.split('/');
            // Find "public" in the path and get the bucket name and file path
            const publicIndex = pathParts.indexOf('public');
            if (publicIndex !== -1 && publicIndex + 2 <= pathParts.length) {
              const bucketName = pathParts[publicIndex + 1];
              const filePath = pathParts.slice(publicIndex + 2).join('/');
              
              console.log(`Deleting cover image from bucket: ${bucketName}, path: ${filePath}`);
              
              const { error: coverDeleteError } = await supabase.storage
                .from(bucketName)
                .remove([filePath]);
                
              if (coverDeleteError) {
                console.error("Error deleting cover image:", coverDeleteError);
              } else {
                console.log("Cover image deleted successfully");
              }
            }
          } catch (fileError) {
            console.error("Error processing cover image URL:", fileError);
          }
        }

        // Delete original file if it exists
        if (article.original_file_url) {
          try {
            // Extract the bucket name and path from the URL
            const storageUrl = new URL(article.original_file_url);
            const pathParts = storageUrl.pathname.split('/');
            // Find "public" in the path and get the bucket name and file path
            const publicIndex = pathParts.indexOf('public');
            if (publicIndex !== -1 && publicIndex + 2 <= pathParts.length) {
              const bucketName = pathParts[publicIndex + 1];
              const filePath = pathParts.slice(publicIndex + 2).join('/');
              
              console.log(`Deleting original file from bucket: ${bucketName}, path: ${filePath}`);
              
              const { error: fileDeleteError } = await supabase.storage
                .from(bucketName)
                .remove([filePath]);
                
              if (fileDeleteError) {
                console.error("Error deleting original file:", fileDeleteError);
              } else {
                console.log("Original file deleted successfully");
              }
            }
          } catch (fileError) {
            console.error("Error processing original file URL:", fileError);
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
