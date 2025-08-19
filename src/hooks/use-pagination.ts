
import { useState, useCallback } from "react";

interface UsePaginationProps {
  totalItems?: number;
  pageSize?: number;
  initialPage?: number;
  maxPageButtons?: number;
}

export function usePagination({ 
  totalItems = 0, 
  pageSize = 10, 
  initialPage = 1,
  maxPageButtons = 5
}: UsePaginationProps = {}) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  
  // Calculate total pages
  const totalPages = Math.max(1, totalItems ? Math.ceil(totalItems / pageSize) : 0);
  
  // Ensure current page is valid
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }
  
  // Get paginated items from an array
  const paginateItems = useCallback(<T>(items: T[] = []): T[] => {
    return items.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  }, [currentPage, pageSize]);
  
  // Reset to first page (useful when filters change)
  const resetPage = useCallback(() => setCurrentPage(1), []);
  
  // Go to a specific page
  const goToPage = useCallback((page: number) => {
    const targetPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(targetPage);
  }, [totalPages]);
  
  // Go to next page
  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);
  
  // Go to previous page
  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);
  
  // Calculate page numbers to display
  const getPageNumbers = useCallback(() => {
    if (totalPages <= maxPageButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    const halfButtons = Math.floor(maxPageButtons / 2);
    let startPage = Math.max(1, currentPage - halfButtons);
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
    
    if (endPage - startPage < maxPageButtons - 1) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }
    
    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  }, [currentPage, totalPages, maxPageButtons]);
  
  return {
    currentPage,
    totalPages,
    pageSize,
    setCurrentPage,
    paginateItems,
    resetPage,
    goToPage,
    nextPage,
    prevPage,
    getPageNumbers,
    startItem: totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0,
    endItem: Math.min(currentPage * pageSize, totalItems),
    hasPreviousPage: currentPage > 1,
    hasNextPage: currentPage < totalPages
  };
}
