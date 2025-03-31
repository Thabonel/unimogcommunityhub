
import { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { toast } from '@/hooks/use-toast';
import { PdfViewerControls } from './PdfViewerControls';
import { PdfCanvas } from './PdfCanvas';
import { preparePdfForPrinting, printPdfPages } from './PdfPrintService';

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

  // Prevent background scrolling when PDF viewer is open
  useEffect(() => {
    // Store the original overflow style
    const originalStyle = document.body.style.overflow;
    // Prevent scrolling on the body
    document.body.style.overflow = 'hidden';
    
    return () => {
      // Restore original overflow style when component unmounts
      document.body.style.overflow = originalStyle;
    };
  }, []);

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
        toast({
          title: 'Error',
          description: 'Failed to load PDF document',
          variant: 'destructive'
        });
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

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3.0));
  };

  const handleZoomOut = () => {
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

      const pageImages = await preparePdfForPrinting(pdfDoc, printRange);
      await printPdfPages(pageImages);
      
      toast({
        title: "Print ready",
        description: "Document has been sent to printer",
      });
    } catch (error) {
      console.error('Error preparing print:', error);
      toast({
        title: 'Print failed',
        description: 'Failed to prepare document for printing',
        variant: 'destructive'
      });
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col">
      <div className="sticky top-0 z-10 bg-background shadow-md pdf-viewer-header">
        <PdfViewerControls 
          currentPage={currentPage}
          numPages={numPages}
          scale={scale}
          isPrinting={isPrinting}
          printRange={printRange}
          onPageChange={setCurrentPage}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onClose={onClose}
          onPrint={handlePrint}
          onPrintRangeChange={handlePrintRangeChange}
        />
      </div>
      
      <div className="flex-1 overflow-auto bg-muted/30 pdf-viewer-content">
        <PdfCanvas 
          pdfDoc={pdfDoc}
          currentPage={currentPage}
          scale={scale}
          isLoading={isLoading}
        />
      </div>
      
      <div className="sticky bottom-0 z-10 bg-background shadow-md pdf-viewer-footer">
        <PdfViewerControls 
          currentPage={currentPage}
          numPages={numPages}
          scale={scale}
          isPrinting={isPrinting}
          printRange={printRange}
          onPageChange={setCurrentPage}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onClose={onClose}
          onPrint={handlePrint}
          onPrintRangeChange={handlePrintRangeChange}
        />
      </div>
    </div>
  );
}
