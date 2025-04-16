
import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import LoadingScreen from '@/components/common/LoadingScreen';
import { LocalizationProvider } from '@/contexts/LocalizationContext';
import { CountrySelectionModal } from '@/components/localization/CountrySelectionModal';
import '@/styles/global.css'; // Updated from globals.css to global.css
import '@/lib/i18n';

function App() {
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
