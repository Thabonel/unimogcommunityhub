
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
import '@/styles/global.css';
import i18nPromise from '@/lib/i18n';
import { createSystemArticle } from '@/services/articles';
import { syncMapboxTokenToStorage, debugMapboxTokenStatus } from '@/utils/mapbox-helper';

function App() {
  const [i18nInitialized, setI18nInitialized] = useState(false);

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
        console.log('System articles initialized');
      } catch (error) {
        console.error('Error initializing system articles:', error);
      }
    };
    
    addSystemArticles();
  }, []);

  // Show loading screen while i18n is initializing
  if (!i18nInitialized) {
    return <LoadingScreen />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <div>
        <EnvironmentStatus />
        <AuthProvider>
          <LocalizationProvider>
            <MapTokenProvider>
              <RouterProvider router={router} />
              <Toaster />
              <CountrySelectionModal />
            </MapTokenProvider>
          </LocalizationProvider>
        </AuthProvider>
      </div>
    </Suspense>
  );
}

export default App;
