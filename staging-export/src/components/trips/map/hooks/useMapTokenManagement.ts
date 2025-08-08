
import { useCallback, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { toast } from 'sonner';
import { hasMapboxToken, saveMapboxToken } from '../mapConfig';
import { getMapboxTokenStorageKey, clearMapboxTokenStorage } from '@/utils/mapbox-helper';

/**
 * Hook to manage Mapbox token operations
 */
export const useMapTokenManagement = () => {
  const [hasToken, setHasToken] = useState<boolean>(hasMapboxToken());
  
  // Save the token and set hasToken state
  const handleTokenSave = useCallback((token: string) => {
    saveMapboxToken(token);
    mapboxgl.accessToken = token;
    setHasToken(true);
    toast.success('Mapbox token saved successfully');
  }, []);
  
  // Reset the token and clear hasToken state
  const handleResetToken = useCallback(() => {
    clearMapboxTokenStorage(); // This handles both current and legacy keys
    setHasToken(false);
    toast.info('Mapbox token has been reset');
  }, []);
  
  return {
    hasToken,
    setHasToken,
    handleTokenSave,
    handleResetToken
  };
};
