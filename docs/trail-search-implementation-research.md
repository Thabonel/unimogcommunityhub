# Trail Search Feature - Implementation Research & Strategy

**Date**: October 3, 2025
**Backup Location**: `docs/backups/trail-search-feature-20251003-075307/`
**Status**: Research Complete - Ready for Implementation

---

## 🎯 Key Optimization: No Unnecessary Conversions

**Original Wasteful Flow**:
```
OSM (GeoJSON) → Convert to GPX → Parse GPX → Convert to GeoJSON → Display
```

**Optimized Direct Flow** ✅:
```
OSM (GeoJSON) → Display on Map
OSM (GeoJSON) → Save to Database
Database (GeoJSON) → Export as GPX (only when user downloads)
```

**Benefits**:
- ⚡ **Faster**: No conversion overhead
- 💾 **Less storage**: GeoJSON is more compact than GPX XML
- 🎯 **Simpler**: Less code, fewer bugs
- 🗺️ **Native**: GeoJSON is Mapbox's preferred format
- 🔒 **No data loss**: All OSM metadata preserved

---

## 🎯 Objective

Build a trail search and discovery system that allows users to:
1. Search for trails by name (e.g., "Monkey Gum Trail")
2. Display trail on trip planner map
3. Save trails to personal library
4. View trail details (distance, elevation, difficulty)
5. Export trail as GPX for GPS devices

---

## 📊 Existing Infrastructure Analysis

### ✅ What We Have (Battle-Tested Code)

#### 1. GPX Processing System (`/src/utils/gpxUtils.ts`)
- **Status**: Production-ready, comprehensive
- **Features**:
  - Parse GPX files (`parseGPXFile`, `parseGPXString`)
  - Track processing with distance, elevation, bounds calculation
  - Waypoint processing
  - GeoJSON conversion (`trackToGeoJSON`, `waypointsToGeoJSON`)
  - GPX generation (`generateGPX`)
  - Validation (`validateGPXFile`)
  - Formatting utilities (distance, duration, elevation)

**Key Interfaces**:
```typescript
interface GPXTrack {
  id: string;
  name: string;
  description?: string;
  distance: number; // meters
  elevation: { min, max, gain, loss };
  duration?: number; // seconds
  waypoints: GPXWaypoint[];
  trackPoints: GPXTrackPoint[];
  bounds: { north, south, east, west };
  metadata: { creator, version, time, keywords };
}
```

#### 2. Map Display System

**TripMap Component** (`/src/components/map/TripMap.tsx`):
- Mapbox GL JS integration
- Marker management with `markersRef`
- Layer/source cleanup before updates
- Bounds fitting
- Error handling with `MapErrorBoundary`

**Best Practices Used**:
```typescript
// ✅ Clean up markers before adding new ones
markersRef.current.forEach(marker => marker.remove());
markersRef.current = [];

// ✅ Clean up layers/sources
if (map.getLayer('route-line')) map.removeLayer('route-line');
if (map.getSource('route')) map.removeSource('route');

// ✅ Add data only after map is loaded
useEffect(() => {
  if (!map || !mapLoaded) return;
  // Add markers/layers
}, [map, mapLoaded, data]);
```

**GPXTrackDisplay Component** (`/src/components/trips/GPXTrackDisplay.tsx`):
- Multiple track visualization
- Color-coded tracks
- Elevation profile canvas rendering
- Track visibility toggles
- Fit to bounds functionality

#### 3. Database Schema

**Existing Tables**:
- `trip_logs` - User trip data with GPS tracking
- `location_checkins` - Manual location check-ins
- `location_tracking_settings` - User preferences

**No existing trail library table** - We need to create this.

#### 4. Trip Planning Hook (`/src/hooks/use-trip-planning.ts`)
- Start/end location management
- Difficulty levels
- Terrain type selection
- POI type selection
- Mock trip planning (ready for real API integration)

---

## 🌐 Trail Data Sources Research

### Option 1: OpenStreetMap (OSM) - ✅ RECOMMENDED
**Pros**:
- Completely free and open
- Massive worldwide coverage
- Public domain data
- Well-documented API (Overpass API)
- Trail data tagged as `highway=track`, `highway=path`

**API**: Overpass API
```
https://overpass-api.de/api/interpreter
```

