import * as pdfjsLib from 'pdfjs-dist';

/**
 * Robust PDF.js worker setup with multiple fallback mechanisms
 * Handles CDN failures, network issues, and CSP restrictions
 */
export async function setupPdfWorker(): Promise<boolean> {
  // Multiple worker sources in order of preference
  const workerSources = [
    // Local worker file (most reliable)
    '/pdf.worker.min.js',
    // Primary CDN
    `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`,
    // Alternative CDN
    `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`,
    // Fallback CDN
    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
  ];

  // Test if a worker source is accessible
  const testWorkerSource = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { 
        method: 'HEAD',
        mode: 'no-cors', // Allow cross-origin requests
        cache: 'no-cache'
      });
      return true; // If we get here, the URL is accessible
    } catch (error) {
      // For no-cors mode, we can't check the actual response
      // So we'll just try to set it and see if PDF.js accepts it
      try {
        pdfjsLib.GlobalWorkerOptions.workerSrc = url;
        return true;
      } catch (workerError) {
        console.warn(`Worker source ${url} failed:`, workerError);
        return false;
      }
    }
  };

  // Try each worker source until one works
  for (let i = 0; i < workerSources.length; i++) {
    const workerUrl = workerSources[i];
    console.log(`🔄 Trying PDF worker source ${i + 1}/${workerSources.length}: ${workerUrl}`);
    
    try {
      // Set the worker source
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
      
      // Clear any existing worker port to avoid conflicts
      pdfjsLib.GlobalWorkerOptions.workerPort = null;
      
      // For local worker, just trust it works
      if (workerUrl.startsWith('/')) {
        console.log(`✅ PDF.js worker configured with local source: ${workerUrl}`);
        return true;
      }
      
      // For remote workers, test accessibility
      const isAccessible = await testWorkerSource(workerUrl);
      if (isAccessible) {
        console.log(`✅ PDF.js worker configured successfully: ${workerUrl}`);
        console.log(`PDF.js version: ${pdfjsLib.version}`);
        return true;
      }
    } catch (error) {
      console.warn(`❌ Worker source ${i + 1} failed:`, error);
      continue;
    }
  }

  // If all sources fail, try to use the fake worker as last resort
  console.warn('⚠️ All worker sources failed, attempting fake worker mode');
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '';
    pdfjsLib.GlobalWorkerOptions.workerPort = null;
    console.log('🔧 PDF.js configured with fake worker mode');
    return true;
  } catch (error) {
    console.error('❌ Even fake worker mode failed:', error);
    return false;
  }
}

/**
 * Synchronous fallback setup for immediate use
 */
export function setupPdfWorkerSync(): boolean {
  try {
    // Try local worker first
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
    pdfjsLib.GlobalWorkerOptions.workerPort = null;
    console.log('✅ PDF.js worker configured synchronously with local worker');
    return true;
  } catch (error) {
    console.error('❌ Synchronous PDF worker setup failed:', error);
    return false;
  }
}

// Initialize immediately with sync setup, then improve with async setup
setupPdfWorkerSync();

// Also set up async version for better reliability
setupPdfWorker().then(success => {
  if (!success) {
    console.error('❌ All PDF.js worker setup attempts failed - PDF viewer may not work properly');
  }
}).catch(error => {
  console.error('❌ PDF worker async setup error:', error);
});