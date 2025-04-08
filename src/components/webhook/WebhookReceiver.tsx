
import React, { useEffect } from 'react';
import { useTripWebhook, TripData } from '@/hooks/use-trip-webhook';

interface WebhookReceiverProps {
  onTripReceived?: (tripData: TripData) => void;
}

/**
 * Component that handles receiving webhook data for trip planning
 * Can be hidden in the UI but still processes webhook events
 */
const WebhookReceiver: React.FC<WebhookReceiverProps> = ({ 
  onTripReceived
}) => {
  const { processTripData } = useTripWebhook();
  
  // Handle receiving message from Botpress through the window
  useEffect(() => {
    function receiveMessage(event: MessageEvent) {
      try {
        const data = event.data;
        
        // Make sure it's our expected format
        if (data && data.type === 'botpress-trip-data') {
          const tripData = data.tripData as TripData;
          processTripData(tripData);
          
          if (onTripReceived) {
            onTripReceived(tripData);
          }
        }
      } catch (err) {
        console.error('Error processing webhook message:', err);
      }
    }

    window.addEventListener('message', receiveMessage);
    return () => window.removeEventListener('message', receiveMessage);
  }, [processTripData, onTripReceived]);

  // This component doesn't render anything visible
  return null;
};

export default WebhookReceiver;
