
import { useEffect, useRef } from 'react';

interface PdfCanvasProps {
  pdfDoc: any | null;
  currentPage: number;
  scale: number;
  isLoading: boolean;
}

export function PdfCanvas({ pdfDoc, currentPage, scale, isLoading }: PdfCanvasProps) {
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
      } catch (error) {
        console.error('Error rendering PDF page:', error);
      }
    };

    renderPage();
  }, [pdfDoc, currentPage, scale]);

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
