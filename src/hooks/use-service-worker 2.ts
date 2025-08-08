import { useEffect, useState, useCallback } from 'react';

interface UseServiceWorkerOptions {
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook to manage service worker registration and updates
 */
export function useServiceWorker(options: UseServiceWorkerOptions = {}) {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isOfflineReady, setIsOfflineReady] = useState(false);

  const { onUpdate, onSuccess, onError } = options;

  // Register service worker
  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      console.log('[Service Worker] Not supported');
      return;
    }

    const registerServiceWorker = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/service-worker.js', {
          scope: '/',
        });

        setRegistration(reg);

        // Check if this is the first installation
        if (reg.installing) {
          console.log('[Service Worker] Installing for the first time');
        }

        // Handle updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New update available
                setIsUpdateAvailable(true);
                if (onUpdate) onUpdate(reg);
              } else {
                // First install
                setIsOfflineReady(true);
                if (onSuccess) onSuccess(reg);
              }
            }
          });
        });

        // Check for updates periodically
        setInterval(() => {
          reg.update();
        }, 60 * 60 * 1000); // Every hour

      } catch (error) {
        console.error('[Service Worker] Registration failed:', error);
        if (onError) onError(error as Error);
      }
    };

    registerServiceWorker();

    // Cleanup
    return () => {
      // Service workers persist, so no cleanup needed
    };
  }, [onUpdate, onSuccess, onError]);

  // Skip waiting and activate new service worker
  const skipWaiting = useCallback(() => {
    if (!registration?.waiting) return;

    // Send message to service worker to skip waiting
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });

    // Listen for controlling service worker to change
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }, [registration]);

  // Cache specific URLs
  const cacheUrls = useCallback(async (urls: string[]) => {
    if (!navigator.serviceWorker.controller) {
      console.warn('[Service Worker] No active service worker');
      return;
    }

    navigator.serviceWorker.controller.postMessage({
      type: 'CACHE_URLS',
      urls,
    });
  }, []);

  // Get cache storage info
  const getCacheInfo = useCallback(async () => {
    if (!('storage' in navigator && 'estimate' in navigator.storage)) {
      return null;
    }

    const estimate = await navigator.storage.estimate();
    const caches = await window.caches.keys();
    
    return {
      usage: estimate.usage || 0,
      quota: estimate.quota || 0,
      percentage: ((estimate.usage || 0) / (estimate.quota || 1)) * 100,
      cacheNames: caches,
    };
  }, []);

  // Clear all caches
  const clearCaches = useCallback(async () => {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    console.log('[Service Worker] All caches cleared');
  }, []);

  return {
    registration,
    isUpdateAvailable,
    isOfflineReady,
    skipWaiting,
    cacheUrls,
    getCacheInfo,
    clearCaches,
  };
}

/**
 * Hook to show service worker update prompt
 */
export function useServiceWorkerPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  const { skipWaiting } = useServiceWorker({
    onUpdate: (reg) => {
      setRegistration(reg);
      setShowPrompt(true);
    },
  });

  const handleUpdate = () => {
    skipWaiting();
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  return {
    showPrompt,
    handleUpdate,
    handleDismiss,
  };
}