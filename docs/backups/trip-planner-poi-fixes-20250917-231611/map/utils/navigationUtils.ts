
import mapboxgl from 'mapbox-gl';

// Fit map to bounds with padding
export const fitMapToBounds = (
  map: mapboxgl.Map, 
  coordinates: [number, number][], 
  padding: number = 100
): void => {
  try {
    const bounds = new mapboxgl.LngLatBounds();
    
    coordinates.forEach(coord => {
      bounds.extend(coord);
    });
    
    map.fitBounds(bounds, { padding });
  } catch (error) {
    console.error('Error fitting map to bounds:', error);
  }
};

// Fly to a specific location
export const flyToLocation = (
  map: mapboxgl.Map, 
  coordinates: [number, number], 
  zoom: number = 12
): void => {
  try {
    map.flyTo({
      center: coordinates,
      zoom,
      essential: true
    });
  } catch (error) {
    console.error('Error flying to location:', error);
  }
};
