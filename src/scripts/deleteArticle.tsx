
import { useState } from "react";
import { deleteArticleByTitle } from "@/utils/articleDeleteUtil";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface DeleteArticleProps {
  title: string;
  onComplete?: (success: boolean) => void;
}

export function DeleteArticle({ title, onComplete }: DeleteArticleProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteArticleByTitle(title);
    setSuccess(result);
    setIsDeleting(false);
    setIsComplete(true);
    if (onComplete) {
      onComplete(result);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {isDeleting ? (
        <div className="flex items-center">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <p>Deleting article "{title}"...</p>
        </div>
      ) : isComplete ? (
        <p className={success ? "text-green-500" : "text-red-500"}>
          {success 
            ? `Successfully deleted article "${title}"` 
            : `Failed to delete article "${title}"`}
        </p>
      ) : (
        <Button variant="destructive" onClick={handleDelete}>
          Delete "{title}"
        </Button>
      )}
    </div>
  );
}
