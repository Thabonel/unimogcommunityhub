
import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { useAnalytics } from '@/hooks/use-analytics';
import { initializeMap, saveMapboxToken, hasMapboxToken } from './mapConfig';
import { MAPBOX_CONFIG } from '@/config/env';
import { useToast } from '@/components/ui/use-toast';

interface UseMapInitializationProps {
  onMapClick?: () => void;
}

export const useMapInitialization = ({ onMapClick }: UseMapInitializationProps = {}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { trackFeatureUse } = useAnalytics();
  const [hasToken, setHasToken] = useState(hasMapboxToken());
  const { toast } = useToast();
  
  // Enhanced debugging logs
  useEffect(() => {
    const envToken = MAPBOX_CONFIG.accessToken;
    const localToken = localStorage.getItem('mapbox_access_token');
    console.log('Map initialization state:', { 
      envTokenExists: !!envToken, 
      localTokenExists: !!localToken,
      hasToken,
      currentMapboxToken: mapboxgl.accessToken,
      isLoading,
      error
    });
  }, [hasToken, isLoading, error]);
  
  // Handle token save
  const handleTokenSave = (token: string) => {
    console.log('Saving new token:', token.substring(0, 5) + '...');
    saveMapboxToken(token);
    // Update mapboxgl.accessToken directly
    mapboxgl.accessToken = token;
    setHasToken(true);
    toast({
      title: "Token saved successfully",
      description: "Your Mapbox token has been saved and will be used for maps",
    });
    // Force reload the component to initialize the map with the new token
    setIsLoading(true);
    setError(null);
  };

  const handleResetToken = () => {
    console.log('Resetting token');
    localStorage.removeItem('mapbox_access_token');
    setHasToken(false);
    setError(null);
  };
  
  // Validate environment variables when component mounts
  useEffect(() => {
    // Check for Mapbox token
    if (!hasToken) {
      setError('Mapbox access token is missing. Please enter your token below.');
      setIsLoading(false);
    }
  }, [hasToken]);
  
  // Initialize the map
  useEffect(() => {
    // Don't try to initialize if we already detected an error or don't have a token
    if (error || !mapContainer.current || !hasToken) return;
    
    try {
      console.log('Attempting to initialize map with token:', mapboxgl.accessToken.substring(0, 5) + '...');
      
      if (!mapboxgl.accessToken) {
        console.error('No Mapbox token available for initialization');
        setError('No Mapbox token available. Please enter your token.');
        setHasToken(false);
        setIsLoading(false);
        return;
      }
      
      map.current = initializeMap(mapContainer.current);
      
      map.current.on('load', () => {
        console.log('Map loaded successfully');
        setIsLoading(false);
        trackFeatureUse('map_view', { action: 'loaded' });
      });
      
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setError(`Failed to load map resources: ${e.error?.message || 'Unknown error'}`);
        setIsLoading(false);
      });
      
    } catch (err) {
      console.error('Error initializing map:', err);
      setError(`Failed to initialize map: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsLoading(false);
    }
    
    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [trackFeatureUse, error, hasToken]);

  const handleMapClick = () => {
    if (onMapClick) {
      onMapClick();
    } else {
      trackFeatureUse('map_interaction', { action: 'click' });
    }
  };

  return {
    mapContainer,
    map: map.current,
    isLoading,
    error,
    hasToken,
    handleTokenSave,
    handleResetToken,
    handleMapClick
  };
};
