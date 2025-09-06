import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, FileText, Image as ImageIcon } from 'lucide-react';
import { WISMedia, getMediaUrl, isImageFile, isPDFFile } from '@/lib/supabase-wis';

interface MediaGalleryProps {
  media: WISMedia[];
  className?: string;
}

interface MediaWithUrl extends WISMedia {
  signedUrl?: string;
  loading?: boolean;
  error?: boolean;
}

export function MediaGallery({ media, className }: MediaGalleryProps) {
  const [mediaWithUrls, setMediaWithUrls] = useState<MediaWithUrl[]>([]);

  useEffect(() => {
    // Initialize media items
    setMediaWithUrls(media.map(m => ({ ...m, loading: true })));

    // Generate signed URLs for all media items
    const generateUrls = async () => {
      const updatedMedia = await Promise.all(
        media.map(async (mediaItem) => {
          try {
            const signedUrl = await getMediaUrl(mediaItem.bucket, mediaItem.file_name);
            return { ...mediaItem, signedUrl, loading: false };
          } catch (error) {
            console.error(`Failed to get URL for ${mediaItem.file_name}:`, error);
            return { ...mediaItem, error: true, loading: false };
          }
        })
      );
      setMediaWithUrls(updatedMedia);
    };

    if (media.length > 0) {
      generateUrls();
    }
  }, [media]);

  if (media.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <h4 className="text-sm font-medium text-gray-900">Media ({media.length})</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {mediaWithUrls.map((item, index) => (
          <MediaItem key={`${item.bucket}-${item.file_name}-${index}`} media={item} />
        ))}
      </div>
    </div>
  );
}

function MediaItem({ media }: { media: MediaWithUrl }) {
  const [imageError, setImageError] = useState(false);

  if (media.loading) {
    return (
      <div className="border rounded-lg overflow-hidden bg-gray-50">
        <div className="aspect-square bg-gray-200 animate-pulse" />
        <div className="p-2">
          <div className="h-4 bg-gray-200 animate-pulse rounded mb-1" />
          <div className="h-3 bg-gray-200 animate-pulse rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (media.error || !media.signedUrl) {
    return (
      <div className="border rounded-lg overflow-hidden bg-red-50 border-red-200">
        <div className="aspect-square bg-red-100 flex items-center justify-center">
          <FileText className="w-8 h-8 text-red-400" />
        </div>
        <div className="p-2">
          <p className="text-xs text-red-600 font-medium truncate">
            {media.file_name}
          </p>
          <p className="text-xs text-red-500">Failed to load</p>
        </div>
      </div>
    );
  }

  const isImage = isImageFile(media.file_name);
  const isPDF = isPDFFile(media.file_name);

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-square bg-gray-50 flex items-center justify-center">
        {isImage && !imageError ? (
          <img
            src={media.signedUrl}
            alt={media.description || media.file_name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : isPDF ? (
          <FileText className="w-12 h-12 text-blue-500" />
        ) : (
          <ImageIcon className="w-12 h-12 text-gray-400" />
        )}
      </div>
      
      <div className="p-2">
        <p className="text-xs font-medium text-gray-900 truncate mb-1">
          {media.type.charAt(0).toUpperCase() + media.type.slice(1)}
        </p>
        {media.description && (
          <p className="text-xs text-gray-600 line-clamp-2 mb-2">
            {media.description}
          </p>
        )}
        
        <Button
          size="sm"
          variant="outline"
          className="w-full text-xs h-7"
          onClick={() => window.open(media.signedUrl, '_blank')}
        >
          {isPDF ? (
            <>
              <FileText className="w-3 h-3 mr-1" />
              Open PDF
            </>
          ) : (
            <>
              <ExternalLink className="w-3 h-3 mr-1" />
              View
            </>
          )}
        </Button>
      </div>
    </div>
  );
}