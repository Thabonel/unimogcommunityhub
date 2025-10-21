import React, { useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageViewerProps {
  url: string;
  alt?: string;
  onLoadSuccess?: () => void;
  onLoadError?: (error: Error) => void;
  className?: string;
}

export function ImageViewer({
  url,
  alt = 'Manual illustration',
  onLoadSuccess,
  onLoadError,
  className = ''
}: ImageViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debug logging
  console.log('[ImageViewer] Component mounted with URL:', url);
  console.log('[ImageViewer] Loading state:', loading);
  console.log('[ImageViewer] Error state:', error);

  const handleLoad = () => {
    console.log('[ImageViewer] Image loaded successfully');
    setLoading(false);
    setError(null);
    onLoadSuccess?.();
  };

  const handleError = () => {
    console.log('[ImageViewer] Image failed to load');
    const errorObj = new Error(`Failed to load image: ${url}`);
    setLoading(false);
    setError('Failed to load image. Please try again.');
    onLoadError?.(errorObj);
  };

  return (
    <div className={cn("relative flex flex-col items-center justify-center h-full bg-gray-50 overflow-auto p-4", className)}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-military-green" />
            <p className="text-sm text-muted-foreground">Loading illustration...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center gap-4 p-8">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-2">Error Loading Image</h3>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      )}

      {!error && (
        <img
          src={url}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "max-w-full h-auto object-contain",
            loading && "opacity-0"
          )}
          style={{ maxHeight: '90vh' }}
        />
      )}
    </div>
  );
}
