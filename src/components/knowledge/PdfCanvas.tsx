import { useEffect, useRef, useState } from 'react';
import { PdfTextLayer } from './PdfTextLayer';

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
  const renderTaskRef = useRef<any>(null);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [viewport, setViewport] = useState<any>(null);

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

      // Cancel any previous render task
      if (renderTaskRef.current) {
        console.log('🚫 Cancelling previous render task');
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }

      console.log('🎯 PDF Canvas: Starting page render', {
        currentPage,
        scale,
        pdfDoc: !!pdfDoc,
        canvas: !!canvasRef.current
      });

      try {
        const page = await pdfDoc.getPage(currentPage);
        const pageViewport = page.getViewport({ scale });
        setViewport(pageViewport); // Store viewport for text layer
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) {
          console.error('❌ Failed to get 2D context from canvas');
          return;
        }

        // Clear the canvas before rendering
        context.clearRect(0, 0, canvas.width, canvas.height);

        canvas.height = pageViewport.height;
        canvas.width = pageViewport.width;
        setCanvasHeight(pageViewport.height);

        console.log('📏 Canvas dimensions set:', {
          width: pageViewport.width,
          height: pageViewport.height,
          scale
        });

        const renderContext = {
          canvasContext: context,
          viewport: pageViewport,
        };

        // Store the render task so we can cancel it if needed
        renderTaskRef.current = page.render(renderContext);
        await renderTaskRef.current.promise;
        renderTaskRef.current = null;
        console.log('✅ PDF page rendered successfully');

        // Test if we can extract any text content for debugging
        try {
          const textContent = await page.getTextContent();
          console.log('📝 Text content check:', {
            itemCount: textContent.items.length,
            firstFewItems: textContent.items.slice(0, 3).map(item => ({
              str: item.str,
              hasTransform: !!item.transform
            }))
          });
        } catch (textError) {
          console.warn('⚠️ Could not extract text content:', textError);
        }

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
              context.fillRect(x, pageViewport.height - y - rectHeight, rectWidth, rectHeight);

              globalResultCount++;
            }
          }
        }
      } catch (error) {
        console.error('Error rendering PDF page:', error);
      }
    };

    renderPage();

    // Cleanup function to cancel render task on component unmount or dependency change
    return () => {
      if (renderTaskRef.current) {
        console.log('🧹 Cleanup: Cancelling render task');
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }
    };
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
          <div className="relative">
            <canvas ref={canvasRef} className="shadow-lg" />
            {/* Text layer overlay */}
            <PdfTextLayer
              pdfDoc={pdfDoc}
              currentPage={currentPage}
              scale={scale}
              viewport={viewport}
            />
          </div>
        )}
      </div>
    </div>
  );
}