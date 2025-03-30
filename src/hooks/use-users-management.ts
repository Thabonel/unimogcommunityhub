
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/utils/userOperations";
import { usePagination } from "./use-pagination";
import { useSearch } from "./use-search";
import { useUserOperations } from "./use-user-operations";
import { useBlockedEmails } from "./use-blocked-emails";

export function useUsersManagement() {
  // Fetch users with React Query
  const { 
    data: users = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: fetchUsers
  });
  
  // Use the search hook to filter users
  const { 
    searchTerm, 
    setSearchTerm, 
    filteredItems: filteredUsers 
  } = useSearch({
    items: users,
    searchFields: ['email', 'id'],
    initialSearchTerm: ''
  });
  
  // Use the pagination hook
  const { 
    currentPage, 
    totalPages, 
    setCurrentPage, 
    paginateItems 
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
  
  return {
    // User data and state
    users,
    filteredUsers,
    paginatedUsers,
    isLoading,
    error,
    refetch,
    
    // Search functionality
    searchTerm,
    setSearchTerm,
    
    // Pagination
    currentPage,
    totalPages,
    setCurrentPage,
    
    // User operations
    ...userOperations,
    
    // Blocked emails operations
    ...blockedEmailsOperations
  };
}
