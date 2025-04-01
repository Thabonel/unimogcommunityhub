
import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface PdfPrintControlsProps {
  isPrinting?: boolean;
  printRange?: { from: number; to: number };
  numPages: number;
  onPrint?: () => void;
  onPrintRangeChange?: (e: React.ChangeEvent<HTMLInputElement>, type: 'from' | 'to') => void;
}

export function PdfPrintControls({ 
  isPrinting, 
  printRange, 
  numPages, 
  onPrint, 
  onPrintRangeChange 
}: PdfPrintControlsProps) {
  if (!onPrint || !printRange || !onPrintRangeChange) {
    return null;
  }

  return (
    <div className="flex items-center space-x-1 print-options">
      <span className="text-sm hidden md:inline-block">Print pages:</span>
      <input
        type="number"
        value={printRange.from}
        onChange={(e) => onPrintRangeChange(e, 'from')}
        min="1"
        max={numPages}
        className="w-12 p-1 text-sm border rounded"
        disabled={isPrinting}
        aria-label="Print from page"
      />
      <span>-</span>
      <input
        type="number"
        value={printRange.to}
        onChange={(e) => onPrintRangeChange(e, 'to')}
        min="1"
        max={numPages}
        className="w-12 p-1 text-sm border rounded"
        disabled={isPrinting}
        aria-label="Print to page"
      />
      <Button 
        variant="outline"
        size="sm"
        onClick={onPrint}
        disabled={isPrinting || !numPages}
        className="flex items-center"
        aria-label="Print document"
      >
        <Printer className="h-4 w-4" />
        <span className="sr-only md:not-sr-only md:ml-2">Print</span>
      </Button>
    </div>
  );
}
