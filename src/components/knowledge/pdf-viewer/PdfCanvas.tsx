
import React, { useEffect, useRef } from 'react';

interface PdfCanvasProps {
  pdfDoc: any;
  currentPage: number;
  scale: number;
  searchTerm: string;
  searchResults: Array<any>;
  currentSearchResultIndex: number;
}

export const PdfCanvas: React.FC<PdfCanvasProps> = ({
  pdfDoc,
  currentPage,
  scale,
  searchTerm,
  searchResults,
  currentSearchResultIndex
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTaskRef = useRef<any | null>(null);

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
    
    return () => {
      // Clean up render task on unmount or when dependencies change
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }
    };
  }, [pdfDoc, currentPage, scale, searchResults, searchTerm, currentSearchResultIndex]);

  return (
    <canvas ref={canvasRef} className="shadow-lg" />
  );
};
