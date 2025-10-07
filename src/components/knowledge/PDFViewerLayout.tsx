
import React from 'react';
import { PdfViewerContent } from './pdf-viewer/layout/PdfViewerContent';
import { PdfViewerFooter } from './pdf-viewer/layout/PdfViewerFooter';
import { X, Printer, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PDFViewerLayoutProps {
  children: React.ReactNode;
  isLoading?: boolean;
  error?: string | null;
  searchComponent?: React.ReactNode;
  embedded?: boolean; // NEW: If true, renders inline without modal overlay
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
    onToggleViewMode?: () => void;
    onPrint?: () => void;
    onDownload?: () => void;
    onPrintRangeChange?: (e: React.ChangeEvent<HTMLInputElement>, type: 'from' | 'to') => void;
  };
}

export function PDFViewerLayout({
  children,
  isLoading = false,
  error = null,
  searchComponent,
  embedded = false, // Default to modal mode for backwards compatibility
  controls,
  actions
}: PDFViewerLayoutProps) {
  // Handle click events within the layout to prevent propagation
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Embedded mode: Render inline without modal overlay
  if (embedded) {
    return (
      <div className="h-full flex flex-col bg-background">
        {/* Header with search and action buttons */}
        <div className="border-b flex items-center justify-between p-1 flex-shrink-0">
          {/* Search bar appears at the left if provided */}
          <div className="flex-1">
            {searchComponent}
          </div>

          {/* Action buttons on the right - icon only */}
          <div className="flex items-center gap-1">
            {actions.onPrint && (
              <Button
                variant="outline"
                size="sm"
                onClick={actions.onPrint}
                className="h-7 px-2"
                aria-label="Print document"
              >
                <Printer className="h-3 w-3" />
              </Button>
            )}

            {actions.onDownload && (
              <Button
                variant="outline"
                size="sm"
                onClick={actions.onDownload}
                className="h-7 px-2"
                aria-label="Download document"
              >
                <Download className="h-3 w-3" />
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={actions.onClose}
              className="h-7 px-2"
              aria-label="Close document"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Main content area with scrolling */}
        <div className="flex-1 min-h-0" style={{ height: 0 }}>
          <PdfViewerContent isLoading={isLoading} error={error}>
            {children}
          </PdfViewerContent>
        </div>

        {/* Sticky footer with controls */}
        <div className="flex-shrink-0">
          <PdfViewerFooter controls={controls} actions={actions} />
        </div>
      </div>
    );
  }

  // Modal mode: Original behavior with overlay
  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-viewer-title"
      onClick={handleContentClick}
    >
      <div
        className="bg-background rounded-lg shadow-lg max-w-5xl w-full max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with search and action buttons */}
        <div className="border-b flex items-center justify-between p-3">
          {/* Search bar appears at the left if provided */}
          <div className="flex-1">
            {searchComponent}
          </div>
          
          {/* Action buttons on the right */}
          <div className="flex items-center gap-2">
            {actions.onPrint && (
              <Button
                variant="outline"
                size="sm"
                onClick={actions.onPrint}
                className="flex items-center"
                aria-label="Print document"
              >
                <Printer className="h-4 w-4" />
                <span className="sr-only md:not-sr-only md:ml-2">Print</span>
              </Button>
            )}
            
            {actions.onDownload && (
              <Button
                variant="outline"
                size="sm"
                onClick={actions.onDownload}
                className="flex items-center"
                aria-label="Download document"
              >
                <Download className="h-4 w-4" />
                <span className="sr-only md:not-sr-only md:ml-2">Download</span>
              </Button>
            )}
            
            <Button
              variant="outline" 
              size="sm"
              onClick={actions.onClose}
              className="flex items-center"
              aria-label="Close document"
            >
              <X className="h-4 w-4" />
              <span className="sr-only md:not-sr-only md:ml-2">Close</span>
            </Button>
          </div>
        </div>
        
        {/* Main content area with scrolling */}
        <PdfViewerContent isLoading={isLoading} error={error}>
          {children}
        </PdfViewerContent>
        
        {/* Sticky footer with controls that always stays visible */}
        <div className="sticky bottom-0 z-10">
          <PdfViewerFooter controls={controls} actions={actions} />
        </div>
      </div>
    </div>
  );
}
