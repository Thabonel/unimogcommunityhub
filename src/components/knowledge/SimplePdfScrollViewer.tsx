import React, { useState, useCallback, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Loader2, AlertTriangle, Search } from 'lucide-react';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface SimplePdfScrollViewerProps {
  pdfUrl: string;
  initialPage?: number;
  searchHighlight?: string;
  className?: string;
  manualTitle?: string;
}

function highlightTextInPage(pageContainer: HTMLElement, searchTerm: string) {
  if (!searchTerm || searchTerm.length < 2) return 0;

  const textLayer = pageContainer.querySelector('.react-pdf__Page__textContent');
  if (!textLayer) return 0;

  // Remove any previous highlights in this page
  textLayer.querySelectorAll('.barry-highlight').forEach(el => {
    const parent = el.parentNode;
    if (parent) {
      parent.replaceChild(document.createTextNode(el.textContent || ''), el);
      parent.normalize();
    }
  });

  let matchCount = 0;
  const searchLower = searchTerm.toLowerCase();
  const spans = textLayer.querySelectorAll('span');

  spans.forEach(span => {
    const text = span.textContent || '';
    const textLower = text.toLowerCase();
    const idx = textLower.indexOf(searchLower);

    if (idx >= 0) {
      // Split text node and wrap match in highlighted span
      const before = text.substring(0, idx);
      const match = text.substring(idx, idx + searchTerm.length);
      const after = text.substring(idx + searchTerm.length);

      const fragment = document.createDocumentFragment();
      if (before) fragment.appendChild(document.createTextNode(before));

      const highlight = document.createElement('span');
      highlight.className = 'barry-highlight';
      highlight.textContent = match;
      highlight.style.backgroundColor = 'rgba(255, 235, 59, 0.85)';
      highlight.style.color = 'transparent';
      highlight.style.borderRadius = '2px';
      highlight.style.padding = '2px 1px';
      highlight.style.margin = '-2px -1px';
      highlight.style.boxShadow = '0 0 4px 2px rgba(255, 235, 59, 0.6)';
      highlight.style.position = 'relative';
      highlight.style.zIndex = '3';
      fragment.appendChild(highlight);

      if (after) fragment.appendChild(document.createTextNode(after));

      span.textContent = '';
      span.appendChild(fragment);
      matchCount++;
    }
  });

  return matchCount;
}

export function SimplePdfScrollViewer({
  pdfUrl,
  initialPage = 1,
  searchHighlight,
  className = ''
}: SimplePdfScrollViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [highlightCount, setHighlightCount] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const renderedPagesRef = useRef<Set<number>>(new Set());

  React.useEffect(() => {
    console.log('SimplePdfScrollViewer: Loading PDF from URL:', pdfUrl);
    console.log('SimplePdfScrollViewer: Initial page:', initialPage);
    if (searchHighlight) {
      console.log('SimplePdfScrollViewer: Search highlight term:', searchHighlight);
    }
  }, [pdfUrl, initialPage, searchHighlight]);

  React.useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth - 32);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  React.useEffect(() => {
    if (numPages > 0 && initialPage > 0) {
      const pageElement = document.querySelector(`[data-page-number="${initialPage}"]`);
      if (pageElement) {
        pageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [numPages, initialPage]);

  // Safety timeout: if PDF hasn't loaded in 20s, show error
  React.useEffect(() => {
    if (!isLoading) return;
    const timer = setTimeout(() => {
      if (isLoading) {
        setError('PDF took too long to load. The file may not be available.');
        setIsLoading(false);
      }
    }, 20000);
    return () => clearTimeout(timer);
  }, [isLoading]);

  // Apply highlights after pages render - uses MutationObserver to catch text layer rendering
  React.useEffect(() => {
    if (!searchHighlight || numPages === 0) return;

    let totalMatches = 0;

    const applyHighlights = () => {
      if (!containerRef.current) return;
      const pages = containerRef.current.querySelectorAll('.react-pdf__Page');
      pages.forEach(page => {
        const count = highlightTextInPage(page as HTMLElement, searchHighlight);
        totalMatches += count;
      });
      setHighlightCount(totalMatches);
    };

    // Observe text layer additions (they render asynchronously after the page canvas)
    const observer = new MutationObserver(() => {
      applyHighlights();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current, { childList: true, subtree: true });
      // Also apply immediately for already-rendered pages
      setTimeout(applyHighlights, 500);
    }

    return () => observer.disconnect();
  }, [searchHighlight, numPages]);

  function onDocumentLoadSuccess({ numPages: pages }: { numPages: number }) {
    setNumPages(pages);
    setError(null);
    setIsLoading(false);
    renderedPagesRef.current.clear();
  }

  function onDocumentLoadError(err: Error) {
    console.error('PDF load error:', err.message, 'URL:', pdfUrl);
    setError(`Failed to load PDF: ${err.message || 'File may not be available'}`);
    setIsLoading(false);
  }

  const onPageRenderSuccess = useCallback((pageNum: number) => {
    renderedPagesRef.current.add(pageNum);

    if (searchHighlight && containerRef.current) {
      // Small delay to let text layer render after canvas
      setTimeout(() => {
        const pageEl = containerRef.current?.querySelector(`[data-page-number="${pageNum}"]`);
        if (pageEl) {
          const count = highlightTextInPage(pageEl as HTMLElement, searchHighlight);
          if (count > 0) {
            setHighlightCount(prev => prev + count);
          }
        }
      }, 300);
    }
  }, [searchHighlight]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-3" />
          <p className="font-medium mb-2 text-foreground">PDF Not Available</p>
          <p className="text-sm text-muted-foreground">{error}</p>
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
      {/* Search highlight indicator */}
      {searchHighlight && !isLoading && (
        <div className="sticky top-0 z-10 bg-yellow-50 border-b border-yellow-200 px-4 py-2 flex items-center gap-2 text-sm">
          <Search className="h-4 w-4 text-yellow-600" />
          <span className="text-yellow-800">
            Highlighting "<strong>{searchHighlight}</strong>"
            {highlightCount > 0 && ` — ${highlightCount} match${highlightCount !== 1 ? 'es' : ''} found`}
          </span>
        </div>
      )}

      <div className="p-4">
        <Document
          file={pdfUrl}
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
                  renderTextLayer={true}
                  renderAnnotationLayer={false}
                  onRenderSuccess={() => onPageRenderSuccess(index + 1)}
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
