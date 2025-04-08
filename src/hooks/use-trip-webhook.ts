
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
 * Safely validates and sanitizes trip data
 * to ensure it can be cloned and processed
 */
const sanitizeTripData = (data: any): TripData | null => {
  try {
    if (!data) return null;
    
    // Basic validation of required fields
    if (!data.id || !data.title || !data.startLocation || !data.endLocation) {
      console.error('Missing required trip data fields:', data);
      return null;
    }
    
    // Validate coordinates are arrays of numbers
    if (!Array.isArray(data.startCoordinates) || data.startCoordinates.length !== 2 ||
        !Array.isArray(data.endCoordinates) || data.endCoordinates.length !== 2) {
      console.error('Invalid coordinates in trip data:', data);
      return null;
    }
    
    // Validate and sanitize locations array
    const sanitizedLocations = Array.isArray(data.locations) 
      ? data.locations.filter(loc => {
          return loc && loc.name && Array.isArray(loc.coordinates) && 
                 loc.coordinates.length === 2 && loc.type;
        })
      : [];
    
    // Validate and sanitize route coordinates
    const sanitizedRouteCoordinates = Array.isArray(data.routeCoordinates)
      ? data.routeCoordinates.filter(coords => {
          return Array.isArray(coords) && coords.length === 2 && 
                 typeof coords[0] === 'number' && typeof coords[1] === 'number';
        })
      : [];
    
    // Create a sanitized version of the trip data
    const sanitized: TripData = {
      id: String(data.id),
      title: String(data.title),
      description: data.description ? String(data.description) : undefined,
      startLocation: String(data.startLocation),
      endLocation: String(data.endLocation),
      startCoordinates: [Number(data.startCoordinates[0]), Number(data.startCoordinates[1])],
      endCoordinates: [Number(data.endCoordinates[0]), Number(data.endCoordinates[1])],
      locations: sanitizedLocations,
      routeCoordinates: sanitizedRouteCoordinates.length > 0 ? sanitizedRouteCoordinates : undefined
    };
    
    return sanitized;
  } catch (error) {
    console.error('Error sanitizing trip data:', error);
    return null;
  }
};

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
    
    // Set up event listener for window messages (for Botpress integration)
    const handleWindowMessage = (event: MessageEvent) => {
      // Check if this is a message from Botpress or our test system
      try {
        const data = event.data;
        
        // Verify it's our expected format
        if (data && data.type === 'botpress-trip-data' && data.tripData) {
          const sanitizedData = sanitizeTripData(data.tripData);
          if (sanitizedData) {
            processTripData(sanitizedData);
            
            // Send confirmation back to the sender if possible
            if (event.source && 'postMessage' in event.source) {
              try {
                // Create a safe, cloneable confirmation object
                const confirmation = {
                  type: 'trip-data-received',
                  success: true,
                  timestamp: Date.now(),
                  tripId: sanitizedData.id
                };
                
                (event.source as Window).postMessage(confirmation, '*');
              } catch (postError) {
                console.error('Failed to send confirmation:', postError);
              }
            }
          }
        }
      } catch (err) {
        console.error('Error processing window message:', err);
      }
    };
    
    window.addEventListener('message', handleWindowMessage);
    
    return () => {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
      window.removeEventListener('message', handleWindowMessage);
    };
  }, []);

  // Function to process trip data from any source
  const processTripData = (data: TripData) => {
    try {
      // Validate and sanitize the data
      const sanitizedData = sanitizeTripData(data);
      
      if (!sanitizedData) {
        console.error('Invalid trip data format:', data);
        toast.error('Invalid trip data received');
        return;
      }
      
      // Store the data for any new components that mount
      lastTripData = sanitizedData;
      
      // Notify all registered handlers
      handlers.forEach(handler => handler(sanitizedData));
      
      toast.success(`Trip "${sanitizedData.title}" received from Steve`);
    } catch (error) {
      console.error('Error processing trip data:', error);
      toast.error('Error processing trip data');
    }
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
