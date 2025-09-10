import * as pdfjsLib from 'pdfjs-dist';

/**
 * Set up PDF.js worker with comprehensive fallback strategy
 * Handles development, staging, and production environments
 */
export function setupPdfWorker() {
  try {
    // Comprehensive worker fallback strategy
    const workerOptions = [
      // Option 1: Local worker file (works in development and should work in production)
      '/pdf.worker.min.js',
      // Option 2: Try different local paths for different deployment scenarios
      './pdf.worker.min.js',
      // Option 3: Try CDN with .js extension for compatibility
      `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`,
      // Option 4: Try CDN with .mjs extension (newer format)
      `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`,
      // Option 5: Legacy CDN path as final fallback
      `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
    ];
    
    // Start with the first worker option
    const workerSrc = workerOptions[0];
    
    // Set the worker source
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
    
    // Clear any existing worker port to avoid conflicts
    pdfjsLib.GlobalWorkerOptions.workerPort = null;
    
    // Store fallback options for use in error recovery
    (pdfjsLib.GlobalWorkerOptions as any).fallbackWorkers = workerOptions.slice(1);
    
    console.log(`✅ PDF.js worker configured: version ${pdfjsLib.version}`);
    console.log(`Primary worker source: ${workerSrc}`);
    console.log(`Fallback workers available: ${workerOptions.length - 1}`);
    
    return true;
  } catch (error) {
    console.error('❌ Failed to setup PDF.js worker:', error);
    return false;
  }
}

// Initialize the worker on module load
const workerSetup = setupPdfWorker();
if (!workerSetup) {
  console.error('❌ PDF.js worker setup failed completely - PDF viewer may not work');
}