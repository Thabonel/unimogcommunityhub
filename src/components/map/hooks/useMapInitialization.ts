
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
  shouldAutoCenter?: boolean;
}

export const useMapInitialization = ({
  center = [0, 20], // Default to world view (only used as ultimate fallback)
  zoom = 2,
  mapStyle,
  onMapLoad,
  shouldAutoCenter = true
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

    // Check WebGL support before attempting initialization
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true }) || 
               canvas.getContext('experimental-webgl', { failIfMajorPerformanceCaveat: true });
    
    if (!gl) {
      // Clean up test canvas
      canvas.width = 0;
      canvas.height = 0;
      setError('WebGL is not supported or has been disabled. Please enable WebGL in your browser settings or try a different browser.');
      return;
    }
    
    // Clean up test WebGL context
    const loseContext = gl.getExtension('WEBGL_lose_context');
    if (loseContext) {
      loseContext.loseContext();
    }
    canvas.width = 0;
    canvas.height = 0;

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

      // Initialize map with WebGL-friendly options
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center: center,
        zoom: zoom,
        attributionControl: true,
        failIfMajorPerformanceCaveat: false,
        preserveDrawingBuffer: false,
        antialias: false,
        refreshExpiredTiles: false
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-left');
      
      // Add geolocation control for blue dot and location tracking
      const geolocateControl = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true, // Keep tracking user location
        showUserHeading: true, // Show compass heading
        showAccuracyCircle: true, // Show accuracy circle around location
        showUserLocation: true // Show the blue dot
      });
      
      map.current.addControl(geolocateControl, 'bottom-left');
      
      // Set up geolocation event handlers
      geolocateControl.on('geolocate', (e) => {
        console.log('✅ Geolocation successful - blue dot should be visible:', {
          latitude: e.coords.latitude,
          longitude: e.coords.longitude,
          accuracy: e.coords.accuracy,
          heading: e.coords.heading
        });
      });
      
      geolocateControl.on('error', (e) => {
        console.error('❌ Geolocation error:', e);
        console.log('💡 Click the compass button in bottom-left to enable location');
      });
      
      // Auto-trigger geolocation after map loads
      const autoTriggerGeolocation = () => {
        setTimeout(() => {
          try {
            geolocateControl.trigger();
            console.log('🎯 Auto-triggered geolocation for blue dot');
          } catch (err) {
            console.log('ℹ️ Auto-trigger failed, user can click compass button manually');
          }
        }, 1000);
      };
      
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
        
        // Auto-trigger geolocation to show blue dot
        autoTriggerGeolocation();
        
        if (onMapLoad && map.current) {
          onMapLoad(map.current);
        }
      });

      // Error handling
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        const errorMessage = e.error?.message || 'Unknown error';
        
        // Check for WebGL-specific errors
        if (errorMessage.toLowerCase().includes('webgl') || 
            errorMessage.toLowerCase().includes('context') ||
            errorMessage.toLowerCase().includes('gl')) {
          setError('WebGL initialization failed. Please check your browser settings or try refreshing the page.');
          return;
        }
        
        setError(`Error loading map: ${errorMessage}`);
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
  }, [hasToken, mapStyle]); // Only reinitialize on token or style changes

  // Update map position when center or zoom changes - only if auto-centering is allowed
  useEffect(() => {
    if (map.current && isMapLoaded && center && shouldAutoCenter) {
      map.current.flyTo({
        center: center,
        zoom: zoom,
        essential: true
      });
    }
  }, [center, zoom, isMapLoaded, shouldAutoCenter]);

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
