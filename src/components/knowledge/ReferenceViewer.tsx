import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Download, Book, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ManualReference {
  manual: string;
  page: number;
  section: string;
  confidence: number;
  context: string;
}

interface ReferenceViewerProps {
  reference: ManualReference | null;
  onNavigate: (reference: ManualReference) => void;
}

export function ReferenceViewer({ reference, onNavigate }: ReferenceViewerProps) {
  const [viewMode, setViewMode] = useState<'pdf' | 'image'>('image');
  const [zoom, setZoom] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load reference content
  useEffect(() => {
    if (!reference) return;

    const loadReferenceContent = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Get image URL for the page
        const imageResponse = await fetch(`/api/manual-images?manual=${encodeURIComponent(reference.manual)}&page=${reference.page}`);
        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          setImageUrl(imageData.url);
        }

        // Get PDF URL for the manual
        const pdfResponse = await fetch(`/api/manual-pdf?manual=${encodeURIComponent(reference.manual)}`);
        if (pdfResponse.ok) {
          const pdfData = await pdfResponse.json();
          setPdfUrl(pdfData.url);
        }

      } catch (err) {
        console.error('Error loading reference content:', err);
        setError('Failed to load reference content');
      } finally {
        setIsLoading(false);
      }
    };

    loadReferenceContent();
  }, [reference]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3.0));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleReset = () => {
    setZoom(1.0);
    setRotation(0);
  };

  const navigateToPage = (delta: number) => {
    if (!reference) return;

    const newPage = reference.page + delta;
    if (newPage < 1) return;

    const newReference: ManualReference = {
      ...reference,
      page: newPage,
      section: `Page ${newPage}`,
      context: `Navigated to page ${newPage}`
    };

    onNavigate(newReference);
  };

  if (!reference) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900">
        <div className="text-center text-gray-400">
          <Book className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No Manual Reference</p>
          <p className="text-sm mt-2">Ask Barry a technical question to see manual pages here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-military-green/30 bg-military-green/10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-sm text-white truncate">
            {reference.manual}
          </h3>
          <Badge variant="secondary" className="text-xs">
            Page {reference.page}
          </Badge>
        </div>

        <p className="text-xs text-gray-300 mb-3">
          {reference.section}
        </p>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 mb-3">
          <Button
            variant={viewMode === 'image' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('image')}
            className="text-xs h-7"
            disabled={!imageUrl}
          >
            <Image className="h-3 w-3 mr-1" />
            Image
          </Button>
          <Button
            variant={viewMode === 'pdf' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('pdf')}
            className="text-xs h-7"
            disabled={!pdfUrl}
          >
            <Book className="h-3 w-3 mr-1" />
            PDF
          </Button>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateToPage(-1)}
            className="text-white hover:bg-military-green/30 h-7 w-7 p-0"
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            className="text-white hover:bg-military-green/30 h-7 w-7 p-0"
          >
            <ZoomOut className="h-3 w-3" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            className="text-white hover:bg-military-green/30 h-7 w-7 p-0"
          >
            <ZoomIn className="h-3 w-3" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleRotate}
            className="text-white hover:bg-military-green/30 h-7 w-7 p-0"
          >
            <RotateCw className="h-3 w-3" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-white hover:bg-military-green/30 text-xs h-7"
          >
            Reset
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateToPage(1)}
            className="text-white hover:bg-military-green/30 h-7 w-7 p-0"
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-2">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="animate-spin h-8 w-8 border-4 border-military-green border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Loading manual page...</p>
            </div>
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-red-400">
              <p className="font-medium">Error Loading Page</p>
              <p className="text-sm mt-2">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="mt-4"
              >
                Retry
              </Button>
            </div>
          </div>
        ) : (
          <Card className="bg-white min-h-full">
            {viewMode === 'image' && imageUrl ? (
              <div className="p-4 flex items-center justify-center min-h-full">
                <img
                  src={imageUrl}
                  alt={`${reference.manual} - Page ${reference.page}`}
                  className="max-w-full h-auto shadow-lg"
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    transformOrigin: 'center',
                    transition: 'transform 0.2s ease-in-out'
                  }}
                />
              </div>
            ) : viewMode === 'pdf' && pdfUrl ? (
              <div className="h-full">
                <iframe
                  src={`${pdfUrl}#page=${reference.page}&zoom=${zoom * 100}`}
                  className="w-full h-full border-0"
                  title={`${reference.manual} - Page ${reference.page}`}
                />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Book className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No content available for this page</p>
                  <p className="text-sm mt-2">Try switching view modes</p>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-military-green/30 bg-military-green/5">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Zoom: {Math.round(zoom * 100)}%</span>
          <span>Confidence: {Math.round(reference.confidence * 100)}%</span>
        </div>
      </div>
    </div>
  );
}