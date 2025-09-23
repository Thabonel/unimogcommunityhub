import React, { useState } from 'react';
import { ImageReference } from '@/services/claude/geminiService';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ZoomIn, Image as ImageIcon, ExternalLink } from 'lucide-react';

interface ImageGalleryProps {
  images: ImageReference[];
  className?: string;
}

export function ImageGallery({ images, className = '' }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<ImageReference | null>(null);

  if (!images || images.length === 0) {
    return null;
  }

  const getImageTypeIcon = (type: string) => {
    switch (type) {
      case 'diagram':
        return '📊';
      case 'schematic':
        return '🔌';
      case 'parts-view':
        return '🔧';
      case 'photo':
        return '📷';
      case 'table':
        return '📋';
      case 'chart':
        return '📈';
      default:
        return '📄';
    }
  };

  const getImageTypeColor = (type: string) => {
    switch (type) {
      case 'diagram':
        return 'bg-blue-100 text-blue-800';
      case 'schematic':
        return 'bg-green-100 text-green-800';
      case 'parts-view':
        return 'bg-orange-100 text-orange-800';
      case 'photo':
        return 'bg-purple-100 text-purple-800';
      case 'table':
        return 'bg-gray-100 text-gray-800';
      case 'chart':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <ImageIcon size={16} className="text-blue-600" />
        <span className="text-sm font-medium text-gray-700">
          Related Images ({images.length})
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {images.map((image, index) => (
          <Card key={image.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-3">
              <div className="space-y-2">
                {/* Image Thumbnail */}
                <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.description}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-technical-diagram.png';
                    }}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setSelectedImage(image)}
                        >
                          <ZoomIn size={16} />
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </div>
                </div>

                {/* Image Info */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Badge className={`text-xs ${getImageTypeColor(image.type)}`}>
                      {getImageTypeIcon(image.type)} {image.type}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      Page {image.pageNumber}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-2">
                    {image.description}
                  </p>

                  {/* Relevance Score */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-400">Relevance:</span>
                      <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all"
                          style={{ width: `${image.relevance * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">
                        {Math.round(image.relevance * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Full Image Modal */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getImageTypeIcon(selectedImage.type)}
                {selectedImage.description}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Full Size Image */}
              <div className="max-h-[60vh] overflow-auto bg-gray-50 rounded-lg">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.description}
                  className="w-full h-auto"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-technical-diagram.png';
                  }}
                />
              </div>

              {/* Image Details */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Image Details</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <Badge className={`text-xs ${getImageTypeColor(selectedImage.type)}`}>
                        {selectedImage.type}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Page:</span>
                      <span>{selectedImage.pageNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Relevance:</span>
                      <span>{Math.round(selectedImage.relevance * 100)}%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Actions</h4>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => window.open(selectedImage.url, '_blank')}
                    >
                      <ExternalLink size={16} className="mr-2" />
                      Open in New Tab
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = selectedImage.url;
                        link.download = `${selectedImage.id}.png`;
                        link.click();
                      }}
                    >
                      Download Image
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default ImageGallery;