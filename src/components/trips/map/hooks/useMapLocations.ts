
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { geocodeLocation, fetchRouteCoordinates } from '../utils/geocodingUtils';
import { clearMapMarkers, addLocationMarkers } from '../utils/mapMarkerUtils';
import { clearMapRoutes, addRouteAndFitView, updateMapView } from '../utils/mapRouteUtils';
import { useUserLocation } from '@/hooks/use-user-location';
import { MAPBOX_CONFIG } from '@/config/env';

interface UseMapLocationsProps {
  map: mapboxgl.Map | null;
  startLocation?: string;
  endLocation?: string;
  waypoints?: string[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to manage locations and routes on the map
 */
export const useMapLocations = ({
  map,
  startLocation,
  endLocation,
  waypoints = [],
  isLoading,
  error
}: UseMapLocationsProps): void => {
  const { location: userLocation } = useUserLocation();
  // Keep track of whether locations have been applied to prevent flickering
  const locationsApplied = useRef(false);

  useEffect(() => {
    // Skip if map isn't ready, is loading, has errors, or if we've already applied these locations
    if (!map || isLoading || error) return;
    
    console.log('useMapLocations effect running with:', {
      mapAvailable: !!map,
      startLocation,
      endLocation,
      waypointsCount: waypoints.length,
      userLocation: userLocation ? `${userLocation.city}, ${userLocation.country}` : 'unknown',
      mapLoaded: map.isStyleLoaded(),
      mapboxToken: MAPBOX_CONFIG.accessToken ? 'Available' : 'Missing',
      directEnvToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ? 'Available' : 'Missing'
    });
    
    // Wait for the map to be fully loaded before manipulating it
    const handleMapUpdate = () => {
      // If the map style isn't loaded yet, wait for it
      if (!map.isStyleLoaded()) {
        console.log('Map style not yet loaded, waiting...');
        const checkStyleLoaded = () => {
          if (map.isStyleLoaded()) {
            updateMapForLocations();
            map.off('style.load', checkStyleLoaded);
          }
        };
        map.on('style.load', checkStyleLoaded);
        return;
      }
      
      updateMapForLocations();
    };
    
    const updateMapForLocations = async () => {
      // If no explicit locations are provided, use the user's location
      if (!startLocation && !endLocation && waypoints.length === 0) {
        if (userLocation) {
          console.log('No locations provided, using user location:', 
            `${userLocation.city}, ${userLocation.country}`);
          
          // Center the map on user's location
          map.flyTo({
            center: [userLocation.longitude, userLocation.latitude],
            zoom: 10,
            essential: true
          });
          
          // Add a marker for user's location
          new mapboxgl.Marker({ color: '#3887be' })
            .setLngLat([userLocation.longitude, userLocation.latitude])
            .addTo(map);
          
          // Add a popup with the user's location
          new mapboxgl.Popup({ closeOnClick: false })
            .setLngLat([userLocation.longitude, userLocation.latitude])
            .setHTML(`<h3>Your Location</h3><p>${userLocation.city}, ${userLocation.country}</p>`)
            .addTo(map);
            
          locationsApplied.current = true;
        }
        return;
      }
      
      try {
        // Clear any existing markers and routes
        if (map) {
          clearMapMarkers(map);
          clearMapRoutes(map);
        }
        
        // Geocode locations to coordinates
        // If no start location but we have user location, use it
        const startCoords: [number, number] = startLocation 
          ? await geocodeLocation(startLocation) 
          : (userLocation ? [userLocation.longitude, userLocation.latitude] : [-99.5, 40.0]);
          
        const endCoords: [number, number] = endLocation 
          ? await geocodeLocation(endLocation) 
          : [-97.5, 39.5];
        
        console.log('Geocoded coordinates:', { startCoords, endCoords });
        
        // Add markers for start and end locations
        if (map) {
          addLocationMarkers(
            map,
            startLocation || (userLocation ? `${userLocation.city}, ${userLocation.country}` : "Your Location"),
            startCoords,
            endLocation,
            endCoords
          );
        }
        
        // If we have both start and end coordinates, draw a route between them
        if ((startLocation || userLocation) && endLocation && map) {
          // Get route coordinates
          const routeCoordinates = await fetchRouteCoordinates(startCoords, endCoords);
          
          // Add the route to the map and fit the view
          addRouteAndFitView(map, routeCoordinates, startCoords, endCoords);
        } else if (map) {
          // Fix: Ensure we pass all five required arguments to updateMapView
          // The function signature is: updateMapView(map, startLocationName, endLocationName, startCoords, endCoords)
          updateMapView(
            map,
            startLocation || (userLocation ? `${userLocation.city}, ${userLocation.country}` : undefined),
            endLocation,
            startCoords,
            endCoords
          );
        }
        
        locationsApplied.current = true;
      } catch (err) {
        console.error('Error updating map for locations:', err);
      }
    };
    
    // If this is the first time or locations changed, update the map
    if (!locationsApplied.current || map.isStyleLoaded()) {
      handleMapUpdate();
    }
    
    // Cleanup function to handle unmounting
    return () => {
      // Remove any event listeners if needed
      if (map) {
        map.off('style.load');
      }
    };
  }, [startLocation, endLocation, waypoints, isLoading, error, map, userLocation]);
};
