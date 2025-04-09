
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface TripLocation {
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
  type: 'campsite' | 'fuel' | 'poi' | 'start' | 'end';
  description?: string;
}

export interface TripData {
  id: string;
  title: string;
  description?: string;
  startLocation: string;
  endLocation: string;
  startCoordinates: [number, number];
  endCoordinates: [number, number];
  locations: TripLocation[];
  routeCoordinates?: [number, number][];
}

type WebhookHandler = (data: TripData) => void;

// Simple in-memory store for the most recent trip data
let lastTripData: TripData | null = null;
const handlers: WebhookHandler[] = [];

// This function creates a unique endpoint URL for this specific browser session
const generateEndpointId = () => {
  // Generate a random string to use as endpoint id
  const randomId = Math.random().toString(36).substring(2, 15);
  const timestamp = Date.now().toString(36);
  return `${randomId}-${timestamp}`;
};

// Initialize the endpoint ID once per browser session
const endpointId = generateEndpointId();

/**
 * Custom hook to use trip data from webhooks
 */
export function useTripWebhook() {
  const [tripData, setTripData] = useState<TripData | null>(lastTripData);
  const [isLoading, setIsLoading] = useState(false);

  // Register this component to receive trip updates
  useEffect(() => {
    const handler: WebhookHandler = (data) => {
      setTripData(data);
    };
    
    handlers.push(handler);
    
    // Send initial data if available
    if (lastTripData) {
      handler(lastTripData);
    }
    
    return () => {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    };
  }, []);

  // Function to simulate a webhook being received
  const processTripData = (data: TripData) => {
    // Store the data for any new components that mount
    lastTripData = data;
    
    // Notify all registered handlers
    handlers.forEach(handler => handler(data));
    
    toast.success(`Trip "${data.title}" received from Steve`);
  };

  // Get the webhook URL to configure in Botpress
  const getWebhookUrl = () => {
    return `${window.location.origin}/api/trip-webhook/${endpointId}`;
  };

  return {
    tripData,
    isLoading,
    processTripData,
    getWebhookUrl,
    endpointId
  };
}
