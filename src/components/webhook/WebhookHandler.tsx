
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTripWebhook, TripData } from '@/hooks/use-trip-webhook';

// This component handles webhook requests via URL route
const WebhookHandler: React.FC = () => {
  const { endpointId } = useParams<{ endpointId: string }>();
  const { processTripData } = useTripWebhook();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's trip data in the URL (from query parameters)
    const params = new URLSearchParams(window.location.search);
    const tripDataParam = params.get('tripData');
    
    if (tripDataParam) {
      try {
        // Parse the trip data
        const tripData = JSON.parse(decodeURIComponent(tripDataParam)) as TripData;
        processTripData(tripData);
        
        // Navigate to the travel planner page to show the result
        navigate('/travel-planner');
      } catch (err) {
        console.error('Error parsing trip data:', err);
      }
    } else {
      // If no data, redirect to travel planner
      navigate('/travel-planner');
    }
  }, [endpointId, processTripData, navigate]);

  return null;
};

export default WebhookHandler;
