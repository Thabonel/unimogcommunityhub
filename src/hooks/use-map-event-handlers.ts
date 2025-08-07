import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import useWaypointStore from '@/stores/waypointStore';
import { toast } from 'sonner';

interface UseMapEventHandlersProps {
  map: mapboxgl.Map | null;
  enabled?: boolean;
}

/**
 * Memory-safe event handler hook for map interactions
 * Uses refs to avoid stale closures and prevent memory leaks
 */
export function useMapEventHandlers({ map, enabled = true }: UseMapEventHandlersProps) {
  const clickHandlerRef = useRef<((e: mapboxgl.MapMouseEvent) => void) | null>(null);
  const moveHandlerRef = useRef<(() => void) | null>(null);
  const lastClickTime = useRef<number>(0);
  
  // Get store actions (stable references)
  const addWaypoint = useWaypointStore(state => state.addWaypoint);
  const addPOI = useWaypointStore(state => state.addPOI);
  const isAddingWaypoints = useWaypointStore(state => state.isAddingWaypoints);
  const isAddingPOI = useWaypointStore(state => state.isAddingPOI);
  const addMarker = useWaypointStore(state => state.addMarker);
  const getOrderedWaypoints = useWaypointStore(state => state.getOrderedWaypoints);
  
  // Set up click handler
  useEffect(() => {
    if (!map || !enabled) return;
    
    console.log('Setting up click handler for map');
    
    // Create click handler
    const handleClick = (e: mapboxgl.MapMouseEvent) => {
      // Prevent event propagation
      e.preventDefault();
      
      // Debounce rapid clicks (prevent multiple waypoints from single click)
      const now = Date.now();
      if (now - lastClickTime.current < 200) {
        console.log('Click debounced (too rapid)');
        return;
      }
      lastClickTime.current = now;
      
      const coords: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      
      // Check current state from store
      const state = useWaypointStore.getState();
      
      console.log('Map clicked!', {
        coords,
        isAddingWaypoints: state.isAddingWaypoints,
        isAddingPOI: state.isAddingPOI
      });
      
      if (state.isAddingWaypoints) {
        console.log('Adding waypoint at:', coords);
        
        // Add waypoint
        addWaypoint(coords);
        
        // Create marker with proper label
        const updatedState = useWaypointStore.getState();
        const waypoints = updatedState.getOrderedWaypoints();
        const newWaypoint = waypoints[waypoints.length - 1];
        
        if (newWaypoint) {
          // Get the correct label
          const label = updatedState.getWaypointLabel(newWaypoint.id);
          const marker = createWaypointMarker(coords, label);
          if (marker) {
            marker.addTo(map);
            addMarker(newWaypoint.id, marker);
          }
          console.log(`Added waypoint ${label} at:`, coords);
        }
      } else if (state.isAddingPOI) {
        // Create POI
        const poi = {
          id: Date.now().toString(),
          coords,
          name: 'New POI',
          category: 'info' as const,
          createdBy: 'current-user', // TODO: Get from auth
          createdAt: new Date(),
          isPublic: true
        };
        
        addPOI(poi);
        
        // Create POI marker
        const marker = createPOIMarker(coords, poi.category);
        if (marker) {
          marker.addTo(map);
          addMarker(`poi-${poi.id}`, marker);
        }
        
        toast.success('POI added - click to edit details');
      }
    };
    
    // Remove any existing listener first
    if (clickHandlerRef.current) {
      map.off('click', clickHandlerRef.current);
    }
    
    // Store ref and add listener
    clickHandlerRef.current = handleClick;
    map.on('click', handleClick);
    
    console.log('Click handler registered');
    
    // Cleanup
    return () => {
      if (map && clickHandlerRef.current) {
        console.log('Removing click handler');
        map.off('click', clickHandlerRef.current);
        clickHandlerRef.current = null;
      }
    };
  }, [map, enabled, addWaypoint, addPOI, addMarker, getOrderedWaypoints]);
  
  // Set up cursor handler
  useEffect(() => {
    if (!map || !enabled) return;
    
    // Create move handler for cursor updates
    const handleMouseMove = () => {
      const state = useWaypointStore.getState();
      const canvas = map.getCanvas();
      
      if (state.isAddingWaypoints || state.isAddingPOI) {
        canvas.style.cursor = 'crosshair';
      } else {
        canvas.style.cursor = '';
      }
    };
    
    // Store ref and add listener
    moveHandlerRef.current = handleMouseMove;
    map.on('mousemove', handleMouseMove);
    
    // Initial cursor update
    handleMouseMove();
    
    // Cleanup
    return () => {
      if (map && moveHandlerRef.current) {
        map.off('mousemove', moveHandlerRef.current);
        moveHandlerRef.current = null;
      }
    };
  }, [map, enabled]);
  
  // Subscribe to store changes for cursor updates
  useEffect(() => {
    if (!map) return;
    
    const unsubscribe = useWaypointStore.subscribe(
      (state) => ({ isAddingWaypoints: state.isAddingWaypoints, isAddingPOI: state.isAddingPOI }),
      ({ isAddingWaypoints, isAddingPOI }) => {
        const canvas = map.getCanvas();
        if (canvas) {
          canvas.style.cursor = (isAddingWaypoints || isAddingPOI) ? 'crosshair' : '';
        }
      }
    );
    
    return unsubscribe;
  }, [map]);
}

