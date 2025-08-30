import { useState, useRef, useCallback, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Waypoint, ManualWaypoint, RouteOptions } from '@/types/waypoint';
import { toast } from 'sonner';
import { getDirections, formatDistance, formatDuration, DirectionsRoute } from '@/services/mapboxDirections';

interface WaypointManagerProps {
  map: mapboxgl.Map | null;
  onRouteUpdate?: (waypoints: Waypoint[]) => void;
}

export function useWaypointManager({ map, onRouteUpdate }: WaypointManagerProps) {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [manualWaypoints, setManualWaypoints] = useState<ManualWaypoint[]>([]);
  const [origin, setOrigin] = useState<Waypoint | null>(null);
  const [destination, setDestination] = useState<Waypoint | null>(null);
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);
  const [originLocked, setOriginLocked] = useState(false);
  const [destinationLocked, setDestinationLocked] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<DirectionsRoute | null>(null);
  const [routeProfile, setRouteProfile] = useState<'driving' | 'walking' | 'cycling'>('driving');
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const routeLayerRef = useRef<string>('route-layer');
  const mapRef = useRef<mapboxgl.Map | null>(map);
  const modesRef = useRef({ isAddingMode, isManualMode });
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update refs when values change
  useEffect(() => {
    mapRef.current = map;
  }, [map]);
  
  useEffect(() => {
    modesRef.current = { isAddingMode, isManualMode };
    
    // Update cursor when modes change
    if (map && map.loaded()) {
      const canvas = map.getCanvas();
      if (canvas) {
        if (isAddingMode || isManualMode) {
          console.log('🎯 Setting cursor to crosshair', { isAddingMode, isManualMode });
          canvas.style.cursor = 'crosshair';
          // Also set important to override any other cursor styles
          canvas.style.setProperty('cursor', 'crosshair', 'important');
        } else {
          console.log('🎯 Resetting cursor to default');
          canvas.style.cursor = '';
          canvas.style.removeProperty('cursor');
        }
      } else {
        console.log('⚠️ Canvas not available for cursor change');
      }
    } else {
      console.log('⚠️ Map not available for cursor change, loaded:', map?.loaded());
      // Try again when map is ready
      if (map && !map.loaded()) {
        const onLoad = () => {
          const canvas = map.getCanvas();
          if (canvas && (isAddingMode || isManualMode)) {
            console.log('🎯 Setting cursor to crosshair after map load');
            canvas.style.cursor = 'crosshair';
            canvas.style.setProperty('cursor', 'crosshair', 'important');
          }
        };
        map.once('load', onLoad);
      }
    }
  }, [isAddingMode, isManualMode, map]);

  // Reverse geocode coordinates to get place name
  const reverseGeocode = async (coords: [number, number]): Promise<string> => {
    try {
      // Get token from localStorage or environment
      const token = localStorage.getItem('mapbox-token') || import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
      if (!token) {
        console.warn('No Mapbox token for geocoding');
        return `${coords[1].toFixed(4)}, ${coords[0].toFixed(4)}`;
      }
      
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords[0]},${coords[1]}.json?access_token=${token}`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        return data.features[0].place_name || 'Unknown location';
      }
      return 'Unknown location';
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return 'Unknown location';
    }
  };

  // Clear all markers from map
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  }, []);

  // Add a waypoint marker to the map
  const addWaypointMarker = useCallback((waypoint: Waypoint | ManualWaypoint, index: number, totalWaypoints: number) => {
    if (!map) return null;

    const coords: [number, number] = 'coords' in waypoint 
      ? waypoint.coords 
      : [waypoint.longitude, waypoint.latitude];

    // Create marker element
    const el = document.createElement('div');
    el.className = 'waypoint-marker';
    // Set explicit dimensions on the container element for Mapbox
    el.style.width = '40px';
    el.style.height = '40px';
    
    // Determine actual type based on position for regular waypoints
    let displayType = 'waypoint';
    let displayLabel = String(index + 1);
    
    if ('type' in waypoint) {
      // For regular waypoints, determine type by position
      if (index === 0) {
        displayType = 'origin';
        displayLabel = 'A';
      } else if (index === totalWaypoints - 1 && totalWaypoints > 1) {
        displayType = 'destination';
        displayLabel = 'B';
      } else {
        displayType = 'waypoint';
        displayLabel = String(index + 1);  // Middle waypoints show position number (2, 3, 4...)
      }
      
      console.log('📍 Creating marker:', { 
        index, 
        totalWaypoints, 
        displayType, 
        displayLabel,
        waypointId: waypoint.id 
      });
      
      switch (displayType) {
        case 'origin':
          el.style.background = '#10b981';
          el.style.border = '3px solid white';
          el.style.borderRadius = '50%';
          el.style.boxShadow = '0 3px 8px rgba(0,0,0,0.3)';
          el.style.display = 'flex';
          el.style.alignItems = 'center';
          el.style.justifyContent = 'center';
          el.style.color = 'white';
          el.style.fontWeight = 'bold';
          el.style.fontSize = '16px';
          el.style.cursor = 'pointer';
          el.style.position = 'relative';
          el.style.zIndex = '10';
          el.textContent = displayLabel;
          break;
        case 'destination':
          el.style.background = '#ef4444';
          el.style.border = '3px solid white';
          el.style.borderRadius = '50%';
          el.style.boxShadow = '0 3px 8px rgba(0,0,0,0.3)';
          el.style.display = 'flex';
          el.style.alignItems = 'center';
          el.style.justifyContent = 'center';
          el.style.color = 'white';
          el.style.fontWeight = 'bold';
          el.style.fontSize = '16px';
          el.style.cursor = 'pointer';
          el.style.position = 'relative';
          el.style.zIndex = '10';
          el.textContent = displayLabel;
          break;
        case 'waypoint':
          el.style.width = '30px';
          el.style.height = '30px';
          el.style.background = '#3b82f6';
          el.style.border = '3px solid white';
          el.style.borderRadius = '50%';
          el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
          el.style.display = 'flex';
          el.style.alignItems = 'center';
          el.style.justifyContent = 'center';
          el.style.color = 'white';
          el.style.fontWeight = 'bold';
          el.style.fontSize = '14px';
          el.style.cursor = 'pointer';
          el.style.position = 'relative';
          el.style.zIndex = '10';
          el.textContent = displayLabel;
          break;
        case 'manual':
          el.style.width = '30px';
          el.style.height = '30px';
          el.style.background = '#dc2626';
          el.style.border = '3px solid white';
          el.style.borderRadius = '50%';
          el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
          el.style.display = 'flex';
          el.style.alignItems = 'center';
          el.style.justifyContent = 'center';
          el.style.color = 'white';
          el.style.fontWeight = 'bold';
          el.style.fontSize = '14px';
          el.style.cursor = 'pointer';
          el.style.position = 'relative';
          el.style.zIndex = '10';
          el.textContent = String(index + 1);
          break;
      }
    } else {
      // Manual waypoint
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.background = '#dc2626';
      el.style.border = '3px solid white';
      el.style.borderRadius = '50%';
      el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.color = 'white';
      el.style.fontWeight = 'bold';
      el.style.fontSize = '14px';
      el.style.cursor = 'pointer';
      el.style.position = 'relative';
      el.style.zIndex = '10';
      el.textContent = String(index + 1);
    }

    // Add click handler to remove waypoint (except origin/destination)
    if ('type' in waypoint && (waypoint.type === 'waypoint' || waypoint.type === 'manual')) {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        removeWaypoint(waypoint.id);
      });
    }

    const marker = new mapboxgl.Marker(el)
      .setLngLat(coords)
      .addTo(map);
    
    console.log('🎯 Marker created and added to map:', {
      coords,
      displayLabel,
      displayType,
      markerId: waypoint.id
    });

    return marker;
  }, [map]);

  // Remove a waypoint
  const removeWaypoint = useCallback((waypointId: string) => {
    setWaypoints(prev => prev.filter(w => w.id !== waypointId));
    setManualWaypoints(prev => prev.filter(w => w.id !== waypointId));
    toast.success('Waypoint removed');
  }, []);

  // Add a new waypoint at clicked location
  const addWaypointAtLocation = useCallback(async (lngLat: { lng: number; lat: number }) => {
    console.log('addWaypointAtLocation called with:', lngLat);
    const coords: [number, number] = [lngLat.lng, lngLat.lat];
    
    // Use ref to check current mode
    const { isAddingMode: addMode, isManualMode: manualMode } = modesRef.current;
    console.log('Current modes in addWaypoint:', { addMode, manualMode });
    
    // Get place name (or use coordinates as fallback)
    let placeName = `Point at ${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}`;
    try {
      placeName = await reverseGeocode(coords);
    } catch (err) {
      console.warn('Reverse geocoding failed, using coordinates');
    }
    
    if (manualMode) {
      // Add manual waypoint
      const newWaypoint: ManualWaypoint = {
        id: `manual-${Date.now()}`,
        latitude: lngLat.lat,
        longitude: lngLat.lng,
        order: 0, // Will be updated in setState
        isLocked: true,
        name: placeName
      };
      
      setManualWaypoints(prev => {
        newWaypoint.order = prev.length;
        const updated = [...prev, newWaypoint];
        toast.success(`POI marked: ${updated.length}`);
        console.log('Added manual waypoint:', newWaypoint);
        return updated;
      });
    } else {
      // Add regular waypoint
      setWaypoints(prev => {
        const order = prev.length;
        let waypointType: 'origin' | 'destination' | 'waypoint' = 'waypoint';
        
        // First waypoint is origin, last could be destination
        if (order === 0) {
          waypointType = 'origin';
        } else if (order === 1) {
          waypointType = 'destination';
        } else {
          waypointType = 'waypoint';
        }
        
        const newWaypoint: Waypoint = {
          id: `waypoint-${Date.now()}`,
          coords,
          name: placeName,
          type: waypointType,
          order: order,
          address: placeName
        };
        
        const updated = [...prev, newWaypoint];
        toast.success(`Waypoint ${updated.length} added`);
        console.log('Added regular waypoint:', newWaypoint);
        return updated;
      });
    }
  }, []);

  // Draw route on map
  const drawRoute = useCallback((coordinates: [number, number][], isRoadFollowing: boolean = false) => {
    if (!map || coordinates.length < 2) return;

    console.log('🛣️ Drawing route:', {
      isRoadFollowing,
      coordinateCount: coordinates.length,
      firstCoord: coordinates[0],
      lastCoord: coordinates[coordinates.length - 1],
      sampleCoords: coordinates.slice(0, 3).map(c => `[${c[0].toFixed(4)}, ${c[1].toFixed(4)}]`)
    });

    const routeData = {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'LineString' as const,
        coordinates
      }
    };

    // Check if source and layer already exist
    const sourceExists = map.getSource(routeLayerRef.current);
    const layerExists = map.getLayer(routeLayerRef.current);

    if (sourceExists) {
      // Update existing source data
      (sourceExists as mapboxgl.GeoJSONSource).setData(routeData);
      
      // Update layer paint properties if they've changed
      if (layerExists) {
        map.setPaintProperty(routeLayerRef.current, 'line-color', isRoadFollowing ? '#10b981' : '#3b82f6');
        map.setPaintProperty(routeLayerRef.current, 'line-width', isRoadFollowing ? 5 : 4);
      }
    } else {
      // Create new source and layer only if they don't exist
      map.addSource(routeLayerRef.current, {
        type: 'geojson',
        data: routeData
      });

      map.addLayer({
        id: routeLayerRef.current,
        type: 'line',
        source: routeLayerRef.current,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': isRoadFollowing ? '#10b981' : '#3b82f6',
          'line-width': isRoadFollowing ? 5 : 4,
          'line-opacity': 0.8
        }
      });
    }
  }, [map]);

  // Fetch directions from Mapbox API
  const fetchDirectionsRef = useRef<(waypointList: Waypoint[]) => Promise<void>>();
  
  fetchDirectionsRef.current = async (waypointList: Waypoint[]) => {
    if (waypointList.length < 2) {
      console.log('Not enough waypoints for directions:', waypointList.length);
      return;
    }
    
    // Clear any pending fetch
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }
    
    // Debounce the fetch to prevent rapid updates
    fetchTimeoutRef.current = setTimeout(async () => {
      console.log('Fetching directions for waypoints:', waypointList);
      setIsLoadingRoute(true);
      console.log('Set loading route to true');
      
      try {
      const directionsWaypoints = waypointList.map(wp => ({
        lng: wp.coords[0],
        lat: wp.coords[1],
        name: wp.name
      }));
      
      console.log('Calling getDirections with:', {
        waypoints: directionsWaypoints,
        profile: routeProfile
      });
      
      // Ensure we use 'driving' not 'driving-traffic' to avoid weird detours
      const profile = routeProfile === 'driving-traffic' ? 'driving' : routeProfile;
      
      const response = await getDirections(directionsWaypoints, {
        profile: profile,
        geometries: 'geojson',
        steps: true,
        overview: 'full',
        alternatives: false,
        continue_straight: false
      });
      
      console.log('Directions API response:', response);
      
      if (response && response.routes && response.routes.length > 0) {
        const route = response.routes[0];
        setCurrentRoute(route);
        
        // Draw the road-following route
        if (route.geometry && route.geometry.coordinates) {
          console.log('Drawing road-following route with', route.geometry.coordinates.length, 'points');
          
          // Validate coordinates are [lng, lat] format
          const validCoords = route.geometry.coordinates.filter((coord: any) => {
            return Array.isArray(coord) && coord.length === 2 && 
                   !isNaN(coord[0]) && !isNaN(coord[1]) &&
                   Math.abs(coord[0]) <= 180 && Math.abs(coord[1]) <= 90;
          });
          
          if (validCoords.length !== route.geometry.coordinates.length) {
            console.warn('Some coordinates were invalid:', {
              total: route.geometry.coordinates.length,
              valid: validCoords.length
            });
          }
          
          drawRoute(validCoords, true);
          
          // Show route stats
          toast.success(
            `Route: ${formatDistance(route.distance)} • ${formatDuration(route.duration)}`,
            { duration: 5000 }
          );
        } else {
          console.warn('Route geometry missing, falling back to straight line');
          const coords = waypointList.map(w => w.coords);
          drawRoute(coords, false);
        }
        
        return route;
      } else {
        console.warn('No routes in response, falling back to straight line');
        const coords = waypointList.map(w => w.coords);
        drawRoute(coords, false);
        toast.info('Using straight line route (directions not available)');
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
      toast.error('Failed to get road directions, using straight line');
      // Fall back to straight line
      const coords = waypointList.map(w => w.coords);
      drawRoute(coords, false);
      } finally {
        setIsLoadingRoute(false);
        console.log('Set loading route to false');
      }
    }, 100); // 100ms debounce
  };
  
  const fetchDirections = useCallback((waypointList: Waypoint[]) => {
    return fetchDirectionsRef.current?.(waypointList);
  }, []);

  // Update route when waypoints change
  useEffect(() => {
    if (!map) {
      console.log('⚠️ Map not available for updating markers');
      return;
    }

    console.log('🔄 Updating markers, waypoints:', waypoints.length);

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for all regular waypoints
    waypoints.forEach((waypoint, index) => {
      const marker = addWaypointMarker(waypoint, index, waypoints.length);
      if (marker) {
        markersRef.current.push(marker);
        console.log(`✅ Added marker ${index + 1}/${waypoints.length}`);
      }
    });

    // Add manual waypoints (POIs)
    manualWaypoints.forEach((waypoint, index) => {
      const marker = addWaypointMarker(waypoint, index, manualWaypoints.length);
      if (marker) {
        markersRef.current.push(marker);
      }
    });

    // Fetch road-following directions if we have waypoints
    if (waypoints.length >= 2 && fetchDirectionsRef.current) {
      fetchDirectionsRef.current(waypoints);
    } else if (waypoints.length === 1) {
      // Clear route if only one waypoint
      if (map.getLayer(routeLayerRef.current)) {
        map.removeLayer(routeLayerRef.current);
      }
      if (map.getSource(routeLayerRef.current)) {
        map.removeSource(routeLayerRef.current);
      }
      setCurrentRoute(null);
    }

    // Notify parent of route update
    if (onRouteUpdate) {
      onRouteUpdate(waypoints);
    }
  }, [waypoints, manualWaypoints, map]); // Removed onRouteUpdate from dependencies

  // Notify parent of route updates in a separate effect
  useEffect(() => {
    if (onRouteUpdate) {
      onRouteUpdate(waypoints);
    }
  }, [waypoints, onRouteUpdate]);

  // Handle route profile changes ONLY
  useEffect(() => {
    // Only refetch if we have waypoints and profile actually changed
    if (waypoints.length >= 2 && fetchDirectionsRef.current) {
      console.log('Route profile changed to:', routeProfile);
      fetchDirectionsRef.current(waypoints);
    }
  }, [routeProfile]); // ONLY depend on routeProfile, not waypoints!

  // Handle map clicks
  useEffect(() => {
    // Use map prop directly instead of mapRef.current
    if (!map) {
      console.log('Map not available for waypoint clicks');
      return;
    }

    console.log('Setting up waypoint click handler, map loaded:', map.loaded());

    const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
      // Use ref to get current mode values
      const { isAddingMode: addMode, isManualMode: manualMode } = modesRef.current;
      const shouldAddWaypoint = addMode || manualMode;
      
      console.log('🗺️ Map clicked!', {
        coords: [e.lngLat.lng, e.lngLat.lat],
        addMode,
        manualMode,
        shouldAdd: shouldAddWaypoint,
        currentWaypointCount: waypoints.length
      });
      
      if (!shouldAddWaypoint) {
        console.log('❌ Not in adding mode, ignoring click');
        return;
      }
      
      console.log('✅ Adding waypoint at location:', e.lngLat);
      addWaypointAtLocation(e.lngLat);
    };

    // Set up click handler
    const setupHandler = () => {
      // Remove any existing handler first
      map.off('click', handleMapClick);
      // Add the click handler
      map.on('click', handleMapClick);
      console.log('✅ Click handler registered successfully');
    };

    // Check if map is ready
    if (map.loaded()) {
      setupHandler();
    } else {
      console.log('Waiting for map to load before setting up click handler');
      const onLoad = () => {
        console.log('Map loaded event fired, setting up click handler');
        setupHandler();
      };
      map.once('load', onLoad);
      
      // Also try on idle as a backup
      const onIdle = () => {
        console.log('Map idle event fired, setting up click handler');
        setupHandler();
      };
      map.once('idle', onIdle);
      
      return () => {
        map.off('load', onLoad);
        map.off('idle', onIdle);
      };
    }

    // Cleanup function
    return () => {
      if (map) {
        console.log('Cleaning up click handler');
        map.off('click', handleMapClick);
      }
    };
  }, [map, addWaypointAtLocation]);

  // Load waypoints from an existing track
  const loadTrackWaypoints = useCallback((track: any) => {
    if (!track || !track.data) return;
    
    // Clear existing waypoints
    clearMarkers();
    setWaypoints([]);
    setManualWaypoints([]);
    
    // Extract points from track data
    const points = track.data.points || track.data;
    if (!Array.isArray(points) || points.length === 0) return;
    
    // Convert track points to waypoints
    const newWaypoints: Waypoint[] = points.slice(0, 10).map((point: any, index: number) => ({
      id: `waypoint-${Date.now()}-${index}`,
      coords: [point.lon || point.lng, point.lat] as [number, number],
      name: `Point ${index + 1}`,
      type: index === 0 ? 'origin' : index === points.length - 1 ? 'destination' : 'waypoint' as const,
      order: index,
      elevation: point.ele
    }));
    
    setWaypoints(newWaypoints);
    toast.success(`Loaded ${newWaypoints.length} waypoints from track`);
  }, [clearMarkers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear any pending fetch timeouts
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
      
      // Clear markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      
      // Note: We don't remove the route layer here because the map might be reused
      // The layer will be updated when the component remounts
    };
  }, []);

  return {
    // State
    waypoints,
    manualWaypoints,
    origin,
    destination,
    isAddingMode,
    isManualMode,
    originLocked,
    destinationLocked,
    currentRoute,
    routeProfile,
    isLoadingRoute,
    
    // Actions
    setWaypoints,
    setManualWaypoints,
    setOrigin,
    setDestination,
    setIsAddingMode,
    setIsManualMode,
    setOriginLocked,
    setDestinationLocked,
    setRouteProfile,
    addWaypointAtLocation,
    removeWaypoint,
    clearMarkers,
    drawRoute,
    loadTrackWaypoints,
    fetchDirections
  };
}