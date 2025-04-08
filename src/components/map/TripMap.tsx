
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { TripData, TripLocation } from '@/hooks/use-trip-webhook';
import { Loader2 } from 'lucide-react';

interface TripMapProps {
  tripData?: TripData | null;
  height?: string;
  width?: string;
}

const TripMap: React.FC<TripMapProps> = ({ 
  tripData, 
  height = '500px', 
  width = '100%' 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  
  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;
    
    const mapboxToken = localStorage.getItem('mapbox-token');
    
    if (!mapboxToken) {
      setError('No Mapbox token found. Please set your token in the map settings.');
      return;
    }
    
    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: [9.1829, 48.7758], // Default to Stuttgart, Germany
        zoom: 5,
      });
      
      map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
      
      map.current.on('load', () => {
        setMapLoaded(true);
      });
      
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setError('Error loading map. Please check your Mapbox token.');
      });
    } catch (err) {
      console.error('Error initializing map:', err);
      setError(`Failed to initialize map: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);
  
  // Update map when trip data changes
  useEffect(() => {
    if (!map.current || !mapLoaded || !tripData) return;
    
    // Clear previous markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Clear any existing routes
    if (map.current.getLayer('route-line')) {
      map.current.removeLayer('route-line');
    }
    
    if (map.current.getLayer('route-line-casing')) {
      map.current.removeLayer('route-line-casing');
    }
    
    if (map.current.getSource('route')) {
      map.current.removeSource('route');
    }
    
    // Create bounds to fit all locations
    const bounds = new mapboxgl.LngLatBounds();
    
    // Add markers for all locations
    tripData.locations.forEach(location => {
      // Add location to bounds
      bounds.extend(location.coordinates);
      
      // Create custom marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'trip-marker';
      
      // Apply different styling based on location type
      let markerColor = '#3887be'; // Default blue
      let markerClass = '';
      
      switch (location.type) {
        case 'start':
          markerColor = '#32CD32'; // Green
          markerClass = 'marker-start';
          break;
        case 'end':
          markerColor = '#DC143C'; // Red
          markerClass = 'marker-end';
          break;
        case 'campsite':
          markerColor = '#FF8C00'; // Orange
          markerClass = 'marker-campsite';
          break;
        case 'fuel':
          markerColor = '#9932CC'; // Purple
          markerClass = 'marker-fuel';
          break;
        case 'poi':
          markerColor = '#1E90FF'; // Blue
          markerClass = 'marker-poi';
          break;
      }
      
      markerEl.innerHTML = `
        <div class="marker ${markerClass}" style="background-color: ${markerColor}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>
      `;
      
      // Create and add the marker
      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat(location.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <h3 style="margin: 0 0 5px 0; font-weight: 700;">${location.name}</h3>
            <p style="margin: 0; font-size: 12px;">${location.description || ''}</p>
          `)
        )
        .addTo(map.current);
      
      markersRef.current.push(marker);
    });
    
    // Add the route if we have route coordinates
    if (tripData.routeCoordinates && tripData.routeCoordinates.length > 1) {
      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: tripData.routeCoordinates
          }
        }
      });
      
      // Add casing line (border)
      map.current.addLayer({
        id: 'route-line-casing',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#2c3e50',
          'line-width': 8
        }
      });
      
      // Add the main route line
      map.current.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3498db',
          'line-width': 4
        }
      });
    } else if (tripData.locations.length >= 2) {
      // If we don't have explicit route coordinates, draw a straight line between start and end
      const startLoc = tripData.locations.find(loc => loc.type === 'start')?.coordinates || tripData.startCoordinates;
      const endLoc = tripData.locations.find(loc => loc.type === 'end')?.coordinates || tripData.endCoordinates;
      
      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [startLoc, endLoc]
          }
        }
      });
      
      map.current.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3498db',
          'line-width': 4,
          'line-dasharray': [2, 1] // Make it dashed to indicate it's not a real route
        }
      });
    }
    
    // Fit the map to the bounds
    if (!bounds.isEmpty()) {
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 12
      });
    }
  }, [tripData, mapLoaded]);
  
  // If there's an error, display it
  if (error) {
    return (
      <div 
        style={{ height, width }} 
        className="flex items-center justify-center bg-gray-100 rounded-lg"
      >
        <div className="text-center p-4">
          <p className="text-red-500 mb-2">{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div style={{ height, width }} className="relative rounded-lg overflow-hidden">
      <div 
        ref={mapContainer} 
        className="w-full h-full" 
      />
      
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
            <p>Loading map...</p>
          </div>
        </div>
      )}
      
      {mapLoaded && !tripData && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
          <div className="text-center p-4">
            <p>No trip data available. Use Steve the Travel Planner to plan a trip!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripMap;
