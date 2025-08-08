
import { useState, useEffect, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { initializeAllLayers } from '../utils/layerUtils';
import { toast } from 'sonner';

interface UseLayerInitializationProps {
  map: mapboxgl.Map | null;
  mapLoaded: boolean;
}

/**
 * Hook to handle layer initialization
 */
export const useLayerInitialization = ({ map, mapLoaded }: UseLayerInitializationProps) => {
  // Track if the layers are initialized
  const [layersInitialized, setLayersInitialized] = useState<boolean>(false);
  
  // Initialize layers manually
  const initializeLayersManually = useCallback(() => {
    if (!map) {
      toast.error('Map not available');
      return;
    }
    
    // If map style is not loaded, wait for it
    if (!map.isStyleLoaded()) {
      toast.info('Waiting for map style to load...');
      
      // Set up one-time listener for style.load
      map.once('style.load', () => {
        const success = initializeAllLayers(map);
        if (success) {
          setLayersInitialized(true);
          toast.success('Layers initialized successfully');
        } else {
          toast.error('Failed to initialize layers');
        }
      });
      
      return;
    }
    
    // Try to initialize layers
    const success = initializeAllLayers(map);
    if (success) {
      setLayersInitialized(true);
      toast.success('Layers initialized successfully');
    } else {
      toast.error('Failed to initialize layers');
    }
  }, [map]);
  
  // Try to initialize layers when map loads
  useEffect(() => {
    if (!map || !mapLoaded) return;
    
    // Try to initialize layers when the map is loaded
    const success = initializeAllLayers(map);
    if (success) {
      setLayersInitialized(true);
    }
    
    // Set up style.load event handler
    const handleStyleLoad = () => {
      console.log('Style loaded, initializing layers');
      const success = initializeAllLayers(map);
      if (success) {
        setLayersInitialized(true);
      }
    };
    
    map.on('style.load', handleStyleLoad);
    
    return () => {
      map.off('style.load', handleStyleLoad);
    };
  }, [map, mapLoaded]);
  
  return {
    layersInitialized,
    initializeLayersManually
  };
};

export default useLayerInitialization;
