import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Gift, Clock, Infinity } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BulkFreeAccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUsers: any[];
  accessType: 'permanent' | '1year';
  onConfirm: (reason: string) => Promise<void>;
  isProcessing?: boolean;
}

export function BulkFreeAccessDialog({
  open,
  onOpenChange,
  selectedUsers,
  accessType,
  onConfirm,
  isProcessing = false
}: BulkFreeAccessDialogProps) {
  const [reason, setReason] = useState("");

  const handleConfirm = async () => {
    await onConfirm(reason);
    setReason("");
  };

  const isPermanent = accessType === 'permanent';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-emerald-500" />
            Grant Bulk Free Access
          </DialogTitle>
          <DialogDescription>
            You are about to grant free premium access to {selectedUsers.length} users.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Access Type Info */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              {isPermanent ? (
                <Infinity className="h-4 w-4 text-emerald-500" />
              ) : (
                <Clock className="h-4 w-4 text-blue-500" />
              )}
              <span className="font-medium">
                {isPermanent ? 'Permanent Free Access' : '1 Year Free Access'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {isPermanent
                ? 'Users will receive permanent premium access with no expiration date.'
                : 'Users will receive premium access that expires in 1 year from today.'
              }
            </p>
          </div>

          {/* Selected Users */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              Selected Users ({selectedUsers.length})
            </Label>
            <ScrollArea className="h-32 border rounded-md p-3">
              <div className="space-y-2">
                {selectedUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between text-sm">
                    <span>{user.email}</span>
                    <Badge variant="outline" className="text-xs">
                      {user.subscription?.is_free_access ? 'Already Free Premium' :
                       user.subscription ? user.subscription.level : 'Free'}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Reason Field */}
          <div>
            <Label htmlFor="reason" className="text-base font-medium">
              Reason for Free Access
            </Label>
            <Textarea
              id="reason"
              placeholder="e.g., Beta tester, Content creator, Community contributor..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-2"
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">
              This reason will be stored for audit purposes.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isProcessing || !reason.trim()}
            className="bg-emerald-500 hover:bg-emerald-600"
          >
            {isProcessing ? 'Processing...' : `Grant Access to ${selectedUsers.length} Users`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}