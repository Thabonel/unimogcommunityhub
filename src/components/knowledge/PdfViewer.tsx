
import { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { toast } from '@/hooks/use-toast';
import { PdfViewerControls } from './PdfViewerControls';
import { PdfCanvas } from './PdfCanvas';
import { preparePdfForPrinting, printPdfPages } from './PdfPrintService';
import { ScrollArea } from '@/components/ui/scroll-area';

// Set up the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

interface PdfViewerProps {
  url: string;
  onClose: () => void;
}

// Define interface for PDF metadata for TypeScript type safety
interface PdfMetadata {
  info?: {
    Title?: string;
    Author?: string;
    Subject?: string;
    Keywords?: string;
    Creator?: string;
    Producer?: string;
    CreationDate?: string;
    ModDate?: string;
    [key: string]: any;
  };
  metadata?: any;
}

export function PdfViewer({ url, onClose }: PdfViewerProps) {
  const [pdfDoc, setPdfDoc] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.2);
  const [isLoading, setIsLoading] = useState(true);
  const [printRange, setPrintRange] = useState({ from: 1, to: 1 });
  const [isPrinting, setIsPrinting] = useState(false);
  const [documentTitle, setDocumentTitle] = useState('');
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{
    pageIndex: number;
    matches: Array<{ transform: number[] }>;
  }>>([]);
  const [currentSearchResultIndex, setCurrentSearchResultIndex] = useState(0);
  const [searchResultsCount, setSearchResultsCount] = useState(0);

  // Prevent background scrolling when PDF viewer is open
  useEffect(() => {
    // Store the original overflow style
    const originalStyle = document.body.style.overflow;
    // Prevent scrolling on the body
    document.body.style.overflow = 'hidden';
    
    return () => {
      // Restore original overflow style when component unmounts
      document.body.style.overflow = originalStyle;
    };
  }, []);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        setIsLoading(true);
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setCurrentPage(1);
        setPrintRange({ from: 1, to: pdf.numPages });
        
        // Try to extract document metadata for title
        try {
          const metadata = await pdf.getMetadata() as PdfMetadata;
          if (metadata?.info?.Title) {
            setDocumentTitle(metadata.info.Title);
          } else {
            // Use filename from URL as fallback
            const urlParts = url.split('/');
            const fileName = urlParts[urlParts.length - 1].split('?')[0];
            setDocumentTitle(decodeURIComponent(fileName));
          }
        } catch (error) {
          console.error('Error extracting PDF metadata:', error);
        }
      } catch (error) {
        console.error('Error loading PDF:', error);
        toast({
          title: 'Error',
          description: 'Failed to load PDF document',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPdf();

    return () => {
      // Cleanup
      if (pdfDoc) {
        pdfDoc.destroy();
      }
    };
  }, [url]);

  // Reset scroll position when changing pages
  useEffect(() => {
    setScrollPosition(0);
  }, [currentPage]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3.0));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.6));
  };

  const handleScrollUp = () => {
    setScrollPosition(prev => Math.max(prev - 0.1, 0));
  };

  const handleScrollDown = () => {
    setScrollPosition(prev => Math.min(prev + 0.1, 1));
  };

  const handlePrintRangeChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'from' | 'to') => {
    const value = parseInt(e.target.value) || 1;
    if (type === 'from') {
      setPrintRange({ ...printRange, from: Math.max(1, Math.min(value, printRange.to)) });
    } else {
      setPrintRange({ ...printRange, to: Math.min(numPages, Math.max(value, printRange.from)) });
    }
  };

  const handlePrint = async () => {
    if (!pdfDoc || isPrinting) return;

    try {
      setIsPrinting(true);
      toast({
        title: "Preparing print",
        description: `Preparing pages ${printRange.from} to ${printRange.to} for printing...`,
      });

      const pageImages = await preparePdfForPrinting(pdfDoc, printRange);
      await printPdfPages(pageImages);
      
      toast({
        title: "Print ready",
        description: "Document has been sent to printer",
      });
    } catch (error) {
      console.error('Error preparing print:', error);
      toast({
        title: 'Print failed',
        description: 'Failed to prepare document for printing',
        variant: 'destructive'
      });
    } finally {
      setIsPrinting(false);
    }
  };

  const handleDownload = () => {
    // If the URL is already a direct link to the PDF
    const link = document.createElement('a');
    link.href = url;
    
    // Try to get the filename from the URL
    const urlParts = url.split('/');
    let fileName = urlParts[urlParts.length - 1].split('?')[0];
    
    // Ensure it has a .pdf extension
    if (!fileName.toLowerCase().endsWith('.pdf')) {
      fileName += '.pdf';
    }
    
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Search functionality
  const handleSearch = async (term: string) => {
    if (!term.trim() || !pdfDoc) {
      setSearchResults([]);
      setSearchResultsCount(0);
      setCurrentSearchResultIndex(0);
      return;
    }

    try {
      setSearchTerm(term);

      // Search through all pages
      let allResults: Array<{
        pageIndex: number;
        matches: Array<{ transform: number[] }>;
      }> = [];
      let totalMatchesCount = 0;

      toast({
        title: "Searching",
        description: "Looking for matches in the document...",
      });

      for (let i = 1; i <= numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        
        // Find matches in the text content
        const pageMatches: Array<{ transform: number[] }> = [];
        
        for (const item of textContent.items) {
          const text = item.str as string;
          if (text.toLowerCase().includes(term.toLowerCase())) {
            // Store the position information
            pageMatches.push({
              transform: item.transform,
            });
          }
        }
        
        if (pageMatches.length > 0) {
          allResults.push({
            pageIndex: i,
            matches: pageMatches,
          });
          totalMatchesCount += pageMatches.length;
        }
      }

      setSearchResults(allResults);
      setSearchResultsCount(totalMatchesCount);
      setCurrentSearchResultIndex(0);
      
      // Navigate to the first result if there are results
      if (totalMatchesCount > 0) {
        const firstResult = allResults[0];
        setCurrentPage(firstResult.pageIndex);
        
        toast({
          title: "Search complete",
          description: `Found ${totalMatchesCount} matches`,
        });
      } else {
        toast({
          title: "No results",
          description: "No matches found for your search term",
        });
      }
    } catch (error) {
      console.error('Error searching PDF:', error);
      toast({
        title: 'Search failed',
        description: 'An error occurred during search',
        variant: 'destructive'
      });
    }
  };

  const navigateToNextResult = () => {
    if (searchResultsCount === 0) return;
    
    const newIndex = (currentSearchResultIndex + 1) % searchResultsCount;
    setCurrentSearchResultIndex(newIndex);
    
    // Find which page this result is on
    let countSoFar = 0;
    for (const pageResult of searchResults) {
      const matchesOnThisPage = pageResult.matches.length;
      if (countSoFar + matchesOnThisPage > newIndex) {
        // This result is on this page
        setCurrentPage(pageResult.pageIndex);
        break;
      }
      countSoFar += matchesOnThisPage;
    }
  };

  const navigateToPrevResult = () => {
    if (searchResultsCount === 0) return;
    
    const newIndex = (currentSearchResultIndex - 1 + searchResultsCount) % searchResultsCount;
    setCurrentSearchResultIndex(newIndex);
    
    // Find which page this result is on
    let countSoFar = 0;
    for (const pageResult of searchResults) {
      const matchesOnThisPage = pageResult.matches.length;
      if (countSoFar + matchesOnThisPage > newIndex) {
        // This result is on this page
        setCurrentPage(pageResult.pageIndex);
        break;
      }
      countSoFar += matchesOnThisPage;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" 
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-viewer-title"
    >
      <div className="bg-background rounded-lg shadow-lg max-w-5xl max-h-[90vh] w-full flex flex-col">
        {/* Header with document title */}
        {documentTitle && (
          <div className="border-b p-3 flex items-center">
            <h2 id="pdf-viewer-title" className="text-lg font-medium truncate flex-1">
              {documentTitle}
            </h2>
          </div>
        )}

        {/* PDF Content */}
        <div className="flex-1 bg-gray-100 overflow-hidden">
          <PdfCanvas 
            pdfDoc={pdfDoc}
            currentPage={currentPage}
            scale={scale}
            isLoading={isLoading}
            searchTerm={searchTerm}
            searchResults={searchResults.filter(r => r.pageIndex === currentPage)}
            currentSearchResultIndex={currentSearchResultIndex}
            scrollPosition={scrollPosition}
            onScroll={setScrollPosition}
          />
        </div>
        
        {/* Footer Controls */}
        <div className="border-t bg-muted">
          <PdfViewerControls 
            currentPage={currentPage}
            numPages={numPages}
            scale={scale}
            isPrinting={isPrinting}
            printRange={printRange}
            searchTerm={searchTerm}
            searchResultsCount={searchResultsCount}
            currentSearchResultIndex={currentSearchResultIndex}
            onPageChange={setCurrentPage}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onClose={onClose}
            onPrint={handlePrint}
            onDownload={handleDownload}
            onSearch={handleSearch}
            onNextResult={navigateToNextResult}
            onPrevResult={navigateToPrevResult}
            onPrintRangeChange={handlePrintRangeChange}
            onScrollUp={handleScrollUp}
            onScrollDown={handleScrollDown}
          />
        </div>
      </div>
    </div>
  );
}
