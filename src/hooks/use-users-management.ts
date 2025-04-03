
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/utils/userOperations";
import { usePagination } from "./use-pagination";
import { useSearch } from "./use-search";
import { useUserOperations } from "./use-user-operations";
import { useBlockedEmails } from "./use-blocked-emails";
import { useErrorHandler } from "./use-error-handler";
import { getUserSubscription } from "@/services/subscriptionService";
import { toast } from "@/hooks/use-toast";
import type { UserData, UserProfile } from "@/types/user";

type UserFilter = 'status' | 'subscription' | 'role';
type FilterValue = string | null;

interface UserWithSubscription extends UserData {
  subscription?: {
    level: string;
    is_active: boolean;
    is_trial: boolean;
    expires_at: string | null;
  }
}

export function useUsersManagement() {
  const { handleError } = useErrorHandler();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [filters, setFilters] = useState<Record<string, FilterValue>>({});
  
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
  
  // Filter options for the UI
  const filterOptions = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'banned', label: 'Banned' }
      ]
    },
    {
      key: 'subscription',
      label: 'Subscription',
      options: [
        { value: 'free', label: 'Free' },
        { value: 'trial', label: 'Trial' },
        { value: 'basic', label: 'Basic' },
        { value: 'premium', label: 'Premium' },
        { value: 'expired', label: 'Expired' }
      ]
    },
    {
      key: 'role',
      label: 'Role',
      options: [
        { value: 'admin', label: 'Admin' },
        { value: 'user', label: 'User' }
      ]
    }
  ];
  
  // Apply filters to the user list
  const applyFilters = (newFilters: Record<string, FilterValue>) => {
    setFilters(newFilters);
    resetPage(); // Reset to first page when filters change
    setSelectedUsers([]); // Clear selections when filters change
  };
  
  // Filter users based on selected filters
  const filterUsers = (users: UserWithSubscription[]): UserWithSubscription[] => {
    if (!filters || Object.keys(filters).length === 0) {
      return users;
    }
    
    return users.filter(user => {
      // Status filter
      if (filters.status) {
        if (filters.status === 'active' && user.banned_until) {
          return false;
        }
        if (filters.status === 'banned' && !user.banned_until) {
          return false;
        }
      }
      
      // Subscription filter
      if (filters.subscription) {
        if (!user.subscription && filters.subscription !== 'free') {
          return false;
        }
        
        if (user.subscription) {
          if (filters.subscription === 'free') {
            return false;
          }
          
          if (filters.subscription === 'trial' && !user.subscription.is_trial) {
            return false;
          }
          
          if (filters.subscription === 'expired' && 
              (user.subscription.is_active || !user.subscription.expires_at)) {
            return false;
          }
          
          if (['basic', 'premium'].includes(filters.subscription) && 
              user.subscription.level !== filters.subscription) {
            return false;
          }
        }
      }
      
      // Role filter
      if (filters.role) {
        if (filters.role === 'admin' && !user.is_admin) {
          return false;
        }
        if (filters.role === 'user' && user.is_admin) {
          return false;
        }
      }
      
      return true;
    });
  };
  
  // Use the search hook to filter users
  const { 
    searchTerm, 
    setSearchTerm, 
    filteredItems: searchedUsers,
    resetSearch
  } = useSearch<UserWithSubscription>({
    items: usersQuery.data || [],
    searchFields: ['email', 'id'],
    initialSearchTerm: '',
    debounceTime: 250
  });
  
  // Apply filters after search
  const filteredUsers = filterUsers(searchedUsers);
  
  // Use the pagination hook
  const { 
    currentPage, 
    totalPages, 
    setCurrentPage, 
    paginateItems,
    nextPage,
    prevPage,
    resetPage,
    getPageNumbers
  } = usePagination({
    totalItems: filteredUsers.length,
    pageSize: 10
  });
  
  // Get paginated users
  const paginatedUsers = paginateItems(filteredUsers);
  
  // Use user operations hook
  const userOperations = useUserOperations();
  
  // Use blocked emails hook
  const blockedEmailsOperations = useBlockedEmails();
  
  // Reset pagination when search changes
  if (searchTerm && currentPage !== 1) {
    resetPage();
  }
  
  // User selection functions
  const toggleSelectUser = useCallback((userId: string, isSelected: boolean) => {
    setSelectedUsers(prev => 
      isSelected 
        ? [...prev, userId]
        : prev.filter(id => id !== userId)
    );
  }, []);
  
  const selectAllUsers = useCallback(() => {
    setSelectedUsers(paginatedUsers.map(user => user.id));
  }, [paginatedUsers]);
  
  const deselectAllUsers = useCallback(() => {
    setSelectedUsers([]);
  }, []);
  
  // Bulk operations
  const exportUsers = useCallback((userIds: string[]) => {
    const selectedUserData = filteredUsers
      .filter(user => userIds.includes(user.id))
      .map(({ id, email, created_at, last_sign_in_at, subscription }) => ({
        id,
        email,
        created_at,
        last_sign_in_at,
        subscription_status: subscription 
          ? `${subscription.is_trial ? 'Trial' : subscription.level} (${subscription.is_active ? 'Active' : 'Inactive'})`
          : 'Free'
      }));
    
    const jsonString = JSON.stringify(selectedUserData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Users Exported',
      description: `Exported data for ${userIds.length} users.`
    });
  }, [filteredUsers, toast]);
  
  const bulkMessageUsers = useCallback((userIds: string[]) => {
    // For demonstration - we'd implement actual messaging functionality here
    console.log('Send message to users:', userIds);
    toast({
      title: 'Bulk Message',
      description: `Message dialog would open for ${userIds.length} users.`
    });
    // This would typically open a dialog to compose a message
  }, [toast]);
  
  return {
    // User data and state
    users: usersQuery.data || [],
    filteredUsers,
    paginatedUsers,
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    error: usersQuery.error,
    refetch: usersQuery.refetch,
    
    // Filters
    filters,
    filterOptions,
    applyFilters,
    
    // Search functionality
    searchTerm,
    setSearchTerm,
    resetSearch,
    
    // Selection
    selectedUsers,
    toggleSelectUser,
    selectAllUsers,
    deselectAllUsers,
    
    // Bulk operations
    exportUsers,
    bulkMessageUsers,
    
    // Pagination
    currentPage,
    totalPages,
    setCurrentPage,
    nextPage,
    prevPage,
    resetPage,
    getPageNumbers,
    
    // User operations
    ...userOperations,
    
    // Blocked emails operations
    ...blockedEmailsOperations
  };
}