**Query Example** (Find trails near coordinates):
```
[out:json];
(
  way["highway"~"track|path"]["name"]
    (around:10000, -33.8688, 151.2093);
);
out geom;
```

**Response**: GeoJSON with coordinates, name, tags

**Implementation Strategy**:
1. User searches "Monkey Gum Trail"
2. Edge Function queries Overpass API with trail name + region
3. Parse OSM data into GPX format using existing `gpxUtils`
4. Display on map using `GPXTrackDisplay`

### Option 2: Trailforks API - ❌ NOT RECOMMENDED
**Cons**:
- Requires approval (not guaranteed)
- Primarily mountain biking trails
- Limited 4x4/off-road coverage
- Paywall for GPX exports

### Option 3: Government Trail Databases - ⚠️ SUPPLEMENTARY
**Examples**:
- Australia: NSW National Parks API
- USA: NPS API, USFS trail data
- Europe: Various regional APIs

**Cons**:
- Region-specific
- Inconsistent formats
- Limited APIs

---

## 🏗️ Implementation Architecture

### Phase 1: Trail Search & Display (Optimized - No Unnecessary Conversions)

```
┌─────────────────────────────────────────┐
│  User searches "Monkey Gum Trail"       │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  TrailSearchInput Component             │
│  - Search bar                            │
│  - Region filter (optional)              │
│  - Autocomplete suggestions              │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Edge Function: search-trails           │
│  - Query Overpass API (returns GeoJSON) │
│  - Calculate distance/elevation          │
│  - Extract metadata                      │
│  - Return GeoJSON directly (no conversion)│
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  TrailSearchResults Component           │
│  - List of matching trails               │
│  - Trail cards with preview              │
│  - "Add to Map" button                   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Mapbox Source + Layer (GeoJSON)        │
│  - Display trail directly (no conversion)│
│  - Show elevation profile                │
│  - Save to library button                │
│  - Export GPX button (convert only when needed)│
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Database: user_trail_library           │
│  - Save GeoJSON data (native format)    │
│  - User bookmarks                        │
│  - Generate GPX on export only           │
└─────────────────────────────────────────┘
```

**Key Optimization**: GeoJSON flows directly from OSM → Map → Database. GPX conversion only happens when user downloads for GPS device.

### Phase 2: Trail Library Management

```
┌─────────────────────────────────────────┐
│  My Trails Page                          │
│  - Saved trails list                     │
│  - Search/filter saved trails            │
│  - Export to GPS                         │
│  - Share with community                  │
└─────────────────────────────────────────┘
```

---

## 📐 Database Schema Design

### New Table: `user_trail_library`

```sql
CREATE TABLE user_trail_library (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Trail identification
    trail_name TEXT NOT NULL,
    trail_description TEXT,
    trail_source TEXT DEFAULT 'osm' CHECK (trail_source IN ('osm', 'user_upload', 'community', 'government')),
    osm_way_id BIGINT, -- OpenStreetMap way ID for reference

    -- GeoJSON data (native format - no conversion needed!)
    geojson_data JSONB NOT NULL, -- Store directly from OSM/Mapbox
    -- Format: { type: 'Feature', geometry: { type: 'LineString', coordinates: [[lon,lat,ele], ...] }, properties: {...} }

    -- Trail metadata (extracted from GeoJSON for quick queries)
    distance_meters NUMERIC(10,2),
    elevation_gain_meters NUMERIC(7,2),
    elevation_loss_meters NUMERIC(7,2),
    min_elevation_meters NUMERIC(7,2),
    max_elevation_meters NUMERIC(7,2),
    difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'moderate', 'difficult', 'extreme')),
    terrain_types TEXT[], -- ['desert', 'mountain', 'forest', etc.]

    -- Geographic bounds (extracted from GeoJSON for spatial queries)
    bounds JSONB, -- { north, south, east, west } - easier to query as single JSONB

    -- User interaction
    is_favorite BOOLEAN DEFAULT false,
    times_driven INTEGER DEFAULT 0,
    last_driven_at TIMESTAMPTZ,
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
    user_notes TEXT,

    -- Sharing
    is_public BOOLEAN DEFAULT false, -- Share with community

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Note: GPX export is generated on-demand from geojson_data when user downloads
-- No need to store GPX format in database - saves space and avoids format conversion overhead

-- Indexes
CREATE INDEX idx_trail_library_user ON user_trail_library(user_id);
CREATE INDEX idx_trail_library_name ON user_trail_library(trail_name);
CREATE INDEX idx_trail_library_source ON user_trail_library(trail_source);
CREATE INDEX idx_trail_library_public ON user_trail_library(is_public) WHERE is_public = true;
CREATE INDEX idx_trail_library_osm_id ON user_trail_library(osm_way_id) WHERE osm_way_id IS NOT NULL;
CREATE INDEX idx_trail_library_geojson ON user_trail_library USING GIN (geojson_data); -- For spatial queries

-- RLS Policies
ALTER TABLE user_trail_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own trails" ON user_trail_library
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view public trails" ON user_trail_library
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can insert their own trails" ON user_trail_library
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own trails" ON user_trail_library
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own trails" ON user_trail_library
    FOR DELETE USING (user_id = auth.uid());
```

