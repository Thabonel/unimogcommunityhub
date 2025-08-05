
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
        // For development mode, return mock data
        if (import.meta.env.DEV) {
          console.log("Development mode: Using mock user data from hook");
          return getMockUsers();
        }
        
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
                  level: subscription.subscription_level,
                  is_active: subscription.is_active,
                  is_trial: subscription.subscription_level === 'trial',
                  expires_at: subscription.expires_at
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
        // Return mock data as fallback 
        console.log("Error occurred, falling back to mock data");
        return getMockUsers();
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

// Mock user data for development mode
function getMockUsers(): UserWithSubscription[] {
  return [
    {
      id: "1",
      email: "admin@example.com",
      created_at: "2025-01-01T00:00:00.000Z",
      last_sign_in_at: "2025-03-30T10:45:00.000Z",
      banned_until: null,
      is_admin: true,
      subscription: {
        level: 'pro',
        is_active: true,
        is_trial: false,
        expires_at: "2026-01-01T00:00:00.000Z"
      }
    },
    {
      id: "2",
      email: "user@example.com",
      created_at: "2025-02-15T00:00:00.000Z",
      last_sign_in_at: "2025-04-01T08:30:00.000Z",
      banned_until: null,
      is_admin: false,
      subscription: {
        level: 'basic',
        is_active: true,
        is_trial: false,
        expires_at: "2025-08-15T00:00:00.000Z"
      }
    },
    {
      id: "3",
      email: "banned@example.com",
      created_at: "2025-01-20T00:00:00.000Z",
      last_sign_in_at: "2025-02-10T14:20:00.000Z",
      banned_until: "2025-12-31T00:00:00.000Z",
      is_admin: false,
      subscription: {
        level: 'free',
        is_active: false,
        is_trial: false,
        expires_at: null
      }
    }
  ];
}
