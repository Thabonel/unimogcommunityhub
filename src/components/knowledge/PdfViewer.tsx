
import { useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PdfViewerControls } from './PdfViewerControls';
import { PdfCanvas } from './PdfCanvas';
import { PdfViewerHeader } from './PdfViewerHeader';
import { usePdfDocument } from '@/hooks/use-pdf-document';
import { usePdfSearch } from '@/hooks/use-pdf-search';
import { usePdfNavigation } from '@/hooks/use-pdf-navigation';

// Set up the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

interface PdfViewerProps {
  url: string;
  onClose: () => void;
}

export function PdfViewer({ url, onClose }: PdfViewerProps) {
  // Use our custom hooks to manage PDF state and behavior
  const {
    pdfDoc,
    numPages,
    isLoading,
    documentTitle,
    printRange,
    setPrintRange
  } = usePdfDocument({ url });

  const {
    currentPage,
    setCurrentPage,
    scale,
    isPrinting,
    scrollPosition,
    setScrollPosition,
    handleZoomIn,
    handleZoomOut,
    handleScrollUp,
    handleScrollDown,
    handlePrintRangeChange,
    handlePrint,
    handleDownload,
  } = usePdfNavigation({ pdfDoc, printRange, numPages });

  const {
    searchTerm,
    searchResults,
    currentSearchResultIndex,
    searchResultsCount,
    handleSearch,
    navigateToNextResult,
    navigateToPrevResult,
  } = usePdfSearch({ pdfDoc, numPages, currentPage, setCurrentPage });

  // Prevent background scrolling when PDF viewer is open
  useEffect(() => {
    // Store the original overflow style
    const originalStyle = document.body.style.overflow;
    // Prevent scrolling on the body
    document.body.style.overflow = 'hidden';
    
    return () => {
      // Restore original overflow style when component unmounts
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const handlePrintRangeChangeWrapper = (e: React.ChangeEvent<HTMLInputElement>, type: 'from' | 'to') => {
    setPrintRange(handlePrintRangeChange(e, type));
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" 
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-viewer-title"
    >
      <div className="bg-background rounded-lg shadow-lg max-w-5xl max-h-[90vh] w-full flex flex-col">
        {/* Header with document title */}
        <PdfViewerHeader documentTitle={documentTitle} />

        {/* PDF Content */}
        <div className="flex-1 bg-gray-100 overflow-hidden">
          <PdfCanvas 
            pdfDoc={pdfDoc}
            currentPage={currentPage}
            scale={scale}
            isLoading={isLoading}
            searchTerm={searchTerm}
            searchResults={searchResults.filter(r => r.pageIndex === currentPage)}
            currentSearchResultIndex={currentSearchResultIndex}
            scrollPosition={scrollPosition}
            onScroll={setScrollPosition}
          />
        </div>
        
        {/* Footer Controls */}
        <div className="border-t bg-muted">
          <PdfViewerControls 
            currentPage={currentPage}
            numPages={numPages}
            scale={scale}
            isPrinting={isPrinting}
            printRange={printRange}
            searchTerm={searchTerm}
            searchResultsCount={searchResultsCount}
            currentSearchResultIndex={currentSearchResultIndex}
            onPageChange={setCurrentPage}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onClose={onClose}
            onPrint={handlePrint}
            onDownload={() => handleDownload(url)}
            onSearch={handleSearch}
            onNextResult={navigateToNextResult}
            onPrevResult={navigateToPrevResult}
            onPrintRangeChange={handlePrintRangeChangeWrapper}
            onScrollUp={handleScrollUp}
            onScrollDown={handleScrollDown}
          />
        </div>
      </div>
    </div>
  );
}
