
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

interface UserToggleAdminDialogProps {
  data: { id: string; makeAdmin: boolean } | null;
  onOpenChange: () => void;
  onConfirm: (userId: string, makeAdmin: boolean) => void;
}

export function UserToggleAdminDialog({
  data,
  onOpenChange,
  onConfirm,
}: UserToggleAdminDialogProps) {
  if (!data) return null;
  
  const { id, makeAdmin } = data;

  return (
    <AlertDialog 
      open={Boolean(data)} 
      onOpenChange={(open) => {
        if (!open) onOpenChange();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {makeAdmin ? "Grant Admin Privileges" : "Remove Admin Privileges"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {makeAdmin 
              ? "This will give the user full administrative access to the platform."
              : "This will remove the user's administrative access to the platform."
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            className={makeAdmin 
              ? "bg-purple-600 text-white hover:bg-purple-700" 
              : "bg-gray-600 text-white hover:bg-gray-700"
            }
            onClick={() => onConfirm(id, makeAdmin)}
          >
            {makeAdmin ? "Make Admin" : "Remove Admin"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
