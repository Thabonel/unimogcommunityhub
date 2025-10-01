
import { useState, useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { toast } from 'sonner';
import { 
  getMapboxToken, 
  hasMapboxToken, 
  saveMapboxToken,
  initializeMap,
  cleanupMap
} from '../utils';
import { addDemSource } from '../utils/terrainUtils';
import { clearMapboxTokenStorage } from '@/utils/mapbox-helper';

interface UseMapInitializationOptions {
  onMapClick?: () => void;
  initialCenter?: [number, number];
  enableTerrain?: boolean;
}

export const useMapInitialization = ({
  onMapClick,
  initialCenter,
  enableTerrain = false
}: UseMapInitializationOptions = {}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasToken, setHasToken] = useState<boolean>(() => hasMapboxToken());
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  
  // Initialize map when component mounts
  useEffect(() => {
    // Skip if no token or no container
    if (!hasToken || !mapContainer.current) {
      setIsLoading(false);
      return;
    }
    
    // Skip if map already exists and is initialized
    if (map.current && isMapInitialized) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Initialize new map
      const newMap = initializeMap(mapContainer.current);
      map.current = newMap;
      
      // Set up event handlers for map initialization
      newMap.on('load', () => {
        console.log('Map loaded successfully');
        
        // Add navigation controls - fix the type error by instantiating the control
        try {
          newMap.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
        } catch (err) {
          console.warn('Navigation control may already exist:', err);
        }
        
        // Add enhanced geolocate control for user location blue dot - STEP 1 FIX
        try {
          // Check HTTPS requirement first
          if (!window.isSecureContext) {
            console.warn('⚠️ Geolocation requires HTTPS - user location may not work in production');
            console.log('💡 However, localhost development should still work');
          }

          const geolocateControl = new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true,
              timeout: 10000, // Increased timeout for better reliability
              maximumAge: 30000 // Reduced to get fresher location data
            },
            trackUserLocation: true,
            showUserLocation: true, // CRITICAL: Required for blue dot visibility
            showAccuracyCircle: false, // Disable to reduce visual clutter
            showUserHeading: true, // Show direction if moving
            fitBoundsOptions: {
              maxZoom: 16, // Good zoom level for trip planning
              padding: 50 // Add some padding around the location
            }
          });

          // Enhanced event handlers with user feedback
          geolocateControl.on('geolocate', (e) => {
            console.log('✅ STEP 1 SUCCESS: User location found!');
            console.log('📍 Coordinates:', e.coords.latitude.toFixed(6), e.coords.longitude.toFixed(6));
            console.log('🎯 Accuracy:', e.coords.accuracy, 'meters');
            console.log('🔵 Blue dot should now be visible on map');

            // Add toast notification for user feedback
            if (typeof toast !== 'undefined') {
              toast.success('📍 Your location found! Blue dot should be visible on map.', {
                duration: 3000,
                description: `Accuracy: ${Math.round(e.coords.accuracy)}m`
              });
            }
          });

          geolocateControl.on('trackuserlocationstart', () => {
            console.log('🔵 Started tracking user location - blue dot activated');
          });

          geolocateControl.on('trackuserlocationend', () => {
            console.log('🔵 Stopped tracking user location - blue dot deactivated');
          });

          geolocateControl.on('error', (error) => {
            console.error('❌ STEP 1 GEOLOCATION ERROR:', error);
            let errorMessage = 'Location access failed';

            if (!window.isSecureContext) {
              errorMessage = 'Location requires HTTPS in production';
              console.error('🚨 Not HTTPS - this is the likely cause');
            } else if (error.code === 1) {
              errorMessage = 'Location permission denied';
              console.error('🚫 User denied geolocation permission');
            } else if (error.code === 2) {
              errorMessage = 'Location unavailable';
              console.error('📍 Position unavailable from device');
            } else if (error.code === 3) {
              errorMessage = 'Location request timeout';
              console.error('⏰ Geolocation request timed out');
            }

            // Show user-friendly error message
            if (typeof toast !== 'undefined') {
              toast.error(`🚫 ${errorMessage}`, {
                duration: 5000,
                description: 'Blue dot will not be visible without location access'
              });
            }
          });

          // Add the control to the map
          newMap.addControl(geolocateControl, 'bottom-right');
          console.log('✅ STEP 1: Enhanced GeolocateControl added successfully');

          // Auto-trigger location request with error handling
          setTimeout(() => {
            try {
              console.log('🎯 STEP 1: Triggering initial location request...');
              geolocateControl.trigger();
            } catch (triggerErr) {
              console.warn('⚠️ Could not auto-trigger location:', triggerErr);
              console.log('💡 User can manually click the location button');
            }
          }, 2000); // Slightly longer delay for map to fully initialize

        } catch (err) {
          console.error('❌ STEP 1 CRITICAL ERROR: Geolocate control failed to initialize:', err);
          // Still continue map initialization even if geolocation fails
        }
        
        setIsMapInitialized(true);
        setIsLoading(false);
      });
      
      // Handle map errors
      newMap.on('error', (e) => {
        console.error('Mapbox error:', e);
        const errorMessage = e.error?.message || 'Unknown error';
        
        // Don't set error for known non-critical errors
        if (errorMessage.includes('raster-dem source can only be used with layer type "hillshade"') ||
            errorMessage.includes('403') || 
            errorMessage.includes('mapbox-terrain-dem') ||
            errorMessage === 'Unknown error') {
          console.warn('Ignoring non-critical map error:', errorMessage);
          return;
        }
        
        setError(`Error loading map: ${errorMessage}`);
        setIsLoading(false);
      });
    } catch (err) {
      console.error('Error initializing map:', err);
      setError(`Failed to initialize map: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsLoading(false);
    }
    
    // Cleanup map on unmount
    return () => {
      cleanupMap(map.current);
      map.current = null;
      setIsMapInitialized(false);
    };
  }, [hasToken]); // Only re-initialize if token changes
  
  // Handle center changes after map is initialized
  useEffect(() => {
    if (map.current && isMapInitialized && initialCenter) {
      map.current.setCenter(initialCenter);
    }
  }, [initialCenter, isMapInitialized]);
  
  // Handle terrain changes after map is initialized
  useEffect(() => {
    if (map.current && isMapInitialized) {
      if (enableTerrain) {
        try {
          addDemSource(map.current);
          map.current.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
        } catch (err) {
          console.warn('Could not enable terrain:', err);
        }
      } else {
        try {
          map.current.setTerrain(null);
        } catch (err) {
          console.warn('Could not disable terrain:', err);
        }
      }
    }
  }, [enableTerrain, isMapInitialized]);
  
  // Save token and refresh
  const handleTokenSave = useCallback((token: string) => {
    try {
      saveMapboxToken(token);
      setHasToken(true);
      toast.success('Mapbox token saved successfully');
    } catch (err) {
      console.error('Error saving token:', err);
      toast.error('Error saving token');
    }
  }, []);
  
  // Reset token and refresh
  const handleResetToken = useCallback(() => {
    clearMapboxTokenStorage(); // Use centralized cleanup
    setHasToken(false);
    setError(null);
    toast.success('Mapbox token reset successfully');
  }, []);
  
  // Handle map click
  const handleMapClick = useCallback(() => {
    if (onMapClick) {
      onMapClick();
    }
  }, [onMapClick]);
  
  return {
    mapContainer,
    map: map.current,
    isLoading,
    error,
    hasToken,
    handleTokenSave,
    handleResetToken,
    handleMapClick
  };
};
