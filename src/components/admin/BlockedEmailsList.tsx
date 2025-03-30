
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BlockEmailDialog } from "@/components/admin/BlockEmailDialog";
import { Loader2, Ban, Trash2, Shield } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface BlockedEmailsListProps {
  blockedEmails: { email: string; reason: string | null }[];
  isLoading: boolean;
  onBlockEmail: (email: string, reason: string) => void;
  onUnblockEmail: (email: string) => void;
}

export function BlockedEmailsList({
  blockedEmails,
  isLoading,
  onBlockEmail,
  onUnblockEmail,
}: BlockedEmailsListProps) {
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [emailToUnblock, setEmailToUnblock] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex flex-row justify-between items-center">
          <div>
            <CardTitle>Blocked Emails</CardTitle>
            <CardDescription>
              Email addresses that are prevented from registering
            </CardDescription>
          </div>
          <Button 
            onClick={() => setShowBlockDialog(true)}
            className="flex items-center gap-2"
          >
            <Ban className="h-4 w-4" />
            Block Email
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : blockedEmails.length > 0 ? (
          <div className="space-y-4">
            {blockedEmails.map((item) => (
              <div 
                key={item.email} 
                className="flex justify-between items-center p-3 rounded-md bg-muted/50"
              >
                <div>
                  <div className="font-medium">{item.email}</div>
                  {item.reason && (
                    <div className="text-sm text-muted-foreground">
                      Reason: {item.reason}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEmailToUnblock(item.email)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No blocked email addresses
          </div>
        )}
      </CardContent>

      {/* Block Email Dialog */}
      <BlockEmailDialog
        open={showBlockDialog}
        onOpenChange={setShowBlockDialog}
        onConfirm={onBlockEmail}
      />

      {/* Unblock Email Confirmation */}
      <AlertDialog
        open={Boolean(emailToUnblock)}
        onOpenChange={(open) => {
          if (!open) setEmailToUnblock(null);
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
                  onUnblockEmail(emailToUnblock);
                  setEmailToUnblock(null);
                }
              }}
            >
              Unblock Email
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
