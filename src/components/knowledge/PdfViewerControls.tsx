
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

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold">
          {numPages === 0 ? 'Loading PDF...' : `Page ${currentPage} of ${numPages}`}
        </h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onZoomOut}>
            <ZoomOut size={16} />
          </Button>
          <Button variant="outline" size="sm" onClick={onZoomIn}>
            <ZoomIn size={16} />
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between p-4 border-t gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            disabled={currentPage <= 1}
          >
            <ChevronLeft size={16} className="mr-1" /> Previous
          </Button>
          <span className="text-sm text-muted-foreground mx-2">
            Page {currentPage} of {numPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={currentPage >= numPages}
          >
            Next <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm">
            <span>Print pages:</span>
            <input
              type="number"
              min={1}
              max={numPages}
              value={printRange.from}
              onChange={(e) => onPrintRangeChange(e, 'from')}
              className="w-16 h-9 px-3 border rounded-md"
            />
            <span>to</span>
            <input
              type="number"
              min={printRange.from}
              max={numPages}
              value={printRange.to}
              onChange={(e) => onPrintRangeChange(e, 'to')}
              className="w-16 h-9 px-3 border rounded-md"
            />
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={onPrint}
            className="gap-2"
            disabled={isPrinting}
          >
            <Printer size={16} />
            {isPrinting ? 'Preparing...' : 'Print'}
          </Button>
        </div>
      </div>
    </>
  );
}
