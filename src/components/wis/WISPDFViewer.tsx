import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ZoomIn,
  ZoomOut,
  Download,
  Loader2,
  AlertCircle,
  Maximize2,
  Minimize2,
  FileText,
  ExternalLink
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

interface WISPDFViewerProps {
  url: string;
  title?: string;
  description?: string;
  className?: string;
  height?: string | number;
}

export function WISPDFViewer({
  url,
  title,
  description,
  className = "",
  height = 600
}: WISPDFViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);

  // Load PDF.js
  useEffect(() => {
    const loadPDF = async () => {
      if (!url) return;

      try {
        console.log('🔄 Loading PDF:', url);

        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;

        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setLoading(false);

        console.log(`✅ PDF loaded: ${pdf.numPages} pages`);

        // Render first page
        renderPage(pdf, 1);
      } catch (err) {
        console.error('PDF loading error:', err);
        setError('Failed to load PDF document');
        setLoading(false);
      }
    };

    loadPDF();
  }, [url]);

  const renderPage = async (pdf: any, pageNumber: number) => {
    if (!pdf || !canvasRef.current) return;

    try {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };

      await page.render(renderContext).promise;
    } catch (err) {
      console.error('Page rendering error:', err);
    }
  };

  // Re-render when scale or page changes
  useEffect(() => {
    if (pdfDoc && pageNum <= numPages) {
      renderPage(pdfDoc, pageNum);
    }
  }, [pdfDoc, pageNum, scale]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3.0));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = title || 'wis-document.pdf';
    link.click();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const goToPreviousPage = () => {
    if (pageNum > 1) {
      setPageNum(pageNum - 1);
    }
  };

  const goToNextPage = () => {
    if (pageNum < numPages) {
      setPageNum(pageNum + 1);
    }
  };

  const openInNewWindow = () => {
    window.open(url, '_blank', 'width=1000,height=800');
  };

  if (loading) {
    return (
      <Card className={className}>
        <div className="flex items-center justify-center p-8" style={{ height }}>
          <div className="text-center">
            <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-gray-400" />
            <p className="text-gray-500">Loading PDF document...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <div className="flex items-center justify-center p-8" style={{ height }}>
          <div className="text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-400" />
            <p className="text-red-600 mb-2">Failed to load PDF</p>
            <p className="text-gray-500 text-sm mb-4">{error}</p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" size="sm" onClick={openInNewWindow}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in New Tab
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  const containerHeight = isFullscreen ? '90vh' : height;

  return (
    <Card className={`${className} ${isFullscreen ? 'fixed inset-4 z-50 bg-white' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-blue-600" />
          <div>
            {title && <h3 className="font-semibold text-gray-900">{title}</h3>}
            {description && <p className="text-sm text-gray-600">{description}</p>}
          </div>
          <Badge variant="outline" className="ml-2">
            PDF
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {numPages > 0 && (
            <span className="text-sm text-gray-600">
              Page {pageNum} of {numPages}
            </span>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={pageNum <= 1}
          >
            ←
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={pageNum >= numPages}
          >
            →
          </Button>
          <div className="mx-2 text-sm text-gray-600">
            <input
              type="number"
              value={pageNum}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= numPages) {
                  setPageNum(page);
                }
              }}
              className="w-16 px-2 py-1 text-center border rounded"
              min={1}
              max={numPages}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={scale <= 0.5}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-600 min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={scale >= 3.0}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={openInNewWindow}>
            <ExternalLink className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* PDF Content */}
      <div
        ref={containerRef}
        className="relative overflow-auto bg-gray-100"
        style={{ height: isFullscreen ? 'calc(90vh - 120px)' : `calc(${height}px - 120px)` }}
      >
        <div className="flex justify-center p-4">
          <canvas
            ref={canvasRef}
            className="border border-gray-300 shadow-lg bg-white"
            style={{
              maxWidth: '100%',
              height: 'auto'
            }}
          />
        </div>
      </div>

      {/* Fullscreen overlay close button */}
      {isFullscreen && (
        <Button
          variant="outline"
          size="sm"
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm"
        >
          <Minimize2 className="w-4 h-4 mr-2" />
          Exit Fullscreen
        </Button>
      )}
    </Card>
  );
}

export default WISPDFViewer;