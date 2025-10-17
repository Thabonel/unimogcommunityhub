import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Loader2 } from 'lucide-react';

// Configure PDF.js worker - use CDN with explicit HTTPS for reliability
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
    setIsLoading(false);
  }

  function onDocumentLoadError(error: Error) {
    console.error('PDF load error:', error);
    console.error('PDF URL that failed:', pdfUrl);
    console.error('Error details:', error.message, error.name);
    setError(`Failed to load PDF: ${error.message || 'Unknown error'}`);
    setIsLoading(false);
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
          file={{
            url: pdfUrl,
            httpHeaders: {},
            withCredentials: false
          }}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          options={{
            cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
            cMapPacked: true,
          }}
          loading={
            <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
              <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
              <p className="text-lg font-medium text-muted-foreground">Loading manual...</p>
              <p className="text-sm text-muted-foreground mt-2">This may take a moment for large files</p>
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
                    <div className="flex flex-col items-center justify-center p-8 min-h-[600px] bg-white">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                      <div className="text-sm text-muted-foreground">Loading page {index + 1}...</div>
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
