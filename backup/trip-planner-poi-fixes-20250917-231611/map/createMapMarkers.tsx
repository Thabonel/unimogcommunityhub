
import mapboxgl from 'mapbox-gl';

/**
 * Creates and adds a custom start marker to the map
 */
export const addStartMarker = (map: mapboxgl.Map, location: string, coordinates: [number, number]): void => {
  // Create a custom marker element for the start point
  const startMarkerEl = document.createElement('div');
  startMarkerEl.id = 'start-marker';
  startMarkerEl.className = 'flex items-center justify-center';
  startMarkerEl.innerHTML = `
    <div class="relative">
      <div class="absolute -top-10 -left-2 px-2 py-1 rounded-md bg-primary text-white text-xs whitespace-nowrap">
        ${location}
      </div>
      <div class="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </div>
    </div>
  `;
  
  new mapboxgl.Marker({ element: startMarkerEl })
    .setLngLat(coordinates)
    .addTo(map);
};

/**
 * Creates and adds a custom end marker to the map
 */
export const addEndMarker = (map: mapboxgl.Map, location: string, coordinates: [number, number]): void => {
  // Create a custom marker element for the end point
  const endMarkerEl = document.createElement('div');
  endMarkerEl.id = 'end-marker';
  endMarkerEl.className = 'flex items-center justify-center';
  endMarkerEl.innerHTML = `
    <div class="relative">
      <div class="absolute -top-10 -left-2 px-2 py-1 rounded-md bg-secondary text-white text-xs whitespace-nowrap">
        ${location}
      </div>
      <div class="h-6 w-6 rounded-full bg-secondary text-white flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 8v8"></path>
          <path d="M8 12h8"></path>
        </svg>
      </div>
    </div>
  `;
  
  new mapboxgl.Marker({ element: endMarkerEl })
    .setLngLat(coordinates)
    .addTo(map);
};
