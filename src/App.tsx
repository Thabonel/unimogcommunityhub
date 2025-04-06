
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { protectedRoutes } from '@/routes/protectedRoutes';
import { publicRoutes } from '@/routes/publicRoutes';
import { adminRoutes } from '@/routes/adminRoutes';
import { knowledgeRoutes } from '@/routes/knowledgeRoutes';
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
            {/* Create routes from public route config */}
            {publicRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
            {/* Create routes from protected route config */}
            {protectedRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
            {/* Create routes from knowledge route config */}
            {knowledgeRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
            {/* Create routes from admin route config */}
            {adminRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
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
