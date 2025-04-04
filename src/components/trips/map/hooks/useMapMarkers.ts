
import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { TripCardProps } from '../../TripCard';

export const useMapMarkers = (
  map: mapboxgl.Map | null,
  trips: TripCardProps[],
  activeTrip: string | null,
  onTripSelect: (trip: TripCardProps) => void,
  mapLoaded: boolean
) => {
  const markerRefs = useRef<{[key: string]: mapboxgl.Marker}>({});
  
  // Add trip markers to the map
  useEffect(() => {
    if (!map || !mapLoaded) return;

    // Clear existing markers first
    Object.values(markerRefs.current).forEach(marker => marker.remove());
    markerRefs.current = {};
    
    // Add markers for each trip
    trips.forEach(trip => {
      // Simple mock geocoding for demo purposes
      const getCoordinates = (location: string): [number, number] => {
        if (location.includes('Swiss') || location.includes('Zurich')) 
          return [8.5417, 47.3769]; // Swiss coordinates
        if (location.includes('Sahara') || location.includes('Marrakech')) 
          return [-7.9811, 31.6295]; // Morocco coordinates
        return [0, 0]; // Default
      };

      const coords = getCoordinates(trip.location);
      
      // Create a custom HTML element for the marker
      const el = document.createElement('div');
      el.className = 'flex items-center justify-center';
      el.innerHTML = `
        <div class="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center
          ${activeTrip === trip.id ? 'ring-4 ring-primary ring-opacity-50' : ''}"
          style="box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
          <span class="text-xs font-bold">U</span>
        </div>
      `;

      // Create the marker and popup
      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat(coords)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <h3 class="text-sm font-bold">${trip.title}</h3>
          <p class="text-xs">${trip.description}</p>
          <p class="text-xs mt-1">${trip.startDate} - ${trip.endDate || 'Ongoing'}</p>
        `))
        .addTo(map);
        
      // Add click event to the marker
      el.addEventListener('click', () => {
        onTripSelect(trip);
      });
        
      // Store the marker reference
      markerRefs.current[trip.id] = marker;
      
      // If this is the active trip, open its popup
      if (activeTrip === trip.id) {
        marker.togglePopup();
      }
    });
  }, [trips, activeTrip, mapLoaded, map, onTripSelect]);
  
  // Function to fly to a trip location
  const flyToTrip = (trip: TripCardProps) => {
    if (!map) return;
    
    // Simple mock geocoding for demo purposes
    const getCoordinates = (location: string): [number, number] => {
      if (location.includes('Swiss') || location.includes('Zurich')) 
        return [8.5417, 47.3769]; // Swiss coordinates
      if (location.includes('Sahara') || location.includes('Marrakech')) 
        return [-7.9811, 31.6295]; // Morocco coordinates
      return [0, 0]; // Default
    };

    const coords = getCoordinates(trip.location);
    
    map.flyTo({
      center: coords,
      zoom: 9,
      essential: true
    });
    
    // Open the popup for this marker
    if (markerRefs.current[trip.id]) {
      markerRefs.current[trip.id].togglePopup();
    }
  };
  
  return { flyToTrip };
};
