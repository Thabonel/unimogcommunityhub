
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { grantFreeAccess, revokeFreeAccess, getFreeAccessUsers } from "@/utils/userMembershipOperations";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { useAuditLogger, LogAction } from "@/hooks/use-audit-logger";

export function useFreeAccessManagement() {
  const [showGrantAccessDialog, setShowGrantAccessDialog] = useState(false);
  const [userToRevokeFreeAccess, setUserToRevokeFreeAccess] = useState<string | null>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { handleError } = useErrorHandler();
  const { logAction } = useAuditLogger();
  
  // Fetch users with free access
  const freeAccessUsersQuery = useQuery({
    queryKey: ["freeAccessUsers"],
    queryFn: async () => {
      try {
        return await getFreeAccessUsers();
      } catch (error) {
        handleError(error, { 
          context: "Fetching Free Access Users",
          showToast: true
        });
        return [];
      }
    },
    // Don't fetch until needed, when the component mounts it should fetch
    enabled: false
  });

  // Grant free access mutation
  const grantFreeMutation = useMutation({
    mutationFn: ({
      email, 
      reason, 
      isPermanent
    }: { 
      email: string; 
      reason?: string; 
      isPermanent?: boolean;
    }) => grantFreeAccess({ email, reason, isPermanent }),
    onSuccess: (_, { email }) => {
      queryClient.invalidateQueries({ queryKey: ["freeAccessUsers"] });
      setShowGrantAccessDialog(false);
      toast({
        title: "Free access granted",
        description: `${email} has been granted free access successfully`
      });
      logAction({
        action: LogAction.ADMIN_ROLE_ADDED,
        details: { email, type: 'free_access' }
      });
    },
    onError: (error) => {
      handleError(error, { context: "Granting Free Access" });
    }
  });

  // Revoke free access mutation
  const revokeFreeMutation = useMutation({
    mutationFn: (userId: string) => revokeFreeAccess(userId),
    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: ["freeAccessUsers"] });
      setUserToRevokeFreeAccess(null);
      toast({
        title: "Free access revoked",
        description: "Free access has been revoked successfully"
      });
      logAction({
        action: LogAction.ADMIN_ROLE_REMOVED,
        details: { type: 'free_access', userId: userToRevokeFreeAccess }
      });
    },
    onError: (error) => {
      handleError(error, { context: "Revoking Free Access" });
    }
  });

  return {
    // Free access data
    freeAccessUsers: freeAccessUsersQuery.data || [],
    isLoadingFreeAccessUsers: freeAccessUsersQuery.isLoading,
    refetchFreeAccessUsers: freeAccessUsersQuery.refetch,
    
    // UI state
    showGrantAccessDialog,
    userToRevokeFreeAccess,
    setShowGrantAccessDialog,
    setUserToRevokeFreeAccess,
    
    // Operations
    grantFreeAccess: grantFreeMutation.mutate,
    revokeFreeAccess: revokeFreeMutation.mutate,
    
    // Status
    isGrantingFreeAccess: grantFreeMutation.isPending,
    isRevokingFreeAccess: revokeFreeMutation.isPending
  };
}
