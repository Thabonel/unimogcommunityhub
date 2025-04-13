
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
  const [isInitializing, setIsInitializing] = useState(false);

  // Create a memoized initialization function with better error handling
  const initializeLayersWithRetry = useCallback(() => {
    if (!map) {
      console.warn('Cannot initialize layers: Map is null');
      return false;
    }
    
    if (isInitializing) {
      console.log('Layer initialization already in progress, skipping');
      return false;
    }
    
    setIsInitializing(true);
    console.log('Attempting to initialize map layers...');
    setInitializationAttempted(true);
    
    try {
      // First check if map style is loaded
      if (!map.isStyleLoaded()) {
        console.log('Map style not loaded yet, setting up listener...');
        
        // Set up a one-time style.load listener
        map.once('style.load', () => {
          console.log('Style loaded, initializing layers');
          const success = initializeAllLayers(map);
          setIsInitializing(false);
          return success;
        });
        
        return false;
      }
      
      // Style is loaded, try to initialize layers
      const result = initializeAllLayers(map);
      setIsInitializing(false);
      return result;
    } catch (error) {
      console.error('Error during layer initialization:', error);
      setIsInitializing(false);
      return false;
    }
  }, [map, isInitializing]);

  // Attempt to initialize layers when map is loaded but layers aren't initialized
  useEffect(() => {
    if (map && mapLoaded && !layersInitialized && !initializationAttempted && !isInitializing) {
      console.log('Map loaded but layers not initialized. Setting up style.load listener.');
      
      // Set up a style.load event handler that will re-initialize layers after style changes
      const handleStyleLoad = () => {
        console.log('Style load event triggered, reinitializing layers');
        initializeAllLayers(map);
      };
      
      map.on('style.load', handleStyleLoad);
      
      // Attempt initialization with a slight delay
      const timer = setTimeout(() => {
        initializeLayersWithRetry();
      }, 500);
      
      return () => {
        clearTimeout(timer);
        map.off('style.load', handleStyleLoad);
      };
    }
  }, [map, mapLoaded, layersInitialized, initializationAttempted, initializeLayersWithRetry, isInitializing]);

  const handleForceInitialize = useCallback(() => {
    if (isInitializing) {
      toast.info("Layer initialization already in progress");
      return;
    }
    
    if (initializeLayersManually) {
      initializeLayersManually();
      toast.success("Attempting to initialize map layers");
    } else {
      // Fallback to our internal initialization
      const success = initializeLayersWithRetry();
      if (success) {
        toast.success("Map layers initialized successfully");
      } else {
        toast.warning("Still waiting for map to be ready. Please try again in a moment.");
      }
    }
  }, [initializeLayersManually, initializeLayersWithRetry, isInitializing]);

  return {
    initializationAttempted,
    isInitializing,
    initializeLayersWithRetry,
    handleForceInitialize
  };
};

export default useLayerInitialization;
