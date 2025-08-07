# Mapbox Route Flickering Fix Documentation

## Problem Description
The green route line that follows roads (using Mapbox Directions API) was flickering on and off when adding waypoints. The waypoint markers (A, 2, 3, B) remained stable, but the connecting line would appear and disappear rapidly, creating a poor user experience.

## Root Causes Identified

### 1. **Duplicate Route Fetching**
- Two separate `useEffect` hooks were both calling `fetchDirections()` when waypoints changed
- This caused the route to be calculated and drawn twice, creating a flicker effect

### 2. **Layer Recreation Instead of Updates**
- The `drawRoute` function was removing and re-adding the entire layer on every update
- This delete-create cycle caused visible flickering

### 3. **Missing Debouncing**
- Route updates were happening immediately on every state change
- No delay to batch rapid updates

### 4. **Excessive Re-renders**
- `onRouteUpdate` callback in useEffect dependencies caused unnecessary re-renders
- Route profile changes triggered duplicate fetches

## Solutions Implemented

### 1. Fixed Duplicate Route Fetching
**File**: `/src/hooks/use-waypoint-manager.ts`

**Before**:
```typescript
// Main effect for waypoint updates
useEffect(() => {
  // ... marker updates ...
  if (waypoints.length >= 2 && fetchDirectionsRef.current) {
    fetchDirectionsRef.current(waypoints);
  }
}, [waypoints, manualWaypoints, map, onRouteUpdate]);

// Separate effect for profile changes - DUPLICATE!
useEffect(() => {
  if (waypoints.length >= 2 && fetchDirectionsRef.current) {
    fetchDirectionsRef.current(waypoints);
  }
}, [routeProfile, waypoints.length]);
```

**After**:
```typescript
// Main effect - removed onRouteUpdate from deps
useEffect(() => {
  // ... marker updates ...
  if (waypoints.length >= 2 && fetchDirectionsRef.current) {
    fetchDirectionsRef.current(waypoints);
  }
}, [waypoints, manualWaypoints, map]);

// Separate effect for notifications only
useEffect(() => {
  if (onRouteUpdate) {
    onRouteUpdate(waypoints);
  }
}, [waypoints, onRouteUpdate]);

// Profile changes only
useEffect(() => {
  if (waypoints.length >= 2 && fetchDirectionsRef.current && routeProfile) {
    fetchDirectionsRef.current(waypoints);
  }
}, [routeProfile, waypoints]);
```

### 2. Smart Layer Updates Instead of Recreation
**File**: `/src/hooks/use-waypoint-manager.ts`

**Before**:
```typescript
const drawRoute = useCallback((coordinates, isRoadFollowing) => {
  // Always remove and recreate
  if (map.getLayer(routeLayerRef.current)) {
    map.removeLayer(routeLayerRef.current);
  }
  if (map.getSource(routeLayerRef.current)) {
    map.removeSource(routeLayerRef.current);
  }
  
  // Add new source and layer
  map.addSource(routeLayerRef.current, { /* ... */ });
  map.addLayer({ /* ... */ });
}, [map]);
```

**After**:
```typescript
const drawRoute = useCallback((coordinates, isRoadFollowing) => {
  const routeData = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates
    }
  };

  const sourceExists = map.getSource(routeLayerRef.current);
  const layerExists = map.getLayer(routeLayerRef.current);

  if (sourceExists) {
    // Update existing source data - no flicker!
    (sourceExists as mapboxgl.GeoJSONSource).setData(routeData);
    
    // Update paint properties if needed
    if (layerExists) {
      map.setPaintProperty(routeLayerRef.current, 'line-color', 
        isRoadFollowing ? '#10b981' : '#3b82f6');
      map.setPaintProperty(routeLayerRef.current, 'line-width', 
        isRoadFollowing ? 5 : 4);
    }
  } else {
    // Only create if doesn't exist
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
```

### 3. Added Debouncing
**File**: `/src/hooks/use-waypoint-manager.ts`

```typescript
const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

fetchDirectionsRef.current = async (waypointList: Waypoint[]) => {
  // Clear any pending fetch
  if (fetchTimeoutRef.current) {
    clearTimeout(fetchTimeoutRef.current);
  }
  
  // Debounce with 100ms delay
  fetchTimeoutRef.current = setTimeout(async () => {
    setIsLoadingRoute(true);
    
    try {
      // Fetch directions and draw route
      const response = await getDirections(/* ... */);
      // ...
    } finally {
      setIsLoadingRoute(false);
    }
  }, 100);
};
```

### 4. Added Proper Cleanup
```typescript
useEffect(() => {
  return () => {
    // Clear pending timeouts
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }
    
    // Clear markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  };
}, []);
```

## Related Issues Fixed

### Duplicate MAP_STYLES Export
**File**: `/src/components/trips/map/mapConfig.ts`
- Removed duplicate export that was causing compilation errors
- Unified all map styles into single export

### Offline Detection in Development
**File**: `/src/hooks/use-offline.ts` and `/src/App.tsx`
- Disabled offline detection in development mode
- Prevents false offline warnings when developing locally

### Missing Database Tables
**Files**: `/supabase/migrations/20250107_fix_tracks_trips_tables.sql`
- Created missing `tracks` and `trips` tables
- Added required columns including `metadata` JSONB
- Fixed type mismatches (UUID vs TEXT for user IDs)

## Testing the Fix

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to Trips page**:
   - Go to `http://localhost:8080/trips`

3. **Test route planning**:
   - Click "Add Route Points"
   - Click on map to add waypoints
   - Verify green line appears without flickering
   - Test switching between driving/walking/cycling modes
   - Save route and verify it persists

## Key Learnings

1. **Avoid duplicate effect triggers**: Carefully manage useEffect dependencies
2. **Update vs Recreate**: Always prefer updating existing map layers over recreation
3. **Debounce rapid updates**: Add delays to batch multiple quick changes
4. **Use refs for stable callbacks**: Prevent unnecessary re-renders with useRef
5. **Test in development mode**: Many issues only appear during active development

## Performance Improvements

- **Reduced API calls**: Eliminated duplicate Mapbox Directions API requests
- **Smoother rendering**: No more layer flickering
- **Better memory management**: Proper cleanup prevents memory leaks
- **Faster updates**: Smart layer updates are more efficient than recreation

## Future Considerations

1. Consider implementing a more robust state management solution (Redux/Zustand) for complex map state
2. Add error boundaries around map components
3. Implement retry logic for failed API requests
4. Consider caching route calculations for identical waypoint sets
5. Add loading states for better UX during route calculation

## Related Documentation

- [Mapbox GL JS Documentation](https://docs.mapbox.com/mapbox-gl-js/)
- [Mapbox Directions API](https://docs.mapbox.com/api/navigation/directions/)
- [React Hooks Best Practices](https://react.dev/reference/react)

## Troubleshooting

### If route still flickers:
1. Check browser console for errors
2. Verify Mapbox token is valid
3. Check network tab for duplicate API calls
4. Ensure no other components are modifying the same layer

### If routes don't appear:
1. Verify database migrations have been run
2. Check Supabase connection
3. Ensure user is authenticated
4. Check browser console for API errors

### If map doesn't load:
1. Check Mapbox token in environment variables
2. Clear browser cache
3. Try incognito mode
4. Check for JavaScript errors in console

---

*Last Updated: January 2025*
*Fixed by: Claude (Anthropic)*
*Affects: UnimogCommunityHub, Wheels and Wins*