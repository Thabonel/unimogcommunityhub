
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { PdfNavigationControls } from './PdfNavigationControls';
import { PdfZoomControls } from './PdfZoomControls';
import { PdfViewModeToggle } from './PdfViewModeToggle';
import { PdfPrintControls } from './PdfPrintControls';

interface PdfViewerFooterProps {
  controls: {
    currentPage: number;
    numPages: number;
    scale: number;
    isContinuousMode: boolean;
    isPrinting?: boolean;
    printRange?: { from: number; to: number };
  };
  actions: {
    onPageChange: (page: number) => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onClose: () => void;
    onToggleViewMode?: () => void;
    onPrint?: () => void;
    onPrintRangeChange?: (e: React.ChangeEvent<HTMLInputElement>, type: 'from' | 'to') => void;
  };
}

export function PdfViewerFooter({ controls, actions }: PdfViewerFooterProps) {
  const { 
    currentPage, 
    numPages, 
    scale, 
    isContinuousMode, 
    isPrinting, 
    printRange 
  } = controls;
  
  const { 
    onPageChange, 
    onZoomIn, 
    onZoomOut, 
    onClose, 
    onToggleViewMode, 
    onPrint, 
    onPrintRangeChange 
  } = actions;
  
  return (
    <div 
      className="flex flex-wrap items-center justify-between gap-2 p-3 border-t bg-background"
      role="toolbar"
      aria-label="PDF viewer controls"
    >
      <div className="flex items-center space-x-2 flex-wrap gap-2">
        <PdfNavigationControls 
          currentPage={currentPage}
          numPages={numPages}
          onPageChange={onPageChange}
        />

        <div className="border-l h-6 mx-2 hidden md:block"></div>

        <PdfZoomControls
          scale={scale}
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
        />
        
        {onToggleViewMode && (
          <>
            <div className="border-l h-6 mx-2 hidden md:block"></div>
            <PdfViewModeToggle 
              isContinuousMode={isContinuousMode}
              onToggleViewMode={onToggleViewMode}
            />
          </>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <PdfPrintControls 
          isPrinting={isPrinting}
          printRange={printRange}
          numPages={numPages}
          onPrint={onPrint}
          onPrintRangeChange={onPrintRangeChange}
        />

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
    </div>
  );
}
