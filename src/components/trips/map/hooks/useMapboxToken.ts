
import { useState, useEffect, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { hasMapboxToken } from '../mapConfig';

/**
 * Hook to manage Mapbox token status and operations
 */
export const useMapboxToken = () => {
  const [hasToken, setHasToken] = useState(hasMapboxToken());

  // Check for tokens periodically in case they're added later
  useEffect(() => {
    // Initially check for token
    setHasToken(hasMapboxToken());
    console.log('Initial token check:', hasMapboxToken());
    
    // Set up periodic check for token
    const tokenCheckInterval = setInterval(() => {
      const tokenExists = hasMapboxToken();
      if (tokenExists && !hasToken) {
        console.log('Token detected, updating state');
        setHasToken(true);
      }
    }, 2000);
    
    return () => clearInterval(tokenCheckInterval);
  }, [hasToken]);

  // Handle token saving
  const handleTokenSave = useCallback((token: string) => {
    localStorage.setItem('mapbox_access_token', token);
    mapboxgl.accessToken = token;
    setHasToken(true);
  }, []);

  // Handle token reset
  const handleResetToken = useCallback(() => {
    localStorage.removeItem('mapbox_access_token');
    window.location.reload();
  }, []);

  return {
    hasToken,
    handleTokenSave,
    handleResetToken
  };
};
