
import { Suspense, useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { router } from '@/routes';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import LoadingScreen from '@/components/common/LoadingScreen';
import { LocalizationProvider } from '@/contexts/LocalizationContext';
import { MapTokenProvider } from '@/contexts/MapTokenContext';
import { CountrySelectionModal } from '@/components/localization/CountrySelectionModal';
import { ErrorBoundary } from '@/components/error-boundary';
import ChunkErrorBoundary from '@/components/ChunkErrorBoundary';
import { OfflineIndicator } from '@/components/ui/offline-indicator';
import { useServiceWorker } from '@/hooks/use-service-worker';
import { useOffline } from '@/hooks/use-offline';
import { processOfflineQueue } from '@/services/offline/offlineSync';
import HealthMonitor from '@/components/HealthMonitor';
import { EnvDiagnostic } from '@/components/EnvDiagnostic';
import '@/styles/global.css';
import '@/styles/fonts.css';
import i18nPromise from '@/lib/i18n';
import { syncMapboxTokenToStorage, debugMapboxTokenStatus } from '@/utils/mapbox-helper';
import { logger } from '@/utils/logger';
import { initializeFontLoader } from '@/utils/fontLoader';
import { UpdateNotification } from '@/components/ui/update-notification';
import type { i18n as I18nType } from 'i18next';
import '@/utils/versionDetector'; // Re-enabled - loop fixed with sessionStorage guard

function App() {
  const [i18nInitialized, setI18nInitialized] = useState(false);
  const [i18nInstance, setI18nInstance] = useState<I18nType | null>(null);
  
  // Initialize service worker
  useServiceWorker({
    onSuccess: () => {
      logger.info('Service Worker registered successfully', { component: 'App', action: 'sw_register' });
    },
    onUpdate: () => {
      logger.info('Service Worker update available', { component: 'App', action: 'sw_update' });
    },
  });
  
  // Handle offline/online status
  const { isOnline } = useOffline({
    onOnline: async () => {
      logger.info('Back online, processing offline queue', { component: 'App', action: 'back_online' });
      await processOfflineQueue();
    },
    onOffline: () => {
      logger.info('Gone offline', { component: 'App', action: 'gone_offline' });
    },
  });

  useEffect(() => {
    // Initialize i18n before rendering the app
    const initializeI18n = async () => {
      const i18n = await i18nPromise;
      setI18nInstance(i18n);
      setI18nInitialized(true);
    };

    initializeI18n();

    // Initialize font loader to prevent blank page issues
    initializeFontLoader();

    // Add global error handler for chunk loading failures
    window.addEventListener('error', (event) => {
      const error = event.error || event;
      if (
        error?.message?.includes('Loading chunk') ||
        error?.message?.includes('module script') ||
        error?.message?.includes('Failed to fetch dynamically imported module') ||
        error?.message?.includes('dynamically imported') ||
        event.filename?.includes('.js') && event.message?.includes('MIME type')
      ) {
        console.error('Chunk loading error detected:', error);
        // Selectively clear ONLY app caches - preserve external CDN and static resources
        if ('caches' in window) {
          caches.keys().then(cacheNames => {
            const appCachesOnly = cacheNames.filter(cacheName =>
              // Only delete our app's dynamic caches
              cacheName.startsWith('unimog-hub-dynamic-') ||
              cacheName.startsWith('workbox-') ||
              (cacheName.startsWith('unimog-hub-') && cacheName.includes('dynamic'))
            );

            Promise.all(appCachesOnly.map(cache => {
              console.log('[Cache Clear] Deleting app cache:', cache);
              return caches.delete(cache);
            })).then(() => {
              console.log('[Cache Clear] Cleared', appCachesOnly.length, 'app caches, preserving external resources');
              setTimeout(() => window.location.reload(), 100);
            });
          });
        } else {
          setTimeout(() => window.location.reload(), 100);
        }
      }
    });

    // Add handler for unhandled promise rejections (dynamic import failures)
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason;
      if (
        error?.message?.includes('Failed to fetch dynamically imported module') ||
        error?.message?.includes('Loading chunk') ||
        error?.message?.includes('dynamically imported')
      ) {
        console.error('Dynamic import error detected:', error);
        // Prevent the error from being logged as unhandled
        event.preventDefault();

        // Selectively clear ONLY app caches - preserve external CDN and static resources
        if ('caches' in window) {
          caches.keys().then(cacheNames => {
            const appCachesOnly = cacheNames.filter(cacheName =>
              // Only delete our app's dynamic caches
              cacheName.startsWith('unimog-hub-dynamic-') ||
              cacheName.startsWith('workbox-') ||
              (cacheName.startsWith('unimog-hub-') && cacheName.includes('dynamic'))
            );

            Promise.all(appCachesOnly.map(cache => {
              console.log('[Cache Clear] Deleting app cache:', cache);
              return caches.delete(cache);
            })).then(() => {
              console.log('[Cache Clear] Cleared', appCachesOnly.length, 'app caches, preserving external resources');
              setTimeout(() => window.location.reload(), 100);
            });
          });
        } else {
          setTimeout(() => window.location.reload(), 100);
        }
      }
    });
    
    // Sync Mapbox token from environment to localStorage if needed
    syncMapboxTokenToStorage();
    
    // Debug token status in development
    if (import.meta.env.DEV) {
      debugMapboxTokenStatus();
    }
  }, []);

  // Show loading screen while i18n is initializing
  if (!i18nInitialized || !i18nInstance) {
    return <LoadingScreen />;
  }

  return (
    <ChunkErrorBoundary>
      <ErrorBoundary>
        <I18nextProvider i18n={i18nInstance}>
          <Suspense fallback={<LoadingScreen />}>
            <TooltipProvider delayDuration={400}>
              <div>
                <EnvDiagnostic />
                <AuthProvider>
                  <LocalizationProvider>
                    <MapTokenProvider>
                      <RouterProvider router={router} />
                      <Toaster />
                      <CountrySelectionModal />
                      <OfflineIndicator />
                      <UpdateNotification />
                      {/* Only show HealthMonitor in development/staging, NEVER in production */}
                      {!import.meta.env.PROD && <HealthMonitor />}
                    </MapTokenProvider>
                  </LocalizationProvider>
                </AuthProvider>
              </div>
            </TooltipProvider>
          </Suspense>
        </I18nextProvider>
      </ErrorBoundary>
    </ChunkErrorBoundary>
  );
}

export default App;
