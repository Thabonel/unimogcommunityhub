
import mapboxgl from 'mapbox-gl';

/**
 * Makes the map fly to a specific location
 */
export const flyToLocation = (map: mapboxgl.Map, coordinates: [number, number], zoom?: number): void => {
  if (!map) return;
  
  map.flyTo({
    center: coordinates,
    zoom: zoom || map.getZoom(),
    essential: true // Animation will happen even if user has "prefers-reduced-motion" enabled
  });
};

/**
 * Fits the map view to include all provided coordinates
 */
export const fitMapToBounds = (map: mapboxgl.Map, coordinates: [number, number][]): void => {
  if (!map || coordinates.length === 0) return;
  
  const bounds = new mapboxgl.LngLatBounds();
  
  // Add each coordinate to the bounds
  coordinates.forEach(coord => {
    bounds.extend(coord);
  });
  
  // Fit the map to the bounds with padding
  map.fitBounds(bounds, {
    padding: 50, // Add padding around the bounds
    maxZoom: 15, // Don't zoom in too far
    duration: 1000 // Animation duration in milliseconds
  });
};

/**
 * Creates markers for start and end locations
 */
export const createMapMarkers = (map: mapboxgl.Map, 
                                startCoords: [number, number], 
                                endCoords: [number, number]) => {
  // Create start marker
  new mapboxgl.Marker({ color: '#3880ff' })
    .setLngLat(startCoords)
    .addTo(map);
    
  // Create end marker
  new mapboxgl.Marker({ color: '#ff3860' })
    .setLngLat(endCoords)
    .addTo(map);
    
  // Fit map to include both markers
  fitMapToBounds(map, [startCoords, endCoords]);
};
