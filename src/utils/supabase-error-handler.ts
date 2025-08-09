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
  
  // Only handle specific JWT/session errors, NOT general API key issues
  const isJwtError = error?.message?.includes('JWT expired') || 
                     error?.message?.includes('Invalid JWT') ||
                     error?.message?.includes('refresh_token_not_found');
  
  // Only clear tokens for actual JWT/session errors, not general API key errors
  if (isJwtError && errorCount === 1) {
    console.log('JWT/session error detected, clearing expired tokens...');
    
    // Only clear expired session tokens, not all Supabase storage
    Object.keys(localStorage).forEach(key => {
      if (key.includes('auth-token') && key.includes('sb-')) {
        localStorage.removeItem(key);
        console.log(`Removed expired auth token: ${key}`);
      }
    });
  }
  
  // Log but don't auto-clear on general "Invalid API key" errors
  const isGeneralApiError = error?.message?.includes('Invalid API key');
  if (isGeneralApiError) {
    console.warn('General API key error detected - this may be a configuration issue, not clearing tokens');
  }
  
  // If we've hit the threshold, stop retrying
  if (errorCount >= ERROR_THRESHOLD) {
    console.error(`🛑 STOPPING: Too many Supabase errors in ${context}. Entering cooldown.`);
    
    // Clear local storage to force re-authentication
    if (isJwtError) {
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