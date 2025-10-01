
import { useState, useEffect, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { hasMapboxToken } from '../mapConfig';
import { getMapboxTokenStorageKey } from '@/utils/mapbox-helper';

/**
 * Hook to manage Mapbox token status and operations
 */
export const useMapboxToken = () => {
  const [hasToken, setHasToken] = useState(hasMapboxToken());

  // Initialize token check once on mount
  useEffect(() => {
    const tokenExists = hasMapboxToken();
    setHasToken(tokenExists);
    console.log('Initial token check:', tokenExists);
  }, []);

  // Handle token saving
  const handleTokenSave = useCallback((token: string) => {
    const storageKey = getMapboxTokenStorageKey();
    localStorage.setItem(storageKey, token);
    // Clean up legacy key
    localStorage.removeItem('mapbox_access_token');
    mapboxgl.accessToken = token;
    setHasToken(true);
  }, []);

  // Handle token reset
  const handleResetToken = useCallback(() => {
    const storageKey = getMapboxTokenStorageKey();
    localStorage.removeItem(storageKey);
    localStorage.removeItem('mapbox_access_token'); // Clean up legacy
    window.location.reload();
  }, []);

  return {
    hasToken,
    handleTokenSave,
    handleResetToken
  };
};
