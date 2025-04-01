
import { useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

interface UsePdfLoaderProps {
  url: string;
  setPdfDoc: (doc: any) => void;
  setNumPages: (pages: number) => void;
  setCurrentPage: (page: number) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePdfLoader = ({
  url,
  setPdfDoc,
  setNumPages,
  setCurrentPage,
  setIsLoading,
  setError
}: UsePdfLoaderProps) => {
  useEffect(() => {
    const loadPdf = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setCurrentPage(1);
      } catch (error) {
        console.error('Error loading PDF:', error);
        setError('Failed to load PDF document. Please check the URL and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadPdf();

    return () => {
      // Cleanup function will run when component unmounts or URL changes
      setPdfDoc(null);
    };
  }, [url, setPdfDoc, setNumPages, setCurrentPage, setIsLoading, setError]);
};
