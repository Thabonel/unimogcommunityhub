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
  
  // Check if this is specifically an auth token issue
  const isAuthError = error?.message?.includes('Invalid API key') || 
                     error?.message?.includes('401') ||
                     error?.message?.includes('JWT') ||
                     error?.message?.includes('token');
  
  // If it's an auth error, try to clear conflicting tokens first
  if (isAuthError && errorCount === 1) {
    console.log('Auth error detected, clearing potentially conflicting tokens...');
    
    // Clear all Supabase-related items from localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('sb-') && key !== 'sb-ydevatqwkoccxhtejdor-auth-token') {
        localStorage.removeItem(key);
        console.log(`Removed conflicting token: ${key}`);
      }
    });
    
    // Clear session storage as well
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('sb-') || key.includes('supabase')) {
        sessionStorage.removeItem(key);
      }
    });
  }
  
  // If we've hit the threshold, stop retrying
  if (errorCount >= ERROR_THRESHOLD) {
    console.error(`🛑 STOPPING: Too many Supabase errors in ${context}. Entering cooldown.`);
    
    // Clear local storage to force re-authentication
    if (isAuthError) {
      console.log('Clearing all session data...');
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('sb-ydevatqwkoccxhtejdor-auth-token');
      
      // Clear ALL sb- prefixed items
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      // Show user-friendly error
      if (typeof window !== 'undefined') {
        const message = `
          ⚠️ Authentication Issue Detected
          
          The app is having trouble connecting to the database.
          Please click "Clear Cache & Reload" button or refresh the page.
          
          If the issue persists:
          1. Clear your browser cache
          2. Close all tabs
          3. Restart your browser
        `;
        
        // Only show one alert
        if (!window.__supabaseErrorShown) {
          window.__supabaseErrorShown = true;
          console.error(message);
          // Don't auto-reload, let user use the Clear Cache button
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