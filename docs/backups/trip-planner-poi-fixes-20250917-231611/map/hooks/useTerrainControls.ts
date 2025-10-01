
import { useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { toast } from 'sonner';

/**
 * Hook to manage terrain-related controls on a map
 */
export const useTerrainControls = (map: mapboxgl.Map | null) => {
  const [terrainEnabled, setTerrainEnabled] = useState<boolean>(true);
  
  // Toggle terrain
  const toggleTerrain = useCallback(() => {
    if (!map) return;
    
    try {
      if (terrainEnabled) {
        // Disable terrain
        map.setTerrain(null);
        console.log('Terrain disabled');
      } else {
        // Enable terrain
        map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
        console.log('Terrain enabled');
      }
      
      setTerrainEnabled(!terrainEnabled);
    } catch (e) {
      console.error('Error toggling terrain:', e);
      toast.error('Failed to toggle terrain. Please try again.');
    }
  }, [map, terrainEnabled]);
  
  return { terrainEnabled, toggleTerrain };
};
