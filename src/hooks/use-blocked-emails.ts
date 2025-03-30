
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  blockEmail,
  unblockEmail,
  getBlockedEmails
} from "@/utils/emailBlockOperations";

export function useBlockedEmails() {
  const [showBlockEmailDialog, setShowBlockEmailDialog] = useState(false);
  const queryClient = useQueryClient();
  
  // Fetch blocked emails
  const { 
    data: blockedEmails = [], 
    isLoading: isLoadingBlockedEmails 
  } = useQuery({
    queryKey: ["blockedEmails"],
    queryFn: getBlockedEmails
  });

  // Block email mutation
  const blockEmailMutation = useMutation({
    mutationFn: ({ email, reason }: { email: string, reason?: string }) => 
      blockEmail(email, reason || null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blockedEmails"] });
      setShowBlockEmailDialog(false);
    }
  });

  // Unblock email mutation
  const unblockEmailMutation = useMutation({
    mutationFn: (email: string) => unblockEmail(email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blockedEmails"] });
    }
  });

  return {
    blockedEmails,
    isLoadingBlockedEmails,
    showBlockEmailDialog,
    setShowBlockEmailDialog,
    blockEmail: blockEmailMutation.mutate,
    unblockEmail: unblockEmailMutation.mutate
  };
}
