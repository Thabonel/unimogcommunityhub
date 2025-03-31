
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { X, ArrowUp, ArrowDown, ZoomIn, ZoomOut, Printer, Maximize, Minimize } from 'lucide-react';

interface PDFViewerLayoutProps {
  children: React.ReactNode;
  isLoading?: boolean;
  error?: string | null;
  controls: {
    currentPage: number;
    numPages: number;
    scale: number;
    isContinuousMode: boolean;
    isPrinting?: boolean;
    printRange?: { from: number; to: number };
  };
  actions: {
    onPageChange: (page: number) => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onClose: () => void;
    onPrint?: () => void;
    onToggleViewMode?: () => void;
    onPrintRangeChange?: (e: React.ChangeEvent<HTMLInputElement>, type: 'from' | 'to') => void;
  };
}

export function PDFViewerLayout({
  children,
  isLoading = false,
  error = null,
  controls,
  actions
}: PDFViewerLayoutProps) {
  const { currentPage, numPages, scale, isContinuousMode, isPrinting, printRange } = controls;
  const { onPageChange, onZoomIn, onZoomOut, onClose, onPrint, onToggleViewMode, onPrintRangeChange } = actions;

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
    <div 
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" 
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-viewer-title"
    >
      <div 
        className="bg-background rounded-lg shadow-lg max-w-5xl w-full max-h-[90vh] flex flex-col"
      >
        {/* Main content area with scrolling */}
        <ScrollArea className="flex-1 bg-gray-100 overflow-auto pdf-container">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <p className="text-muted-foreground mt-4" aria-live="polite">Loading PDF document...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-12 text-destructive">
              <p className="font-medium">Error:</p>
              <p>{error}</p>
            </div>
          ) : (
            <div className="pdf-content-container">
              {children}
            </div>
          )}
        </ScrollArea>
        
        {/* Sticky footer with controls that always stays visible */}
        <div className="sticky bottom-0 z-10">
          <div 
            className="flex flex-wrap items-center justify-between gap-2 p-3 border-t bg-background"
            role="toolbar"
            aria-label="PDF viewer controls"
          >
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

              <div className="border-l h-6 mx-2 hidden md:block"></div>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={onZoomOut} 
                disabled={scale <= 0.6}
                className="flex items-center"
                aria-label="Zoom out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              
              <div className="text-sm font-medium">
                {Math.round(scale * 100)}%
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onZoomIn} 
                disabled={scale >= 3.0}
                className="flex items-center"
                aria-label="Zoom in"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              
              {onToggleViewMode && (
                <>
                  <div className="border-l h-6 mx-2 hidden md:block"></div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onToggleViewMode}
                    className="flex items-center"
                    aria-label={isContinuousMode ? "Switch to single page view" : "Switch to continuous view"}
                  >
                    {isContinuousMode ? (
                      <Minimize className="h-4 w-4" />
                    ) : (
                      <Maximize className="h-4 w-4" />
                    )}
                    <span className="sr-only md:not-sr-only md:ml-2">
                      {isContinuousMode ? "Single Page" : "Continuous"}
                    </span>
                  </Button>
                </>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {onPrint && printRange && onPrintRangeChange && (
                <div className="flex items-center space-x-1 print-options">
                  <span className="text-sm hidden md:inline-block">Print pages:</span>
                  <input
                    type="number"
                    value={printRange.from}
                    onChange={(e) => onPrintRangeChange(e, 'from')}
                    min="1"
                    max={numPages}
                    className="w-12 p-1 text-sm border rounded"
                    disabled={isPrinting}
                    aria-label="Print from page"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    value={printRange.to}
                    onChange={(e) => onPrintRangeChange(e, 'to')}
                    min="1"
                    max={numPages}
                    className="w-12 p-1 text-sm border rounded"
                    disabled={isPrinting}
                    aria-label="Print to page"
                  />
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={onPrint}
                    disabled={isPrinting || !numPages}
                    className="flex items-center"
                    aria-label="Print document"
                  >
                    <Printer className="h-4 w-4" />
                    <span className="sr-only md:not-sr-only md:ml-2">Print</span>
                  </Button>
                </div>
              )}

              <Button 
                variant="outline" 
                size="sm" 
                onClick={onClose}
                className="flex items-center"
                aria-label="Close document"
              >
                <X className="h-4 w-4" />
                <span className="sr-only md:not-sr-only md:ml-2">Close</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
