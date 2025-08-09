/**
 * Supabase Error Handler
 * Prevents infinite retry loops and handles API key errors gracefully
 */

let errorCount = 0;
let lastErrorTime = 0;
const ERROR_THRESHOLD = 5; // Max errors in time window
const TIME_WINDOW = 5000; // 5 seconds
const COOLDOWN_PERIOD = 30000; // 30 seconds

export function handleSupabaseError(error: any, context: string = 'Unknown') {
  const now = Date.now();
  
  // Reset counter if outside time window
  if (now - lastErrorTime > TIME_WINDOW) {
    errorCount = 0;
  }
  
  errorCount++;
  lastErrorTime = now;
  
  // If we've hit the threshold, stop retrying
  if (errorCount >= ERROR_THRESHOLD) {
    console.error(`🛑 STOPPING: Too many Supabase errors in ${context}. Entering cooldown.`);
    
    // Clear local storage to force re-authentication
    if (error?.message?.includes('Invalid API key') || error?.message?.includes('401')) {
      console.log('Clearing corrupted session data...');
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('sb-ydevatqwkoccxhtejdor-auth-token');
      
      // Show user-friendly error
      if (typeof window !== 'undefined') {
        const message = `
          ⚠️ Authentication Issue Detected
          
          The app is having trouble connecting to the database.
          Please refresh the page and try logging in again.
          
          If the issue persists:
          1. Clear your browser cache
          2. Close all tabs
          3. Restart your browser
        `;
        
        // Only show one alert
        if (!window.__supabaseErrorShown) {
          window.__supabaseErrorShown = true;
          setTimeout(() => {
            alert(message);
            // Reload the page after alert
            window.location.reload();
          }, 100);
        }
      }
    }
    
    // Return null to stop processing
    return null;
  }
  
  // Log the error but don't throw
  console.warn(`Supabase error in ${context} (${errorCount}/${ERROR_THRESHOLD}):`, error?.message || error);
  
  return error;
}

// Window type extension
declare global {
  interface Window {
    __supabaseErrorShown?: boolean;
  }
}

// Reset error count after cooldown
export function resetErrorCount() {
  errorCount = 0;
  lastErrorTime = 0;
  if (typeof window !== 'undefined') {
    window.__supabaseErrorShown = false;
  }
}