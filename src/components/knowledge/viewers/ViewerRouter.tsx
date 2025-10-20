import React from 'react';
import { AlertCircle, FileQuestion } from 'lucide-react';
import { SimplePdfScrollViewer } from '../SimplePdfScrollViewer';
import { ImageViewer } from './ImageViewer';
import { detectFileType, getFileExtension } from '@/utils/file-type-detector';

interface ViewerRouterProps {
  url: string;
  pageNumber?: number;
  manualTitle?: string;
  onLoadSuccess?: () => void;
  onLoadError?: (error: Error) => void;
  className?: string;
}

export function ViewerRouter({
  url,
  pageNumber,
  manualTitle,
  onLoadSuccess,
  onLoadError,
  className = ''
}: ViewerRouterProps) {
  const fileType = detectFileType(url);
  const extension = getFileExtension(url);

  // Debug logging
  console.log('[ViewerRouter] URL:', url);
  console.log('[ViewerRouter] Detected type:', fileType);
  console.log('[ViewerRouter] Extension:', extension);

  switch (fileType) {
    case 'pdf':
      return (
        <SimplePdfScrollViewer
          pdfUrl={url}
          initialPage={pageNumber}
          manualTitle={manualTitle}
          className={className}
        />
      );

    case 'image':
      return (
        <ImageViewer
          url={url}
          alt={`${manualTitle || 'Manual'} - Page ${pageNumber || 'N/A'}`}
          onLoadSuccess={onLoadSuccess}
          onLoadError={onLoadError}
          className={className}
        />
      );

    case 'video':
      return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-8">
          <FileQuestion className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">Video Viewer Not Yet Implemented</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Video support coming soon!
          </p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-military-green hover:underline"
          >
            Open video in new tab
          </a>
        </div>
      );

    case 'unsupported':
    default:
      return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-8">
          <AlertCircle className="h-16 w-16 text-destructive mb-4" />
          <h3 className="font-semibold text-lg mb-2">Unsupported File Type</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Cannot display {extension ? `.${extension}` : 'this'} files in the viewer.
          </p>
          <p className="text-sm text-muted-foreground">
            Supported formats: PDF, PNG, JPG, JPEG, WEBP, GIF
          </p>
        </div>
      );
  }
}
