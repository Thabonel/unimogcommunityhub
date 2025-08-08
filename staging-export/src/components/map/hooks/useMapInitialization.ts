
import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { hasMapboxToken } from '../../trips/map/utils';
import { MAP_STYLES } from '../../trips/map/utils/styleUtils';
import { addTopographicalLayers, addDemSource } from '../../trips/map/utils';
import { getMapboxTokenFromAnySource } from '@/utils/mapbox-helper';
import { toast } from 'sonner';

interface UseMapInitializationProps {
  center?: [number, number];
  zoom?: number;
  mapStyle: string;
  onMapLoad?: (map: mapboxgl.Map) => void;
}

export const useMapInitialization = ({
  center = [9.1829, 48.7758], // Default to Stuttgart, Germany
  zoom = 5,
  mapStyle,
  onMapLoad
}: UseMapInitializationProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasToken, setHasToken] = useState<boolean>(hasMapboxToken());
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);

  // Initialize map
  useEffect(() => {
    if (!hasToken) {
      console.log('No Mapbox token found, showing token input');
      return;
    }

    if (map.current) return; // Map already initialized

    try {
      console.log('Initializing Mapbox map with center:', center);
      const token = getMapboxTokenFromAnySource();
      
      if (!token) {
        setError('No Mapbox token found');
        setHasToken(false);
        return;
      }

      mapboxgl.accessToken = token;
      
      if (!mapContainer.current) {
        console.error('Map container ref is null');
        return;
      }

      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center: center,
        zoom: zoom,
        attributionControl: true
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-left');
      
      // Scale control
      map.current.addControl(new mapboxgl.ScaleControl({
        maxWidth: 100,
        unit: 'metric'
      }), 'bottom-right');

      // Setup style.load event handler first, before the map is loaded
      map.current.on('style.load', () => {
        console.log('Map style loaded successfully');
        
        if (!map.current) return;
        
        // Add DEM source if it doesn't exist
        if (!map.current.getSource('mapbox-dem')) {
          console.log('Adding DEM source after style load');
          addDemSource(map.current);
        }
        
        // Add topographical layers with a delay to ensure map is ready
        setTimeout(() => {
          if (map.current) {
            console.log('Adding topographical layers after style load');
            addTopographicalLayers(map.current);
          }
        }, 200);
      });

      // Handle the initial map load
      map.current.on('load', () => {
        console.log('Map loaded successfully');
        setIsMapLoaded(true);
        
        if (onMapLoad && map.current) {
          onMapLoad(map.current);
        }
      });

      // Error handling
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setError(`Error loading map: ${e.error?.message || 'Unknown error'}`);
      });

    } catch (err) {
      console.error('Error initializing map:', err);
      setError(`Failed to initialize map: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [hasToken, center, zoom, onMapLoad, mapStyle]);

  // Update map position when center or zoom changes
  useEffect(() => {
    if (map.current && isMapLoaded && center) {
      map.current.flyTo({
        center: center,
        zoom: zoom,
        essential: true
      });
    }
  }, [center, zoom, isMapLoaded]);

  // Update map style when it changes
  useEffect(() => {
    if (map.current && isMapLoaded) {
      try {
        console.log('Changing map style to:', mapStyle);
        
        // Keep a reference to the current center and zoom
        const currentCenter = map.current.getCenter();
        const currentZoom = map.current.getZoom();
        
        map.current.setStyle(mapStyle);
        
        // Re-apply the center and zoom after style change
        // This ensures the view doesn't jump
        map.current.once('style.load', () => {
          if (map.current) {
            map.current.setCenter(currentCenter);
            map.current.setZoom(currentZoom);
          }
        });
        
      } catch (err) {
        console.error('Error changing map style:', err);
        toast.error('Failed to change map style');
      }
    }
  }, [mapStyle, isMapLoaded]);

  return {
    mapContainer,
    map: map.current,
    error,
    hasToken,
    isMapLoaded,
    setHasToken
  };
};
