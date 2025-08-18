
import { Suspense, useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import LoadingScreen from '@/components/common/LoadingScreen';
import { LocalizationProvider } from '@/contexts/LocalizationContext';
import { MapTokenProvider } from '@/contexts/MapTokenContext';
import { CountrySelectionModal } from '@/components/localization/CountrySelectionModal';
import EnvironmentStatus from '@/components/debug/EnvironmentStatus';
import { ErrorBoundary } from '@/components/error-boundary';
import { OfflineIndicator } from '@/components/ui/offline-indicator';
import { useServiceWorker } from '@/hooks/use-service-worker';
import { useOffline } from '@/hooks/use-offline';
import { processOfflineQueue } from '@/services/offline/offlineSync';
import HealthMonitor from '@/components/HealthMonitor';
import '@/styles/global.css';
import i18nPromise from '@/lib/i18n';
import { createSystemArticle } from '@/services/articles';
import { syncMapboxTokenToStorage, debugMapboxTokenStatus } from '@/utils/mapbox-helper';
import { logger } from '@/utils/logger';

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
    
    // Sync Mapbox token from environment to localStorage if needed
    syncMapboxTokenToStorage();
    
    // Debug token status in development
    if (import.meta.env.DEV) {
      debugMapboxTokenStatus();
    }
    
    // Add system articles to the database (this will only add them if they don't exist)
    const addSystemArticles = async () => {
      try {
        await createSystemArticle();
        logger.info('System articles initialized', { component: 'App', action: 'system_articles_init' });
      } catch (error) {
        logger.error('Failed to initialize system articles', error, { component: 'App', action: 'system_articles_init' });
      }
    };
    
    addSystemArticles();
  }, []);

  // Show loading screen while i18n is initializing
  if (!i18nInitialized) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <div>
          <EnvironmentStatus />
          <AuthProvider>
            <LocalizationProvider>
              <MapTokenProvider>
                <RouterProvider router={router} />
                <Toaster />
                <CountrySelectionModal />
                <OfflineIndicator />
                {/* Only show HealthMonitor in development/staging, NEVER in production */}
                {!import.meta.env.PROD && <HealthMonitor />}
              </MapTokenProvider>
            </LocalizationProvider>
          </AuthProvider>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
