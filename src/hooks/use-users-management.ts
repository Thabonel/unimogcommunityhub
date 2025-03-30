
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchUsers, 
  banUser, 
  unbanUser, 
  deleteUser, 
  blockEmail, 
  unblockEmail,
  getBlockedEmails
} from "@/utils/userUtils";

export function useUsersManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [userToBan, setUserToBan] = useState<string | null>(null);
  const [userToToggleAdmin, setUserToToggleAdmin] = useState<{id: string, makeAdmin: boolean} | null>(null);
  const [showBlockEmailDialog, setShowBlockEmailDialog] = useState(false);
  const queryClient = useQueryClient();
  const pageSize = 10;
  
  // Fetch users with React Query
  const { 
    data: users, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: fetchUsers
  });
  
  // Fetch blocked emails
  const { 
    data: blockedEmails = [], 
    isLoading: isLoadingBlockedEmails 
  } = useQuery({
    queryKey: ["blockedEmails"],
    queryFn: getBlockedEmails
  });

  // Filter users by search term
  const filteredUsers = users?.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toString().includes(searchTerm)
  );

  // Get paginated users
  const paginatedUsers = filteredUsers?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Total pages
  const totalPages = filteredUsers ? Math.ceil(filteredUsers.length / pageSize) : 0;

  // Ban user mutation
  const banUserMutation = useMutation({
    mutationFn: ({ userId, duration }: { userId: string, duration?: number }) => 
      banUser(userId, duration),
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
    // State
    users,
    filteredUsers,
    paginatedUsers,
    blockedEmails,
    isLoading,
    isLoadingBlockedEmails,
    error,
    searchTerm,
    currentPage, 
    totalPages,
    userToDelete,
    userToBan,
    userToToggleAdmin,
    showBlockEmailDialog,
    
    // Actions
    setSearchTerm,
    setCurrentPage,
    setUserToDelete,
    setUserToBan,
    setUserToToggleAdmin,
    setShowBlockEmailDialog,
    refetch,
    
    // Mutations
    banUser: banUserMutation.mutate,
    unbanUser: unbanUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    blockEmail: blockEmailMutation.mutate,
    unblockEmail: unblockEmailMutation.mutate
  };
}
