import * as pdfjsLib from 'pdfjs-dist';

/**
 * Simple PDF.js worker setup that works reliably across all environments
 * Keeps the embedded PDF viewer working without complex async logic
 */
export function setupPdfWorker() {
  try {
    // Simple, reliable worker setup - use local file first
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
    return false;
  }
}

// Initialize the worker on module load
const workerSetup = setupPdfWorker();
if (!workerSetup) {
  console.error('❌ PDF.js worker setup failed completely - PDF viewer may not work');
}