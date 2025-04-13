
import React, { useEffect } from 'react';
import { useTripWebhook, TripData } from '@/hooks/use-trip-webhook';

interface WebhookReceiverProps {
  onTripReceived?: (data: TripData) => void;
}

const WebhookReceiver: React.FC<WebhookReceiverProps> = ({ onTripReceived }) => {
  const { processTripData, endpointId } = useTripWebhook();

  // Mock endpoint for demonstration/testing
  useEffect(() => {
    // Simulated webhook endpoint
    const handleWebhookMessage = (event: MessageEvent) => {
      try {
        const data = event.data;
        
        // Check if this is a trip data message
        if (data && data.type === 'trip-data' && data.endpointId === endpointId) {
          console.log('Webhook received trip data:', data.tripData);
          processTripData(data.tripData);
          
          if (onTripReceived) {
            onTripReceived(data.tripData);
          }
        }
      } catch (error) {
        console.error('Error processing webhook message:', error);
      }
    };

    // Listen for postMessage events (simulating webhooks in dev environment)
    window.addEventListener('message', handleWebhookMessage);
    
    return () => {
      window.removeEventListener('message', handleWebhookMessage);
    };
  }, [processTripData, endpointId, onTripReceived]);

  return null; // This is just an event listener, no UI needed
};

export default WebhookReceiver;
