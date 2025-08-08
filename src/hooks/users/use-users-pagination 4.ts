
import { useState, useCallback, useMemo } from "react";

interface UseUsersPaginationProps {
  totalItems: number;
  pageSize?: number;
  initialPage?: number;
}

export function useUsersPagination({ 
  totalItems, 
  pageSize = 10,
  initialPage = 1
}: UseUsersPaginationProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  
  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / pageSize));
  }, [totalItems, pageSize]);
  
  // Ensure current page is valid
  if (totalPages > 0 && currentPage > totalPages) {
    setCurrentPage(totalPages);
  }
  
  // Get paginated items
  const paginateItems = useCallback(<T>(items: T[]): T[] => {
    const startIndex = (currentPage - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }, [currentPage, pageSize]);
  
  // Page navigation
  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);
  
  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);
  
  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);
  
  // Get array of page numbers for pagination UI
  const getPageNumbers = useCallback(() => {
    const pages = [];
    const maxPages = 7; // Arbitrary limit to avoid too many page buttons
    
    if (totalPages <= maxPages) {
      // Show all pages if there aren't too many
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first and last page
      pages.push(1);
      
      // Logic for showing pages around current page
      if (currentPage <= 3) {
        // Near start, show first 5 pages
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
      } else if (currentPage >= totalPages - 2) {
        // Near end, show last 5 pages
        pages.push('...');
        for (let i = totalPages - 4; i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In middle, show current page and neighbors
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  }, [currentPage, totalPages]);
  
  return {
    currentPage,
    totalPages,
    setCurrentPage,
    paginateItems,
    nextPage,
    prevPage,
    resetPage,
    getPageNumbers
  };
}
