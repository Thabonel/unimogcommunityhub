
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface BlockedEmailItemProps {
  email: string;
  reason: string | null;
  onUnblock: (email: string) => void;
}

export function BlockedEmailItem({ email, reason, onUnblock }: BlockedEmailItemProps) {
  return (
    <div className="flex justify-between items-center p-3 rounded-md bg-muted/50">
      <div>
        <div className="font-medium">{email}</div>
        {reason && (
          <div className="text-sm text-muted-foreground">
            Reason: {reason}
          </div>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onUnblock(email)}
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}
