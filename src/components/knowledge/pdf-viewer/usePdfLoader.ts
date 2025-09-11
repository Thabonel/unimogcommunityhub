
import { useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { setupPdfWorker, setupPdfWorkerSync } from '@/utils/pdfWorkerSetup';

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

        // Attempt to reconfigure worker on retry attempts
        if (attempt > 1) {
          console.log(`🔧 Reconfiguring PDF worker for attempt ${attempt}`);
          try {
            await setupPdfWorker();
          } catch (workerError) {
            console.warn('Worker reconfiguration failed, continuing with existing setup:', workerError);
            setupPdfWorkerSync(); // Fallback to sync setup
          }
        }

        // Load PDF with robust options and multiple fallback strategies
        const loadingOptions = {
          url,
          withCredentials: false,
          disableRange: attempt > 1, // Disable range requests on retries
          disableStream: attempt > 2, // Disable streaming on final attempt
          isEvalSupported: false, // Disable eval for security
          disableAutoFetch: attempt > 1, // Disable auto fetching on retries
          disableFontFace: attempt > 2, // Disable font loading on final attempt
          useSystemFonts: attempt > 1, // Use system fonts on retries
          // Use multiple CDN fallbacks for resources
          cMapUrl: attempt === 1 
            ? `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`
            : attempt === 2 
            ? `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/cmaps/`
            : `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/cmaps/`,
          cMapPacked: true,
          standardFontDataUrl: attempt === 1 
            ? `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/standard_fonts/`
            : attempt === 2 
            ? `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/standard_fonts/`
            : undefined, // Skip font data on final attempt
          maxImageSize: attempt > 1 ? 1024 * 1024 : -1, // Limit image size on retries
          verbosity: attempt > 2 ? 0 : 1 // Reduce logging on final attempt
        };

        console.log(`🔧 PDF loading options for attempt ${attempt}:`, {
          disableRange: loadingOptions.disableRange,
          disableStream: loadingOptions.disableStream,
          cMapUrl: loadingOptions.cMapUrl
        });
        
        const loadingTask = pdfjsLib.getDocument(loadingOptions);
        
        // Add timeout to prevent hanging
        const pdfPromise = Promise.race([
          loadingTask.promise,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('PDF loading timeout')), 30000)
          )
        ]);
        
        const pdf = await pdfPromise;
        
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
        
        // Detect specific error types and decide on retry strategy
        const isWorkerError = error.message?.includes('WorkerMessageHandler') || 
                             error.message?.includes('fake worker') ||
                             error.message?.includes('Cannot load script') ||
                             error.message?.includes('worker');
                             
        const isNetworkError = error.message?.includes('CORS') ||
                              error.message?.includes('timeout') ||
                              error.message?.includes('fetch');
                              
        const isInvalidUrl = error.message?.includes('Invalid PDF URL');
        
        if (isWorkerError) {
          console.log('🔧 Worker-related error detected, will retry with different worker configuration');
        } else if (isNetworkError) {
          console.log('🌐 Network-related error detected, will retry with different loading options');
        }
        
        // If we have retries left, try again with different strategies
        if (attempt <= maxRetries && !isInvalidUrl) {
          const retryDelay = attempt === 1 ? 1000 : 2000; // Longer delay for subsequent retries
          console.log(`🔄 Retrying PDF load in ${retryDelay/1000} second(s)... (${attempt}/${maxRetries})`);
          setTimeout(() => loadPdf(attempt + 1), retryDelay);
          return;
        }
        
        // Generate specific error messages with fallback instructions
        let errorMessage = 'Failed to load PDF document.';
        
        if (isWorkerError) {
          errorMessage = 'PDF viewer initialization failed. Falling back to simple viewer. You can also try refreshing the page.';
        } else if (error.message?.includes('timeout')) {
          errorMessage = 'PDF loading timed out. The document may be too large or your connection may be slow. Falling back to simple viewer.';
        } else if (error.message?.includes('CORS')) {
          errorMessage = 'PDF loading blocked by security policy. Falling back to simple viewer.';
        } else if (error.message?.includes('Invalid PDF')) {
          errorMessage = 'The document appears to be corrupted or is not a valid PDF.';
        } else if (error.message?.includes('404') || error.message?.includes('Not Found')) {
          errorMessage = 'PDF document not found. It may have been moved or deleted.';
        } else if (isInvalidUrl) {
          errorMessage = 'Invalid PDF URL. Please try refreshing the page.';
        } else {
          errorMessage = 'Advanced PDF viewer failed to load. Falling back to simple viewer.';
        }
        
        console.error(`💥 Final PDF loading failure:`, errorMessage);
        console.log('🔄 The page will automatically fall back to the simple PDF viewer');
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
