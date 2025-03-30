
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

interface UnblockEmailDialogProps {
  emailToUnblock: string | null;
  onOpenChange: () => void;
  onConfirm: (email: string) => void;
}

export function UnblockEmailDialog({
  emailToUnblock,
  onOpenChange,
  onConfirm,
}: UnblockEmailDialogProps) {
  return (
    <AlertDialog
      open={Boolean(emailToUnblock)}
      onOpenChange={(open) => {
        if (!open) onOpenChange();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Blocked Email</AlertDialogTitle>
          <AlertDialogDescription>
            This will allow new users to register with this email address.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (emailToUnblock) {
                onConfirm(emailToUnblock);
              }
            }}
          >
            Unblock Email
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
