
import mapboxgl from 'mapbox-gl';
import { Trip } from '@/types/trip';

/**
 * Clear any existing markers from the map
 */
export const clearMapMarkers = (map: mapboxgl.Map): void => {
  // Remove any markers with the specific IDs we use
  const markers = document.querySelectorAll('.mapboxgl-marker');
  markers.forEach(marker => {
    marker.remove();
  });
};

/**
 * Add location markers to the map
 */
export const addLocationMarkers = (
  map: mapboxgl.Map,
  startLocationName: string,
  startCoords: [number, number],
  endLocationName?: string,
  endCoords?: [number, number]
): void => {
  // Add start location marker
  if (startLocationName && startCoords) {
    const startMarker = new mapboxgl.Marker({ color: '#3887be' })
      .setLngLat(startCoords)
      .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <h3>Start: ${startLocationName}</h3>
      `))
      .addTo(map);
    
    // Add ID to the marker element for easier removal later
    const markerElement = startMarker.getElement();
    markerElement.id = 'start-marker';
  }
  
  // Add end location marker if provided
  if (endLocationName && endCoords) {
    const endMarker = new mapboxgl.Marker({ color: '#f30' })
      .setLngLat(endCoords)
      .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <h3>Destination: ${endLocationName}</h3>
      `))
      .addTo(map);
    
    // Add ID to the marker element for easier removal later
    const markerElement = endMarker.getElement();
    markerElement.id = 'end-marker';
  }
};

/**
 * Load trips on the map with markers
 */
export const loadTripsOnMap = (map: mapboxgl.Map, trips: Trip[]): void => {
  if (!trips || trips.length === 0) {
    console.log("No trips to load on the map.");
    return;
  }

  // Clear any existing markers first
  const existingMarkers = document.querySelectorAll('.marker');
  existingMarkers.forEach(marker => marker.remove());

  console.log(`Loading ${trips.length} trips on the map`);
  
  trips.forEach(trip => {
    if (trip.start_location?.latitude && trip.start_location?.longitude) {
      // Create a DOM element for each trip marker
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage = `url(${trip.image_url || '/img/default-unimog-marker.png'})`;
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.backgroundSize = 'cover';
      el.style.borderRadius = '50%';

      // Add a popup for each marker
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <h3>${trip.title}</h3>
          <p>${trip.description}</p>
          <img src="${trip.image_url || '/img/default-unimog-marker.png'}" alt="${trip.title}" style="width: 200px; height: auto;">
        `);

      // Add a marker for each trip
      new mapboxgl.Marker(el)
        .setLngLat([trip.start_location.longitude, trip.start_location.latitude])
        .setPopup(popup) // sets a popup on this marker
        .addTo(map);
    } else {
      console.warn(`Trip ${trip.id} has no valid start location coordinates`);
    }
  });
};