---

## 🛠️ Implementation Steps (Safe & Incremental)

### Step 1: Database Migration ✅ SAFE
1. Create migration file
2. Test on staging
3. Deploy when confirmed working

### Step 2: Edge Function - Trail Search ✅ SAFE (Optimized - No GPX Conversion)
**File**: `supabase/functions/search-trails/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { searchQuery, region, limit = 10 } = await req.json()

  // Build Overpass API query (returns GeoJSON directly)
  const overpassQuery = `
    [out:json][timeout:25];
    (
      way["highway"~"track|path"]["name"~"${searchQuery}",i]
        (${region.south},${region.west},${region.north},${region.east});
    );
    out geom;
  `

  // Query Overpass API
  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: `data=${encodeURIComponent(overpassQuery)}`
  })

  const osmData = await response.json()

  // Convert OSM elements to GeoJSON Features (native Mapbox format)
  const trails = osmData.elements.map(element => {
    const coordinates = element.geometry.map(node => [node.lon, node.lat])

    // Calculate metadata
    const distance = calculateDistance(coordinates)
    const bounds = calculateBounds(coordinates)

    return {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates
      },
      properties: {
        name: element.tags.name || 'Unnamed Trail',
        description: element.tags.description,
        surface: element.tags.surface,
        difficulty: element.tags.difficulty,
        osm_id: element.id,
        distance_meters: distance,
        bounds
      }
    }
  })

  return new Response(JSON.stringify({ trails }), {
    headers: { 'Content-Type': 'application/json' }
  })
})

// Helper: Calculate distance from coordinates
function calculateDistance(coords: number[][]): number {
  let total = 0
  for (let i = 1; i < coords.length; i++) {
    total += haversineDistance(coords[i-1], coords[i])
  }
  return total
}

// Helper: Calculate bounds
function calculateBounds(coords: number[][]) {
  const lons = coords.map(c => c[0])
  const lats = coords.map(c => c[1])
  return {
    north: Math.max(...lats),
    south: Math.min(...lats),
    east: Math.max(...lons),
    west: Math.min(...lons)
  }
}
```

**Key Change**: Returns GeoJSON directly from OSM - no GPX conversion needed!

### Step 3: TrailSearchInput Component ✅ SAFE
**File**: `src/components/trips/TrailSearchInput.tsx`

- Search input with debounce
- Region autocomplete (country/state)
- Loading spinner
- No map interaction yet

### Step 4: TrailSearchResults Component ✅ SAFE
**File**: `src/components/trips/TrailSearchResults.tsx`

- Display search results as cards
- "Add to Map" button (prepares data)
- No database writes yet

### Step 5: Integrate with TripPlanner ⚠️ CAREFUL
**File**: `src/components/trips/TripPlanner.tsx`

- Add new tab "Search Trails"
- Render TrailSearchInput
- Display trail using Mapbox Source + Layer (native GeoJSON)
  ```typescript
  <Source
    id="searched-trail"
    type="geojson"
    data={selectedTrail.geojson}  // Direct from API!
  >
    <Layer
      id="trail-line"
      type="line"
      paint={{ 'line-color': '#3498db', 'line-width': 4 }}
    />
  </Source>
  ```
- **TEST THOROUGHLY** before touching map
- No GPX conversion needed - faster and simpler!

### Step 6: Save to Library ✅ SAFE
**File**: `src/services/trailService.ts`

