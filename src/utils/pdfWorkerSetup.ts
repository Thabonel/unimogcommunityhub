import * as pdfjsLib from 'pdfjs-dist';

/**
 * Test if a worker URL is accessible
 */
async function testWorkerUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Set up PDF.js worker with comprehensive fallback strategy
 * Handles development, staging, and production environments with pre-validation
 */
export async function setupPdfWorker(): Promise<boolean> {
  try {
    // Environment-aware worker strategy with explicit domain checking
    const hostname = window.location.hostname;
    const isProduction = hostname === 'unimogcommunityhub.netlify.app' || 
                         hostname === 'www.unimogcommunityhub.netlify.app' ||
                         (hostname !== 'localhost' && 
                          !hostname.includes('staging') && 
                          !hostname.includes('127.0.0.1') &&
                          !hostname.includes('preview'));
    
    // Comprehensive worker fallback strategy with production prioritization
    const workerOptions = [
      // Production: Start with most reliable CDN options
      ...(isProduction ? [
        `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`,
        `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`,
      ] : []),
      // Local options (work better in dev/staging)
      '/pdf.worker.min.js',
      './pdf.worker.min.js',
      // Additional CDN fallbacks
      `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`,
      `https://jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`,
    ];
    
    console.log(`🔍 Environment: ${isProduction ? 'Production' : 'Development/Staging'}`);
    console.log(`📋 Testing ${workerOptions.length} worker options...`);
    
    // Try to find a working worker
    for (let i = 0; i < workerOptions.length; i++) {
      const workerSrc = workerOptions[i];
      
      try {
        // For local files, skip URL test as fetch might fail due to CORS
        if (workerSrc.startsWith('/') || workerSrc.startsWith('./')) {
          console.log(`🔧 Trying local worker: ${workerSrc}`);
        } else {
          console.log(`🔧 Testing CDN worker: ${workerSrc}`);
          const isAccessible = await testWorkerUrl(workerSrc);
          if (!isAccessible) {
            console.log(`❌ Worker not accessible: ${workerSrc}`);
            continue;
          }
        }
        
        // Set the worker source
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
        
        // Clear any existing worker port to avoid conflicts
        pdfjsLib.GlobalWorkerOptions.workerPort = null;
        
        // Store remaining fallback options for runtime error recovery
        (pdfjsLib.GlobalWorkerOptions as any).fallbackWorkers = workerOptions.slice(i + 1);
        
        console.log(`✅ PDF.js worker configured: version ${pdfjsLib.version}`);
        console.log(`✅ Selected worker source: ${workerSrc}`);
        console.log(`📋 Remaining fallbacks: ${workerOptions.length - i - 1}`);
        
        return true;
      } catch (error) {
        console.log(`❌ Worker failed: ${workerSrc}`, error);
        continue;
      }
    }
    
    console.error('❌ All worker options failed');
    return false;
  } catch (error) {
    console.error('❌ Failed to setup PDF.js worker:', error);
    return false;
  }
}

/**
 * Synchronous wrapper for backward compatibility
 */
export function setupPdfWorkerSync(): boolean {
  // For immediate use, set a reasonable default and let async function optimize later
  const isProduction = typeof window !== 'undefined' && (() => {
    const hostname = window.location.hostname;
    return hostname === 'unimogcommunityhub.netlify.app' || 
           hostname === 'www.unimogcommunityhub.netlify.app' ||
           (hostname !== 'localhost' && 
            !hostname.includes('staging') && 
            !hostname.includes('127.0.0.1') &&
            !hostname.includes('preview'));
  })();
  
  const defaultWorker = isProduction 
    ? `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`
    : '/pdf.worker.min.js';
  
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = defaultWorker;
    pdfjsLib.GlobalWorkerOptions.workerPort = null;
    
    console.log(`⚡ Quick worker setup: ${defaultWorker}`);
    
    // Optimize in background
    setupPdfWorker().catch(console.error);
    
    return true;
  } catch (error) {
    console.error('❌ Quick worker setup failed:', error);
    return false;
  }
}

// Initialize the worker on module load
// Use sync version for immediate setup, async optimization happens in background
const workerSetup = setupPdfWorkerSync();
if (!workerSetup) {
  console.error('❌ PDF.js worker setup failed completely - PDF viewer may not work');
}