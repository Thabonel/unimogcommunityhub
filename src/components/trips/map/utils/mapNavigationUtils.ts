
import mapboxgl from 'mapbox-gl';

/**
 * Fits the map view to show all coordinates within bounds with padding
 */
export const fitMapToBounds = (
  map: mapboxgl.Map, 
  coords: [number, number][]
): void => {
  if (!coords.length) return;
  
  const bounds = new mapboxgl.LngLatBounds();
  
  coords.forEach(coord => {
    bounds.extend(coord);
  });
  
  map.fitBounds(bounds, {
    padding: 80,
    duration: 1000
  });
};

/**
 * Smoothly animates the map to center on specific coordinates
 */
export const flyToLocation = (
  map: mapboxgl.Map,
  coordinates: [number, number],
  zoom: number = 10
): void => {
  map.flyTo({
    center: coordinates,
    zoom,
    duration: 1000
  });
};
