
import { useEffect } from 'react';
import { useMapTokenManagement } from './useMapTokenManagement';
import { useMapInitCore } from './useMapInitCore';
import { useTerrainControls } from './useTerrainControls';
import { addTopographicalLayers, addDemSource } from '../utils/layerUtils';
import { cleanupMap } from '../utils/mapInitUtils';
import mapboxgl from 'mapbox-gl';
import { initializeMap } from '../utils/mapInitUtils';

interface UseMapInitializationProps {
  onMapClick?: () => void;
  enableTerrain?: boolean;
  initialCenter?: [number, number];
}

/**
 * Main hook for Mapbox map initialization and management
 * Composes smaller hooks for better maintainability
 */
export const useMapInitialization = ({ 
  onMapClick,
  enableTerrain = true,
  initialCenter
}: UseMapInitializationProps = {}) => {
  // Combine the token management hook
  const { 
    hasToken, 
    setHasToken, 
    handleTokenSave, 
    handleResetToken 
  } = useMapTokenManagement();
  
  // Get core map initialization functionality
  const {
    mapContainer,
    map,
    isLoading,
    setIsLoading,
    error,
    setError,
    initialCenterRef,
    mapInstance,
    isMountedRef,
    isInitializingRef,
    mapInitAttempts,
    handleMapClick,
    setMap
  } = useMapInitCore({ onMapClick, initialCenter });
  
  // Get terrain controls
  const { terrainEnabled, toggleTerrain } = useTerrainControls(map);
  
  // Initialize the map when the container is ready and we have a token
  useEffect(() => {
    if (!mapContainer.current || !hasToken || error || !isMountedRef.current || isInitializingRef.current) return;
    
    if (mapInstance.current) {
      console.log('Map already initialized, skipping initialization');
      return;
    }
    
    isInitializingRef.current = true;
    
    const initializeMapInstance = async () => {
      try {
        // Reset error state
        setError(null);
        if (isMountedRef.current) {
          setIsLoading(true);
        }
        
        console.log('Initializing map with center:', initialCenterRef.current);
        mapInitAttempts.current += 1;
        
        // Validate container dimensions
        if (!mapContainer.current) {
          throw new Error('Map container reference is null');
        }
        
        const { offsetWidth, offsetHeight } = mapContainer.current;
        if (offsetWidth <= 10 || offsetHeight <= 10) {
          console.warn('Container has invalid dimensions:', { width: offsetWidth, height: offsetHeight });
          isInitializingRef.current = false;
          return;
        }

        // Use our improved initialization utility
        const newMapInstance = initializeMap(mapContainer.current);
        
        // Check if component was unmounted during async operation
        if (!isMountedRef.current) {
          cleanupMap(newMapInstance);
          isInitializingRef.current = false;
          return;
        }
        
        // Update center if provided
        if (initialCenterRef.current) {
          newMapInstance.setCenter(initialCenterRef.current);
          newMapInstance.setZoom(10); // Zoom in when we have a specific center
        }
        
        // Store map instance
        mapInstance.current = newMapInstance;
        
        if (isMountedRef.current) {
          // Fix: use setMap function from useMapInitCore
          setMap(newMapInstance);
        }
        
        // Set up style.load event handler with proper unmount checks
        newMapInstance.on('style.load', () => {
          console.log('Map style loaded successfully');
          
          if (!isMountedRef.current || !newMapInstance) return;
          
          try {
            if (isMountedRef.current && newMapInstance) {
              // Add DEM source for terrain
              addDemSource(newMapInstance);
              
              // Add topographical layers
              addTopographicalLayers(newMapInstance);
              
              // Enable terrain if requested
              if (enableTerrain) {
                newMapInstance.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
              }
              
              if (isMountedRef.current) {
                setIsLoading(false);
              }
            }
          } catch (e) {
            console.error('Error adding layers:', e);
            if (isMountedRef.current) {
              setIsLoading(false);
            }
          }
        });
        
        // Set up load event handler
        newMapInstance.on('load', () => {
          console.log('Map loaded successfully');
          
          if (!isMountedRef.current) return;
          
          if (isMountedRef.current) {
            setIsLoading(false);
          }
        });
        
        // Set up error handler
        newMapInstance.on('error', (e) => {
          const errorMessage = e.error?.message || 'Unknown error';
          console.error('Map error:', e, errorMessage);
          
          if (isMountedRef.current) {
            setError(`Error loading map: ${errorMessage}`);
            setIsLoading(false);
          }
        });
        
      } catch (err) {
        console.error('Error initializing map:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error initializing map';
        
        if (isMountedRef.current) {
          setError(errorMessage);
          setIsLoading(false);
        }
      } finally {
        isInitializingRef.current = false;
      }
    };
    
    // Start initialization
    initializeMapInstance();
    
    // Safety timeout to prevent stuck loading state
    const safetyTimeoutId = setTimeout(() => {
      if (isMountedRef.current && isLoading) {
        console.log('Safety timeout reached, resetting loading state');
        setIsLoading(false);
        isInitializingRef.current = false;
      }
    }, 10000);
    
    // Cleanup function
    return () => {
      clearTimeout(safetyTimeoutId);
    };
  }, [hasToken, enableTerrain, error, setError, setIsLoading]);
  
  // Return all the necessary values and functions from the combined hooks
  return {
    mapContainer,
    map,
    isLoading,
    error,
    hasToken,
    terrainEnabled,
    handleTokenSave,
    handleResetToken,
    handleMapClick,
    toggleTerrain
  };
};

// Reexport (for backward compatibility)
export { useMapTokenManagement } from './useMapTokenManagement';
export { useMapInitCore } from './useMapInitCore';
export { useTerrainControls } from './useTerrainControls';
