
import { Suspense, useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import LoadingScreen from '@/components/common/LoadingScreen';
import { LocalizationProvider } from '@/contexts/LocalizationContext';
import { MapTokenProvider } from '@/contexts/MapTokenContext';
import { CountrySelectionModal } from '@/components/localization/CountrySelectionModal';
import EnvironmentStatus from '@/components/debug/EnvironmentStatus';
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
import { initializeVersionManager } from '@/utils/versionManager';
import { initializeFontLoader } from '@/utils/fontLoader';
import { UpdateNotification } from '@/components/ui/update-notification';
import '@/utils/versionDetector';

function App() {
  const [i18nInitialized, setI18nInitialized] = useState(false);
  
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
      await i18nPromise;
      setI18nInitialized(true);
    };

    initializeI18n();
    
    // Initialize version manager for handling deployment updates
    initializeVersionManager();

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
        // Selectively clear caches and reload
        if ('caches' in window) {
          caches.keys().then(cacheNames => {
            cacheNames.forEach(cacheName => {
              // Enhanced cache clearing - preserve font, static assets, and Google caches
              if (!cacheName.includes('font') && 
                  !cacheName.includes('google') && 
                  !cacheName.includes('static') &&
                  !cacheName.includes('assets')) {
                caches.delete(cacheName);
              }
            });
            setTimeout(() => window.location.reload(), 100);
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
        
        // Clear caches and reload
        if ('caches' in window) {
          caches.keys().then(cacheNames => {
            cacheNames.forEach(cacheName => {
              // Enhanced cache clearing - preserve font, static assets, and Google caches
              if (!cacheName.includes('font') && 
                  !cacheName.includes('google') && 
                  !cacheName.includes('static') &&
                  !cacheName.includes('assets')) {
                caches.delete(cacheName);
              }
            });
            setTimeout(() => window.location.reload(), 100);
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
  if (!i18nInitialized) {
    return <LoadingScreen />;
  }

  return (
    <ChunkErrorBoundary>
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <TooltipProvider delayDuration={400}>
            <div>
              <EnvironmentStatus />
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
      </ErrorBoundary>
    </ChunkErrorBoundary>
  );
}

export default App;
