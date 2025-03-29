
import { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, X, Printer } from 'lucide-react';

// Set up the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

interface PdfViewerProps {
  url: string;
  onClose: () => void;
}

export function PdfViewer({ url, onClose }: PdfViewerProps) {
  const [pdfDoc, setPdfDoc] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.2);
  const [isLoading, setIsLoading] = useState(true);
  const [printRange, setPrintRange] = useState({ from: 1, to: 1 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        setIsLoading(true);
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setCurrentPage(1);
        setPrintRange({ from: 1, to: pdf.numPages });
      } catch (error) {
        console.error('Error loading PDF:', error);
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
    };
  }, [url]);

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

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3.0));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.6));
  };

  const handlePrintRangeChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'from' | 'to') => {
    const value = parseInt(e.target.value) || 1;
    if (type === 'from') {
      setPrintRange({ ...printRange, from: Math.max(1, Math.min(value, printRange.to)) });
    } else {
      setPrintRange({ ...printRange, to: Math.min(numPages, Math.max(value, printRange.from)) });
    }
  };

  const handlePrint = async () => {
    if (!pdfDoc) return;

    try {
      // Create a new PDF document for printing selected pages
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        console.error('Could not open print window');
        return;
      }

      printWindow.document.write('<html><body style="margin: 0; padding: 0;">');
      printWindow.document.write('<div id="print-container"></div>');
      printWindow.document.write('</body></html>');

      const printContainer = printWindow.document.getElementById('print-container');
      if (!printContainer) return;

      // Render each selected page to the print window
      for (let i = printRange.from; i <= printRange.to; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 }); // Higher resolution for printing
        
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.marginBottom = '10px';
        
        const context = canvas.getContext('2d');
        if (!context) continue;
        
        await page.render({
          canvasContext: context,
          viewport,
        }).promise;
        
        printContainer.appendChild(canvas);
      }
      
      // Add a small delay to ensure all canvases are rendered
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        // Close the window after print dialog is closed or printing is done
        printWindow.addEventListener('afterprint', () => {
          printWindow.close();
        }, { once: true });
      }, 500);
      
    } catch (error) {
      console.error('Error printing PDF:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-lg max-w-5xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">
            {isLoading ? 'Loading PDF...' : `Page ${currentPage} of ${numPages}`}
          </h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={zoomOut}>
              <ZoomOut size={16} />
            </Button>
            <Button variant="outline" size="sm" onClick={zoomIn}>
              <ZoomIn size={16} />
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X size={16} />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-muted/30">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Loading PDF...</p>
            </div>
          ) : (
            <canvas ref={canvasRef} className="shadow-lg" />
          )}
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between p-4 border-t gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={currentPage <= 1}
            >
              <ChevronLeft size={16} className="mr-1" /> Previous
            </Button>
            <span className="text-sm text-muted-foreground mx-2">
              Page {currentPage} of {numPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={currentPage >= numPages}
            >
              Next <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm">
              <span>Print pages:</span>
              <input
                type="number"
                min={1}
                max={numPages}
                value={printRange.from}
                onChange={(e) => handlePrintRangeChange(e, 'from')}
                className="w-16 h-9 px-3 border rounded-md"
              />
              <span>to</span>
              <input
                type="number"
                min={printRange.from}
                max={numPages}
                value={printRange.to}
                onChange={(e) => handlePrintRangeChange(e, 'to')}
                className="w-16 h-9 px-3 border rounded-md"
              />
            </div>
            <Button
              variant="default"
              size="sm"
              onClick={handlePrint}
              className="gap-2"
            >
              <Printer size={16} />
              Print
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
