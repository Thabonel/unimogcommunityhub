
import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';
import { useTripWebhook } from '@/hooks/use-trip-webhook';

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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
      <BotpressMessageListener />
    </QueryClientProvider>
  );
}

export default App;
