
import { useEffect, useRef } from 'react';

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
}

export function PdfCanvas({ 
  pdfDoc, 
  currentPage, 
  scale, 
  isLoading,
  searchTerm = '',
  searchResults = [],
  currentSearchResultIndex = 0
}: PdfCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

        const renderContext = {
          canvasContext: context,
          viewport,
        };

        await page.render(renderContext).promise;

        // Highlight search results if we have them for this page
        if (searchTerm && searchResults.length > 0) {
          let currentResultCount = 0;
          let globalResultCount = 0;
          
          // Count results on previous pages to determine global index
          for (const result of searchResults) {
            for (let i = 0; i < result.matches.length; i++) {
              const match = result.matches[i];
              
              // Get coordinates for the text from transform array [scaleX, skewX, skewY, scaleY, x, y]
              const x = match.transform[4];
              const y = match.transform[5];
              
              // Determine if this is the currently selected search result
              const isCurrentResult = globalResultCount === currentSearchResultIndex;
              
              // Draw highlight rectangle
              context.fillStyle = isCurrentResult ? 'rgba(255, 165, 0, 0.5)' : 'rgba(255, 255, 0, 0.3)';
              context.fillRect(x, viewport.height - y - 20, 100, 20); // Approximate rectangle size
              
              currentResultCount++;
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
      className="w-full h-full overflow-auto flex items-center justify-center p-8 pt-96"
      onClick={(e) => e.stopPropagation()}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading PDF...</p>
        </div>
      ) : (
        <canvas ref={canvasRef} className="shadow-lg mt-48" />
      )}
    </div>
  );
}
