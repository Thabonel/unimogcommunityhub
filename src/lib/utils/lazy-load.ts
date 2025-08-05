import { lazy, LazyExoticComponent, ComponentType } from 'react';

/**
 * Enhanced lazy loading with retry logic
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  retries = 3,
  delay = 1000
): LazyExoticComponent<T> {
  return lazy(() =>
    importFunc().catch((error) => {
      if (retries > 0) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(lazyWithRetry(importFunc, retries - 1, delay * 2)._payload._result);
          }, delay);
        });
      }
      throw error;
    })
  );
}

/**
 * Preload a lazy component
 */
export function preloadComponent(
  lazyComponent: LazyExoticComponent<any>
): void {
  try {
    // Access the internal promise to trigger loading
    const componentModule = (lazyComponent as any)._payload;
    if (componentModule && typeof componentModule._result === 'function') {
      componentModule._result();
    }
  } catch (error) {
    // Ignore errors during preload
    console.debug('Component preload failed:', error);
  }
}