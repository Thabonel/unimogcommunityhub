
import React, { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

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
  const textLayerRef = useRef<HTMLDivElement | null>(null);
  const renderTaskRef = useRef<any | null>(null);

  useEffect(() => {
    let isMounted = true;
    let localRenderTask = null;
    
    const renderPage = async () => {
      if (!pdfDoc || !canvasRef.current || !isMounted) return;

      try {
        // Cancel any ongoing render task first
        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch (e) {
            // Ignore cancellation errors
          }
          renderTaskRef.current = null;
        }
        
        // Wait a bit for any pending operations to complete
        await new Promise(resolve => setTimeout(resolve, 50));
        
        if (!isMounted || !canvasRef.current) return;
        
        // Get fresh context each time
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;
        
        // Clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        console.log(`Rendering page ${currentPage}...`);
        console.log('📄 PDF document object:', pdfDoc);
        console.log('📄 PDF info - numPages:', pdfDoc.numPages);

        const page = await pdfDoc.getPage(currentPage);
        console.log('📄 Page object:', page);
        console.log('📄 Page dimensions:', page.getViewport({ scale: 1.0 }));

        const viewport = page.getViewport({ scale });
        
        // Set canvas dimensions
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const renderContext = {
          canvasContext: context,
          viewport,
        };
        
        // Store the render task so we can cancel it if needed
        localRenderTask = page.render(renderContext);
        renderTaskRef.current = localRenderTask;
        
        await localRenderTask.promise;
        
        if (isMounted) {
          renderTaskRef.current = null;
          console.log(`Successfully rendered page ${currentPage}`);
        }

        // Render text layer for text selection using modern TextLayer API
        if (isMounted && textLayerRef.current) {
          try {
            console.log('🔍 Starting modern text layer rendering...');
            console.log('🔧 Debugging getTextContent call...');

            // Try different getTextContent options
            const textContentOptions = {
              includeMarkedContent: true,
              disableNormalization: false
            };

            console.log('📋 getTextContent options:', textContentOptions);
            const textContent = await page.getTextContent(textContentOptions);
            const textLayerDiv = textLayerRef.current;

            // Clear previous text layer content
            textLayerDiv.innerHTML = '';
            textLayerDiv.style.width = `${viewport.width}px`;
            textLayerDiv.style.height = `${viewport.height}px`;

            console.log('📝 Text content extracted, items:', textContent.items.length);
            console.log('🔍 Text content object:', textContent);
            console.log('🔍 First few items:', textContent.items.slice(0, 3));

            // Use modern TextLayer class API (more stable than renderTextLayer)
            const textLayer = new pdfjsLib.TextLayer({
              textContentSource: textContent,
              container: textLayerDiv,
              viewport: viewport
            });

            await textLayer.render();
            console.log('✅ Modern TextLayer rendered successfully');
          } catch (textError) {
            console.warn('❌ Modern TextLayer failed, trying legacy API:', textError);
            // Fallback to legacy renderTextLayer if modern API fails
            try {
              const textContent = await page.getTextContent();
              const textLayerDiv = textLayerRef.current;

              textLayerDiv.innerHTML = '';
              textLayerDiv.style.width = `${viewport.width}px`;
              textLayerDiv.style.height = `${viewport.height}px`;

              await pdfjsLib.renderTextLayer({
                textContent: textContent,
                container: textLayerDiv,
                viewport: viewport,
                textDivs: []
              });

              console.log('📄 Legacy renderTextLayer fallback succeeded');
            } catch (fallbackError) {
              console.warn('❌ All text layer methods failed:', fallbackError);
              // Final fallback to manual text positioning
              try {
                const textContent = await page.getTextContent();
                const textLayerDiv = textLayerRef.current;

                textContent.items.forEach((textItem: any) => {
                  if (textItem.str.trim()) {
                    const textSpan = document.createElement('span');
                    textSpan.textContent = textItem.str;
                    textSpan.style.position = 'absolute';
                    textSpan.style.left = `${textItem.transform[4]}px`;
                    textSpan.style.top = `${viewport.height - textItem.transform[5]}px`;
                    textSpan.style.fontSize = `${textItem.transform[0]}px`;
                    textSpan.style.fontFamily = textItem.fontName || 'sans-serif';
                    textSpan.style.color = 'transparent';
                    textSpan.style.userSelect = 'text';
                    textSpan.style.whiteSpace = 'pre';
                    textLayerDiv.appendChild(textSpan);
                  }
                });
                console.log('🛠️ Manual text positioning fallback created');
              } catch (manualError) {
                console.warn('❌ Manual text layer also failed:', manualError);
              }
            }
          }
        }

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
    <div className="relative inline-block">
      <canvas ref={canvasRef} className="shadow-lg" />
      <div
        ref={textLayerRef}
        className="textLayer absolute top-0 left-0"
        style={{
          userSelect: 'text',
          overflow: 'hidden',
          opacity: 1,
          lineHeight: 1.0,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
