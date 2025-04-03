
import { useState } from "react";
import { useSearch } from "../use-search";
import { usePagination } from "../use-pagination";
import { useUserOperations } from "../use-user-operations";
import { useBlockedEmails } from "../use-blocked-emails";
import { useUsersData } from "./use-users-data";
import { useUsersFilters } from "./use-users-filters";
import { useUsersSelection } from "./use-users-selection";

export function useUsersManagement() {
  const { users, isLoading, isError, error, refetch } = useUsersData();
  const { filters, filterOptions, applyFilters, filterUsers } = useUsersFilters();
  const { 
    selectedUsers, 
    toggleSelectUser, 
    selectAllUsers, 
    deselectAllUsers, 
    exportUsers, 
    bulkMessageUsers 
  } = useUsersSelection();
  
  // Use the search hook to filter users
  const { 
    searchTerm, 
    setSearchTerm, 
    filteredItems: searchedUsers,
    resetSearch
  } = useSearch({
    items: users,
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
      setSelectedUsers([]); // Clear selections when filters change
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
    ...blockedEmailsOperations
  };
}

// Re-export for backwards compatibility
export * from './use-users-filters';
export * from './use-users-selection';
export * from './use-users-data';
