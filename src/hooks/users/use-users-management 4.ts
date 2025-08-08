
import { useUsersData } from "./use-users-data";
import { useUsersFilters } from "./use-users-filters";
import { useUsersSelection } from "./use-users-selection";
import { useUsersPagination } from "./use-users-pagination";
import { useUsersSearch } from "./use-users-search";
import { useUserOperations } from "../use-user-operations";
import { useBlockedEmails } from "../use-blocked-emails";
import { useFreeAccessManagement } from "./use-free-access-management";

/**
 * Main hook for users management functionality
 * Combines all user-related hooks into a single API
 */
export function useUsersManagement() {
  // Get users data
  const usersData = useUsersData();
  const { users, isLoading, isError, error, refetch } = usersData;
  
  // Setup filters
  const { filters, filterOptions, applyFilters, filterUsers } = useUsersFilters();
  
  // Setup selection
  const { 
    selectedUsers, 
    toggleSelectUser, 
    selectAllUsers, 
    deselectAllUsers, 
    exportUsers, 
    bulkMessageUsers 
  } = useUsersSelection();
  
  // Setup search functionality
  const { 
    searchTerm, 
    setSearchTerm, 
    filteredItems: searchedUsers,
    resetSearch
  } = useUsersSearch({ items: users });
  
  // Apply filters after search
  const filteredUsers = filterUsers(searchedUsers);
  
  // Setup pagination
  const { 
    currentPage, 
    totalPages, 
    setCurrentPage, 
    paginateItems,
    nextPage,
    prevPage,
    resetPage,
    getPageNumbers
  } = useUsersPagination({ totalItems: filteredUsers.length });
  
  // Get paginated users
  const paginatedUsers = paginateItems(filteredUsers);
  
  // Get user operations
  const userOperations = useUserOperations();
  
  // Get blocked emails operations
  const blockedEmailsOperations = useBlockedEmails();

  // Get free access management
  const freeAccessManagement = useFreeAccessManagement();
  
  // Reset pagination when search changes
  if (searchTerm && currentPage !== 1) {
    resetPage();
  }
  
  return {
    // User data and state
    users,
    filteredUsers,
    paginatedUsers,
    isLoading,
    isError,
    error,
    refetch,
    
    // Filters
    filters,
    filterOptions,
    applyFilters: (newFilters: any) => {
      applyFilters(newFilters);
      resetPage(); // Reset to first page when filters change
      deselectAllUsers(); // Clear selections when filters change
    },
    
    // Search functionality
    searchTerm,
    setSearchTerm,
    resetSearch,
    
    // Selection
    selectedUsers,
    toggleSelectUser,
    selectAllUsers: () => selectAllUsers(paginatedUsers.map(user => user.id)),
    deselectAllUsers,
    
    // Bulk operations
    exportUsers: (userIds: string[]) => exportUsers(filteredUsers, userIds),
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
    ...blockedEmailsOperations,
    
    // Free access management
    ...freeAccessManagement
  };
}

export * from './use-users-filters';
export * from './use-users-selection';
export * from './use-users-data';
export * from './use-users-pagination';
export * from './use-users-search';
export * from './use-free-access-management';
