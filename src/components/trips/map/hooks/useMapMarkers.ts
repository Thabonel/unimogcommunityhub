
import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { TripCardProps } from '../../TripCard';

export function useMapMarkers(
  map: mapboxgl.Map | null,
  trips: TripCardProps[],
  activeTrip: string | null,
  onTripSelect: (trip: TripCardProps) => void,
  mapLoaded: boolean
) {
  // Add markers for each trip when map is loaded
  useEffect(() => {
    if (!map || !mapLoaded) return;

    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.mapboxgl-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Create a bounds object to fit all markers
    const bounds = new mapboxgl.LngLatBounds();
    let hasValidCoordinates = false;

    // Add markers for each trip
    trips.forEach(trip => {
      // Extract coordinates from trip data
      // In a real app, these would come directly from your trip data
      // For this mock, we'll generate some coordinates near the start/end locations
      
      let lng = 0;
      let lat = 0;
      
      // Try to extract coordinates from locations using a simplified approach
      if (trip.startLocation) {
        // This is a very simplistic mock - in real app you'd use geocoding
        if (trip.startLocation.includes('Zurich')) {
          lng = 8.5417;
          lat = 47.3769;
        } else if (trip.startLocation.includes('Marrakech')) {
          lng = -7.9811;
          lat = 31.6295;
        } else if (trip.startLocation.includes('Stuttgart')) {
          lng = 9.1829;
          lat = 48.7758;
        } else {
          // Random coordinates for other locations
          lng = 8 + Math.random() * 4;
          lat = 47 + Math.random() * 4;
        }
      }
      
      if (lng !== 0 && lat !== 0) {
        hasValidCoordinates = true;
        
        // Create marker element
        const markerEl = document.createElement('div');
        markerEl.className = `trip-marker ${activeTrip === trip.id ? 'active' : ''}`;
        markerEl.innerHTML = `
          <div class="relative">
            <div class="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white shadow-lg">
              <span class="text-xs">${trip.difficulty.charAt(0).toUpperCase()}</span>
            </div>
            ${activeTrip === trip.id ? '<div class="absolute inset-0 animate-ping rounded-full bg-primary/50"></div>' : ''}
          </div>
        `;
        
        // Add marker to map
        const marker = new mapboxgl.Marker({
          element: markerEl
        })
          .setLngLat([lng, lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <div>
                  <h3 class="text-sm font-bold">${trip.title}</h3>
                  <p class="text-xs">${trip.location}</p>
                  <p class="text-xs mt-1">${trip.distance} km, ${trip.duration} days</p>
                  <button 
                    class="text-xs text-blue-600 hover:underline mt-2"
                    id="view-trip-${trip.id}"
                  >
                    View Details
                  </button>
                </div>
              `)
          )
          .addTo(map);
          
        // Extend bounds to include this marker
        bounds.extend([lng, lat]);
        
        // Add click handler to popup button
        marker.getPopup().on('open', () => {
          setTimeout(() => {
            const viewButton = document.getElementById(`view-trip-${trip.id}`);
            if (viewButton) {
              viewButton.addEventListener('click', () => {
                onTripSelect(trip);
              });
            }
          }, 10);
        });
      }
    });
    
    // Fit bounds if we have valid coordinates
    if (hasValidCoordinates) {
      map.fitBounds(bounds, {
        padding: 50,
        maxZoom: 12
      });
    }
  }, [map, trips, activeTrip, mapLoaded, onTripSelect]);
  
  // Function to fly to a specific trip
  const flyToTrip = (trip: TripCardProps) => {
    if (!map) return;
    
    let lng = 0;
    let lat = 0;
    
    // Extract coordinates from the trip in the same way as above
    if (trip.startLocation) {
      if (trip.startLocation.includes('Zurich')) {
        lng = 8.5417;
        lat = 47.3769;
      } else if (trip.startLocation.includes('Marrakech')) {
        lng = -7.9811;
        lat = 31.6295;
      } else if (trip.startLocation.includes('Stuttgart')) {
        lng = 9.1829;
        lat = 48.7758;
      }
    }
    
    if (lng !== 0 && lat !== 0) {
      map.flyTo({
        center: [lng, lat],
        zoom: 10,
        duration: 2000
      });
    }
  };
  
  return { flyToTrip };
}