// Helper function to create waypoint marker
function createWaypointMarker(coords: [number, number], label: string): mapboxgl.Marker {
  const el = document.createElement('div');
  el.className = 'waypoint-marker';
  el.style.width = '30px';
  el.style.height = '30px';
  el.style.position = 'relative';
  
  // Create the pin
  const pin = document.createElement('div');
  pin.style.width = '100%';
  pin.style.height = '100%';
  pin.style.backgroundColor = '#FF0000';
  pin.style.borderRadius = '50% 50% 50% 0';
  pin.style.transform = 'rotate(-45deg)';
  pin.style.border = '2px solid white';
  pin.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
  pin.style.cursor = 'pointer';
  el.appendChild(pin);
  
  // Create the label
  const labelEl = document.createElement('div');
  labelEl.className = 'waypoint-label';
  labelEl.style.position = 'absolute';
  labelEl.style.top = '50%';
  labelEl.style.left = '50%';
  labelEl.style.transform = 'translate(-50%, -50%) rotate(45deg)';
  labelEl.style.color = 'white';
  labelEl.style.fontWeight = 'bold';
  labelEl.style.fontSize = '12px';
  labelEl.style.pointerEvents = 'none';
  labelEl.textContent = label;
  pin.appendChild(labelEl);
  
  return new mapboxgl.Marker(el).setLngLat(coords);
}

// Helper function to create POI marker
function createPOIMarker(coords: [number, number], category: string): mapboxgl.Marker {
  const el = document.createElement('div');
  el.className = 'poi-marker';
  el.style.width = '24px';
  el.style.height = '24px';
  el.style.borderRadius = '50%';
  el.style.border = '2px solid white';
  el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
  el.style.cursor = 'pointer';
  
  // Set color based on category
  const colors: Record<string, string> = {
    parking: '#3B82F6', // blue
    viewpoint: '#10B981', // green
    camping: '#F59E0B', // yellow
    fuel: '#EF4444', // red
    food: '#8B5CF6', // purple
    danger: '#DC2626', // dark red
    info: '#6B7280', // gray
    other: '#6B7280'
  };
  
  el.style.backgroundColor = colors[category] || colors.other;
  
  // Add icon
  const icon = document.createElement('div');
  icon.style.width = '100%';
  icon.style.height = '100%';
  icon.style.display = 'flex';
  icon.style.alignItems = 'center';
  icon.style.justifyContent = 'center';
  icon.style.color = 'white';
  icon.style.fontSize = '12px';
  icon.style.fontWeight = 'bold';
  
  const icons: Record<string, string> = {
    parking: 'P',
    viewpoint: '👁',
    camping: '⛺',
    fuel: '⛽',
    food: '🍽',
    danger: '⚠',
    info: 'i',
    other: '?'
  };
  
  icon.textContent = icons[category] || icons.other;
  el.appendChild(icon);
  
  return new mapboxgl.Marker(el).setLngLat(coords);
}

export { createWaypointMarker, createPOIMarker };