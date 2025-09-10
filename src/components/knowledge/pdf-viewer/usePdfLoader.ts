
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
    let retryCount = 0;
    const maxRetries = 2;
    
    const loadPdf = async (attempt = 1) => {
      try {
        setIsLoading(true);
        setError(null);

        console.log(`📄 Loading PDF (attempt ${attempt}/${maxRetries + 1}):`, url);
        
        // Check if URL is valid
        if (!url || url === 'null' || url === 'undefined') {
          throw new Error('Invalid PDF URL provided');
        }

        // Load PDF with optimized options for Supabase compatibility
        const loadingTask = pdfjsLib.getDocument({
          url,
          withCredentials: false,
          disableRange: false, // Enable range requests
          disableStream: false, // Enable streaming
          isEvalSupported: false, // Disable eval for security
          disableAutoFetch: false, // Allow auto fetching
          disableFontFace: false, // Allow font loading
          // Use matching version in CDN paths
          cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
          cMapPacked: true,
          standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/standard_fonts/`
        });
        
        const pdf = await loadingTask.promise;
        
        console.log('✅ PDF loaded successfully:', {
          pages: pdf.numPages,
          version: pdfjsLib.version,
          attempt: attempt
        });
        
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setCurrentPage(1);
        
      } catch (error: any) {
        console.error(`❌ PDF loading error (attempt ${attempt}):`, error);
        
        // Handle worker setup errors specifically
        if (error.message?.includes('WorkerMessageHandler') || error.message?.includes('fake worker')) {
          console.log('🔧 Worker setup error detected, trying fallback workers...');
          
          // Try fallback workers if available
          const fallbackWorkers = (pdfjsLib.GlobalWorkerOptions as any).fallbackWorkers;
          if (fallbackWorkers && fallbackWorkers.length > 0) {
            const nextWorker = fallbackWorkers.shift();
            try {
              pdfjsLib.GlobalWorkerOptions.workerSrc = nextWorker;
              console.log(`🔄 Trying fallback worker: ${nextWorker}`);
              
              if (attempt <= maxRetries) {
                setTimeout(() => loadPdf(attempt + 1), 1000);
                return;
              }
            } catch (workerError) {
              console.error('❌ Fallback worker failed:', workerError);
            }
          } else {
            // No more fallback workers, try manual fallbacks
            const manualFallbacks = [
              './pdf.worker.min.js',
              `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`,
              `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
            ];
            
            if (attempt <= maxRetries && manualFallbacks.length > 0) {
              const fallbackWorker = manualFallbacks[attempt - 1] || manualFallbacks[0];
              try {
                pdfjsLib.GlobalWorkerOptions.workerSrc = fallbackWorker;
                console.log(`🔄 Trying manual fallback worker (attempt ${attempt}): ${fallbackWorker}`);
                setTimeout(() => loadPdf(attempt + 1), 1000);
                return;
              } catch (workerError) {
                console.error('❌ Manual fallback worker failed:', workerError);
              }
            }
          }
        }
        
        // If we have retries left for other errors, try again
        if (attempt <= maxRetries && !error.message?.includes('Invalid PDF URL')) {
          console.log(`🔄 Retrying PDF load in 1 second... (${attempt}/${maxRetries})`);
          setTimeout(() => loadPdf(attempt + 1), 1000);
          return;
        }
        
        // Generate specific error messages
        let errorMessage = 'Failed to load PDF document.';
        
        if (error.message?.includes('WorkerMessageHandler') || error.message?.includes('fake worker')) {
          errorMessage = 'PDF viewer initialization failed. Please refresh the page and try again.';
        } else if (error.message?.includes('CORS')) {
          errorMessage = 'PDF loading blocked by CORS policy. The document may not be accessible.';
        } else if (error.message?.includes('Invalid PDF')) {
          errorMessage = 'The document appears to be corrupted or is not a valid PDF.';
        } else if (error.message?.includes('404') || error.message?.includes('Not Found')) {
          errorMessage = 'PDF document not found. It may have been moved or deleted.';
        } else if (error.message?.includes('Invalid PDF URL')) {
          errorMessage = 'Invalid PDF URL. Please try refreshing the page.';
        }
        
        console.error(`💥 Final PDF loading failure:`, errorMessage);
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
