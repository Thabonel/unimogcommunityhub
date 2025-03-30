
import { useState } from "react";

interface UsePaginationProps {
  totalItems?: number;
  pageSize?: number;
  initialPage?: number;
}

export function usePagination({ 
  totalItems = 0, 
  pageSize = 10, 
  initialPage = 1 
}: UsePaginationProps = {}) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  
  // Calculate total pages
  const totalPages = totalItems ? Math.ceil(totalItems / pageSize) : 0;
  
  // Get paginated items from an array
  const paginateItems = <T>(items: T[] = []): T[] => {
    return items.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  };
  
  // Reset to first page (useful when filters change)
  const resetPage = () => setCurrentPage(1);
  
  return {
    currentPage,
    totalPages,
    pageSize,
    setCurrentPage,
    paginateItems,
    resetPage
  };
}
