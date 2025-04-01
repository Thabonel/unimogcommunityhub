
import { PdfSearchBar } from './pdf-controls/PdfSearchBar';
import { PdfNavigationControls } from './pdf-controls/PdfNavigationControls';
import { PdfZoomControls } from './pdf-controls/PdfZoomControls';
import { PdfActionControls } from './pdf-controls/PdfActionControls';

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
  onDownload: () => void;
  onSearch: (searchTerm: string) => void;
  onNextResult: () => void;
  onPrevResult: () => void;
  searchTerm: string;
  searchResultsCount: number;
  currentSearchResultIndex: number;
  onPrintRangeChange: (e: React.ChangeEvent<HTMLInputElement>, type: 'from' | 'to') => void;
}

export function PdfViewerControls(props: PdfViewerControlsProps) {
  // Handle clicks within the controls to prevent event propagation
  const handleControlClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="p-3 flex flex-wrap items-center justify-between gap-2" onClick={handleControlClick}>
      {/* Search bar */}
      <PdfSearchBar 
        searchTerm={props.searchTerm}
        searchResultsCount={props.searchResultsCount}
        currentSearchResultIndex={props.currentSearchResultIndex}
        onSearch={props.onSearch}
        onNextResult={props.onNextResult}
        onPrevResult={props.onPrevResult}
      />

      <div className="flex flex-wrap justify-between w-full items-center gap-2">
        {/* Navigation controls */}
        <PdfNavigationControls 
          currentPage={props.currentPage}
          numPages={props.numPages}
          onPageChange={props.onPageChange}
        />
        
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <PdfZoomControls 
            scale={props.scale}
            onZoomIn={props.onZoomIn}
            onZoomOut={props.onZoomOut}
          />
          
          {/* Divider */}
          <div className="hidden md:block border-l h-6 mx-2" aria-hidden="true"></div>
          
          {/* Actions */}
          <PdfActionControls 
            isPrinting={props.isPrinting}
            numPages={props.numPages}
            printRange={props.printRange}
            onPrint={props.onPrint}
            onDownload={props.onDownload}
            onClose={props.onClose}
            onPrintRangeChange={props.onPrintRangeChange}
          />
        </div>
      </div>
    </div>
  );
}
