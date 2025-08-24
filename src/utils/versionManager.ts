/**
 * Version management to handle deployment cache issues
 * Silently handles version changes without user-visible errors
 */

// Generate a version based on build time
const BUILD_VERSION = import.meta.env.VITE_BUILD_VERSION || Date.now().toString();
const VERSION_KEY = 'app-build-version';
const LAST_CHECK_KEY = 'app-version-last-check';
const CHECK_INTERVAL = 5 * 60 * 1000; // Check every 5 minutes

/**
 * Initialize version checking system
 */
export function initializeVersionManager(): void {
  if (typeof window === 'undefined') return;
  
  // Check version on initial load
  checkVersion();
  
  // Set up periodic version checks for long-running sessions
  setInterval(checkVersionSilently, CHECK_INTERVAL);
  
  // Check version when page becomes visible after being hidden
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      checkVersionSilently();
    }
  });
}

/**
 * Check if app version has changed and handle appropriately
 */
function checkVersion(): void {
  const storedVersion = localStorage.getItem(VERSION_KEY);
  
  if (!storedVersion) {
    // First visit or cleared storage
    localStorage.setItem(VERSION_KEY, BUILD_VERSION);
    return;
  }
  
  if (storedVersion !== BUILD_VERSION) {
    // Version mismatch detected
    console.log('New app version detected, updating...');
    localStorage.setItem(VERSION_KEY, BUILD_VERSION);
    
    // Clear any stale session storage
    sessionStorage.clear();
    
    // If we're in the middle of navigation, reload to get fresh chunks
    if (window.location.pathname !== '/') {
      // Give the user a moment to see the current page, then reload
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  }
}

/**
 * Silent version check that doesn't interrupt user
 */
function checkVersionSilently(): void {
  const lastCheck = localStorage.getItem(LAST_CHECK_KEY);
  const now = Date.now();
  
  // Rate limit checks
  if (lastCheck && (now - parseInt(lastCheck)) < CHECK_INTERVAL) {
    return;
  }
  
  localStorage.setItem(LAST_CHECK_KEY, now.toString());
  
  // In production, we could fetch a version endpoint here
  // For now, just check the stored version
  const storedVersion = localStorage.getItem(VERSION_KEY);
  if (storedVersion && storedVersion !== BUILD_VERSION) {
    // New version available, prepare for next navigation
    localStorage.setItem(VERSION_KEY, BUILD_VERSION);
  }
}

/**
 * Clear version data (useful for testing)
 */
export function clearVersionData(): void {
  localStorage.removeItem(VERSION_KEY);
  localStorage.removeItem(LAST_CHECK_KEY);
  sessionStorage.clear();
}