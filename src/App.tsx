
import { RouterProvider } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
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
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
