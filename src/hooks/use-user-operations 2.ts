
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "@/utils/userOperations";
import { banUser, unbanUser } from "@/utils/userBanOperations";
import { addAdminRole, removeAdminRole } from "@/utils/adminUtils";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { useAuditLogger, LogAction } from "@/hooks/use-audit-logger";
import type { UserBanParams, AdminToggleParams } from "@/types/user";

export function useUserOperations() {
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [userToBan, setUserToBan] = useState<string | null>(null);
  const [userToToggleAdmin, setUserToToggleAdmin] = useState<AdminToggleParams | null>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { handleError } = useErrorHandler();
  const { logAction } = useAuditLogger();
  
  // Ban user mutation
  const banUserMutation = useMutation({
    mutationFn: ({ userId, duration, reason }: UserBanParams) => 
      banUser(userId, duration, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      setUserToBan(null);
      toast({
        title: "User banned",
        description: "The user has been banned successfully"
      });
      logAction({
        action: LogAction.USER_BANNED,
        target_id: variables.userId,
        details: { 
          duration: variables.duration, 
          reason: variables.reason 
        }
      });
    },
    onError: (error) => {
      handleError(error, { context: "User Ban" });
    }
  });

  // Unban user mutation
  const unbanUserMutation = useMutation({
    mutationFn: (userId: string) => unbanUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      toast({
        title: "User unbanned",
        description: "The user has been unbanned successfully"
      });
      logAction({
        action: LogAction.USER_UNBANNED,
        target_id: userId
      });
    },
    onError: (error) => {
      handleError(error, { context: "User Unban" });
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      setUserToDelete(null);
      toast({
        title: "User deleted",
        description: "The user has been deleted successfully"
      });
      logAction({
        action: LogAction.USER_DELETED,
        target_id: userId
      });
    },
    onError: (error) => {
      handleError(error, { context: "User Deletion" });
    }
  });
  
  // Handler for toggling admin role
  const handleToggleAdminRole = async (userId: string, makeAdmin: boolean) => {
    try {
      let success;
      
      if (makeAdmin) {
        success = await addAdminRole(userId);
        if (success) {
          logAction({
            action: LogAction.ADMIN_ROLE_ADDED,
            target_id: userId
          });
        }
      } else {
        success = await removeAdminRole(userId);
        if (success) {
          logAction({
            action: LogAction.ADMIN_ROLE_REMOVED,
            target_id: userId
          });
        }
      }
      
      if (success) {
        queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
        toast({
          title: makeAdmin ? "Admin role assigned" : "Admin role removed",
          description: `User has been ${makeAdmin ? "made an administrator" : "removed from administrators"} successfully`
        });
      }
      
      setUserToToggleAdmin(null);
    } catch (error) {
      handleError(error, {
        context: makeAdmin ? "Admin Role Assignment" : "Admin Role Removal"
      });
    }
  };

  return {
    // State
    userToDelete,
    userToBan,
    userToToggleAdmin,
    setUserToDelete,
    setUserToBan,
    setUserToToggleAdmin,
    
    // Operations
    handleToggleAdminRole,
    banUser: banUserMutation.mutate,
    unbanUser: unbanUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    
    // Status
    isBanning: banUserMutation.isPending,
    isUnbanning: unbanUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending
  };
}
