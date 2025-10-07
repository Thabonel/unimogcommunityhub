
import React from 'react';
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
      className="flex flex-wrap items-center justify-between gap-2 p-2 border-t bg-background"
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
      </div>
    </div>
  );
}
