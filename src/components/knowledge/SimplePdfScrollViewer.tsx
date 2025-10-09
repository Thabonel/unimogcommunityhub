import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Configure PDF.js worker - use CDN for reliability
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface SimplePdfScrollViewerProps {
  pdfUrl: string;
  initialPage?: number;
  className?: string;
}

export function SimplePdfScrollViewer({
  pdfUrl,
  initialPage = 1,
  className = ''
}: SimplePdfScrollViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Set container width on mount and resize
  React.useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth - 32); // Account for padding
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Scroll to initial page after PDF loads
  React.useEffect(() => {
    if (numPages > 0 && initialPage > 0) {
      const pageElement = document.querySelector(`[data-page-number="${initialPage}"]`);
      if (pageElement) {
        pageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [numPages, initialPage]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setError(null);
  }

  function onDocumentLoadError(error: Error) {
    console.error('PDF load error:', error);
    setError('Failed to load PDF document');
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center text-destructive">
          <p className="font-medium mb-2">Error Loading PDF</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-y-auto h-full bg-gray-100 ${className}`}
      style={{ scrollBehavior: 'smooth' }}
    >
      <div className="p-4">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          }
        >
          {numPages > 0 &&
            Array.from({ length: numPages }, (_, index) => (
              <div
                key={index + 1}
                data-page-number={index + 1}
                className="mb-4 shadow-md bg-white"
              >
                <Page
                  pageNumber={index + 1}
                  width={containerWidth}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  loading={
                    <div className="flex items-center justify-center p-8">
                      <div className="text-muted-foreground">Loading page {index + 1}...</div>
                    </div>
                  }
                />
              </div>
            ))}
        </Document>
      </div>
    </div>
  );
}
