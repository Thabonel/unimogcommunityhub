
import { RouterProvider } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { initVisitorTracking } from '@/services/analytics/visitorTracking';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';
import { router } from '@/routes';

function App() {
  // Initialize visitor tracking when the app loads
  useEffect(() => {
    initVisitorTracking();
  }, []);

  console.log('App component is rendering, with router:', router);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
