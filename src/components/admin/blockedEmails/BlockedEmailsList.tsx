
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BlockEmailDialog } from "@/components/admin/BlockEmailDialog";
import { Loader2, Ban } from "lucide-react";
import { BlockedEmailsContent } from "./BlockedEmailsContent";
import { UnblockEmailDialog } from "./UnblockEmailDialog";

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
        ) : (
          <BlockedEmailsContent 
            blockedEmails={blockedEmails} 
            onUnblock={setEmailToUnblock} 
          />
        )}
      </CardContent>

      {/* Block Email Dialog */}
      <BlockEmailDialog
        open={showBlockDialog}
        onOpenChange={setShowBlockDialog}
        onConfirm={onBlockEmail}
      />

      {/* Unblock Email Confirmation */}
      <UnblockEmailDialog
        emailToUnblock={emailToUnblock}
        onOpenChange={() => setEmailToUnblock(null)}
        onConfirm={(email) => {
          onUnblockEmail(email);
          setEmailToUnblock(null);
        }}
      />
    </Card>
  );
}
