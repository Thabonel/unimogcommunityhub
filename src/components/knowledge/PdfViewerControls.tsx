
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X, Printer, Search, ArrowUp, ArrowDown, Download, ChevronUp, ChevronDown } from 'lucide-react';
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
  onDownload: () => void;
  onSearch: (searchTerm: string) => void;
  onNextResult: () => void;
  onPrevResult: () => void;
  searchTerm: string;
  searchResultsCount: number;
  currentSearchResultIndex: number;
  onPrintRangeChange: (e: React.ChangeEvent<HTMLInputElement>, type: 'from' | 'to') => void;
  onScrollUp: () => void;
  onScrollDown: () => void;
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
  onDownload,
  onSearch,
  onNextResult,
  onPrevResult,
  searchTerm,
  searchResultsCount,
  currentSearchResultIndex,
  onPrintRangeChange,
  onScrollUp,
  onScrollDown
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
    <div className="p-3 flex flex-wrap items-center justify-between gap-2" onClick={handleControlClick}>
      {/* Search bar */}
      <form onSubmit={handleSearchSubmit} className="w-full mb-2 flex items-center gap-2">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Search in document"
            value={localSearchTerm}
            onChange={handleSearchChange}
            className="w-full"
            startIcon={<Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />}
          />
          {searchResultsCount > 0 && (
            <span className="absolute right-10 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              {currentSearchResultIndex + 1}/{searchResultsCount}
            </span>
          )}
        </div>
        <Button
          type="submit"
          variant="outline"
          size="sm"
        >
          <span className="sr-only md:not-sr-only md:mr-1">Search</span>
          <Search size={16} className="md:hidden" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onPrevResult}
          disabled={searchResultsCount === 0}
        >
          <ArrowUp size={16} />
          <span className="sr-only">Previous result</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onNextResult}
          disabled={searchResultsCount === 0}
        >
          <ArrowDown size={16} />
          <span className="sr-only">Next result</span>
        </Button>
      </form>

      <div className="flex flex-wrap justify-between w-full items-center gap-2">
        {/* Navigation controls */}
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
        
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center">
            <Button variant="outline" size="sm" onClick={onZoomOut}>
              <ZoomOut size={16} />
              <span className="sr-only">Zoom out</span>
            </Button>
            <span className="text-sm px-2">{Math.round(scale * 100)}%</span>
            <Button variant="outline" size="sm" onClick={onZoomIn}>
              <ZoomIn size={16} />
              <span className="sr-only">Zoom in</span>
            </Button>
          </div>
          
          {/* Divider */}
          <div className="hidden md:block border-l h-6 mx-2" aria-hidden="true"></div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
            >
              <Download size={16} />
              <span className="sr-only md:not-sr-only md:ml-1">Download</span>
            </Button>
            
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <input
                type="number"
                min={1}
                max={numPages}
                value={printRange.from}
                onChange={(e) => onPrintRangeChange(e, 'from')}
                className="w-12 h-7 px-1 border rounded-md"
                aria-label="Print from page"
              />
              <span>-</span>
              <input
                type="number"
                min={printRange.from}
                max={numPages}
                value={printRange.to}
                onChange={(e) => onPrintRangeChange(e, 'to')}
                className="w-12 h-7 px-1 border rounded-md"
                aria-label="Print to page"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={onPrint}
                disabled={isPrinting}
              >
                <Printer size={16} />
                <span className="sr-only md:not-sr-only md:ml-1">{isPrinting ? 'Preparing...' : 'Print'}</span>
              </Button>
            </div>
            
            <Button variant="outline" size="sm" onClick={onClose} className="ml-1">
              <X size={16} />
              <span className="sr-only md:not-sr-only md:ml-1">Close</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
