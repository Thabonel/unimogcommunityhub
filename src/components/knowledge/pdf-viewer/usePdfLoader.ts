
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

        console.log('Loading PDF from URL:', url);
        
        // Check if URL is valid
        if (!url || url === 'null' || url === 'undefined') {
          throw new Error('Invalid PDF URL provided');
        }

        // Load PDF with additional options for CORS
        const loadingTask = pdfjsLib.getDocument({
          url,
          withCredentials: false,
          disableRange: true, // Disable range requests to avoid CORS issues
          disableStream: true // Disable streaming to avoid CORS issues
        });
        
        const pdf = await loadingTask.promise;
        
        console.log('PDF loaded successfully, pages:', pdf.numPages);
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setCurrentPage(1);
      } catch (error: any) {
        console.error('Error loading PDF:', error);
        
        // More specific error messages
        let errorMessage = 'Failed to load PDF document.';
        
        if (error.message?.includes('CORS')) {
          errorMessage = 'PDF loading blocked by CORS policy. The document may not be accessible.';
        } else if (error.message?.includes('Invalid PDF')) {
          errorMessage = 'The document appears to be corrupted or is not a valid PDF.';
        } else if (error.message?.includes('404')) {
          errorMessage = 'PDF document not found. It may have been moved or deleted.';
        } else if (error.message?.includes('Invalid PDF URL')) {
          errorMessage = 'Invalid PDF URL. Please try refreshing the page.';
        }
        
        setError(errorMessage);
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
