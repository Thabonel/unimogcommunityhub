
import React, { useState, useEffect, useRef } from 'react';
import { PDFViewerLayout } from './PDFViewerLayout';
import * as pdfjsLib from 'pdfjs-dist';
import { usePdfSearch } from '@/hooks/use-pdf-search';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Set up the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

interface SimplePDFViewerProps {
  url: string;
  onClose: () => void;
}

export function SimplePDFViewer({ url, onClose }: SimplePDFViewerProps) {
  const [pdfDoc, setPdfDoc] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.2);
  const [isLoading, setIsLoading] = useState(true);
  const [isContinuousMode, setIsContinuousMode] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use useRef instead of state for the canvas reference to avoid re-renders
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Track current render task to cancel it if needed
  const renderTaskRef = useRef<any | null>(null);

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

  // Load PDF when component mounts or URL changes
  useEffect(() => {
    const loadPdf = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setCurrentPage(1);
      } catch (error) {
        console.error('Error loading PDF:', error);
        setError('Failed to load PDF document. Please check the URL and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadPdf();

    return () => {
      // Cleanup
      if (pdfDoc) {
        pdfDoc.destroy();
      }
      
      // Cancel any ongoing render task
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }
    };
  }, [url]);

  // Render current page
  useEffect(() => {
    const renderPage = async () => {
      if (!pdfDoc || !canvasRef.current) return;

      try {
        // Cancel any ongoing render task first
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
          renderTaskRef.current = null;
        }
        
        // Clean up any existing renders first to avoid canvas conflicts
        const context = canvasRef.current.getContext('2d');
        if (context) {
          context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
        
        const page = await pdfDoc.getPage(currentPage);
        const viewport = page.getViewport({ scale });
        
        canvasRef.current.height = viewport.height;
        canvasRef.current.width = viewport.width;
        
        const renderContext = {
          canvasContext: context,
          viewport,
        };
        
        // Store the render task so we can cancel it if needed
        renderTaskRef.current = page.render(renderContext);
        await renderTaskRef.current.promise;
        renderTaskRef.current = null;
        
        // Highlight search results if there are any
        if (searchTerm && searchResults.length > 0) {
          // Find search results for the current page
          const currentPageResults = searchResults.find(r => r.pageIndex === currentPage);
          if (currentPageResults && currentPageResults.matches.length > 0) {
            // Use the result transform information to highlight matches
            currentPageResults.matches.forEach((match, index) => {
              const isActive = index === currentSearchResultIndex;
              context.fillStyle = isActive ? 'rgba(255, 165, 0, 0.4)' : 'rgba(255, 255, 0, 0.3)';
              
              // Get position from transform array [scaleX, skewX, skewY, scaleY, x, y]
              const x = match.transform[4];
              const y = match.transform[5];
              
              // Draw a highlight rectangle (approximate dimensions)
              context.fillRect(x, viewport.height - y - 15, 100, 20);
            });
          }
        }
      } catch (error) {
        if (error?.message !== "Rendering cancelled") {
          console.error('Error rendering page:', error);
        }
      }
    };

    renderPage();
  }, [pdfDoc, currentPage, scale, searchResults, searchTerm, currentSearchResultIndex]);

  // Handle zoom
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3.0));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.6));
  };

  // Toggle view mode
  const handleToggleViewMode = () => {
    setIsContinuousMode(prev => !prev);
  };
  
  // Create compact search component
  const SearchBar = () => (
    <div className="flex items-center justify-between w-full mb-2 bg-background/90 rounded-md p-1">
      <div className="flex items-center flex-1 relative">
        <Input
          type="text"
          placeholder="Search in document"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-8 h-8 text-sm"
        />
        <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        
        {searchResultsCount > 0 && (
          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
            {currentSearchResultIndex + 1}/{searchResultsCount}
          </span>
        )}
      </div>
      
      <div className="flex items-center space-x-1 ml-2">
        <Button 
          variant="outline" 
          size="sm"
          className="h-8 px-2"
          onClick={navigateToPrevResult} 
          disabled={searchResultsCount === 0}
        >
          <span className="sr-only">Previous result</span>
          ↑
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="h-8 px-2"
          onClick={navigateToNextResult} 
          disabled={searchResultsCount === 0}
        >
          <span className="sr-only">Next result</span>
          ↓
        </Button>
      </div>
    </div>
  );

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
      searchComponent={<SearchBar />}
    >
      <div className="flex justify-center p-4">
        <canvas 
          ref={canvasRef}
          className="shadow-lg"
        />
      </div>
    </PDFViewerLayout>
  );
}
