
import { useState, useCallback } from 'react';
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
  // Use a single, consistent state variable to avoid React hook errors
  const [initState, setInitState] = useState({
    initializationAttempted: false,
    isInitializing: false
  });
  
  // Create a memoized initialization function with better error handling
  const initializeLayersWithRetry = useCallback(() => {
    if (!map) {
      console.warn('Cannot initialize layers: Map is null');
      return false;
    }
    
    if (initState.isInitializing) {
      console.log('Layer initialization already in progress, skipping');
      return false;
    }
    
    setInitState(prev => ({ ...prev, isInitializing: true, initializationAttempted: true }));
    console.log('Attempting to initialize map layers...');
    
    try {
      // First check if map style is loaded
      if (!map.isStyleLoaded()) {
        console.log('Map style not loaded yet, setting up listener...');
        
        // Set up a one-time style.load listener
        map.once('style.load', () => {
          console.log('Style loaded, initializing layers');
          const success = initializeAllLayers(map);
          setInitState(prev => ({ ...prev, isInitializing: false }));
          return success;
        });
        
        return false;
      }
      
      // Style is loaded, try to initialize layers
      const result = initializeAllLayers(map);
      setInitState(prev => ({ ...prev, isInitializing: false }));
      return result;
    } catch (error) {
      console.error('Error during layer initialization:', error);
      setInitState(prev => ({ ...prev, isInitializing: false }));
      return false;
    }
  }, [map, initState.isInitializing]);

  const handleForceInitialize = useCallback(() => {
    if (initState.isInitializing) {
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
  }, [initializeLayersManually, initializeLayersWithRetry, initState.isInitializing]);

  return {
    initializationAttempted: initState.initializationAttempted,
    isInitializing: initState.isInitializing,
    initializeLayersWithRetry,
    handleForceInitialize
  };
};

export default useLayerInitialization;
