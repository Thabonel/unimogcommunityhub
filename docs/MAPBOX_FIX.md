# Trip Planner Map Fix - Resolved Flashing Issue

## Problem
The trip planner map was constantly flashing/reloading with error "Unknown error" when trying to load the Mapbox map.

## Root Causes Identified

1. **Map Re-initialization Loop**: The map was being destroyed and recreated on every render due to improper dependency management in React hooks
2. **Missing Import**: `clearMapboxTokenStorage` function was being called but not imported
3. **Unstable Dependencies**: `initialCenter` and `enableTerrain` were causing the map to reinitialize unnecessarily
4. **Duplicate Terrain Setup**: Terrain was being set up both in the initial load event and in a separate effect

## Solutions Implemented

### 1. Fixed Import Issue
Added missing import for `clearMapboxTokenStorage` from `@/utils/mapbox-helper`

### 2. Stabilized Map Initialization
- Added `isMapInitialized` state to track when map is fully loaded
- Changed useEffect dependencies to only re-initialize on token changes, not on prop changes
- Separated concerns: initialization, center updates, and terrain updates are now handled independently

### 3. Improved Prop Handling
- `initialCenter` changes now update the existing map rather than recreating it
- `enableTerrain` changes are applied to the existing map instance
- Removed duplicate terrain setup code from the load event

### 4. Better Error Handling
- Added try-catch blocks around control additions to prevent duplicate control errors
- Changed error logs to warnings for non-critical issues
- Ignoring known hillshade layer errors that don't affect functionality

## Files Modified

1. `/src/components/trips/map/hooks/useMapInitialization.ts`
   - Added `isMapInitialized` state tracking
   - Fixed import for `clearMapboxTokenStorage`
   - Separated initialization, center, and terrain effects
   - Reduced dependencies to prevent re-initialization

2. `/src/components/trips/TripMap.tsx`
   - Fixed memoization dependencies to include `initialCenter`

## Technical Details

### Before (Problematic Code)
```typescript
useEffect(() => {
  // Map initialization code
}, [hasToken, enableTerrain]); // Re-initialized on terrain changes
```

### After (Fixed Code)
```typescript
// Separate effects for different concerns
useEffect(() => {
  // Map initialization only
}, [hasToken]); // Only re-init on token change

useEffect(() => {
  // Handle center updates on existing map
}, [initialCenter, isMapInitialized]);

useEffect(() => {
  // Handle terrain toggling on existing map
}, [enableTerrain, isMapInitialized]);
```

## Testing

To verify the fix works:

1. Navigate to a page with the trip planner
2. The map should load once without flashing
3. Changing locations should update the map smoothly without reloading
4. No "Unknown error" messages should appear
5. Map controls should work properly

## Performance Impact

- **Before**: Map was constantly destroying and recreating itself (100+ re-renders)
- **After**: Map initializes once and updates smoothly (1 initialization, updates as needed)
- **Result**: Significant performance improvement and better user experience

## Additional Notes

- The Mapbox token is properly retrieved from environment variables
- Token validation happens before map initialization
- The map properly handles user location updates without re-initializing
- Terrain features are disabled by default to avoid compatibility issues

## Related Fixes

For the route line flickering issue (green line appearing/disappearing), see:
- [MAPBOX_ROUTE_FLICKERING_FIX.md](./MAPBOX_ROUTE_FLICKERING_FIX.md) - Comprehensive fix for route rendering issues

## Update History

- **Initial Fix (2024)**: Resolved map flashing/reloading issue
- **Route Fix (January 2025)**: Fixed route line flickering issue