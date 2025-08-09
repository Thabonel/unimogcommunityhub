
import React, { useEffect } from 'react';
import { useTripWebhook, TripData } from '@/hooks/use-trip-webhook';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';
import { EmergencyAlert } from '@/types/track';

interface WebhookReceiverProps {
  onTripReceived?: (data: TripData) => void;
  onEmergencyAlertReceived?: (data: EmergencyAlert) => void;
}

const WebhookReceiver: React.FC<WebhookReceiverProps> = ({ 
  onTripReceived,
  onEmergencyAlertReceived 
}) => {
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
        
        // Check if this is an emergency alert message
        if (data && data.type === 'emergency-alert') {
          console.log('Webhook received emergency alert:', data.alertData);
          
          // Process emergency alert
          if (data.alertData && onEmergencyAlertReceived) {
            onEmergencyAlertReceived(data.alertData);
            
            // Also store in database if user is logged in
            const storeAlertInDatabase = async () => {
              try {
                const { data: { user } } = await supabase.auth.getUser();
                
                if (user) {
                  // Format the alert data for our database
                  const alertToStore = {
                    ...data.alertData,
                    source: `webhook:${user.id}`,
                    active: true,
                    expires_at: data.alertData.expires_at || new Date(Date.now() + 86400000).toISOString() // Default to 24h expiry
                  };
                  
                  // Cast to unknown first to avoid type errors
                  const { data: insertedAlert, error } = await supabase
                    .from('emergency_alerts' as any)
                    .insert(alertToStore as any)
                    .select()
                    .single();
                  
                  if (error) throw error;
                  
                  console.log('Emergency alert stored in database:', insertedAlert);
                  toast.success('Emergency alert received and stored');
                }
              } catch (error) {
                console.error('Error storing emergency alert:', error);
                toast.error('Failed to store emergency alert');
              }
            };
            
            storeAlertInDatabase();
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
  }, [processTripData, endpointId, onTripReceived, onEmergencyAlertReceived]);

  return null; // This is just an event listener, no UI needed
};

export default WebhookReceiver;
