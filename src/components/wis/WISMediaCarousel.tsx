import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Image as ImageIcon,
  File,
  Download,
  ExternalLink,
  Eye,
  Maximize2
} from 'lucide-react';
import WISPDFViewer from './WISPDFViewer';
import WISImageGallery from './WISImageGallery';

export interface MediaItem {
  type: 'photo' | 'diagram' | 'table' | 'document' | 'image' | 'pdf';
  bucket: string;
  file_name: string;
  description: string;
  signed_url?: string;
}

interface WISMediaCarouselProps {
  media: MediaItem[];
  className?: string;
  height?: string | number;
  showThumbnails?: boolean;
  initialIndex?: number;
}

export function WISMediaCarousel({
  media,
  className = "",
  height = 500,
  showThumbnails = true,
  initialIndex = 0
}: WISMediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(Math.max(0, Math.min(initialIndex, media.length - 1)));
  const [viewMode, setViewMode] = useState<'carousel' | 'fullscreen'>('carousel');

  if (!media || media.length === 0) {
    return (
      <Card className={className}>
        <div className="flex items-center justify-center p-8" style={{ height }}>
          <div className="text-center text-gray-500">
            <File className="w-8 h-8 mx-auto mb-4 text-gray-300" />
            <p>No media files available</p>
          </div>
        </div>
      </Card>
    );
  }

  const currentMedia = media[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : media.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev < media.length - 1 ? prev + 1 : 0));
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'photo':
      case 'image':
        return <ImageIcon className="w-4 h-4" />;
      case 'diagram':
      case 'table':
      case 'document':
      case 'pdf':
        return <FileText className="w-4 h-4" />;
      default:
        return <File className="w-4 h-4" />;
    }
  };

  const getMediaBadgeClass = (type: string) => {
    switch (type) {
      case 'photo':
      case 'image':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'diagram':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'table':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'document':
      case 'pdf':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isImageType = (type: string) => {
    return ['photo', 'image'].includes(type.toLowerCase());
  };

  const isPDFType = (type: string) => {
    return ['diagram', 'table', 'document', 'pdf'].includes(type.toLowerCase());
  };

  const handleDownload = (mediaItem: MediaItem) => {
    if (mediaItem.signed_url) {
      const link = document.createElement('a');
      link.href = mediaItem.signed_url;
      link.download = mediaItem.file_name;
      link.click();
    }
  };

  const openInNewWindow = (mediaItem: MediaItem) => {
    if (mediaItem.signed_url) {
      window.open(mediaItem.signed_url, '_blank');
    }
  };

  const renderMediaContent = (mediaItem: MediaItem) => {
    if (!mediaItem.signed_url) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500">
            <File className="w-8 h-8 mx-auto mb-4" />
            <p>Media not available</p>
            <p className="text-sm mt-2">{mediaItem.file_name}</p>
          </div>
        </div>
      );
    }

    if (isImageType(mediaItem.type)) {
      return (
        <WISImageGallery
          images={[{
            url: mediaItem.signed_url,
            title: mediaItem.description,
            description: mediaItem.file_name,
            filename: mediaItem.file_name
          }]}
          height={viewMode === 'fullscreen' ? '80vh' : `calc(${height}px - 140px)`}
          showThumbnails={false}
          className="border-0"
        />
      );
    }

    if (isPDFType(mediaItem.type)) {
      return (
        <WISPDFViewer
          url={mediaItem.signed_url}
          title={mediaItem.description}
          description={mediaItem.file_name}
          height={viewMode === 'fullscreen' ? '80vh' : `calc(${height}px - 140px)`}
          className="border-0"
        />
      );
    }

    // Fallback for unknown media types
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <File className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="font-semibold text-gray-700 mb-2">{mediaItem.description}</h3>
          <p className="text-sm text-gray-500 mb-4">{mediaItem.file_name}</p>
          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => openInNewWindow(mediaItem)}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload(mediaItem)}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className={`${className} ${viewMode === 'fullscreen' ? 'fixed inset-4 z-50 bg-white' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center gap-3">
          {getMediaIcon(currentMedia.type)}
          <div>
            <h3 className="font-semibold text-gray-900">{currentMedia.description}</h3>
            <p className="text-sm text-gray-600">{currentMedia.file_name}</p>
          </div>
          <Badge className={getMediaBadgeClass(currentMedia.type)}>
            {currentMedia.type.charAt(0).toUpperCase() + currentMedia.type.slice(1)}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {currentIndex + 1} of {media.length}
          </span>
          {viewMode === 'carousel' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('fullscreen')}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Navigation Controls */}
      {media.length > 1 && (
        <div className="flex items-center justify-between p-3 border-b bg-gray-50">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToPrevious}>
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={goToNext}>
              <ChevronRight className="w-4 h-4" />
              Next
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => openInNewWindow(currentMedia)}
              disabled={!currentMedia.signed_url}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload(currentMedia)}
              disabled={!currentMedia.signed_url}
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Media Content */}
      <div
        className="relative bg-gray-50"
        style={{
          height: viewMode === 'fullscreen'
            ? 'calc(90vh - 140px)'
            : `calc(${height}px - 140px)`
        }}
      >
        {renderMediaContent(currentMedia)}
      </div>

      {/* Thumbnails */}
      {showThumbnails && media.length > 1 && (
        <div className="p-3 border-t bg-gray-50">
          <div className="flex gap-2 overflow-x-auto">
            {media.map((mediaItem, index) => (
              <button
                key={index}
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 text-xs border rounded-lg transition-colors ${
                  index === currentIndex
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                }`}
                onClick={() => setCurrentIndex(index)}
                title={mediaItem.description}
              >
                {getMediaIcon(mediaItem.type)}
                <span className="max-w-20 truncate">
                  {mediaItem.description}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen close button */}
      {viewMode === 'fullscreen' && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewMode('carousel')}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm"
        >
          Exit Fullscreen
        </Button>
      )}
    </Card>
  );
}

export default WISMediaCarousel;