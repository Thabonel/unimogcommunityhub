
import React from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface PdfZoomControlsProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export function PdfZoomControls({ scale, onZoomIn, onZoomOut }: PdfZoomControlsProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onZoomOut} 
        disabled={scale <= 0.6}
        className="flex items-center"
        aria-label="Zoom out"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      
      <div className="text-sm font-medium">
        {Math.round(scale * 100)}%
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onZoomIn} 
        disabled={scale >= 3.0}
        className="flex items-center"
        aria-label="Zoom in"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
    </div>
  );
}
