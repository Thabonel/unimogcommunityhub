import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from './ui/card';
import { useUserLocation } from '@/hooks/use-user-location';
import { Skeleton } from './ui/skeleton';
import { getMapboxTokenFromAnySource } from '@/utils/mapbox-helper';

export interface MapMarker {
  latitude: number;
  longitude: number;
  title: string;
  description?: string;
  color?: string;
}

export interface SimpleMapProps {
  height?: string;
  width?: string;
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
}

const SimpleMap = ({
  height = '400px',
  width = '100%',
  center,
  zoom = 9,
  markers = []
}: SimpleMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const { location, isLoading: isLoadingLocation } = useUserLocation();
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    // Early return if there's no container
    if (!mapContainer.current) return;
    
    // Prevent multiple map instances
    if (map.current) return;
    
    // Get the Mapbox access token from any available source
    const token = getMapboxTokenFromAnySource();
    if (!token) {
      console.error('No Mapbox token available');
      setMapError('Mapbox token not configured');
      return;
    }
    
    // Set the Mapbox access token right before map creation
    mapboxgl.accessToken = token;
    
    try {
      // Determine map center with fallback options
      const defaultCenter: [number, number] = [9.1829, 48.7758]; // Stuttgart
      
      // Use provided center first, then user location if available, then default
      const mapCenter = center || 
                        (location && location.longitude && location.latitude ? 
                          [location.longitude, location.latitude] as [number, number] : 
                          defaultCenter);
                
      console.log('Initializing SimpleMap with center:', mapCenter);
      
      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: mapCenter,
        zoom: zoom
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add user location marker if we have the data
      if (location && !isNaN(location.longitude) && !isNaN(location.latitude)) {
        console.log('🗺️ SimpleMap: Adding user location marker', {
          longitude: location.longitude,
          latitude: location.latitude,
          accuracy: location.accuracy,
          timestamp: location.timestamp
        });
        
        const userMarker = new mapboxgl.Marker({ color: '#FF0000' })
          .setLngLat([location.longitude, location.latitude])
          .addTo(map.current);
          
        console.log('✅ SimpleMap: User location marker added successfully', userMarker);
      } else {
        console.log('⚠️ SimpleMap: No location data available for marker', {
          hasLocation: !!location,
          longitude: location?.longitude,
          latitude: location?.latitude,
          isLongitudeValid: location ? !isNaN(location.longitude) : false,
          isLatitudeValid: location ? !isNaN(location.latitude) : false
        });
      }

      console.log('Mapbox map initialized successfully');
    } catch (error) {
      console.error('Error initializing Mapbox map:', error);
      setMapError('Failed to initialize map');
    }

    // Cleanup on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [center, zoom, location]);

  // Handle markers
  useEffect(() => {
    if (!map.current || !markers.length) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    markers.forEach(marker => {
      // Create a popup with the marker info
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h3>${marker.title}</h3><p>${marker.description || ''}</p>`);

      // Create and add the marker
      const mapMarker = new mapboxgl.Marker({
        color: marker.color || '#3FB1CE'
      })
        .setLngLat([marker.longitude, marker.latitude])
        .setPopup(popup)
        .addTo(map.current!);

      markersRef.current.push(mapMarker);
    });

    // If we have markers, fit the map to show them all
    if (markers.length > 1 && map.current.isStyleLoaded()) {
      const bounds = new mapboxgl.LngLatBounds();
      markers.forEach(marker => {
        bounds.extend([marker.longitude, marker.latitude]);
      });
      
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 12
      });
    }
  }, [markers, map.current]);

  // Botpress message handler for adding markers
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, payload } = event.data;

      if (type === 'map:marker:add') {
        console.log('Received marker from Botpress:', payload);

        if (map.current) {
          const marker = payload;

          const newMarker = new mapboxgl.Marker({ color: marker.color || '#3FB1CE' })
            .setLngLat(marker.coordinates)
            .setPopup(new mapboxgl.Popup().setText(`${marker.label || 'Marker'}: ${marker.description || ''}`))
            .addTo(map.current);
          
          // Add to marker refs for cleanup
          markersRef.current.push(newMarker);
          
          // Optionally fly to the marker
          map.current.flyTo({
            center: marker.coordinates,
            zoom: 12,
            essential: true
          });
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <Card className="overflow-hidden">
      {mapError ? (
        <div className="flex items-center justify-center bg-muted" style={{ width, height }}>
          <p className="text-sm text-muted-foreground">
            {mapError}. Please check your Mapbox access token.
          </p>
        </div>
      ) : isLoadingLocation ? (
        <Skeleton style={{ width, height }} />
      ) : (
        <div 
          ref={mapContainer} 
          style={{ width, height, position: 'relative', zIndex: 1 }}
          className="relative bg-gray-100"
          data-testid="simple-mapbox-container" 
        />
      )}
    </Card>
  );
};

export default SimpleMap;