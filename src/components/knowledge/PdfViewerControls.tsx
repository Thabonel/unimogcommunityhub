
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X, Printer, Search, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface PdfViewerControlsProps {
  currentPage: number;
  numPages: number;
  scale: number;
  isPrinting: boolean;
  printRange: { from: number; to: number };
  onPageChange: (pageNumber: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onClose: () => void;
  onPrint: () => void;
  onSearch: (searchTerm: string) => void;
  onNextResult: () => void;
  onPrevResult: () => void;
  searchTerm: string;
  searchResultsCount: number;
  currentSearchResultIndex: number;
  onPrintRangeChange: (e: React.ChangeEvent<HTMLInputElement>, type: 'from' | 'to') => void;
}

export function PdfViewerControls({
  currentPage,
  numPages,
  scale,
  isPrinting,
  printRange,
  onPageChange,
  onZoomIn,
  onZoomOut,
  onClose,
  onPrint,
  onSearch,
  onNextResult,
  onPrevResult,
  searchTerm,
  searchResultsCount,
  currentSearchResultIndex,
  onPrintRangeChange
}: PdfViewerControlsProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  
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

  // Handle clicks within the controls to prevent event propagation
  const handleControlClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(localSearchTerm);
  };

  return (
    <div className="bg-background border-b last:border-t last:border-b-0" onClick={handleControlClick}>
      {/* Search bar */}
      <form onSubmit={handleSearchSubmit} className="border-b p-2 flex items-center gap-2">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Search in document"
            value={localSearchTerm}
            onChange={handleSearchChange}
            className="w-full"
          />
          {searchResultsCount > 0 && (
            <span className="absolute right-10 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              {currentSearchResultIndex + 1}/{searchResultsCount}
            </span>
          )}
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
          >
            <Search size={16} />
          </Button>
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onPrevResult}
          disabled={searchResultsCount === 0}
        >
          <ArrowUp size={16} />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onNextResult}
          disabled={searchResultsCount === 0}
        >
          <ArrowDown size={16} />
        </Button>
      </form>

      {/* Navigation controls */}
      <div className="flex items-center justify-between py-2 px-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            disabled={currentPage <= 1}
          >
            <ChevronLeft size={16} />
          </Button>
          
          <span className="text-sm whitespace-nowrap">
            Page {currentPage} of {numPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={currentPage >= numPages}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Button variant="outline" size="sm" onClick={onZoomOut}>
              <ZoomOut size={16} />
            </Button>
            <span className="text-sm px-2">{Math.round(scale * 100)}%</span>
            <Button variant="outline" size="sm" onClick={onZoomIn}>
              <ZoomIn size={16} />
            </Button>
          </div>
          
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <input
              type="number"
              min={1}
              max={numPages}
              value={printRange.from}
              onChange={(e) => onPrintRangeChange(e, 'from')}
              className="w-12 h-7 px-1 border rounded-md"
            />
            <span>-</span>
            <input
              type="number"
              min={printRange.from}
              max={numPages}
              value={printRange.to}
              onChange={(e) => onPrintRangeChange(e, 'to')}
              className="w-12 h-7 px-1 border rounded-md"
            />
            <Button
              variant="default"
              size="sm"
              onClick={onPrint}
              disabled={isPrinting}
            >
              <Printer size={16} />
              <span className="hidden md:inline ml-1">{isPrinting ? 'Preparing...' : 'Print'}</span>
            </Button>
          </div>
          
          <Button variant="outline" size="sm" onClick={onClose} className="ml-1">
            <X size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
