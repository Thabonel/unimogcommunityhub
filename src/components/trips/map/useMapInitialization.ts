
import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { useAnalytics } from '@/hooks/use-analytics';
import { initializeMap, saveMapboxToken, hasMapboxToken } from './mapConfig';
import { MAPBOX_CONFIG } from '@/config/env';

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
  
  // Log the available token for debugging
  useEffect(() => {
    console.log('Environment Mapbox token available:', !!MAPBOX_CONFIG.accessToken);
    console.log('LocalStorage Mapbox token available:', !!localStorage.getItem('mapbox_access_token'));
  }, []);
  
  // Handle token save
  const handleTokenSave = (token: string) => {
    saveMapboxToken(token);
    setHasToken(true);
    // Force reload the component to initialize the map with the new token
    setIsLoading(true);
  };

  const handleResetToken = () => {
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
      map.current = initializeMap(mapContainer.current);
      
      map.current.on('load', () => {
        setIsLoading(false);
        trackFeatureUse('map_view', { action: 'loaded' });
      });
      
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setError('Failed to load map resources');
        setIsLoading(false);
      });
      
      // Add this check to handle potential token error
      if (!mapboxgl.accessToken) {
        setError('Mapbox token not recognized. Please try entering a different token.');
        setHasToken(false);
        setIsLoading(false);
        return;
      }
      
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize map');
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
