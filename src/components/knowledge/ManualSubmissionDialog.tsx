
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ManualSubmissionForm } from "@/components/knowledge/ManualSubmissionForm";

interface ManualSubmissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitSuccess: () => void;
}

export function ManualSubmissionDialog({
  open,
  onOpenChange,
  onSubmitSuccess
}: ManualSubmissionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Submit a Manual</DialogTitle>
          <DialogDescription>
            Share your Unimog manual with the community. All submissions will be reviewed before publishing.
          </DialogDescription>
        </DialogHeader>
        <ManualSubmissionForm onSubmitSuccess={onSubmitSuccess} />
      </DialogContent>
    </Dialog>
  );
}
