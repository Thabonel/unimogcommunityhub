import { useEffect, useRef } from 'react';
import { pdfjs } from 'react-pdf';
import { ManualReference } from './use-simple-barry';

/**
 * Preloads PDF files in the background for faster rendering
 * Uses PDF.js to fetch and cache PDFs before user clicks on them
 */
export function usePdfPreloader(manualReferences: ManualReference[]) {
  const preloadedUrls = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!manualReferences || manualReferences.length === 0) return;

    // Preload each PDF in the background
    manualReferences.forEach((ref) => {
      const pdfUrl = ref.storage_url?.split('#')[0]; // Remove #page= fragment

      if (!pdfUrl || preloadedUrls.current.has(pdfUrl)) {
        return; // Skip if no URL or already preloaded
      }

      // Mark as preloaded to avoid duplicates
      preloadedUrls.current.add(pdfUrl);

      // Start preloading in background
      console.log(`[PDF Preloader] Starting preload for: ${pdfUrl}`);

      const loadingTask = pdfjs.getDocument({
        url: pdfUrl,
        httpHeaders: {},
        withCredentials: false,
        // Use range requests to only fetch needed pages
        disableRange: false,
        disableStream: false
      });

      loadingTask.promise
        .then((pdf) => {
          console.log(`[PDF Preloader] Successfully preloaded: ${pdfUrl} (${pdf.numPages} pages)`);
          // PDF is now cached by browser and PDF.js
        })
        .catch((error) => {
          console.warn(`[PDF Preloader] Failed to preload ${pdfUrl}:`, error);
          // Remove from preloaded set so we can retry later
          preloadedUrls.current.delete(pdfUrl);
        });
    });
  }, [manualReferences]);

  // Return function to clear cache if needed
  return {
    clearPreloadCache: () => {
      preloadedUrls.current.clear();
    }
  };
}
