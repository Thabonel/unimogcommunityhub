
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
    <div className="flex items-center space-x-1">
      <Button
        variant="outline"
        size="sm"
        onClick={onZoomOut}
        disabled={scale <= 0.6}
        className="h-7 px-2"
        title="Zoom out"
        aria-label="Zoom out"
      >
        <ZoomOut className="h-3 w-3" />
      </Button>

      <div className="text-xs font-medium min-w-[40px] text-center" aria-live="polite">
        {displayScale}%
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onZoomIn}
        disabled={scale >= 3.0}
        className="h-7 px-2"
        title="Zoom in"
        aria-label="Zoom in"
      >
        <ZoomIn className="h-3 w-3" />
      </Button>
    </div>
  );
}
