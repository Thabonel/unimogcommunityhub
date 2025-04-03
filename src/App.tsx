
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { privateRoutes } from '@/routes/privateRoutes';
import { publicRoutes } from '@/routes/publicRoutes';
import { adminRoutes } from '@/routes/adminRoutes';
import ProtectedRoute from '@/components/ProtectedRoute';
import NotFound from '@/pages/NotFound';
import { useEffect } from 'react';
import { initVisitorTracking } from '@/services/analytics/visitorTracking';

function App() {
  // Initialize visitor tracking when the app loads
  useEffect(() => {
    initVisitorTracking();
  }, []);

  return (
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

          {privateRoutes.map((route) => (
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
  );
}

export default App;
