
import mapboxgl from 'mapbox-gl';

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
