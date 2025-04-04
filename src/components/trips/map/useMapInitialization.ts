
import { useState } from 'react';
import { useMapboxToken } from './hooks/useMapboxToken';
import { useMapContainer } from './hooks/useMapContainer';
import { useMapNavigation } from './hooks/useMapNavigation';

interface MapInitializationProps {
  onMapClick?: () => void;
  defaultZoom?: number;
  defaultCenter?: [number, number];
}

export const useMapInitialization = ({ 
  onMapClick,
  defaultZoom = 5,
  defaultCenter = [-99.5, 40.0]
}: MapInitializationProps = {}) => {
  const [error, setError] = useState<string | null>(null);
  
  // Use specialized hooks
  const { hasToken, handleTokenSave, handleResetToken } = useMapboxToken();
  
  const { mapContainer, map, isLoading } = useMapContainer({
    hasToken,
    onError: (err) => setError(err)
  });
  
  const { handleMapClick } = useMapNavigation({
    map,
    onMapClick,
    defaultZoom,
    defaultCenter
  });

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
