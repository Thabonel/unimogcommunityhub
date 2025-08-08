import { ComponentType, lazy } from 'react';

/**
 * Enhanced lazy loading with retry logic for production
 * This helps handle chunk loading failures due to deployments
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>,
  retries = 3
): React.LazyExoticComponent<T> {
  return lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.sessionStorage.getItem('page-has-been-force-refreshed') || 'false'
    );

    try {
      const component = await componentImport();
      window.sessionStorage.setItem('page-has-been-force-refreshed', 'false');
      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed && retries > 0) {
        // Retry the import
        console.log(`Retrying import, attempts remaining: ${retries}`);
        return lazyWithRetry(componentImport, retries - 1)();
      }
      
      // If we've already tried refreshing, just throw the error
      if (pageHasAlreadyBeenForceRefreshed) {
        throw error;
      }

      // Try one page refresh as a last resort
      window.sessionStorage.setItem('page-has-been-force-refreshed', 'true');
      window.location.reload();
      
      // This will never be reached but TypeScript needs it
      throw error;
    }
  });
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
    [name]: lazyWithRetry(() => 
      factory().then((module) => ({ default: module[name] }))
    ),
  });
}