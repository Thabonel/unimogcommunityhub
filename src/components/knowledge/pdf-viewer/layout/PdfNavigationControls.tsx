
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
    const value = e.target.value;

    // Only process if user has finished typing (on blur) or pressed Enter
    // This prevents constant page changes while typing
    if (value === '') return;

    const page = parseInt(value);
    if (!isNaN(page) && page >= 1 && page <= numPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement;
      const page = parseInt(target.value);
      if (!isNaN(page) && page >= 1 && page <= numPages && page !== currentPage) {
        onPageChange(page);
      }
    }
  };

  return (
    <div className="flex items-center space-x-1 flex-wrap gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrevPage}
        disabled={currentPage <= 1}
        className="h-7 px-2"
        aria-label="Previous page"
      >
        <ArrowUp className="h-3 w-3" />
      </Button>

      <input
        type="number"
        value={currentPage}
        onChange={handleGoToPage}
        onKeyPress={handleKeyPress}
        min="1"
        max={numPages}
        className="w-10 h-7 p-1 text-xs border rounded text-center"
        aria-label={`Page ${currentPage} of ${numPages}`}
      />

      <Button
        variant="outline"
        size="sm"
        onClick={handleNextPage}
        disabled={currentPage >= numPages}
        className="h-7 px-2"
        aria-label="Next page"
      >
        <ArrowDown className="h-3 w-3" />
      </Button>
    </div>
  );
}
