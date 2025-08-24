import { ComponentType, lazy } from 'react';

// Track app version for cache busting
const APP_VERSION = import.meta.env.VITE_APP_VERSION || 'unknown';
const VERSION_KEY = 'app-version';
const REFRESH_KEY = 'app-refreshed-for-version';

/**
 * Silent retry mechanism for lazy loading
 * Handles chunk loading failures professionally without user-visible errors
 */
async function retryImport<T>(
  fn: () => Promise<T>,
  retriesLeft = 3,
  delay = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (retriesLeft === 0) {
      // Check if this is a chunk loading error
      if (error.message && error.message.includes('Failed to fetch dynamically imported module')) {
        // Check version mismatch
        const storedVersion = localStorage.getItem(VERSION_KEY);
        const hasRefreshedForVersion = sessionStorage.getItem(REFRESH_KEY) === APP_VERSION;
        
        if (storedVersion !== APP_VERSION && !hasRefreshedForVersion) {
          // New deployment detected, refresh silently
          localStorage.setItem(VERSION_KEY, APP_VERSION);
          sessionStorage.setItem(REFRESH_KEY, APP_VERSION);
          window.location.reload();
          // This won't execute but satisfies TypeScript
          return Promise.reject(error);
        }
      }
      throw error;
    }
    
    // Silent retry with exponential backoff
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryImport(fn, retriesLeft - 1, delay * 2);
  }
}

/**
 * Enhanced lazy loading with silent retry logic
 * Transparently handles deployment-related chunk loading failures
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return lazy(() => retryImport(componentImport));
}

/**
 * Helper function for lazy loading components with named exports and retry
 */
export function lazyImportWithRetry<
  T extends ComponentType<any>,
  I extends { [K2 in K]: T },
  K extends keyof I
>(factory: () => Promise<I>, name: K): I {
  return Object.create({
    [name]: lazy(() => 
      retryImport(() => factory().then((module) => ({ default: module[name] })))
    ),
  });
}

/**
 * Preload a lazy component to avoid runtime loading failures
 * Call this when you know a component will be needed soon
 */
export function preloadComponent(
  componentImport: () => Promise<any>
): void {
  // Silently preload in the background
  componentImport().catch(() => {
    // Ignore errors during preload - component will retry when actually needed
  });
}

// Initialize version tracking
if (typeof window !== 'undefined') {
  const currentVersion = localStorage.getItem(VERSION_KEY);
  if (!currentVersion) {
    localStorage.setItem(VERSION_KEY, APP_VERSION);
  }
}