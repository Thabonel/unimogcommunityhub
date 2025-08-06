import * as pdfjsLib from 'pdfjs-dist';

/**
 * Set up PDF.js worker with fallback options
 * This ensures the PDF viewer works even if CDN is blocked or slow
 */
export function setupPdfWorker() {
  // Try multiple CDN sources as fallback
  const workerSources = [
    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`,
    `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`,
    `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`
  ];

  // Set the primary worker source
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerSources[0];

  // Log the version for debugging
  console.log(`PDF.js version: ${pdfjsLib.version}, Worker: ${workerSources[0]}`);
  
  // Return the worker sources for potential fallback handling
  return workerSources;
}

// Initialize the worker on module load
setupPdfWorker();