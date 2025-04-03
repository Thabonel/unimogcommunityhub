
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
                subscription: subscription ? {
                  level: subscription.subscription_level,
                  is_active: subscription.is_active,
                  is_trial: subscription.subscription_level === 'trial',
                  expires_at: subscription.expires_at
                } : undefined
              };
            } catch (error) {
              console.error(`Failed to fetch subscription for user ${user.id}`, error);
              return user;
            }
          })
        );
        
        return usersWithSubscription as UserWithSubscription[];
      } catch (error) {
        handleError(error, { 
          context: "Fetching Users",
          showToast: true
        });
        return [] as UserWithSubscription[];
      }
    }
  });
  
  return {
    users: usersQuery.data || [],
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    error: usersQuery.error,
    refetch: usersQuery.refetch
  };
}
