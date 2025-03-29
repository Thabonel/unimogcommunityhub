
import { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, X, Printer } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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
  const [isPrinting, setIsPrinting] = useState(false);
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
    if (!pdfDoc || isPrinting) return;

    try {
      setIsPrinting(true);
      toast({
        title: "Preparing print",
        description: `Preparing pages ${printRange.from} to ${printRange.to} for printing...`,
      });

      // Create an invisible iframe to handle the printing
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      const iframeDoc = iframe.contentWindow?.document;
      if (!iframeDoc) throw new Error('Could not access iframe document');
      
      // Write basic HTML structure
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print PDF</title>
            <style>
              body { margin: 0; padding: 0; }
              .page { page-break-after: always; margin-bottom: 10mm; }
              img { max-width: 100%; height: auto; display: block; margin: 0 auto; }
            </style>
          </head>
          <body id="print-container"></body>
        </html>
      `);
      
      const printContainer = iframeDoc.getElementById('print-container');
      if (!printContainer) throw new Error('Print container not found');
      
      // We'll use data URLs for images which is much faster than canvas rendering
      const imagePromises = [];
      
      // Only process the pages in the specified range
      for (let i = printRange.from; i <= printRange.to; i++) {
        imagePromises.push((async () => {
          // Get the page
          const page = await pdfDoc.getPage(i);
          
          // Higher scale for better print quality
          const viewport = page.getViewport({ scale: 1.5 });
          
          // Create a canvas for this page
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          
          const context = canvas.getContext('2d');
          if (!context) return null;
          
          // Render the PDF page to the canvas
          await page.render({
            canvasContext: context,
            viewport,
          }).promise;
          
          return { pageNum: i, dataUrl: canvas.toDataURL('image/jpeg', 0.8) };
        })());
      }
      
      // Wait for all pages to be processed
      const pageImages = await Promise.all(imagePromises);
      
      // Add each image to the container with page breaks
      pageImages.forEach(page => {
        if (!page) return;
        
        const div = iframeDoc.createElement('div');
        div.className = 'page';
        
        const img = iframeDoc.createElement('img');
        img.src = page.dataUrl;
        img.alt = `Page ${page.pageNum}`;
        
        div.appendChild(img);
        printContainer.appendChild(div);
      });
      
      // Finish writing the document
      iframeDoc.close();
      
      // Wait for images to load
      iframe.onload = () => {
        setTimeout(() => {
          // Trigger print
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          
          // Clean up iframe after printing
          iframe.onafterprint = () => {
            document.body.removeChild(iframe);
            setIsPrinting(false);
          };
          
          // Fallback cleanup in case onafterprint is not supported
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
              setIsPrinting(false);
            }
          }, 5000);
        }, 500);
      };
    } catch (error) {
      console.error('Error preparing print:', error);
      setIsPrinting(false);
      toast({
        title: 'Print failed',
        description: 'Failed to prepare document for printing',
        variant: 'destructive'
      });
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
              disabled={isPrinting}
            >
              <Printer size={16} />
              {isPrinting ? 'Preparing...' : 'Print'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
