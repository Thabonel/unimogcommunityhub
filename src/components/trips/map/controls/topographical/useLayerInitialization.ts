
import { useState, useCallback, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { initializeAllLayers } from '../../utils';
import { toast } from 'sonner';

interface UseLayerInitializationProps {
  map: mapboxgl.Map | null;
  mapLoaded: boolean;
  layersInitialized: boolean;
  initializeLayersManually?: () => void;
}

export const useLayerInitialization = ({
  map,
  mapLoaded,
  layersInitialized,
  initializeLayersManually
}: UseLayerInitializationProps) => {
  const [initializationAttempted, setInitializationAttempted] = useState(false);

  // Create a memoized initialization function
  const initializeLayersWithRetry = useCallback(() => {
    if (!map) return false;
    
    console.log('Attempting to initialize map layers manually...');
    setInitializationAttempted(true);
    
    // First check if map style is loaded
    if (!map.isStyleLoaded()) {
      console.log('Map style not loaded yet, waiting...');
      
      // Set up a one-time style.load listener
      map.once('style.load', () => {
        console.log('Style loaded, initializing layers');
        initializeAllLayers(map);
      });
      
      return false;
    }
    
    // Style is loaded, try to initialize layers
    return initializeAllLayers(map);
  }, [map]);

  // Attempt to initialize layers when map is loaded but layers aren't initialized
  useEffect(() => {
    if (map && mapLoaded && !layersInitialized && !initializationAttempted) {
      // Set up a style.load event handler that will re-initialize layers after style changes
      map.on('style.load', () => {
        console.log('Style load event triggered, reinitializing layers');
        initializeAllLayers(map);
      });
      
      // Attempt initialization with a slight delay
      const timer = setTimeout(() => {
        initializeLayersWithRetry();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [map, mapLoaded, layersInitialized, initializationAttempted, initializeLayersWithRetry]);

  const handleForceInitialize = useCallback(() => {
    if (initializeLayersManually) {
      initializeLayersManually();
      toast.success("Attempting to initialize map layers");
    } else {
      // Fallback to our internal initialization
      const success = initializeLayersWithRetry();
      if (success) {
        toast.success("Map layers initialized successfully");
      } else {
        toast.warning("Still waiting for map to be ready...");
      }
    }
  }, [initializeLayersManually, initializeLayersWithRetry]);

  return {
    initializationAttempted,
    initializeLayersWithRetry,
    handleForceInitialize
  };
};

export default useLayerInitialization;
