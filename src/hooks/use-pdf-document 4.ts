
import { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { toast } from '@/hooks/use-toast';

// Define interface for PDF metadata for TypeScript type safety
export interface PdfMetadata {
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

interface UsePdfDocumentProps {
  url: string;
}

interface UsePdfDocumentResult {
  pdfDoc: any | null;
  numPages: number;
  isLoading: boolean;
  documentTitle: string;
  printRange: { from: number; to: number };
  setPrintRange: React.Dispatch<React.SetStateAction<{ from: number; to: number }>>;
}

export function usePdfDocument({ url }: UsePdfDocumentProps): UsePdfDocumentResult {
  const [pdfDoc, setPdfDoc] = useState<any | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [printRange, setPrintRange] = useState({ from: 1, to: 1 });
  const [documentTitle, setDocumentTitle] = useState('');

  useEffect(() => {
    const loadPdf = async () => {
      try {
        setIsLoading(true);
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
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

  return {
    pdfDoc,
    numPages,
    isLoading,
    documentTitle,
    printRange,
    setPrintRange,
  };
}
