
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PdfViewerHeaderProps {
  onClose: () => void;
}

export function PdfViewerHeader({ onClose }: PdfViewerHeaderProps) {
  return (
    <div className="flex items-center justify-between p-3 border-b">
      <h2 id="pdf-viewer-title" className="text-xl font-medium">PDF Document</h2>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onClose}
        className="flex items-center"
        aria-label="Close document"
      >
        <X className="h-4 w-4" />
        <span className="sr-only md:not-sr-only md:ml-2">Close</span>
      </Button>
    </div>
  );
}
