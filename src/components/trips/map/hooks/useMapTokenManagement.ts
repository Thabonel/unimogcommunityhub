
import { useCallback, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { toast } from 'sonner';
import { hasMapboxToken, saveMapboxToken } from '../mapConfig';

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
    localStorage.removeItem('mapbox_access_token');
    localStorage.removeItem('mapbox-token'); // also remove legacy key
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
