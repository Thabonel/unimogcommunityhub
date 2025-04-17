
import { Suspense, useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import LoadingScreen from '@/components/common/LoadingScreen';
import { LocalizationProvider } from '@/contexts/LocalizationContext';
import { CountrySelectionModal } from '@/components/localization/CountrySelectionModal';
import '@/styles/global.css';
import i18nPromise from '@/lib/i18n';

function App() {
  const [i18nInitialized, setI18nInitialized] = useState(false);

  useEffect(() => {
    // Initialize i18n before rendering the app
    const initializeI18n = async () => {
      await i18nPromise;
      setI18nInitialized(true);
    };

    initializeI18n();
  }, []);

  // Show loading screen while i18n is initializing
  if (!i18nInitialized) {
    return <LoadingScreen />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <AuthProvider>
        <LocalizationProvider>
          <RouterProvider router={router} />
          <Toaster />
          <CountrySelectionModal />
        </LocalizationProvider>
      </AuthProvider>
    </Suspense>
  );
}

export default App;
