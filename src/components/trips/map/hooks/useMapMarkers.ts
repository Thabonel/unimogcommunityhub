
import { useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { TripCardProps } from '../../TripCard';

export const useMapMarkers = (
  map: mapboxgl.Map | null,
  trips: TripCardProps[],
  activeTrip: string | null,
  onTripSelect: (trip: TripCardProps) => void,
  mapLoaded: boolean
) => {
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);

  // Function to add markers for all trips
  const addTripMarkers = useCallback(() => {
    if (!map || !mapLoaded) return;
    
    // Remove existing markers
    markers.forEach(marker => marker.remove());
    
    const newMarkers: mapboxgl.Marker[] = [];
    
    // Create markers for each trip
    trips.forEach(trip => {
      // Mock coordinates based on trip locations
      const startCoords = getMockCoordinates(trip.startLocation);
      const endCoords = getMockCoordinates(trip.endLocation);
      
      if (startCoords) {
        // Create marker for start location
        const el = document.createElement('div');
        el.className = 'relative flex items-center justify-center';
        el.innerHTML = `
          <div class="absolute w-4 h-4 bg-green-500 rounded-full -ml-2 -mt-2 ${
            trip.id === activeTrip ? 'animate-ping' : ''
          }"></div>
          <div class="w-3 h-3 bg-green-600 rounded-full"></div>
        `;
        
        const marker = new mapboxgl.Marker(el)
          .setLngLat(startCoords)
          .addTo(map);
          
        // Add popup with trip info
        marker.setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-2">
                <h3 class="font-bold">${trip.title}</h3>
                <p class="text-xs mt-1">${trip.description.substring(0, 100)}...</p>
                <p class="text-xs mt-2">
                  <span class="font-semibold">Start:</span> ${trip.startLocation}
                </p>
                <p class="text-xs">
                  <span class="font-semibold">End:</span> ${trip.endLocation}
                </p>
              </div>
            `)
        );
        
        // Add click handler
        marker.getElement().addEventListener('click', () => {
          onTripSelect(trip);
        });
        
        newMarkers.push(marker);
      }
      
      if (endCoords) {
        // Create marker for end location
        const el = document.createElement('div');
        el.className = 'relative flex items-center justify-center';
        el.innerHTML = `
          <div class="absolute w-4 h-4 bg-red-500 rounded-full -ml-2 -mt-2 ${
            trip.id === activeTrip ? 'animate-ping' : ''
          }"></div>
          <div class="w-3 h-3 bg-red-600 rounded-full"></div>
        `;
        
        const marker = new mapboxgl.Marker(el)
          .setLngLat(endCoords)
          .addTo(map);
        
        newMarkers.push(marker);
      }
    });
    
    setMarkers(newMarkers);
  }, [map, trips, activeTrip, onTripSelect, mapLoaded, markers]);
  
  // Function to fly to a specific trip on the map
  const flyToTrip = useCallback((trip: TripCardProps) => {
    if (!map) return;
    
    // Get coordinates for the trip
    const startCoords = getMockCoordinates(trip.startLocation);
    const endCoords = getMockCoordinates(trip.endLocation);
    
    if (startCoords && endCoords) {
      // Create a bounds that includes both start and end
      const bounds = new mapboxgl.LngLatBounds()
        .extend(startCoords)
        .extend(endCoords);
      
      // Fit the map to the bounds
      map.fitBounds(bounds, {
        padding: 100,
        maxZoom: 10,
        duration: 1000
      });
    } else if (startCoords) {
      // Just fly to start coordinates
      map.flyTo({
        center: startCoords,
        zoom: 10,
        duration: 1000
      });
    }
  }, [map]);
  
  // Update markers when trips or active trip changes
  useState(() => {
    addTripMarkers();
  }, [trips, activeTrip, addTripMarkers]);
  
  return {
    markers,
    addTripMarkers,
    flyToTrip
  };
};

// Helper function to get mock coordinates based on location string
function getMockCoordinates(location?: string): [number, number] | null {
  if (!location) return null;
  
  const mockCoordinates: Record<string, [number, number]> = {
    'Zurich': [8.5417, 47.3769],
    'Switzerland': [8.2275, 46.8182],
    'Interlaken': [7.8632, 46.6863],
    'Marrakech': [-7.9811, 31.6295],
    'Morocco': [-7.0926, 31.7917],
    'Merzouga': [-4.0185, 31.1616],
    'New York': [-74.0060, 40.7128],
    'Los Angeles': [-118.2437, 34.0522],
    'Chicago': [-87.6298, 41.8781],
    'Stuttgart': [9.1829, 48.7758],
    'Munich': [11.5820, 48.1351],
    'Berlin': [13.4050, 52.5200],
    'Germany': [10.4515, 51.1657],
    'Alps': [8.2275, 46.8182],
    'Sahara': [2.2000, 29.0000],
    'Desert': [2.2000, 29.0000]
  };
  
  // Search for keywords in the location string
  for (const [key, coords] of Object.entries(mockCoordinates)) {
    if (location.toLowerCase().includes(key.toLowerCase())) {
      return coords;
    }
  }
  
  // Default fallback
  return [9.1829, 48.7758]; // Stuttgart, Germany (Unimog hometown)
}
