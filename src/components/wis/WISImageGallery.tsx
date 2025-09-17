import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  ExternalLink,
  Grid3X3,
  Eye
} from 'lucide-react';

interface ImageItem {
  url: string;
  title?: string;
  description?: string;
  filename?: string;
}

interface WISImageGalleryProps {
  images: ImageItem[];
  initialImageIndex?: number;
  className?: string;
  height?: string | number;
  showThumbnails?: boolean;
}

export function WISImageGallery({
  images,
  initialImageIndex = 0,
  className = "",
  height = 400,
  showThumbnails = true
}: WISImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialImageIndex);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState<string | null>(null);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentImage = images[currentIndex];

  useEffect(() => {
    setCurrentIndex(Math.max(0, Math.min(initialImageIndex, images.length - 1)));
  }, [initialImageIndex, images.length]);

  useEffect(() => {
    // Reset transformations when changing images
    setScale(1.0);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
    setLoading(true);
    setImageError(null);
  }, [currentIndex]);

  const handleImageLoad = () => {
    setLoading(false);
    setImageError(null);
  };

  const handleImageError = () => {
    setLoading(false);
    setImageError('Failed to load image');
  };

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 4.0));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.25));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleReset = () => {
    setScale(1.0);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      handleReset();
    }
  };

  const handleDownload = () => {
    if (currentImage) {
      const link = document.createElement('a');
      link.href = currentImage.url;
      link.download = currentImage.filename || currentImage.title || 'wis-image.jpg';
      link.click();
    }
  };

  const openInNewWindow = () => {
    if (currentImage) {
      window.open(currentImage.url, '_blank');
    }
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen) {
        switch (e.key) {
          case 'ArrowLeft':
            goToPrevious();
            break;
          case 'ArrowRight':
            goToNext();
            break;
          case 'Escape':
            setIsFullscreen(false);
            break;
          case '+':
          case '=':
            handleZoomIn();
            break;
          case '-':
            handleZoomOut();
            break;
          case 'r':
          case 'R':
            handleRotate();
            break;
          case '0':
            handleReset();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  if (!images || images.length === 0) {
    return (
      <Card className={className}>
        <div className="flex items-center justify-center p-8" style={{ height }}>
          <div className="text-center text-gray-500">
            <ImageIcon className="w-8 h-8 mx-auto mb-4 text-gray-300" />
            <p>No images available</p>
          </div>
        </div>
      </Card>
    );
  }

  const containerHeight = isFullscreen ? '90vh' : height;

  return (
    <>
      <Card className={`${className} ${isFullscreen ? 'fixed inset-4 z-50 bg-white' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center gap-3">
            <ImageIcon className="w-5 h-5 text-green-600" />
            <div>
              {currentImage?.title && (
                <h3 className="font-semibold text-gray-900">{currentImage.title}</h3>
              )}
              {currentImage?.description && (
                <p className="text-sm text-gray-600">{currentImage.description}</p>
              )}
            </div>
            <Badge variant="outline" className="ml-2">
              Image {currentIndex + 1} of {images.length}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {images.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowGrid(!showGrid)}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between p-3 border-b bg-gray-50">
          <div className="flex items-center gap-2">
            {images.length > 1 && (
              <>
                <Button variant="outline" size="sm" onClick={goToPrevious}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={goToNext}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={scale <= 0.25}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600 min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={scale >= 4.0}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleRotate}>
              <RotateCw className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset
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

        {/* Image Display */}
        {!showGrid && (
          <div
            ref={containerRef}
            className="relative overflow-hidden bg-gray-100 flex items-center justify-center cursor-grab active:cursor-grabbing"
            style={{ height: isFullscreen ? 'calc(90vh - 120px)' : `calc(${height}px - 120px)` }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            )}

            {imageError ? (
              <div className="text-center">
                <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-400" />
                <p className="text-red-600 mb-2">Failed to load image</p>
                <Button variant="outline" size="sm" onClick={openInNewWindow}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Original
                </Button>
              </div>
            ) : currentImage && (
              <img
                ref={imageRef}
                src={currentImage.url}
                alt={currentImage.title || currentImage.description || 'WIS Image'}
                onLoad={handleImageLoad}
                onError={handleImageError}
                style={{
                  transform: `scale(${scale}) rotate(${rotation}deg) translate(${position.x}px, ${position.y}px)`,
                  maxWidth: scale === 1 ? '100%' : 'none',
                  maxHeight: scale === 1 ? '100%' : 'none',
                  transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                  userSelect: 'none',
                  pointerEvents: 'none'
                }}
                draggable={false}
              />
            )}
          </div>
        )}

        {/* Grid View */}
        {showGrid && (
          <div
            className="p-4 overflow-auto"
            style={{ height: isFullscreen ? 'calc(90vh - 120px)' : `calc(${height}px - 120px)` }}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointer border-2 rounded-lg overflow-hidden hover:border-blue-400 transition-colors ${
                    index === currentIndex ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                  }`}
                  onClick={() => {
                    setCurrentIndex(index);
                    setShowGrid(false);
                  }}
                >
                  <div className="aspect-square relative bg-gray-100">
                    <img
                      src={image.url}
                      alt={image.title || `Image ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  {image.title && (
                    <div className="p-2 bg-white">
                      <p className="text-xs text-gray-600 truncate">{image.title}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Thumbnails */}
        {showThumbnails && !showGrid && images.length > 1 && (
          <div className="p-3 border-t bg-gray-50">
            <div className="flex gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={`flex-shrink-0 w-16 h-16 border-2 rounded overflow-hidden ${
                    index === currentIndex ? 'border-blue-500' : 'border-gray-300'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                >
                  <img
                    src={image.url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Fullscreen overlay close */}
      {isFullscreen && (
        <Button
          variant="outline"
          size="sm"
          onClick={toggleFullscreen}
          className="fixed top-4 right-4 z-60 bg-white/90 backdrop-blur-sm"
        >
          <Minimize2 className="w-4 h-4 mr-2" />
          Exit Fullscreen
        </Button>
      )}
    </>
  );
}

export default WISImageGallery;