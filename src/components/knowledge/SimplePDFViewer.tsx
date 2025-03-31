
import React, { useState, useEffect } from 'react';
import { PDFViewerLayout } from './PDFViewerLayout';
import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

interface SimplePDFViewerProps {
  url: string;
  onClose: () => void;
}

export function SimplePDFViewer({ url, onClose }: SimplePDFViewerProps) {
  const [pdfDoc, setPdfDoc] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.2);
  const [isLoading, setIsLoading] = useState(true);
  const [isContinuousMode, setIsContinuousMode] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);

  // Load PDF when component mounts or URL changes
  useEffect(() => {
    const loadPdf = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setCurrentPage(1);
      } catch (error) {
        console.error('Error loading PDF:', error);
        setError('Failed to load PDF document. Please check the URL and try again.');
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

  // Render current page
  useEffect(() => {
    const renderPage = async () => {
      if (!pdfDoc || !canvasRef) return;

      try {
        const page = await pdfDoc.getPage(currentPage);
        const viewport = page.getViewport({ scale });
        
        const context = canvasRef.getContext('2d');
        canvasRef.height = viewport.height;
        canvasRef.width = viewport.width;
        
        const renderTask = page.render({
          canvasContext: context,
          viewport,
        });
        
        await renderTask.promise;
      } catch (error) {
        console.error('Error rendering page:', error);
      }
    };

    renderPage();
  }, [pdfDoc, currentPage, scale, canvasRef]);

  // Handle zoom
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3.0));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.6));
  };

  // Toggle view mode
  const handleToggleViewMode = () => {
    setIsContinuousMode(prev => !prev);
  };

  return (
    <PDFViewerLayout
      isLoading={isLoading}
      error={error}
      controls={{
        currentPage,
        numPages,
        scale,
        isContinuousMode
      }}
      actions={{
        onPageChange: setCurrentPage,
        onZoomIn: handleZoomIn,
        onZoomOut: handleZoomOut,
        onClose,
        onToggleViewMode: handleToggleViewMode
      }}
    >
      <div className="flex justify-center p-4">
        <canvas 
          ref={setCanvasRef}
          className="shadow-lg"
        />
      </div>
    </PDFViewerLayout>
  );
}
