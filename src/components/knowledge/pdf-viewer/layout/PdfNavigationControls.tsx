
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface PdfNavigationControlsProps {
  currentPage: number;
  numPages: number;
  onPageChange: (page: number) => void;
}

export function PdfNavigationControls({ 
  currentPage, 
  numPages, 
  onPageChange 
}: PdfNavigationControlsProps) {
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < numPages) {
      onPageChange(currentPage + 1);
    }
  };
  
  const handleGoToPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(e.target.value);
    if (!isNaN(page) && page >= 1 && page <= numPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex items-center space-x-2 flex-wrap gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handlePrevPage} 
        disabled={currentPage <= 1}
        className="flex items-center"
        aria-label="Previous page"
      >
        <ArrowUp className="h-4 w-4" />
        <span className="sr-only md:not-sr-only md:ml-2">Previous</span>
      </Button>
      
      <div className="flex items-center">
        <span className="text-sm mr-2">Page</span>
        <input
          type="number"
          value={currentPage}
          onChange={handleGoToPage}
          min="1"
          max={numPages}
          className="w-12 p-1 text-sm border rounded"
          aria-label={`Current page ${currentPage} of ${numPages}`}
        />
        <span className="text-sm ml-2">of {numPages}</span>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleNextPage} 
        disabled={currentPage >= numPages}
        className="flex items-center"
        aria-label="Next page"
      >
        <ArrowDown className="h-4 w-4" />
        <span className="sr-only md:not-sr-only md:ml-2">Next</span>
      </Button>
    </div>
  );
}
