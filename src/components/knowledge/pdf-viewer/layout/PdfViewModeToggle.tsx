
import React from 'react';
import { Button } from '@/components/ui/button';
import { Maximize, Minimize } from 'lucide-react';

interface PdfViewModeToggleProps {
  isContinuousMode: boolean;
  onToggleViewMode: () => void;
}

export function PdfViewModeToggle({ isContinuousMode, onToggleViewMode }: PdfViewModeToggleProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onToggleViewMode}
      className="flex items-center"
      aria-label={isContinuousMode ? "Switch to single page view" : "Switch to continuous view"}
    >
      {isContinuousMode ? (
        <Minimize className="h-4 w-4" />
      ) : (
        <Maximize className="h-4 w-4" />
      )}
      <span className="sr-only md:not-sr-only md:ml-2">
        {isContinuousMode ? "Single Page" : "Continuous"}
      </span>
    </Button>
  );
}
