
import mapboxgl from 'mapbox-gl';

/**
 * Adds a start marker to the map
 */
export const addStartMarker = (
  map: mapboxgl.Map,
  name: string,
  coordinates: [number, number]
): mapboxgl.Marker => {
  const marker = new mapboxgl.Marker({ color: '#4CAF50' })
    .setLngLat(coordinates)
    .setPopup(new mapboxgl.Popup().setHTML(`<p><b>Start:</b> ${name}</p>`))
    .addTo(map);
  
  // Set marker ID for later reference
  const el = marker.getElement();
  el.id = 'start-marker';
  
  return marker;
};

/**
 * Adds an end marker to the map
 */
export const addEndMarker = (
  map: mapboxgl.Map,
  name: string,
  coordinates: [number, number]
): mapboxgl.Marker => {
  const marker = new mapboxgl.Marker({ color: '#F44336' })
    .setLngLat(coordinates)
    .setPopup(new mapboxgl.Popup().setHTML(`<p><b>End:</b> ${name}</p>`))
    .addTo(map);
  
  // Set marker ID for later reference
  const el = marker.getElement();
  el.id = 'end-marker';
  
  return marker;
};

/**
 * Adds a waypoint marker to the map
 */
export const addWaypointMarker = (
  map: mapboxgl.Map,
  name: string,
  coordinates: [number, number],
  index: number
): mapboxgl.Marker => {
  const marker = new mapboxgl.Marker({ color: '#2196F3' })
    .setLngLat(coordinates)
    .setPopup(new mapboxgl.Popup().setHTML(`<p><b>Waypoint ${index + 1}:</b> ${name}</p>`))
    .addTo(map);
  
  // Set marker ID for later reference
  const el = marker.getElement();
  el.id = `waypoint-marker-${index}`;
  
  return marker;
};
