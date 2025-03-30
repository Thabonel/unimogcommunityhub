
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

interface UsersPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function UsersPagination({ currentPage, totalPages, onPageChange }: UsersPaginationProps) {
  // Generate pagination items
  const generatePaginationItems = () => {
    // If 5 or fewer pages, show all
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Always include first page, last page, current page and one on each side of current
    const items = new Set([1, totalPages, currentPage]);
    
    if (currentPage > 1) items.add(currentPage - 1);
    if (currentPage < totalPages) items.add(currentPage + 1);
    
    // Convert to array and sort
    return Array.from(items).sort((a, b) => a - b);
  };
  
  const paginationItems = generatePaginationItems();
  
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
        
        {paginationItems.map((page, index) => {
          // If there's a gap of more than 1 page, add ellipsis
          if (index > 0 && page > paginationItems[index - 1] + 1) {
            return (
              <PaginationItem key={`ellipsis-${page}`}>
                <span className="flex h-9 w-9 items-center justify-center">...</span>
              </PaginationItem>
            );
          }
          
          return (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => onPageChange(page)}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        
        <PaginationItem>
          <PaginationNext 
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
