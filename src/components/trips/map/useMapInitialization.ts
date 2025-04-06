
import { useState, useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { hasMapboxToken, validateMapboxToken } from './mapConfig';
import { MAPBOX_CONFIG } from '@/config/env';

interface UseMapInitializationProps {
  onMapClick?: () => void;
}

export const useMapInitialization = ({ onMapClick }: UseMapInitializationProps = {}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasToken, setHasToken] = useState<boolean>(hasMapboxToken());

  // Initialize the map when the container is ready and we have a token
  useEffect(() => {
    if (!mapContainer.current || !hasToken) return;
    
    try {
      // Clear any previous error state
      setError(null);
      setIsLoading(true);
      
      console.log('Initializing map...');
      
      // Use the saved token from localStorage or the environment variable
      const token = localStorage.getItem('mapbox-token') || MAPBOX_CONFIG.accessToken;
      
      if (!token) {
        throw new Error('No Mapbox token available');
      }
      
      // Set the token for the mapboxgl library
      mapboxgl.accessToken = token;
      
      // Create a new map instance
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: [9.1829, 48.7758], // Default to Stuttgart, Germany
        zoom: 5
      });
      
      // Add navigation controls
      newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Wait for the map to load before setting the state
      newMap.on('load', () => {
        console.log('Map loaded successfully');
        setMap(newMap);
        setIsLoading(false);
      });
      
      // Add error handling
      newMap.on('error', (e) => {
        console.error('Map error:', e);
        setError('Error loading map: ' + (e.error?.message || 'Unknown error'));
        setIsLoading(false);
      });
      
    } catch (err) {
      console.error('Error initializing map:', err);
      setError(err instanceof Error ? err.message : 'Unknown error initializing map');
      setIsLoading(false);
    }
    
    // Cleanup function to remove the map instance when component unmounts
    return () => {
      if (map) {
        map.remove();
        setMap(null);
      }
    };
  }, [hasToken]);
  
  // Save the token and set hasToken state
  const handleTokenSave = useCallback((token: string) => {
    localStorage.setItem('mapbox-token', token);
    setHasToken(true);
  }, []);
  
  // Reset the token and clear hasToken state
  const handleResetToken = useCallback(() => {
    localStorage.removeItem('mapbox-token');
    setHasToken(false);
    setMap(null);
    setError(null);
  }, []);
  
  // Handle map click
  const handleMapClick = useCallback(() => {
    if (onMapClick) {
      onMapClick();
    }
  }, [onMapClick]);
  
  return {
    mapContainer,
    map,
    isLoading,
    error,
    hasToken,
    handleTokenSave,
    handleResetToken,
    handleMapClick
  };
};
