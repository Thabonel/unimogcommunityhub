
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
  controls,
  actions
}: PDFViewerLayoutProps) {
  // Handle click events within the layout to prevent propagation
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
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
