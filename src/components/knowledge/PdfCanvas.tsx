
import { useEffect, useRef, useState } from 'react';

interface SearchResult {
  pageIndex: number;
  matches: Array<{ transform: number[] }>;
}

interface PdfCanvasProps {
  pdfDoc: any | null;
  currentPage: number;
  scale: number;
  isLoading: boolean;
  searchTerm?: string;
  searchResults?: SearchResult[];
  currentSearchResultIndex?: number;
  scrollPosition: number;
  onScroll: (newPosition: number) => void;
}

export function PdfCanvas({ 
  pdfDoc, 
  currentPage, 
  scale, 
  isLoading,
  searchTerm = '',
  searchResults = [],
  currentSearchResultIndex = 0,
  scrollPosition,
  onScroll
}: PdfCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasHeight, setCanvasHeight] = useState(0);
  
  // Apply scroll position when it changes externally
  useEffect(() => {
    if (containerRef.current && canvasHeight > 0) {
      const containerHeight = containerRef.current.clientHeight;
      const maxScroll = Math.max(0, canvasHeight - containerHeight);
      const scrollValue = scrollPosition * maxScroll;
      containerRef.current.scrollTop = scrollValue;
    }
  }, [scrollPosition, canvasHeight]);
  
  // Update scroll position when user scrolls manually
  const handleScroll = () => {
    if (containerRef.current && canvasHeight > 0) {
      const containerHeight = containerRef.current.clientHeight;
      const maxScroll = Math.max(0, canvasHeight - containerHeight);
      if (maxScroll > 0) {
        const newScrollPosition = containerRef.current.scrollTop / maxScroll;
        onScroll(newScrollPosition);
      }
    }
  };

  useEffect(() => {
    const renderPage = async () => {
      if (!pdfDoc || !canvasRef.current) return;

      try {
        const page = await pdfDoc.getPage(currentPage);
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;
        setCanvasHeight(viewport.height);

        const renderContext = {
          canvasContext: context,
          viewport,
        };

        await page.render(renderContext).promise;

        // Highlight search results if we have them for this page
        if (searchTerm && searchResults.length > 0) {
          let globalResultCount = 0;
          
          // Process all search results for this page
          for (const result of searchResults) {
            for (const match of result.matches) {
              // Get coordinates for the text from transform array [scaleX, skewX, skewY, scaleY, x, y]
              const x = match.transform[4];
              const y = match.transform[5];
              
              // Determine if this is the currently selected search result
              const isCurrentResult = globalResultCount === currentSearchResultIndex;
              
              // Draw highlight rectangle
              context.fillStyle = isCurrentResult ? 'rgba(255, 165, 0, 0.5)' : 'rgba(255, 255, 0, 0.3)';
              
              // Improved rectangle size calculation
              const rectWidth = Math.max(100, 20 * scale); // Base width scaled by zoom level
              const rectHeight = 20 * scale; // Height scaled by zoom level
              
              // Draw the highlight rectangle (adjusted for PDF coordinate system)
              context.fillRect(x, viewport.height - y - rectHeight, rectWidth, rectHeight);
              
              globalResultCount++;
            }
          }
        }
      } catch (error) {
        console.error('Error rendering PDF page:', error);
      }
    };

    renderPage();
  }, [pdfDoc, currentPage, scale, searchTerm, searchResults, currentSearchResultIndex]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full overflow-auto"
      onClick={(e) => e.stopPropagation()}
      onScroll={handleScroll}
    >
      <div className="py-8 flex justify-center">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Loading PDF...</p>
          </div>
        ) : (
          <canvas ref={canvasRef} className="shadow-lg" />
        )}
      </div>
    </div>
  );
}
