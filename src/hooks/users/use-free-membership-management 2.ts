
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { grantFreeAccess, revokeFreeAccess, getFreeAccessUsers } from "@/utils/userMembershipOperations";
import { useToast } from "@/hooks/use-toast";

export function useFreeMembershipManagement() {
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query for fetching free memberships
  const { 
    data = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["freeMemberships"],
    queryFn: getFreeAccessUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once to prevent excessive error messages
  });

  // Mutation for revoking membership
  const revokeMutation = useMutation({
    mutationFn: revokeFreeAccess,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["freeMemberships"] });
      toast({
        title: "Membership revoked",
        description: "Free membership has been successfully revoked"
      });
    },
    onError: (error) => {
      console.error("Error revoking membership:", error);
      toast({
        title: "Failed to revoke membership",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  });

  // Format data for display
  const freeMemberships = data.map(item => ({
    id: item.id,
    user: {
      name: item.profiles?.full_name || item.profiles?.display_name || null,
      email: item.profiles?.email || "Unknown email"
    },
    reason: item.free_access_reason || "",
    expiresAt: item.expires_at || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
  }));

  // Function to refresh data
  const refreshData = () => {
    refetch();
  };

  return {
    isLoading,
    error,
    freeMemberships,
    revokeMembership: revokeMutation.mutate,
    refreshData,
    showDialog,
    setShowDialog
  };
}
