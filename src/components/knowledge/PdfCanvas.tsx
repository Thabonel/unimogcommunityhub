
import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

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
  const textLayerRef = useRef<HTMLDivElement>(null);
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
      if (!pdfDoc || !canvasRef.current) {
        return;
      }

      try {
        const page = await pdfDoc.getPage(currentPage);
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;
        setCanvasHeight(viewport.height);

        // Clear previous text layer content
        const textLayerDiv = textLayerRef.current;
        textLayerDiv.innerHTML = '';
        textLayerDiv.style.width = `${viewport.width}px`;
        textLayerDiv.style.height = `${viewport.height}px`;

        // Render the page canvas (graphics layer)
        const renderContext = {
          canvasContext: context,
          viewport,
        };

        const renderTask = page.render(renderContext);
        await renderTask.promise;

        // Debug logging to identify why text layer isn't working
        console.log('🎯 Starting text layer rendering...');
        console.log('📊 Debug info:', {
          textLayerRef: !!textLayerRef.current,
          textLayerDiv: textLayerRef.current,
          viewport: { width: viewport.width, height: viewport.height }
        });

        // Render text layer using modern PDF.js API with fallbacks
        if (textLayerRef.current) {
          try {
            console.log('🔍 Getting text content...');
            const textContent = await page.getTextContent();
            const textLayerDiv = textLayerRef.current;

            console.log('📝 Text content extracted:', {
              itemCount: textContent.items.length,
              firstItems: textContent.items.slice(0, 3).map(item => ({ str: item.str, transform: item.transform }))
            });

            if (textContent.items.length > 0) {
              // Show text layer only when there's text content
              textLayerDiv.style.display = 'block';
              textLayerDiv.style.pointerEvents = 'auto';

              // Clear and setup text layer container
              textLayerDiv.innerHTML = '';
              textLayerDiv.style.width = `${viewport.width}px`;
              textLayerDiv.style.height = `${viewport.height}px`;

              // Try modern TextLayer API first
              try {
                console.log('🆕 Attempting modern TextLayer API...');
                const textLayer = new pdfjsLib.TextLayer({
                  textContentSource: textContent,
                  container: textLayerDiv,
                  viewport: viewport
                });
                await textLayer.render();
                console.log('✅ Modern TextLayer API succeeded');
              } catch (modernError) {
                console.warn('❌ Modern TextLayer API failed:', modernError);

                // Fallback to legacy renderTextLayer
                try {
                  console.log('🔄 Trying legacy renderTextLayer...');
                  await pdfjsLib.renderTextLayer({
                    textContent: textContent,
                    container: textLayerDiv,
                    viewport: viewport,
                    textDivs: []
                  });
                  console.log('✅ Legacy renderTextLayer succeeded');
                } catch (legacyError) {
                  console.warn('❌ Legacy renderTextLayer failed:', legacyError);

                  // Final fallback - manual text positioning with transparent text
                  console.log('🛠️ Using manual text positioning fallback...');
                  textContent.items.forEach((textItem: any) => {
                    if (textItem.str.trim()) {
                      const textSpan = document.createElement('span');
                      textSpan.textContent = textItem.str;
                      textSpan.style.position = 'absolute';
                      textSpan.style.left = `${textItem.transform[4]}px`;
                      textSpan.style.top = `${viewport.height - textItem.transform[5]}px`;
                      textSpan.style.fontSize = `${textItem.transform[0]}px`;
                      textSpan.style.fontFamily = textItem.fontName || 'sans-serif';
                      textSpan.style.color = 'transparent'; // Transparent for selection
                      textSpan.style.userSelect = 'text';
                      textSpan.style.pointerEvents = 'auto';
                      textSpan.style.whiteSpace = 'pre';
                      textLayerDiv.appendChild(textSpan);
                    }
                  });
                  console.log('🛠️ Manual text positioning completed');
                }
              }
            } else {
              console.warn('⚠️ No text content found in PDF page');
              // Hide text layer when there's no text content
              textLayerDiv.style.display = 'none';
              textLayerDiv.style.pointerEvents = 'none';
            }
          } catch (textError) {
            console.error('❌ Text layer rendering completely failed:', textError);
          }
        } else {
          console.error('❌ textLayerRef.current is null - cannot render text layer');
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
          <div className="relative inline-block">
            <canvas ref={canvasRef} className="shadow-lg" />
            {/* Text layer positioned over the canvas - hidden when no text content */}
            <div
              ref={textLayerRef}
              className="textLayer"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                pointerEvents: 'none', // Changed to 'none' to not block canvas when empty
                userSelect: 'text',
                display: 'none', // Hidden by default, will be shown only if text exists
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
