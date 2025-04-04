
import mapboxgl from 'mapbox-gl';

/**
 * Clear existing markers from the map
 */
export const clearMapMarkers = (map: mapboxgl.Map): void => {
  const existingStartMarker = document.getElementById('start-marker');
  if (existingStartMarker) existingStartMarker.remove();
  
  const existingEndMarker = document.getElementById('end-marker');
  if (existingEndMarker) existingEndMarker.remove();
};

/**
 * Add location markers to the map
 */
export const addLocationMarkers = (
  map: mapboxgl.Map,
  startLocation: string | undefined, 
  startCoords: [number, number],
  endLocation: string | undefined,
  endCoords: [number, number]
): void => {
  // Add markers for start and end if we have coordinates
  if (startLocation) {
    // Add start marker
    const startMarkerElement = document.createElement('div');
    startMarkerElement.id = 'start-marker';
    startMarkerElement.className = 'marker start-marker';
    
    const startMarker = new mapboxgl.Marker({ color: '#3887be', element: startMarkerElement })
      .setLngLat(startCoords)
      .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>Start: ${startLocation}</h3>`))
      .addTo(map);
  }
  
  if (endLocation) {
    // Add end marker
    const endMarkerElement = document.createElement('div');
    endMarkerElement.id = 'end-marker';
    endMarkerElement.className = 'marker end-marker';
    
    const endMarker = new mapboxgl.Marker({ color: '#f30', element: endMarkerElement })
      .setLngLat(endCoords)
      .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>End: ${endLocation}</h3>`))
      .addTo(map);
  }
};
