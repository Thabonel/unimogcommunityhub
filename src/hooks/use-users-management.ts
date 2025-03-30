
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/utils/userOperations";
import { usePagination } from "./use-pagination";
import { useSearch } from "./use-search";
import { useUserOperations } from "./use-user-operations";
import { useBlockedEmails } from "./use-blocked-emails";
import { useErrorHandler } from "./use-error-handler";
import type { UserData } from "@/types/user";

export function useUsersManagement() {
  const { handleError } = useErrorHandler();
  
  // Fetch users with React Query and error handling
  const usersQuery = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      try {
        return await fetchUsers();
      } catch (error) {
        handleError(error, { 
          context: "Fetching Users",
          showToast: true
        });
        return [] as UserData[];
      }
    }
  });
  
  // Use the search hook to filter users
  const { 
    searchTerm, 
    setSearchTerm, 
    filteredItems: filteredUsers,
    resetSearch
  } = useSearch<UserData>({
    items: usersQuery.data || [],
    searchFields: ['email', 'id'],
    initialSearchTerm: '',
    debounceTime: 250
  });
  
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
  
  return {
    // User data and state
    users: usersQuery.data || [],
    filteredUsers,
    paginatedUsers,
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    error: usersQuery.error,
    refetch: usersQuery.refetch,
    
    // Search functionality
    searchTerm,
    setSearchTerm,
    resetSearch,
    
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
