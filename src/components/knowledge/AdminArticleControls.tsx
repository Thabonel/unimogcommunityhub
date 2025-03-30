
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { ArticleDeleteDialog } from "./ArticleDeleteDialog";
import { ArticleMoveMenu } from "./ArticleMoveMenu";
import { ArticleDeleteButton } from "./ArticleDeleteButton";
import { useArticleManagement } from "@/hooks/use-article-management";

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
  
  const {
    isDeleting,
    isMoving,
    handleDelete,
    handleMoveArticle
  } = useArticleManagement({
    onArticleDeleted,
    onArticleMoved
  });

  const confirmDelete = async () => {
    // Close dialog before database operation
    setIsDeleteDialogOpen(false);
    
    // Call the delete handler
    await handleDelete(articleId);
  };

  const handleMove = (targetCategory: string) => {
    handleMoveArticle(articleId, targetCategory, category);
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
          
          <ArticleDeleteButton
            isDeleting={isDeleting}
            onDelete={() => setIsDeleteDialogOpen(true)}
          />
          
          <ArticleMoveMenu
            currentCategory={category}
            isMoving={isMoving}
            onMove={handleMove}
          />
        </DropdownMenuContent>
      </DropdownMenu>

      <ArticleDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
