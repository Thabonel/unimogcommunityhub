import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Waypoint } from '@/types/waypoint';
import { DirectionsRoute } from '@/services/mapboxDirections';
import mapboxgl from 'mapbox-gl';

interface WaypointState {
  // Core waypoint data
  waypoints: Map<string, Waypoint>;
  waypointOrder: string[];
  
  // POI data
  pois: Map<string, POI>;
  
  // UI state
  isAddingWaypoints: boolean;
  isAddingPOI: boolean;
  selectedWaypointId: string | null;
  selectedPOIId: string | null;
  
  // Route data
  currentRoute: DirectionsRoute | null;
  routeProfile: 'driving' | 'walking' | 'cycling';
  isLoadingRoute: boolean;
  
  // Map references (not reactive)
  mapRef: mapboxgl.Map | null;
  markers: Map<string, mapboxgl.Marker>;
  
  // Actions
  addWaypoint: (coords: [number, number]) => void;
  removeWaypoint: (id: string) => void;
  updateWaypoint: (id: string, updates: Partial<Waypoint>) => void;
  reorderWaypoints: (newOrder: string[]) => void;
  clearWaypoints: () => void;
  
  // POI actions
  addPOI: (poi: POI) => void;
  removePOI: (id: string) => void;
  updatePOI: (id: string, updates: Partial<POI>) => void;
  
  // UI actions
  setAddingWaypoints: (isAdding: boolean) => void;
  setAddingPOI: (isAdding: boolean) => void;
  selectWaypoint: (id: string | null) => void;
  selectPOI: (id: string | null) => void;
  
  // Route actions
  setRoute: (route: DirectionsRoute | null) => void;
  setRouteProfile: (profile: 'driving' | 'walking' | 'cycling') => void;
  setLoadingRoute: (isLoading: boolean) => void;
  
  // Map actions
  setMap: (map: mapboxgl.Map | null) => void;
  addMarker: (id: string, marker: mapboxgl.Marker) => void;
  removeMarker: (id: string) => void;
  clearMarkers: () => void;
  
  // Computed values
  getOrderedWaypoints: () => Waypoint[];
  getWaypointLabel: (id: string) => string;
}

interface POI {
  id: string;
  coords: [number, number];
  name: string;
  category: 'parking' | 'viewpoint' | 'camping' | 'fuel' | 'food' | 'danger' | 'info' | 'other';
  description?: string;
  rating?: number;
  photos?: string[];
  createdBy: string;
  createdAt: Date;
  isPublic: boolean;
}

