
import React from 'react';
import { PDFViewerLayout } from './PDFViewerLayout';
import * as pdfjsLib from 'pdfjs-dist';
import { usePdfSearch } from '@/hooks/use-pdf-search';
import { PdfCanvas } from './pdf-viewer/PdfCanvas';
import { PdfSearchBar } from './pdf-viewer/PdfSearchBar';
import { usePdfViewerState } from './pdf-viewer/usePdfViewerState';
import { usePdfLoader } from './pdf-viewer/usePdfLoader';

// Set up the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

interface SimplePDFViewerProps {
  url: string;
  onClose: () => void;
}

export function SimplePDFViewer({ url, onClose }: SimplePDFViewerProps) {
  // Use our custom hooks for state management and PDF loading
  const {
    currentPage,
    setCurrentPage,
    numPages,
    setNumPages,
    scale,
    isLoading,
    setIsLoading,
    isContinuousMode,
    error,
    setError,
    pdfDoc,
    setPdfDoc,
    handleZoomIn,
    handleZoomOut,
    handleToggleViewMode
  } = usePdfViewerState();

  // Load PDF when component mounts or URL changes
  usePdfLoader({
    url,
    setPdfDoc,
    setNumPages,
    setCurrentPage,
    setIsLoading,
    setError
  });

  // Set up search functionality
  const { 
    searchTerm, 
    searchResults,
    currentSearchResultIndex,
    searchResultsCount,
    handleSearch,
    navigateToNextResult,
    navigateToPrevResult
  } = usePdfSearch({ 
    pdfDoc, 
    numPages, 
    currentPage, 
    setCurrentPage 
  });

  return (
    <PDFViewerLayout
      isLoading={isLoading}
      error={error}
      controls={{
        currentPage,
        numPages,
        scale,
        isContinuousMode
      }}
      actions={{
        onPageChange: setCurrentPage,
        onZoomIn: handleZoomIn,
        onZoomOut: handleZoomOut,
        onClose,
        onToggleViewMode: handleToggleViewMode
      }}
      searchComponent={
        <PdfSearchBar
          searchTerm={searchTerm}
          searchResultsCount={searchResultsCount}
          currentSearchResultIndex={currentSearchResultIndex}
          onSearchChange={handleSearch}
          onNextResult={navigateToNextResult}
          onPrevResult={navigateToPrevResult}
        />
      }
    >
      <div className="flex justify-center p-4">
        {pdfDoc && (
          <PdfCanvas
            pdfDoc={pdfDoc}
            currentPage={currentPage}
            scale={scale}
            searchTerm={searchTerm}
            searchResults={searchResults}
            currentSearchResultIndex={currentSearchResultIndex}
          />
        )}
      </div>
    </PDFViewerLayout>
  );
}
