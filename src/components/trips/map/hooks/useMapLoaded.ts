
import { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

interface UseMapLoadedProps {
  map: mapboxgl.Map | null;
}

/**
 * Hook to track if a map is loaded and its style is ready
 */
export const useMapLoaded = ({ map }: UseMapLoadedProps) => {
  // Track if the map is loaded
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  
  // Listen for map load
  useEffect(() => {
    if (!map) return;
    
    const handleMapLoad = () => {
      console.log('Map loaded in useMapLoaded');
      setMapLoaded(true);
    };
    
    const handleStyleLoad = () => {
      console.log('Map style loaded in useMapLoaded');
      setMapLoaded(true);
    };
    
    // Check if map is already loaded
    if (map.loaded()) {
      handleMapLoad();
    } else {
      map.on('load', handleMapLoad);
    }
    
    // Listen for style changes
    map.on('style.load', handleStyleLoad);
    
    return () => {
      // Clean up event listeners
      map.off('load', handleMapLoad);
      map.off('style.load', handleStyleLoad);
    };
  }, [map]);
  
  return {
    mapLoaded
  };
};

export default useMapLoaded;
