
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { protectedRoutes } from '@/routes/protectedRoutes';
import { publicRoutes } from '@/routes/publicRoutes';
import { adminRoutes } from '@/routes/adminRoutes';
import ProtectedRoute from '@/components/ProtectedRoute';
import NotFound from '@/pages/NotFound';
import { useEffect } from 'react';
import { initVisitorTracking } from '@/services/analytics/visitorTracking';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';

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
            {publicRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  route.requireAuth ? (
                    <ProtectedRoute>{route.element}</ProtectedRoute>
                  ) : (
                    route.element
                  )
                }
              />
            ))}

            {protectedRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<ProtectedRoute>{route.element}</ProtectedRoute>}
              />
            ))}

            {adminRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <ProtectedRoute requireAdmin={true}>
                    {route.element}
                  </ProtectedRoute>
                }
              />
            ))}

            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