```typescript
export async function saveTrailToLibrary(trail: GeoJSONFeature) {
  const { data, error } = await supabase
    .from('user_trail_library')
    .insert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      trail_name: trail.properties.name,
      trail_description: trail.properties.description,
      geojson_data: trail,  // Store GeoJSON directly - no conversion!
      distance_meters: trail.properties.distance_meters,
      bounds: trail.properties.bounds,
      osm_way_id: trail.properties.osm_id,
      trail_source: 'osm'
    })

  return { data, error }
}

export async function exportTrailAsGPX(trailId: string) {
  // Get trail from database
  const { data: trail } = await supabase
    .from('user_trail_library')
    .select('geojson_data, trail_name')
    .eq('id', trailId)
    .single()

  // Convert GeoJSON to GPX only when exporting
  const gpxString = convertGeoJSONToGPX(trail.geojson_data)

  // Download file
  downloadFile(gpxString, `${trail.trail_name}.gpx`)
}
```

- Pure database operations, no map risk
- GeoJSON stored natively
- GPX conversion only on export

### Step 7: Trail Library Page ✅ SAFE
**File**: `src/pages/TrailLibrary.tsx`

- List saved trails
- "Download GPX" button (converts GeoJSON → GPX on-demand)
- "Load to Map" button (displays GeoJSON directly on trip planner)
- No format conversions during normal use - faster performance!

---

## 🚨 Safety Protocols

### Map Safety Rules
1. **NEVER** modify map code without backup
2. **ALWAYS** test in isolation first
3. **ALWAYS** clean up markers/layers before adding new ones
4. **ALWAYS** check `map` and `mapLoaded` before operations
5. **NEVER** modify map state during render

### Testing Checklist
- [ ] Create database migration
- [ ] Test Edge Function with curl
- [ ] Test Trail Search Component standalone
- [ ] Test with single trail first
- [ ] Test with multiple trails
- [ ] Test cleanup (remove trails from map)
- [ ] Test bounds fitting
- [ ] Test with existing GPX uploads (no conflicts)

### Rollback Plan
```bash
# Instant rollback
cp -r docs/backups/trail-search-feature-20251003-075307/* src/

# Database rollback
# Revert migration in Supabase dashboard
```

---

## 📚 Code Libraries & References

### Battle-Hardened Dependencies
- `@tmcw/togeojson` - GPX/KML to GeoJSON (already used)
- `gpxparser` - GPX parsing library (already used)
- `mapbox-gl` - Map display (already used)
- `react-map-gl` - React wrapper (already used in GPXTrackDisplay)

### Mapbox Documentation
- **Markers**: https://docs.mapbox.com/mapbox-gl-js/api/markers/
- **Layers**: https://docs.mapbox.com/mapbox-gl-js/api/map/#map#addlayer
- **Sources**: https://docs.mapbox.com/mapbox-gl-js/api/sources/
- **GeoJSON**: https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/#geojson

### OpenStreetMap References
- **Overpass API**: https://wiki.openstreetmap.org/wiki/Overpass_API
- **Overpass Turbo** (query builder): https://overpass-turbo.eu/
- **OSM Trail Tags**: https://wiki.openstreetmap.org/wiki/Key:highway

---

## 🎯 Success Criteria

### Must Have
- [x] Research complete
- [ ] Database schema created
- [ ] Edge Function working
- [ ] Search component functional
- [ ] Display trail on map (using existing GPXTrackDisplay)
- [ ] Save trail to library
- [ ] No map breakage

### Nice to Have
- [ ] Trail difficulty calculation
- [ ] Terrain type detection from OSM tags
- [ ] Share trails with community
- [ ] Trail ratings and reviews
- [ ] Offline trail storage

---

## 🚀 Next Actions

1. ✅ Get user approval for implementation plan
2. Create database migration
3. Build Edge Function (test with curl first)
4. Build search component (standalone, no map)
5. Integrate with trip planner (carefully)
6. Test extensively
7. Deploy to staging
8. Get user testing
9. Deploy to production

---

**Backup Location**: `docs/backups/trail-search-feature-20251003-075307/`
**Risk Level**: LOW (using existing proven components)
**Estimated Time**: 4-6 hours implementation + 2 hours testing
**Rollback Time**: < 1 minute
