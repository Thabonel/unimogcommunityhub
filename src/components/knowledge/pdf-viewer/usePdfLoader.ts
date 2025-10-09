
import { useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';

interface UsePdfLoaderProps {
  url: string;
  setPdfDoc: (doc: PDFDocumentProxy | null) => void;
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
    const maxRetries = 2;
    
    const baseUrl = import.meta.env.BASE_URL ?? '/';
    const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    const localPdfAssetsBase = `${normalizedBaseUrl}pdfjs/`;

    const cMapSources = [
      `${localPdfAssetsBase}cmaps/`,
      `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
      `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
      `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/cmaps/`
    ];

    const standardFontSources = [
      `${localPdfAssetsBase}standard_fonts/`,
      `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/standard_fonts/`,
      `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/standard_fonts/`
    ];

    const resolveCMapUrl = (attempt: number) => {
      if (attempt <= cMapSources.length) {
        return cMapSources[attempt - 1];
      }
      return cMapSources[cMapSources.length - 1];
    };

    const resolveStandardFontUrl = (attempt: number) => {
      if (attempt <= standardFontSources.length) {
        return standardFontSources[attempt - 1];
      }
      return undefined;
    };

    const loadPdf = async (attempt = 1) => {
      try {
        setIsLoading(true);
        setError(null);

        console.info(`📄 Loading PDF (attempt ${attempt}/${maxRetries + 1}):`, url);
        
        // Check if URL is valid
        if (!url || url === 'null' || url === 'undefined') {
          throw new Error('Invalid PDF URL provided');
        }

        // Worker is already configured globally by pdfjs-dist 3.11.174

        // Load PDF with robust options and multiple fallback strategies
        const standardFontDataUrl = resolveStandardFontUrl(attempt);
        const cMapUrl = resolveCMapUrl(attempt);

        const loadingOptions = {
          url,
          withCredentials: false,
          disableRange: attempt > 1, // Disable range requests on retries
          disableStream: attempt > 2, // Disable streaming on final attempt
          isEvalSupported: false, // Disable eval for security
          disableAutoFetch: attempt > 1, // Disable auto fetching on retries
          disableFontFace: !standardFontDataUrl, // Disable font loading when no source available
          useSystemFonts: !standardFontDataUrl, // Rely on system fonts only when we run out of sources
          cMapUrl,
          cMapPacked: true,
          standardFontDataUrl,
          maxImageSize: attempt > 1 ? 1024 * 1024 : -1, // Limit image size on retries
          verbosity: attempt > 2 ? 0 : 1 // Reduce logging on final attempt
        };

        console.info(`🔧 PDF loading options for attempt ${attempt}:`, {
          disableRange: loadingOptions.disableRange,
          disableStream: loadingOptions.disableStream,
          cMapUrl: loadingOptions.cMapUrl,
          standardFontDataUrl: loadingOptions.standardFontDataUrl
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
        
        console.info('✅ PDF loaded successfully:', {
          pages: pdf.numPages,
          version: pdfjsLib.version,
          attempt: attempt
        });
        
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setCurrentPage(1);
        
      } catch (error: unknown) {
        console.error(`❌ PDF loading error (attempt ${attempt}):`, error);

        const errorMessageText = error instanceof Error ? error.message : String(error);

        // Detect specific error types and decide on retry strategy
        const isWorkerError = errorMessageText.includes('WorkerMessageHandler') ||
                             errorMessageText.includes('fake worker') ||
                             errorMessageText.includes('Cannot load script') ||
                             errorMessageText.includes('worker');

        const isNetworkError = errorMessageText.includes('CORS') ||
                              errorMessageText.includes('timeout') ||
                              errorMessageText.includes('fetch');

        const isInvalidUrl = errorMessageText.includes('Invalid PDF URL');
        
        if (isWorkerError) {
          console.info('🔧 Worker-related error detected, will retry with different worker configuration');
        } else if (isNetworkError) {
          console.info('🌐 Network-related error detected, will retry with different loading options');
        }
        
        // If we have retries left, try again with different strategies
        if (attempt <= maxRetries && !isInvalidUrl) {
          const retryDelay = attempt === 1 ? 1000 : 2000; // Longer delay for subsequent retries
          console.info(`🔄 Retrying PDF load in ${retryDelay/1000} second(s)... (${attempt}/${maxRetries})`);
          setTimeout(() => loadPdf(attempt + 1), retryDelay);
          return;
        }
        
        // Generate specific error messages with fallback instructions
        let errorMessage = 'Failed to load PDF document.';
        
        if (isWorkerError) {
          errorMessage = 'PDF viewer initialization failed. Falling back to simple viewer. You can also try refreshing the page.';
        } else if (errorMessageText.includes('timeout')) {
          errorMessage = 'PDF loading timed out. The document may be too large or your connection may be slow. Falling back to simple viewer.';
        } else if (errorMessageText.includes('CORS')) {
          errorMessage = 'PDF loading blocked by security policy. Falling back to simple viewer.';
        } else if (errorMessageText.includes('Invalid PDF')) {
          errorMessage = 'The document appears to be corrupted or is not a valid PDF.';
        } else if (errorMessageText.includes('404') || errorMessageText.includes('Not Found')) {
          errorMessage = 'PDF document not found. It may have been moved or deleted.';
        } else if (isInvalidUrl) {
          errorMessage = 'Invalid PDF URL. Please try refreshing the page.';
        } else {
          errorMessage = 'Advanced PDF viewer failed to load. Falling back to simple viewer.';
        }
        
        console.error(`💥 Final PDF loading failure:`, errorMessage);
        console.info('🔄 The page will automatically fall back to the simple PDF viewer');
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
