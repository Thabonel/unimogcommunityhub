
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PdfNavigationControlsProps {
  currentPage: number;
  numPages: number;
  onPageChange: (pageNumber: number) => void;
  onScrollUp: () => void;
  onScrollDown: () => void;
}

export function PdfNavigationControls({
  currentPage,
  numPages,
  onPageChange,
  onScrollUp,
  onScrollDown
}: PdfNavigationControlsProps) {
  const prevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < numPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={prevPage}
        disabled={currentPage <= 1}
      >
        <ChevronLeft size={16} />
        <span className="sr-only md:not-sr-only md:ml-1">Previous</span>
      </Button>
      
      <div className="flex items-center text-sm">
        <span>
          Page {currentPage} of {numPages}
        </span>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={nextPage}
        disabled={currentPage >= numPages}
      >
        <span className="sr-only md:not-sr-only md:mr-1">Next</span>
        <ChevronRight size={16} />
      </Button>

      {/* Page scroll controls */}
      <div className="flex items-center ml-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onScrollUp}
          title="Scroll up"
        >
          <ChevronUp size={16} />
          <span className="sr-only">Scroll up</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onScrollDown}
          title="Scroll down"
        >
          <ChevronDown size={16} />
          <span className="sr-only">Scroll down</span>
        </Button>
      </div>
    </div>
  );
}
