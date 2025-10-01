# Trip Planner Issues - Bug Report

**Date Created**: 2025-01-14
**Status**: Active Issues
**Priority**: High - Core functionality affected

## Overview
The trip planner has several critical issues affecting core functionality including position display, waypoint labeling, trip saving, and trip loading features.

## 🐛 Current Issues

### 1. Missing Current Position (Blue Dot)
**Problem**: The blue dot showing the user's current GPS position is not visible on the map
- **Expected**: Blue dot indicating current location should be visible
- **Actual**: Blue dot is missing or potentially hidden under the map layers
- **Impact**: Users cannot see their starting position for trip planning

### 2. Missing Waypoint Labels (A, B, C...)
**Problem**: Waypoint markers don't display their letter labels
- **Expected**: When clicking to add waypoints, each dot should show "A", "B", "C" etc. on top
- **Actual**: Dots appear but labels are missing (possibly hidden under the dots)
- **Impact**: Users can't identify waypoint sequence visually

### 3. Trip Saving to List Broken
**Problem**: Created trips are not being saved to the "Saved Trips" list
- **Expected**: After creating and saving a trip, it should appear in the saved trips list
- **Actual**: Trips are not appearing in the list (worked until recently)
- **Impact**: Users lose their created trips

### 4. Trip Data Not Saving to Supabase
**Problem**: Trip data is not being persisted to the database
- **Expected**: Trip waypoints, routes, and metadata should be saved to Supabase
- **Actual**: Data is not being written to the database
- **Impact**: Trips are completely lost, no persistence

### 5. Trip Loading from List Not Working
**Problem**: Cannot load saved trips back onto the map for editing
- **Expected**: Checking the tickbox next to a saved trip should load it onto the map
- **Actual**: Tickbox doesn't load the trip onto the map
- **Impact**: Cannot edit or modify existing trips

### 6. Multi-Trip Selection/Combination Missing
**Problem**: Cannot select and combine multiple trips
- **Expected**: Should be able to tick multiple trips to load them simultaneously and combine into one
- **Actual**: Multi-selection and combination functionality not working
- **Impact**: Cannot create complex routes from existing trip segments

## 🔍 Technical Investigation Needed

### Potential Root Causes
1. **Z-index issues**: UI elements may be layered incorrectly
2. **Database connection**: Supabase save/load operations failing
3. **State management**: Trip data not properly managed in React state
4. **Map layer ordering**: Current position and labels rendering behind other layers
5. **Event handlers**: Click handlers for trip selection may be broken

### Files to Investigate
- `/src/components/trips/` - Trip planner components
- `/src/services/` - Trip data service layer
- `/src/pages/trips/` - Trip planner pages
- Supabase tables: `gpx_tracks`, `gpx_waypoints`, related trip tables

## 🛠️ Suggested Fix Priority

### Priority 1 (Critical - Data Loss)
1. **Fix trip saving to Supabase** - Prevent data loss
2. **Fix trip saving to list** - Restore basic functionality

### Priority 2 (UX Issues)
3. **Fix waypoint labels (A, B, C)** - Essential for usability
4. **Fix current position blue dot** - Navigation aid

### Priority 3 (Advanced Features)
5. **Fix trip loading from list** - Edit existing trips
6. **Fix multi-trip selection** - Combine trips

## 📝 Success Criteria
- [ ] Blue dot shows current GPS position
- [ ] Waypoint dots display A, B, C labels clearly
- [ ] Created trips appear in saved trips list
- [ ] Trip data persists to Supabase database
- [ ] Can load saved trips back onto map via tickbox
- [ ] Can select multiple trips and combine them

## 🧪 Test Scenarios
1. **Basic Trip Creation**: Create 3-point trip, verify labels and saving
2. **Trip Persistence**: Refresh page, verify trip remains in list and loads
3. **GPS Position**: Verify blue dot appears at current location
4. **Trip Editing**: Load existing trip, modify, save as new version
5. **Trip Combination**: Select 2 trips, combine into single route

---

**Note**: These issues represent a significant regression in core trip planner functionality. All features worked previously, suggesting recent changes may have broken the implementation.