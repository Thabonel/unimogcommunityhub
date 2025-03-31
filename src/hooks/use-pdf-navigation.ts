
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { preparePdfForPrinting, printPdfPages } from '@/components/knowledge/PdfPrintService';

interface UsePdfNavigationProps {
  pdfDoc: any | null;
  printRange: { from: number; to: number };
  numPages: number;
}

export function usePdfNavigation({ pdfDoc, printRange, numPages }: UsePdfNavigationProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [isPrinting, setIsPrinting] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

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
    // Move up by a meaningful amount (smaller for more precision)
    setScrollPosition(prev => Math.max(prev - 0.05, 0));
  };

  const handleScrollDown = () => {
    // Move down by a meaningful amount (smaller for more precision)
    setScrollPosition(prev => Math.min(prev + 0.05, 1));
  };

  const handlePrintRangeChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'from' | 'to') => {
    const value = parseInt(e.target.value) || 1;
    if (type === 'from') {
      return { ...printRange, from: Math.max(1, Math.min(value, printRange.to)) };
    } else {
      return { ...printRange, to: Math.min(numPages, Math.max(value, printRange.from)) };
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

  const handleDownload = (url: string) => {
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

  return {
    currentPage,
    setCurrentPage,
    scale,
    isPrinting,
    scrollPosition,
    setScrollPosition,
    handleZoomIn,
    handleZoomOut,
    handleScrollUp,
    handleScrollDown,
    handlePrintRangeChange,
    handlePrint,
    handleDownload,
  };
}
