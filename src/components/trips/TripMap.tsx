
import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, AlertTriangle } from 'lucide-react';
import { useAnalytics } from '@/hooks/use-analytics';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Configure Mapbox with the access token
mapboxgl.accessToken = 'pk.eyJ1IjoidGhhYm9uZWwiLCJhIjoiY204d3l5NGpwMDBpZDJqb2IzaXF6Ym4weCJ9.ZS6nu4vUyINjg2wKRg0yqQ';

interface TripMapProps {
  startLocation?: string;
  endLocation?: string;
  waypoints?: string[];
  onMapClick?: () => void;
}

const TripMap = ({ 
  startLocation, 
  endLocation,
  waypoints = [],
  onMapClick 
}: TripMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { trackFeatureUse } = useAnalytics();
  
  useEffect(() => {
    // Initialize the map only once when the component mounts
    if (!mapContainer.current) return;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12', // Enhanced satellite imagery with streets
        center: [0, 0] as [number, number], // Default center, will be updated based on locations
        zoom: 2,
        pitch: 30, // Add some pitch for a more immersive view
        attributionControl: false // We'll add a custom attribution control
      });
      
      // Add navigation controls with terrain visualization
      map.current.addControl(new mapboxgl.NavigationControl({
        visualizePitch: true,
        showZoom: true
      }), 'top-right');
      
      // Add attribution control separately
      map.current.addControl(new mapboxgl.AttributionControl({
        compact: true
      }), 'bottom-right');
      
      map.current.on('load', () => {
        setIsLoading(false);
        trackFeatureUse('map_view', { action: 'loaded' });
        
        // Add terrain and sky for 3D effect
        if (map.current) {
          map.current.setFog({
            'horizon-blend': 0.1,
            'color': '#f8f8f8',
            'high-color': '#add8e6',
            'space-color': '#d8f2ff',
            'star-intensity': 0.15
          });
        }
      });
      
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setError('Failed to load map resources');
        setIsLoading(false);
      });
      
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize map');
      setIsLoading(false);
    }
    
    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [trackFeatureUse]);
  
  // Update map when start or end location changes
  useEffect(() => {
    if (!map.current || isLoading || error) return;
    
    const updateMapForLocations = async () => {
      if (!startLocation && !endLocation) return;
      
      try {
        // Clear any existing markers and routes
        const existingStartMarker = document.getElementById('start-marker');
        if (existingStartMarker) existingStartMarker.remove();
        
        const existingEndMarker = document.getElementById('end-marker');
        if (existingEndMarker) existingEndMarker.remove();
        
        if (map.current?.getLayer('route-line')) {
          map.current.removeLayer('route-line');
        }
        
        if (map.current?.getSource('route')) {
          map.current.removeSource('route');
        }
        
        // In a real app, we would geocode these locations
        // For now we'll use placeholder coordinates
        const startCoords: [number, number] = startLocation ? [-99.5, 40.0] : [-99.5, 40.0];
        const endCoords: [number, number] = endLocation ? [-97.5, 39.5] : [-97.5, 39.5];
        
        // Add markers for start and end if we have coordinates
        if (startLocation) {
          // Create a custom marker element for the start point
          const startMarkerEl = document.createElement('div');
          startMarkerEl.id = 'start-marker';
          startMarkerEl.className = 'flex items-center justify-center';
          startMarkerEl.innerHTML = `
            <div class="relative">
              <div class="absolute -top-10 -left-2 px-2 py-1 rounded-md bg-primary text-white text-xs whitespace-nowrap">
                ${startLocation}
              </div>
              <div class="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
            </div>
          `;
          
          new mapboxgl.Marker({ element: startMarkerEl })
            .setLngLat(startCoords)
            .addTo(map.current);
        }
        
        if (endLocation) {
          // Create a custom marker element for the end point
          const endMarkerEl = document.createElement('div');
          endMarkerEl.id = 'end-marker';
          endMarkerEl.className = 'flex items-center justify-center';
          endMarkerEl.innerHTML = `
            <div class="relative">
              <div class="absolute -top-10 -left-2 px-2 py-1 rounded-md bg-secondary text-white text-xs whitespace-nowrap">
                ${endLocation}
              </div>
              <div class="h-6 w-6 rounded-full bg-secondary text-white flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 8v8"></path>
                  <path d="M8 12h8"></path>
                </svg>
              </div>
            </div>
          `;
          
          new mapboxgl.Marker({ element: endMarkerEl })
            .setLngLat(endCoords)
            .addTo(map.current);
        }
        
        // If we have both start and end coordinates, draw a route between them
        if (startLocation && endLocation) {
          // For a real app, we'd use the Mapbox Directions API to get the route
          // For now, we'll create a simple curved line between the points
          const midpoint: [number, number] = [
            (startCoords[0] + endCoords[0]) / 2,
            (startCoords[1] + endCoords[1]) / 2 + 0.5 // Offset to create a curve
          ];
          
          const routeCoordinates: [number, number][] = [
            startCoords,
            midpoint,
            endCoords
          ];
          
          // Add the route source and layer only if the map is fully loaded
          if (map.current?.isStyleLoaded()) {
            addRouteToMap(map.current, routeCoordinates);
          } else {
            // Wait for the style to load if it hasn't already
            map.current?.once('style.load', () => {
              if (map.current) {
                addRouteToMap(map.current, routeCoordinates);
              }
            });
          }
          
          // Fit the map to show both points with padding
          const bounds = new mapboxgl.LngLatBounds()
            .extend(startCoords)
            .extend(endCoords);
            
          map.current?.fitBounds(bounds, {
            padding: 80,
            duration: 1000
          });
        } else if (startLocation) {
          // If we only have start coordinates
          map.current?.flyTo({
            center: startCoords,
            zoom: 10,
            duration: 1000
          });
        } else if (endLocation) {
          // If we only have end coordinates
          map.current?.flyTo({
            center: endCoords,
            zoom: 10,
            duration: 1000
          });
        }
      } catch (err) {
        console.error('Error updating map for locations:', err);
      }
    };
    
    updateMapForLocations();
  }, [startLocation, endLocation, isLoading, error]);
  
  // Helper function to add a route to the map
  const addRouteToMap = (mapInstance: mapboxgl.Map, coordinates: [number, number][]) => {
    // Add the route source if it doesn't exist
    if (!mapInstance.getSource('route')) {
      mapInstance.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates
          }
        }
      });
    } else {
      // Update existing source
      const source = mapInstance.getSource('route') as mapboxgl.GeoJSONSource;
      source.setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates
        }
      });
    }
    
    // Add the route layer if it doesn't exist
    if (!mapInstance.getLayer('route-line')) {
      mapInstance.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#F97316',
          'line-width': 4,
          'line-opacity': 0.8,
          'line-dasharray': [0.5, 1.5]
        }
      });
    }
  };
  
  const handleMapClick = () => {
    if (onMapClick) {
      onMapClick();
    } else {
      trackFeatureUse('map_interaction', { action: 'click' });
    }
  };
  
  if (error) {
    return (
      <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
          <AlertTriangle className="h-5 w-5" />
          <p>Failed to load map: {error}</p>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="relative overflow-hidden">
      {isLoading ? (
        <Skeleton className="h-[300px] w-full" />
      ) : (
        <div 
          ref={mapContainer}
          className="h-[300px] w-full"
          onClick={handleMapClick}
        />
      )}
    </Card>
  );
};

export default TripMap;
