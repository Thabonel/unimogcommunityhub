
import { useEffect, Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from '@/routes';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import LoadingScreen from '@/components/common/LoadingScreen';
import { LocalizationProvider } from '@/contexts/LocalizationContext';
import { CountrySelectionModal } from '@/components/localization/CountrySelectionModal';
import '@/styles/globals.css';

// Import and initialize i18n
import '@/lib/i18n';

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <AuthProvider>
        <LocalizationProvider>
          <Router>
            <AppRoutes />
            <Toaster />
            <CountrySelectionModal />
          </Router>
        </LocalizationProvider>
      </AuthProvider>
    </Suspense>
  );
}

export default App;
