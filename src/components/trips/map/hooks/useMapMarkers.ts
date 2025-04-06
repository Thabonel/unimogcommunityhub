
import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { fitMapToBounds, flyToLocation } from '../utils/mapNavigationUtils';

interface TripWithLocation {
  id: string;
  title: string;
  location: string;
  [key: string]: any;
}

/**
 * Custom hook to manage map markers
 */
export const useMapMarkers = (
  map: mapboxgl.Map | null,
  trips: TripWithLocation[],
  activeTrip: string | null,
  onTripSelect: (trip: TripWithLocation) => void,
  mapLoaded: boolean
) => {
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);
  
  // Add markers for trips
  useEffect(() => {
    if (!map || !mapLoaded || !trips.length) return;
    
    // Clear existing markers
    markers.forEach(marker => marker.remove());
    
    const newMarkers: mapboxgl.Marker[] = [];
    
    trips.forEach((trip) => {
      // In a real app, you would use actual coordinates
      // For demo, generate random positions around the US
      const lat = 35 + (Math.random() * 10) - 5;
      const lng = -100 + (Math.random() * 20) - 10;
      
      // Create marker element
      const el = document.createElement('div');
      el.className = 'trip-marker';
      el.style.width = '25px';
      el.style.height = '25px';
      el.style.borderRadius = '50%';
      el.style.background = trip.id === activeTrip ? '#3880ff' : '#10b981';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 0 0 4px rgba(255,255,255,0.7)';
      el.style.transition = 'all 0.3s ease';
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .addTo(map);
      
      // Add click handler
      el.addEventListener('click', () => {
        onTripSelect(trip);
      });
      
      // Add popup
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div style="padding: 8px;">
            <h3 style="font-weight: bold; margin-bottom: 5px;">${trip.title}</h3>
            <p style="color: #888;">${trip.location}</p>
          </div>
        `);
      
      marker.setPopup(popup);
      
      newMarkers.push(marker);
    });
    
    setMarkers(newMarkers);
    
    // If there are trips, fit map to show all of them
    if (trips.length > 0) {
      const coordinates = newMarkers.map(marker => marker.getLngLat().toArray() as [number, number]);
      fitMapToBounds(map, coordinates);
    }
    
    // Cleanup
    return () => {
      newMarkers.forEach(marker => marker.remove());
    };
  }, [map, trips, activeTrip, onTripSelect, mapLoaded]);
  
  // Fly to the selected trip
  const flyToTrip = (trip: TripWithLocation) => {
    if (!map) return;
    
    const marker = markers.find((m, i) => trips[i]?.id === trip.id);
    if (marker) {
      flyToLocation(map, marker.getLngLat().toArray() as [number, number], 12);
    }
  };
  
  return {
    markers,
    flyToTrip
  };
};
