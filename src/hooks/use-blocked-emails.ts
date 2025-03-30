
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  blockEmail,
  unblockEmail,
  getBlockedEmails
} from "@/utils/emailBlockOperations";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { useAuditLogger, LogAction } from "@/hooks/use-audit-logger";
import type { BlockEmailParams } from "@/types/user";

export function useBlockedEmails() {
  const [showBlockEmailDialog, setShowBlockEmailDialog] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { handleError } = useErrorHandler();
  const { logAction } = useAuditLogger();
  
  // Fetch blocked emails with error handling
  const blockedEmailsQuery = useQuery({
    queryKey: ["blockedEmails"],
    queryFn: async () => {
      try {
        return await getBlockedEmails();
      } catch (error) {
        handleError(error, { 
          context: "Fetching Blocked Emails",
          showToast: true
        });
        return [];
      }
    }
  });

  // Block email mutation
  const blockEmailMutation = useMutation({
    mutationFn: ({ email, reason }: BlockEmailParams) => 
      blockEmail(email, reason || null),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["blockedEmails"] });
      setShowBlockEmailDialog(false);
      toast({
        title: "Email blocked",
        description: "The email address has been blocked successfully"
      });
      logAction({
        action: LogAction.EMAIL_BLOCKED,
        details: { 
          email: variables.email,
          reason: variables.reason 
        }
      });
    },
    onError: (error) => {
      handleError(error, { context: "Email Block" });
    }
  });

  // Unblock email mutation
  const unblockEmailMutation = useMutation({
    mutationFn: (email: string) => unblockEmail(email),
    onSuccess: (_, email) => {
      queryClient.invalidateQueries({ queryKey: ["blockedEmails"] });
      toast({
        title: "Email unblocked",
        description: "The email address has been unblocked successfully"
      });
      logAction({
        action: LogAction.EMAIL_UNBLOCKED,
        details: { email }
      });
    },
    onError: (error) => {
      handleError(error, { context: "Email Unblock" });
    }
  });

  return {
    // Data
    blockedEmails: blockedEmailsQuery.data || [],
    isLoadingBlockedEmails: blockedEmailsQuery.isLoading,
    isErrorBlockedEmails: blockedEmailsQuery.isError,
    
    // UI state
    showBlockEmailDialog,
    setShowBlockEmailDialog,
    
    // Operations
    blockEmail: blockEmailMutation.mutate,
    unblockEmail: unblockEmailMutation.mutate,
    refetchBlockedEmails: blockedEmailsQuery.refetch,
    
    // Status
    isBlocking: blockEmailMutation.isPending,
    isUnblocking: unblockEmailMutation.isPending
  };
}
