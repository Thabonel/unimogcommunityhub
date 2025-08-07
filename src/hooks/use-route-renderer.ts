import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import useWaypointStore from '@/stores/waypointStore';
import { getDirections } from '@/services/mapboxDirections';
import { debounce } from 'lodash';

interface UseRouteRendererProps {
  map: mapboxgl.Map | null;
  enabled?: boolean;
}

/**
 * Hook to render routes on the map with real-time updates
 * Handles route calculation and rendering with road-following green lines
 */
export function useRouteRenderer({ map, enabled = true }: UseRouteRendererProps) {
  const routeSourceId = useRef('route-source');
  const routeLayerId = useRef('route-layer');
  const isInitialized = useRef(false);
  
  // Subscribe to waypoint changes - use selectors properly
  const waypointOrder = useWaypointStore(state => state.waypointOrder);
  const waypointsMap = useWaypointStore(state => state.waypoints);
  const routeProfile = useWaypointStore(state => state.routeProfile);
  const setRoute = useWaypointStore(state => state.setRoute);
  const setLoadingRoute = useWaypointStore(state => state.setLoadingRoute);
  
  // Compute ordered waypoints from the state
  const waypoints = React.useMemo(() => {
    return waypointOrder
      .map(id => waypointsMap.get(id))
      .filter(Boolean) as any[];
  }, [waypointOrder, waypointsMap]);
  
  // Initialize route layer
  useEffect(() => {
    if (!map || !enabled || isInitialized.current) return;
    
    // Wait for map to be fully loaded
    const setupLayer = () => {
      // Add empty source
      if (!map.getSource(routeSourceId.current)) {
        map.addSource(routeSourceId.current, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: []
            }
          }
        });
      }
      
      // Add route layer
      if (!map.getLayer(routeLayerId.current)) {
        map.addLayer({
          id: routeLayerId.current,
          type: 'line',
          source: routeSourceId.current,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#00ff00',
            'line-width': 4,
            'line-opacity': 0.75
          }
        });
      }
      
      isInitialized.current = true;
    };
    
    if (map.loaded()) {
      setupLayer();
    } else {
      map.once('load', setupLayer);
    }
    
    // Cleanup
    return () => {
      if (map && isInitialized.current) {
        if (map.getLayer(routeLayerId.current)) {
          map.removeLayer(routeLayerId.current);
        }
        if (map.getSource(routeSourceId.current)) {
          map.removeSource(routeSourceId.current);
        }
        isInitialized.current = false;
      }
    };
  }, [map, enabled]);
  
  // Debounced route calculation
  const calculateRoute = useRef(
    debounce(async (waypoints: any[], profile: string, map: mapboxgl.Map) => {
      if (waypoints.length < 2 || !map.getSource(routeSourceId.current)) return;
      
      setLoadingRoute(true);
      
      try {
        const route = await getDirections(waypoints, profile as any);
        
        if (route && route.geometry) {
          // Update route on map
          const source = map.getSource(routeSourceId.current) as mapboxgl.GeoJSONSource;
          if (source) {
            source.setData({
              type: 'Feature',
              properties: {},
              geometry: route.geometry
            });
          }
          
          // Store route in state
          setRoute(route);
          
          // Fit map to route bounds
          const coordinates = route.geometry.coordinates;
          const bounds = coordinates.reduce((bounds, coord) => {
            return bounds.extend(coord as [number, number]);
          }, new mapboxgl.LngLatBounds(coordinates[0] as [number, number], coordinates[0] as [number, number]));
          
          map.fitBounds(bounds, {
            padding: 100,
            duration: 1000
          });
        } else {
          // Fallback to straight lines if directions fail
          const source = map.getSource(routeSourceId.current) as mapboxgl.GeoJSONSource;
          if (source) {
            source.setData({
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: waypoints.map(wp => wp.coords)
              }
            });
          }
        }
      } catch (error) {
        console.error('Error calculating route:', error);
        
        // Fallback to straight lines
        const source = map.getSource(routeSourceId.current) as mapboxgl.GeoJSONSource;
        if (source) {
          source.setData({
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: waypoints.map(wp => wp.coords)
            }
          });
        }
      } finally {
        setLoadingRoute(false);
      }
    }, 500)
  ).current;
  
  // Update route when waypoints or profile changes
  useEffect(() => {
    if (!map || !enabled || !isInitialized.current) return;
    
    console.log('Route renderer: waypoint count changed:', waypoints.length);
    
    if (waypoints.length >= 2) {
      console.log('Calculating route for waypoints:', waypoints);
      calculateRoute(waypoints, routeProfile, map);
    } else {
      // Clear route if less than 2 waypoints
      const source = map.getSource(routeSourceId.current) as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: []
          }
        });
      }
      setRoute(null);
    }
  }, [waypoints, routeProfile, map, enabled, calculateRoute, setRoute]);
  
  // Handle map style changes
  useEffect(() => {
    if (!map || !enabled) return;
    
    const handleStyleData = () => {
      // Re-add layer after style change
      if (isInitialized.current && !map.getLayer(routeLayerId.current)) {
        // Re-add source
        if (!map.getSource(routeSourceId.current)) {
          map.addSource(routeSourceId.current, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: waypoints.map(wp => wp.coords)
              }
            }
          });
        }
        
        // Re-add layer
        map.addLayer({
          id: routeLayerId.current,
          type: 'line',
          source: routeSourceId.current,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#00ff00',
            'line-width': 4,
            'line-opacity': 0.75
          }
        });
        
        // Recalculate route
        if (waypoints.length >= 2) {
          calculateRoute(waypoints, routeProfile, map);
        }
      }
    };
    
    map.on('style.load', handleStyleData);
    
    return () => {
      map.off('style.load', handleStyleData);
    };
  }, [map, enabled, waypoints, routeProfile, calculateRoute]);
}

export default useRouteRenderer;