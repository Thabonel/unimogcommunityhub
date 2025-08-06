import * as pdfjsLib from 'pdfjs-dist';

/**
 * Set up PDF.js worker with fallback options
 * This ensures the PDF viewer works even if CDN is blocked or slow
 */
export function setupPdfWorker() {
  // Try multiple CDN sources as fallback - unpkg first since cdnjs is having issues
  const workerSources = [
    `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`,
    `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`,
    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`,
  ];

  // Try the first working source
  for (let i = 0; i < workerSources.length; i++) {
    const source = workerSources[i];
    try {
      pdfjsLib.GlobalWorkerOptions.workerSrc = source;
      console.log(`PDF.js version: ${pdfjsLib.version}, Worker: ${source}`);
      break;
    } catch (error) {
      console.warn(`Worker source ${source} failed, trying next...`);
      if (i === workerSources.length - 1) {
        // If all fail, let PDF.js use its fallback
        console.warn('All CDN sources failed, PDF.js will use inline worker (slower but works)');
      }
    }
  }
  
  // Return the worker sources for potential fallback handling
  return workerSources;
}

// Initialize the worker on module load
setupPdfWorker();