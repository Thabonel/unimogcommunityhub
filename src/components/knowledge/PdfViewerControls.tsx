
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PdfViewerControlsProps {
  currentPage: number;
  numPages: number;
  scale: number;
  isPrinting: boolean;
  printRange: { from: number; to: number };
  onPageChange: (pageNumber: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onClose: () => void;
  onPrint: () => void;
  onPrintRangeChange: (e: React.ChangeEvent<HTMLInputElement>, type: 'from' | 'to') => void;
}

export function PdfViewerControls({
  currentPage,
  numPages,
  scale,
  isPrinting,
  printRange,
  onPageChange,
  onZoomIn,
  onZoomOut,
  onClose,
  onPrint,
  onPrintRangeChange
}: PdfViewerControlsProps) {
  const prevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < numPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Handle clicks within the controls to prevent event propagation
  const handleControlClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="bg-background border-b last:border-t last:border-b-0" onClick={handleControlClick}>
      <div className="flex items-center justify-between py-2 px-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            disabled={currentPage <= 1}
          >
            <ChevronLeft size={16} />
          </Button>
          
          <span className="text-sm whitespace-nowrap">
            Page {currentPage} of {numPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={currentPage >= numPages}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Button variant="outline" size="sm" onClick={onZoomOut}>
              <ZoomOut size={16} />
            </Button>
            <span className="text-sm px-2">{Math.round(scale * 100)}%</span>
            <Button variant="outline" size="sm" onClick={onZoomIn}>
              <ZoomIn size={16} />
            </Button>
          </div>
          
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <input
              type="number"
              min={1}
              max={numPages}
              value={printRange.from}
              onChange={(e) => onPrintRangeChange(e, 'from')}
              className="w-12 h-7 px-1 border rounded-md"
            />
            <span>-</span>
            <input
              type="number"
              min={printRange.from}
              max={numPages}
              value={printRange.to}
              onChange={(e) => onPrintRangeChange(e, 'to')}
              className="w-12 h-7 px-1 border rounded-md"
            />
            <Button
              variant="default"
              size="sm"
              onClick={onPrint}
              disabled={isPrinting}
            >
              <Printer size={16} />
              <span className="hidden md:inline ml-1">{isPrinting ? 'Preparing...' : 'Print'}</span>
            </Button>
          </div>
          
          <Button variant="outline" size="sm" onClick={onClose} className="ml-1">
            <X size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