const useWaypointStore = create<WaypointState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    waypoints: new Map(),
    waypointOrder: [],
    pois: new Map(),
    isAddingWaypoints: false,
    isAddingPOI: false,
    selectedWaypointId: null,
    selectedPOIId: null,
    currentRoute: null,
    routeProfile: 'driving',
    isLoadingRoute: false,
    mapRef: null,
    markers: new Map(),
    
    // Waypoint actions
    addWaypoint: (coords) => {
      const id = Date.now().toString();
      const { waypoints, waypointOrder, markers } = get();
      
      // Update existing waypoints if we're adding more than 2
      if (waypointOrder.length >= 2) {
        // The previous last waypoint (currently 'B') should become a number
        const previousLastId = waypointOrder[waypointOrder.length - 1];
        const previousLast = waypoints.get(previousLastId);
        if (previousLast) {
          const newName = (waypointOrder.length - 1).toString();
          waypoints.set(previousLastId, {
            ...previousLast,
            name: newName
          });
          
          // Update the marker label
          const marker = markers.get(previousLastId);
          if (marker) {
            const element = marker.getElement();
            if (element) {
              const label = element.querySelector('.waypoint-label');
              if (label) {
                label.textContent = newName;
              }
            }
          }
        }
      }
      
      // Determine the label for the new waypoint
      const index = waypointOrder.length;
      let name: string;
      if (index === 0) {
        name = 'A';
      } else {
        name = 'B'; // Last waypoint is always B
      }
      
      const newWaypoint: Waypoint = {
        id,
        coords,
        name,
        type: 'waypoint',
        order: index
      };
      
      waypoints.set(id, newWaypoint);
      waypointOrder.push(id);
      
      console.log('Added waypoint to store:', {
        id,
        name,
        coords,
        totalWaypoints: waypointOrder.length
      });
      
      set({
        waypoints: new Map(waypoints),
        waypointOrder: [...waypointOrder]
      });
    },
    
    removeWaypoint: (id) => {
      const { waypoints, waypointOrder, markers } = get();
      
      waypoints.delete(id);
      const newOrder = waypointOrder.filter(wId => wId !== id);
      
      // Remove marker
      const marker = markers.get(id);
      if (marker) {
        marker.remove();
        markers.delete(id);
      }
      
      // Relabel remaining waypoints
      newOrder.forEach((wId, index) => {
        const wp = waypoints.get(wId);
        if (wp) {
          let name: string;
          if (index === 0) {
            name = 'A';
          } else if (index === newOrder.length - 1) {
            name = 'B';
          } else {
            name = index.toString();
          }
          waypoints.set(wId, { ...wp, name, order: index });
        }
      });
      
      set({
        waypoints: new Map(waypoints),
        waypointOrder: newOrder,
        markers: new Map(markers)
      });
    },
    
    updateWaypoint: (id, updates) => {
      const { waypoints } = get();
      const waypoint = waypoints.get(id);
      if (waypoint) {
        waypoints.set(id, { ...waypoint, ...updates });
        set({ waypoints: new Map(waypoints) });
      }
    },
    
    reorderWaypoints: (newOrder) => {
      const { waypoints } = get();
      
      // Update order and labels
      newOrder.forEach((id, index) => {
        const wp = waypoints.get(id);
        if (wp) {
          let name: string;
          if (index === 0) {
            name = 'A';
          } else if (index === newOrder.length - 1) {
            name = 'B';
          } else {
            name = index.toString();
          }
          waypoints.set(id, { ...wp, name, order: index });
        }
      });
      
      set({
        waypoints: new Map(waypoints),
        waypointOrder: newOrder
      });
    },
    
    clearWaypoints: () => {
      const { markers } = get();
      
      // Remove all markers
      markers.forEach(marker => marker.remove());
      
      set({
        waypoints: new Map(),
        waypointOrder: [],
        markers: new Map(),
        currentRoute: null,
        selectedWaypointId: null
      });
    },
    
    // POI actions
    addPOI: (poi) => {
      const { pois } = get();
      pois.set(poi.id, poi);
      set({ pois: new Map(pois) });
    },
    
    removePOI: (id) => {
      const { pois, markers } = get();
      pois.delete(id);
      
      // Remove marker
      const marker = markers.get(`poi-${id}`);
      if (marker) {
        marker.remove();
        markers.delete(`poi-${id}`);
      }
      
      set({ 
        pois: new Map(pois),
        markers: new Map(markers)
      });
    },
    
    updatePOI: (id, updates) => {
      const { pois } = get();
      const poi = pois.get(id);
      if (poi) {
        pois.set(id, { ...poi, ...updates });
        set({ pois: new Map(pois) });
      }
    },
    
    // UI actions
    setAddingWaypoints: (isAdding) => {
      set({ 
        isAddingWaypoints: isAdding,
        isAddingPOI: false // Can't add both at once
      });
      
      // Update cursor
      const { mapRef } = get();
      if (mapRef) {
        const canvas = mapRef.getCanvas();
        if (canvas) {
          canvas.style.cursor = isAdding ? 'crosshair' : '';
        }
      }
    },
    
    setAddingPOI: (isAdding) => {
      set({ 
        isAddingPOI: isAdding,
        isAddingWaypoints: false // Can't add both at once
      });
      
      // Update cursor
      const { mapRef } = get();
      if (mapRef) {
        const canvas = mapRef.getCanvas();
        if (canvas) {
          canvas.style.cursor = isAdding ? 'crosshair' : '';
        }
      }
    },
    
    selectWaypoint: (id) => set({ selectedWaypointId: id }),
    selectPOI: (id) => set({ selectedPOIId: id }),
    
    // Route actions
    setRoute: (route) => set({ currentRoute: route }),
    setRouteProfile: (profile) => set({ routeProfile: profile }),
    setLoadingRoute: (isLoading) => set({ isLoadingRoute: isLoading }),
    
    // Map actions
    setMap: (map) => set({ mapRef: map }),
    
    addMarker: (id, marker) => {
      const { markers } = get();
      markers.set(id, marker);
      set({ markers: new Map(markers) });
    },
    
    removeMarker: (id) => {
      const { markers } = get();
      const marker = markers.get(id);
      if (marker) {
        marker.remove();
        markers.delete(id);
        set({ markers: new Map(markers) });
      }
    },
    
    clearMarkers: () => {
      const { markers } = get();
      markers.forEach(marker => marker.remove());
      set({ markers: new Map() });
    },
    
    // Computed values
    getOrderedWaypoints: () => {
      const { waypoints, waypointOrder } = get();
      return waypointOrder
        .map(id => waypoints.get(id))
        .filter(Boolean) as Waypoint[];
    },
    
    getWaypointLabel: (id) => {
      const { waypoints, waypointOrder } = get();
      const index = waypointOrder.indexOf(id);
      if (index === 0) return 'A';
      if (index === waypointOrder.length - 1) return 'B';
      return index.toString();
    }
  }))
);

export default useWaypointStore;
export type { POI };