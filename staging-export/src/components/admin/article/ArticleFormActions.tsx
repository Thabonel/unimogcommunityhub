
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ArticleFormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

export function ArticleFormActions({ isSubmitting, onCancel }: ArticleFormActionsProps) {
  return (
    <div className="flex justify-end gap-3">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting}
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
