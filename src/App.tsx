
import React, { useEffect, Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';
import { useTripWebhook } from '@/hooks/use-trip-webhook';
import { MapTokenProvider } from '@/contexts/MapTokenContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Create a component to listen for post messages from Botpress
const BotpressMessageListener = () => {
  const { processTripData } = useTripWebhook();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verify this is from Botpress
      if (event.data && event.data.type === 'botpress-trip-data') {
        console.log('Received trip data from Botpress:', event.data);
        processTripData(event.data.tripData);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [processTripData]);

  return null;
};

// Analytics tracker component
const AnalyticsTracker = () => {
  useEffect(() => {
    // Track page views
    const trackPageView = () => {
      try {
        const { pathname } = window.location;
        console.log(`Page view: ${pathname}`);
        // In production, connect this to your analytics service
      } catch (err) {
        console.error('Analytics error:', err);
      }
    };

    // Track initial page view
    trackPageView();

    // Track navigation events
    const handleRouteChange = () => {
      trackPageView();
    };

    window.addEventListener('popstate', handleRouteChange);
    
    // Custom event for route changes
    window.addEventListener('routeChange', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('routeChange', handleRouteChange);
    };
  }, []);

  return null;
};

function App() {
  return (
    <ErrorBoundary fallback={<div className="p-6 text-center">Something went wrong. Please try refreshing the page.</div>}>
      <QueryClientProvider client={queryClient}>
        <MapTokenProvider>
          <Suspense fallback={<LoadingFallback />}>
            <RouterProvider router={router} />
            <Toaster />
            <BotpressMessageListener />
            <AnalyticsTracker />
          </Suspense>
        </MapTokenProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
