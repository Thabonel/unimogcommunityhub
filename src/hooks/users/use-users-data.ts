
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/utils/userOperations";
import { getUserSubscription } from "@/services/subscriptionService";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { UserWithSubscription } from "./use-users-filters";

export function useUsersData() {
  const { handleError } = useErrorHandler();
  
  // Fetch users with React Query and error handling
  const usersQuery = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      try {
        const users = await fetchUsers();
        
        // Fetch subscription status for each user
        const usersWithSubscription = await Promise.all(
          users.map(async (user) => {
            try {
              const subscription = await getUserSubscription(user.id);
              return {
                ...user,
                // Ensure is_admin is always boolean (not undefined)
                is_admin: !!user.is_admin,
                subscription: subscription ? {
                  // Map correct database columns to expected format
                  level: subscription.subscription_type,
                  subscription_type: subscription.subscription_type,
                  is_active: subscription.subscription_status === 'active',
                  is_trial: !!subscription.trial_ends_at,
                  trial_ends_at: subscription.trial_ends_at,
                  expires_at: subscription.current_period_end,
                  is_free_access: subscription.is_free_access || false,
                  free_access_reason: subscription.free_access_reason,
                  stripe_customer_id: subscription.stripe_customer_id
                } : undefined
              };
            } catch (error) {
              console.error(`Failed to fetch subscription for user ${user.id}`, error);
              // Ensure is_admin is always boolean (not undefined)
              return {
                ...user,
                is_admin: !!user.is_admin
              };
            }
          })
        );
        
        return usersWithSubscription as UserWithSubscription[];
      } catch (error) {
        console.error("Error in useUsersData:", error);
        handleError(error, { 
          context: "Fetching Users",
          showToast: true
        });
        // Re-throw error - no fallbacks
        throw error;
      }
    },
    // Add retry configuration  
    retry: import.meta.env.PROD ? 3 : 0,
    retryDelay: (attempt) => Math.min(attempt > 1 ? 2000 * 2 ** attempt : 1000, 30000),
  });
  
  return {
    users: usersQuery.data || [],
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    error: usersQuery.error,
    refetch: usersQuery.refetch
  };
}

