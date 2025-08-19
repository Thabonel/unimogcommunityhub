
import React from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface PdfZoomControlsProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export function PdfZoomControls({ scale, onZoomIn, onZoomOut }: PdfZoomControlsProps) {
  // Round scale to nearest percent for display
  const displayScale = Math.round(scale * 100);
  
  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onZoomOut} 
        disabled={scale <= 0.6}
        className="flex items-center"
        title="Zoom out"
        aria-label="Zoom out"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      
      <div className="text-sm font-medium min-w-[48px] text-center" aria-live="polite">
        {displayScale}%
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onZoomIn} 
        disabled={scale >= 3.0}
        className="flex items-center"
        title="Zoom in"
        aria-label="Zoom in"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
    </div>
  );
}
