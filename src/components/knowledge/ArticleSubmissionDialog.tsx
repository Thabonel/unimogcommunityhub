
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArticleSubmissionForm } from "./ArticleSubmissionForm";

interface ArticleSubmissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: "Maintenance" | "Repair" | "Adventures" | "Modifications" | "Tyres";
}

export function ArticleSubmissionDialog({ open, onOpenChange, category }: ArticleSubmissionDialogProps) {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Submit an Article</DialogTitle>
          <DialogDescription>
            Share your knowledge or a valuable resource with the Unimog community. If you're sharing content from Facebook or another website, please include the original source URL.
          </DialogDescription>
        </DialogHeader>
        <ArticleSubmissionForm onSuccess={handleSuccess} defaultCategory={category} />
      </DialogContent>
    </Dialog>
  );
}
