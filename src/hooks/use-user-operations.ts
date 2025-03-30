
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  deleteUser 
} from "@/utils/userOperations";
import {
  banUser,
  unbanUser
} from "@/utils/userBanOperations";
import { addAdminRole, removeAdminRole } from "@/utils/adminUtils";

export function useUserOperations() {
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [userToBan, setUserToBan] = useState<string | null>(null);
  const [userToToggleAdmin, setUserToToggleAdmin] = useState<{id: string, makeAdmin: boolean} | null>(null);
  const queryClient = useQueryClient();
  
  // Ban user mutation
  const banUserMutation = useMutation({
    mutationFn: ({ userId, duration, reason }: { userId: string, duration?: number, reason?: string }) => 
      banUser(userId, duration, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      setUserToBan(null);
    }
  });

  // Unban user mutation
  const unbanUserMutation = useMutation({
    mutationFn: (userId: string) => unbanUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      setUserToDelete(null);
    }
  });
  
  // Handler for toggling admin role
  const handleToggleAdminRole = async (userId: string, makeAdmin: boolean) => {
    try {
      let success;
      
      if (makeAdmin) {
        success = await addAdminRole(userId);
      } else {
        success = await removeAdminRole(userId);
      }
      
      if (success) {
        queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      }
      
      setUserToToggleAdmin(null);
    } catch (error) {
      console.error("Error toggling admin role:", error);
    }
  };

  return {
    userToDelete,
    userToBan,
    userToToggleAdmin,
    setUserToDelete,
    setUserToBan,
    setUserToToggleAdmin,
    handleToggleAdminRole,
    banUser: banUserMutation.mutate,
    unbanUser: unbanUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
  };
}
