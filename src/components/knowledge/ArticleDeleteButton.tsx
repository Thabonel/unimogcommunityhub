
import { Trash2, Loader2 } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface ArticleDeleteButtonProps {
  isDeleting: boolean;
  onDelete: () => void;
}

export function ArticleDeleteButton({ isDeleting, onDelete }: ArticleDeleteButtonProps) {
  return (
    <DropdownMenuItem 
      className="text-destructive focus:text-destructive"
      onClick={onDelete}
      disabled={isDeleting}
    >
      {isDeleting ? (
        <>
          <Loader2 size={16} className="mr-2 animate-spin" />
          Deleting...
        </>
      ) : (
        <>
          <Trash2 size={16} className="mr-2" />
          Delete Article
        </>
      )}
    </DropdownMenuItem>
  );
}
