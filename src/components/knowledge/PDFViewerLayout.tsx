
import React from 'react';
import { PdfViewerContent } from './pdf-viewer/layout/PdfViewerContent';
import { PdfViewerFooter } from './pdf-viewer/layout/PdfViewerFooter';

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
        {/* Search bar appears at the top if provided */}
        {searchComponent && (
          <div className="px-3 pt-3">
            {searchComponent}
          </div>
        )}
        
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
