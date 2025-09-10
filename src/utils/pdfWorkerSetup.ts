import * as pdfjsLib from 'pdfjs-dist';

/**
 * Set up PDF.js worker with robust fallback options
 * This ensures the PDF viewer works even if CDN is blocked or slow
 */
export function setupPdfWorker() {
  try {
    // Use local worker file for reliability
    const localWorker = '/pdf.worker.min.js';
    
    // Set the worker source
    pdfjsLib.GlobalWorkerOptions.workerSrc = localWorker;
    
    // Clear any existing worker port to avoid conflicts
    pdfjsLib.GlobalWorkerOptions.workerPort = null;
    
    console.log(`✅ PDF.js worker configured: version ${pdfjsLib.version}`);
    console.log(`Worker source: ${localWorker}`);
    
    return true;
  } catch (error) {
    console.error('❌ Failed to setup PDF.js worker:', error);
    
    // Emergency fallback - try CDN as backup
    try {
      const cdnWorker = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
      pdfjsLib.GlobalWorkerOptions.workerSrc = cdnWorker;
      console.log('⚠️ Using CDN PDF worker as fallback');
      return true;
    } catch (fallbackError) {
      console.error('❌ CDN PDF worker also failed:', fallbackError);
      return false;
    }
  }
}

// Initialize the worker on module load
const workerSetup = setupPdfWorker();
if (!workerSetup) {
  console.error('❌ PDF.js worker setup failed completely - PDF viewer may not work');
}