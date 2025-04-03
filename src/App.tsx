
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { protectedRoutes } from '@/routes/protectedRoutes';
import { publicRoutes } from '@/routes/publicRoutes';
import { adminRoutes } from '@/routes/adminRoutes';
import NotFound from '@/pages/NotFound';
import { useEffect } from 'react';
import { initVisitorTracking } from '@/services/analytics/visitorTracking';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';
import { createRoutesFromConfig, convertToAppRoutes } from '@/routes';

function App() {
  // Initialize visitor tracking when the app loads
  useEffect(() => {
    initVisitorTracking();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Convert standard RouteObjects to AppRouteObjects for public routes */}
            {createRoutesFromConfig(convertToAppRoutes(publicRoutes))}
            {createRoutesFromConfig(protectedRoutes)}
            {createRoutesFromConfig(adminRoutes)}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
