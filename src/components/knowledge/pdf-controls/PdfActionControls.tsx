
import { Printer, X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PdfActionControlsProps {
  isPrinting: boolean;
  numPages: number;
  printRange: { from: number; to: number };
  onPrint: () => void;
  onDownload: () => void;
  onClose: () => void;
  onPrintRangeChange: (e: React.ChangeEvent<HTMLInputElement>, type: 'from' | 'to') => void;
}

export function PdfActionControls({
  isPrinting,
  numPages,
  printRange,
  onPrint,
  onDownload,
  onClose,
  onPrintRangeChange
}: PdfActionControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onDownload}
      >
        <Download size={16} />
        <span className="sr-only md:not-sr-only md:ml-1">Download</span>
      </Button>
      
      <div className="hidden sm:flex items-center gap-2 text-sm">
        <input
          type="number"
          min={1}
          max={numPages}
          value={printRange.from}
          onChange={(e) => onPrintRangeChange(e, 'from')}
          className="w-12 h-7 px-1 border rounded-md"
          aria-label="Print from page"
        />
        <span>-</span>
        <input
          type="number"
          min={printRange.from}
          max={numPages}
          value={printRange.to}
          onChange={(e) => onPrintRangeChange(e, 'to')}
          className="w-12 h-7 px-1 border rounded-md"
          aria-label="Print to page"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={onPrint}
          disabled={isPrinting}
        >
          <Printer size={16} />
          <span className="sr-only md:not-sr-only md:ml-1">{isPrinting ? 'Preparing...' : 'Print'}</span>
        </Button>
      </div>
      
      <Button variant="outline" size="sm" onClick={onClose} className="ml-1">
        <X size={16} />
        <span className="sr-only md:not-sr-only md:ml-1">Close</span>
      </Button>
    </div>
  );
}
