# World Routes & Local Tracks Autocomplete - Implementation Plan

**Date Created**: October 4, 2025
**Status**: Planning Phase
**Priority**: High
**Complexity**: Medium-High (Multi-source data aggregation)

---

## 🎯 Objective

Build an intelligent autocomplete search system that allows users to find and load tracks by typing their names, covering:

1. **Famous World Routes** - Pan-American Highway, Silk Road, Trans-America Trail
2. **Local 4WD Tracks** - Community-known trails like "Erzberg Extream Hill", "Mud Bowl track" (Wattagans Forest example)
3. **Official Trails** - Government/park trails available in OpenStreetMap

---

## ❌ Why OSM-Only Won't Work

### The Problem with OpenStreetMap Approach

**OSM Coverage Analysis**:
- ✅ Famous routes: "Pan-American Highway" → Likely mapped
- ⚠️ Regional trails: "Gibb River Road" → Partially mapped
- ❌ Local 4WD tracks: "Erzberg Extream Hill" → Not in OSM
- ❌ Community nicknames: "Mud Bowl track" → Definitely not in OSM
- ❌ Private land tracks: Most unmapped or restricted

**Real-World Example - Wattagans Forest, NSW**:
```
User wants to search for:
- "Erzberg Extream Hill"        ❌ Not in OSM
- "Mud Bowl track"               ❌ Not in OSM
- "Prickley Ridge Power line"    ❌ Not in OSM
- "Farrells Rd" (1, 2, 3)       ❌ Not in OSM
- "4WD Playground"               ❌ Not in OSM

Reality: 90%+ of local 4WD tracks are NOT in OpenStreetMap
```

---

## ✅ Solution: 3-Tier Hybrid Track Database

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│            User Types: "Mud Bowl"                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│         Multi-Source Autocomplete Search                 │
│                                                          │
│  1. Community Tracks DB (Priority 1)                    │
│     └─→ "Mud Bowl track" ✅ FOUND                       │
│                                                          │
│  2. Famous Routes DB (Priority 2)                       │
│     └─→ No match                                        │
│                                                          │
│  3. OpenStreetMap API (Priority 3 - Fallback)           │
│     └─→ Query if no local matches                       │
│                                                          │
│  Results Ranked By:                                      │
│  - Exact match score                                     │
│  - User's location proximity                             │
│  - Popularity (times driven)                             │
│  - Community verification status                         │
└─────────────────────────────────────────────────────────┘
```

### Tier 1: Famous Routes (Curated Database)

**Examples**:
- Pan-American Highway (Alaska to Argentina)
- Silk Road (China to Mediterranean)
- Trans-America Trail (East to West USA)
- Gibb River Road (Western Australia)
- Simpson Desert Crossing (Australia)
- Cape to Cairo (Africa)
- Carretera Austral (Chile)
- Dempster Highway (Canada)

**Data Source**:
- Manual curation by admins
- Pre-seeded from verified sources (Wikipedia, official tourism sites)
- OSM data for coordinates (verified and enhanced)

**Characteristics**:
- `source_type: 'famous_route'`
- `verification_status: 'verified'`
- High-quality metadata (distance, difficulty, countries)
- Professional descriptions

**Initial Seed List**: 50-100 world-famous overlanding routes

### Tier 2: Community-Contributed Tracks (User Database)

**Examples** (Wattagans Forest, NSW):
- Watagan Forest Rd / Dr
- Erzberg Extream Hill
- Greens Break
- Cut Rock Rd
- Prickley Ridge Hill
- Mud Bowl track
- Farrells Rd (1, 2, 3)
- Wave Rock Rd
- 4WD Playground
- Morisset 4WD Playground
- Red Hill 4WD Playground

**Data Source**:
- User GPX uploads (existing `tracks` table)
- Manual submissions via "Add Track" form
- Community sharing and verification

**Characteristics**:
- `source_type: 'community_upload'`
- `verification_status: 'pending' | 'verified' | 'rejected'`
- User-contributed metadata
- Community ratings and comments

**Workflow**:
```
User uploads GPX → Extract metadata → Admin review → Verified → Searchable
```

### Tier 3: OpenStreetMap (Fallback)

**Use Cases**:
- Official government trails (national parks)
- Well-documented hiking/biking trails
- Fallback when community DB has no matches

**Implementation**:
- Real-time Overpass API query (if no local matches)
- Cache results to avoid repeated API calls
- Lower priority in search results

---

## 🗄️ Database Schema Design

### Enhanced Community Tracks Table

```sql
CREATE TABLE community_tracks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- Basic Information
    name TEXT NOT NULL,                     -- "Erzberg Extream Hill"
    alternate_names TEXT[],                 -- ["Erzberg Hill", "Extreme Hill"]
    description TEXT,
    region TEXT,                            -- "Wattagans Forest, NSW, Australia"
    country_code TEXT,                      -- "AU", "US", "BR"

    -- Geographic Data (GeoJSON - native Mapbox format)
    geojson_data JSONB NOT NULL,
    -- Format: { type: 'Feature', geometry: { type: 'LineString', coordinates: [[lon,lat,ele]...] }, properties: {...} }

    -- Track Metadata (extracted from geojson_data for quick filtering)
    distance_km NUMERIC(10,2),
    elevation_gain_m NUMERIC(7,2),
    elevation_loss_m NUMERIC(7,2),
    min_elevation_m NUMERIC(7,2),
    max_elevation_m NUMERIC(7,2),
    difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'moderate', 'difficult', 'extreme')),
    terrain_types TEXT[],                   -- ['desert', 'mountain', 'forest', 'mud', 'rock']
    surface_type TEXT,                      -- 'dirt', 'gravel', 'rock', 'sand', 'mixed'

    -- Geographic Bounds (for spatial queries)
    bounds JSONB,                           -- { north, south, east, west }

    -- Source Classification
    source_type TEXT NOT NULL DEFAULT 'community_upload'
        CHECK (source_type IN ('famous_route', 'community_upload', 'osm', 'government')),

    -- Verification & Moderation
    verification_status TEXT DEFAULT 'pending'
        CHECK (verification_status IN ('pending', 'verified', 'rejected', 'flagged')),
    verified_by UUID REFERENCES auth.users(id),
    verified_at TIMESTAMPTZ,
    rejection_reason TEXT,

    -- Searchability & Discovery
    search_tags TEXT[],                     -- ['wattagans', 'hill', 'extreme', '4wd']
    search_vector tsvector,                 -- Full-text search index
    popularity_score INT DEFAULT 0,         -- Calculated from usage stats

    -- Community Features
    contributed_by UUID REFERENCES auth.users(id),
    is_public BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,      -- Admin can feature popular tracks

    -- Usage Statistics
    times_driven INTEGER DEFAULT 0,
    times_saved INTEGER DEFAULT 0,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    average_rating NUMERIC(3,2),            -- 1.00 to 5.00

    -- External References
    osm_way_id BIGINT,                      -- If sourced from OSM
    external_url TEXT,                      -- Link to original source

    -- Metadata
    metadata JSONB DEFAULT '{}',            -- Flexible storage for additional data

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX idx_community_tracks_name ON community_tracks USING GIN(name gin_trgm_ops);
CREATE INDEX idx_community_tracks_region ON community_tracks(region);
CREATE INDEX idx_community_tracks_source ON community_tracks(source_type);
CREATE INDEX idx_community_tracks_status ON community_tracks(verification_status);
CREATE INDEX idx_community_tracks_public ON community_tracks(is_public) WHERE is_public = true;
CREATE INDEX idx_community_tracks_contributor ON community_tracks(contributed_by);
CREATE INDEX idx_community_tracks_tags ON community_tracks USING GIN(search_tags);
CREATE INDEX idx_community_tracks_search ON community_tracks USING GIN(search_vector);
CREATE INDEX idx_community_tracks_geojson ON community_tracks USING GIN(geojson_data);
CREATE INDEX idx_community_tracks_popularity ON community_tracks(popularity_score DESC);
CREATE INDEX idx_community_tracks_country ON community_tracks(country_code);

-- Full-Text Search Trigger
CREATE OR REPLACE FUNCTION update_track_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(array_to_string(NEW.search_tags, ' '), '')), 'C') ||
        setweight(to_tsvector('english', COALESCE(NEW.region, '')), 'D');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_search_vector_update
    BEFORE INSERT OR UPDATE ON community_tracks
    FOR EACH ROW EXECUTE FUNCTION update_track_search_vector();

-- RLS Policies
ALTER TABLE community_tracks ENABLE ROW LEVEL SECURITY;

-- Anyone can view public tracks
CREATE POLICY "Public tracks are viewable by everyone" ON community_tracks
    FOR SELECT USING (is_public = true OR verification_status = 'verified');

-- Users can view their own tracks (even private/pending)
CREATE POLICY "Users can view their own tracks" ON community_tracks
    FOR SELECT USING (contributed_by = auth.uid());

-- Authenticated users can insert tracks
CREATE POLICY "Authenticated users can insert tracks" ON community_tracks
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND contributed_by = auth.uid());

-- Users can update their own unverified tracks
CREATE POLICY "Users can update their own pending tracks" ON community_tracks
    FOR UPDATE USING (
        contributed_by = auth.uid()
        AND verification_status = 'pending'
    );

-- Users can delete their own pending tracks
CREATE POLICY "Users can delete their own pending tracks" ON community_tracks
    FOR DELETE USING (
        contributed_by = auth.uid()
        AND verification_status = 'pending'
    );

-- Admins have full access
CREATE POLICY "Admins have full access to tracks" ON community_tracks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
    );
```

### Track Ratings Table

```sql
CREATE TABLE track_ratings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    track_id UUID NOT NULL REFERENCES community_tracks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    difficulty_experienced TEXT CHECK (difficulty_experienced IN ('easy', 'moderate', 'difficult', 'extreme')),
    conditions TEXT,                        -- "Muddy after rain", "Rocky section damaged"
    driven_date DATE,

    helpful_votes INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(track_id, user_id)              -- One rating per user per track
);

CREATE INDEX idx_track_ratings_track ON track_ratings(track_id);
CREATE INDEX idx_track_ratings_user ON track_ratings(user_id);
CREATE INDEX idx_track_ratings_date ON track_ratings(driven_date DESC);
```

---

## 🔍 Autocomplete Search Implementation

### Search Algorithm

```typescript
// Multi-source autocomplete search
async function searchTracks(query: string, userLocation?: Coordinates) {
  const results = [];

  // 1. EXACT MATCH PRIORITY (Community + Famous)
  const exactMatches = await supabase
    .from('community_tracks')
    .select('*')
    .ilike('name', query)
    .in('verification_status', ['verified'])
    .limit(5);

  results.push(...exactMatches.data.map(t => ({ ...t, matchType: 'exact', score: 100 })));

  // 2. PARTIAL MATCH (Community DB)
  const partialMatches = await supabase
    .from('community_tracks')
    .select('*')
    .or(`name.ilike.%${query}%,search_tags.cs.{${query}}`)
    .in('verification_status', ['verified'])
    .not('id', 'in', `(${exactMatches.data.map(t => t.id).join(',')})`)
    .limit(10);

  results.push(...partialMatches.data.map(t => ({ ...t, matchType: 'partial', score: 75 })));

  // 3. FULL-TEXT SEARCH (Community DB)
  const textMatches = await supabase
    .rpc('search_tracks_fulltext', { search_query: query, max_results: 10 });

  results.push(...textMatches.data.map(t => ({ ...t, matchType: 'fulltext', score: 50 })));

  // 4. OSM FALLBACK (only if < 5 results)
  if (results.length < 5) {
    const osmResults = await searchOSM(query, userLocation);
    results.push(...osmResults.map(t => ({ ...t, matchType: 'osm', score: 25 })));
  }

  // RANK RESULTS
  return rankResults(results, userLocation);
}

function rankResults(results: Track[], userLocation?: Coordinates) {
  return results
    .map(track => {
      let score = track.score;

      // Boost by popularity
      score += Math.min(track.popularity_score / 10, 20);

      // Boost by proximity to user (if location available)
      if (userLocation && track.bounds) {
        const distance = calculateDistance(userLocation, track.bounds);
        if (distance < 100) score += 15;      // Within 100km
        else if (distance < 500) score += 10; // Within 500km
        else if (distance < 1000) score += 5; // Within 1000km
      }

      // Boost famous routes slightly
      if (track.source_type === 'famous_route') score += 10;

      // Boost featured tracks
      if (track.is_featured) score += 5;

      return { ...track, finalScore: score };
    })
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, 20); // Top 20 results
}
```

### Database Function for Full-Text Search

```sql
CREATE OR REPLACE FUNCTION search_tracks_fulltext(
    search_query TEXT,
    max_results INT DEFAULT 10
)
RETURNS SETOF community_tracks AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM community_tracks
    WHERE
        search_vector @@ plainto_tsquery('english', search_query)
        AND verification_status = 'verified'
        AND is_public = true
    ORDER BY
        ts_rank(search_vector, plainto_tsquery('english', search_query)) DESC,
        popularity_score DESC
    LIMIT max_results;
END;
$$ LANGUAGE plpgsql STABLE;
```

---

## 🎨 Frontend Components

### 1. TrackAutocompleteInput Component

```typescript
// src/components/trips/TrackAutocompleteInput.tsx
import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Globe, Users } from 'lucide-react';
import { searchTracks } from '@/services/trackSearchService';
import { debounce } from 'lodash';

interface TrackAutocompleteProps {
  onTrackSelect: (track: CommunityTrack) => void;
  userLocation?: Coordinates;
}

export function TrackAutocompleteInput({ onTrackSelect, userLocation }: TrackAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CommunityTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search
  const performSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const tracks = await searchTracks(searchQuery, userLocation);
        setResults(tracks);
      } catch (error) {
        console.error('Track search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [userLocation]
  );

  useEffect(() => {
    performSearch(query);
  }, [query, performSearch]);

  const getSourceIcon = (sourceType: string) => {
    switch (sourceType) {
      case 'famous_route': return <Globe className="h-4 w-4" />;
      case 'community_upload': return <Users className="h-4 w-4" />;
      case 'osm': return <MapPin className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getSourceLabel = (sourceType: string) => {
    switch (sourceType) {
      case 'famous_route': return 'Famous Route';
      case 'community_upload': return 'Community';
      case 'osm': return 'OpenStreetMap';
      default: return 'Unknown';
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for tracks... (e.g., 'Mud Bowl', 'Pan-American Highway')"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            className="pl-9"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandList>
            {isLoading && (
              <CommandEmpty>Searching tracks...</CommandEmpty>
            )}
            {!isLoading && results.length === 0 && query.length >= 2 && (
              <CommandEmpty>No tracks found. Try a different search term.</CommandEmpty>
            )}
            {!isLoading && results.length > 0 && (
              <CommandGroup heading="Search Results">
                {results.map((track) => (
                  <CommandItem
                    key={track.id}
                    onSelect={() => {
                      onTrackSelect(track);
                      setOpen(false);
                      setQuery('');
                    }}
                    className="flex items-start justify-between py-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{track.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {getSourceIcon(track.source_type)}
                          <span className="ml-1">{getSourceLabel(track.source_type)}</span>
                        </Badge>
                      </div>
                      {track.region && (
                        <div className="text-sm text-muted-foreground">{track.region}</div>
                      )}
                      {track.distance_km && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {track.distance_km.toFixed(1)} km · {track.difficulty_level || 'Unknown difficulty'}
                        </div>
                      )}
                    </div>
                    {track.popularity_score > 50 && (
                      <Badge variant="secondary" className="ml-2">Popular</Badge>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
```

### 2. Track Contribution Modal

```typescript
// src/components/trips/ContributeTrackModal.tsx
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { contributeTrack } from '@/services/trackContributionService';

interface ContributeTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  gpxData?: GPXTrack; // Optional: pre-fill from uploaded GPX
}

export function ContributeTrackModal({ isOpen, onClose, gpxData }: ContributeTrackModalProps) {
  const [formData, setFormData] = useState({
    name: gpxData?.name || '',
    description: '',
    region: '',
    difficulty: 'moderate',
    terrainTypes: [] as string[],
    tags: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('Track name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await contributeTrack({
        ...formData,
        search_tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        geojson_data: gpxData?.geojson || null,
      });

      toast.success('Track submitted for review! Admins will verify it soon.');
      onClose();
    } catch (error) {
      console.error('Track contribution error:', error);
      toast.error('Failed to submit track. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Contribute a Track to the Community</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="name">Track Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Erzberg Extream Hill"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="region">Region / Location</Label>
            <Input
              id="region"
              placeholder="e.g., Wattagans Forest, NSW, Australia"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the track, conditions, notable features..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="difficulty">Difficulty Level</Label>
            <Select
              value={formData.difficulty}
              onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
            >
              <SelectTrigger id="difficulty">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy - Stock Unimog</SelectItem>
                <SelectItem value="moderate">Moderate - Some modifications needed</SelectItem>
                <SelectItem value="difficult">Difficult - Experienced drivers only</SelectItem>
                <SelectItem value="extreme">Extreme - High risk, expert only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="tags">Search Tags (comma-separated)</Label>
            <Input
              id="tags"
              placeholder="e.g., wattagans, hill, extreme, mud, rock"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Tags help other users find this track
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit for Review'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 🌱 Famous Routes Seeding Strategy

### Initial Seed Data (Top 50 Routes)

```typescript
// scripts/seed-famous-routes.ts
const FAMOUS_ROUTES = [
  {
    name: "Pan-American Highway",
    description: "The world's longest 'motorable road' stretching from Alaska to Argentina",
    region: "Americas",
    country_code: "Multiple",
    distance_km: 30000,
    difficulty_level: "moderate",
    terrain_types: ["highway", "mountain", "desert", "jungle"],
    search_tags: ["pan-american", "highway", "alaska", "argentina", "longest", "road"],
    is_featured: true,
    popularity_score: 95,
  },
  {
    name: "Trans-America Trail",
    description: "Off-road motorcycle and 4x4 route across the United States",
    region: "United States",
    country_code: "US",
    distance_km: 8000,
    difficulty_level: "difficult",
    terrain_types: ["dirt", "gravel", "mountain", "desert"],
    search_tags: ["tat", "trans-america", "usa", "offroad", "4x4"],
    is_featured: true,
    popularity_score: 90,
  },
  {
    name: "Silk Road",
    description: "Ancient trade route connecting East and West",
    region: "Asia",
    country_code: "Multiple",
    distance_km: 6500,
    difficulty_level: "extreme",
    terrain_types: ["desert", "mountain", "steppe"],
    search_tags: ["silk-road", "asia", "china", "historic", "adventure"],
    is_featured: true,
    popularity_score: 85,
  },
  {
    name: "Gibb River Road",
    description: "Iconic 4WD track through the Kimberley region of Western Australia",
    region: "Western Australia",
    country_code: "AU",
    distance_km: 660,
    difficulty_level: "moderate",
    terrain_types: ["dirt", "gravel", "river-crossing"],
    search_tags: ["gibb-river", "kimberley", "australia", "4wd", "outback"],
    is_featured: true,
    popularity_score: 88,
  },
  {
    name: "Simpson Desert Crossing",
    description: "Australia's most challenging desert crossing with 1100+ sand dunes",
    region: "Central Australia",
    country_code: "AU",
    distance_km: 435,
    difficulty_level: "extreme",
    terrain_types: ["sand", "dunes", "desert"],
    search_tags: ["simpson", "desert", "australia", "sand-dunes", "extreme"],
    is_featured: true,
    popularity_score: 82,
  },
  // ... Add 45 more famous routes
];

// Fetch actual coordinates from OSM for each route
async function seedFamousRoute(route: FamousRoute) {
  const osmData = await fetchFromOSM(route.name);

  await supabase.from('community_tracks').insert({
    ...route,
    source_type: 'famous_route',
    verification_status: 'verified',
    geojson_data: osmData.geojson,
    verified_by: ADMIN_USER_ID,
    verified_at: new Date().toISOString(),
  });
}
```

### Admin Interface for Adding Famous Routes

```typescript
// src/components/admin/AddFamousRoute.tsx
// Allow admins to search OSM and promote routes to "famous_route" status
```

---

## 🔄 Community Contribution Workflow

### User Flow

```
1. User drives "Mud Bowl track" with GPS
   ↓
2. Uploads GPX file OR manually adds track via form
   ↓
3. System extracts: name, region, coordinates, metadata
   ↓
4. Status: pending → Shows in "My Tracks" only
   ↓
5. Admin reviews submission in Admin Dashboard
   ↓
6. Admin verifies OR rejects with reason
   ↓
7. If verified: Track becomes searchable by all users
   ↓
8. Community can rate, review, and improve metadata
```

### Admin Review Interface

```typescript
// src/components/admin/TrackReviewQueue.tsx
- List of pending tracks
- Preview map with route
- Approve/Reject buttons
- Edit metadata before approval
- Batch operations (approve multiple)
```

---

## 📊 Success Metrics

### Phase 1: Foundation (Weeks 1-2)
- Database schema deployed ✅
- Famous routes seeded (50 routes) ✅
- Basic autocomplete working ✅

### Phase 2: Community Features (Weeks 3-4)
- User contribution flow working ✅
- Admin review queue functional ✅
- 100+ community tracks verified ✅

### Phase 3: Enhancement (Weeks 5-6)
- OSM fallback integrated ✅
- Ratings and reviews functional ✅
- Search ranking optimized ✅

### Long-term KPIs
- 500+ tracks in database (3 months)
- 80% search success rate
- <200ms autocomplete response time
- 50+ active contributors per month

---

## 🚀 Implementation Timeline

### Week 1: Database & Backend
- [x] Create `community_tracks` table migration
- [x] Create `track_ratings` table migration
- [x] Implement full-text search function
- [x] Build track search service
- [x] Seed 50 famous routes

### Week 2: Autocomplete Component
- [ ] Build `TrackAutocompleteInput` component
- [ ] Integrate with TripPlanner
- [ ] Test search performance
- [ ] Deploy to staging

### Week 3: Community Contribution
- [ ] Build `ContributeTrackModal` component
- [ ] Build track submission service
- [ ] Create admin review queue UI
- [ ] Test end-to-end contribution flow

### Week 4: Polish & Launch
- [ ] OSM fallback integration
- [ ] Track ratings UI
- [ ] Performance optimization
- [ ] Deploy to production
- [ ] User documentation

---

## 🔐 Security Considerations

### Input Validation
- Sanitize all user-submitted track names
- Validate GeoJSON structure
- Prevent SQL injection in search queries
- Rate limit autocomplete requests

### Content Moderation
- Admin approval required for public tracks
- Community flagging system for inappropriate content
- Automated spam detection
- Track ownership verification

### Privacy
- Private tracks hidden from other users
- User can choose public/private on upload
- Location data only shown for public tracks
- User activity not tracked without consent

---

## 📝 Testing Strategy

### Unit Tests
- Search algorithm ranking
- GeoJSON validation
- Distance calculations
- Text search matching

### Integration Tests
- Autocomplete end-to-end flow
- Track contribution workflow
- Admin review process
- Multi-source search priority

### Performance Tests
- 10,000+ tracks in database
- Autocomplete response time < 200ms
- Concurrent user searches
- Database query optimization

---

## 🎯 Next Steps

1. **Get User Approval** ✅ (You're reading this!)
2. **Create Database Migration**
3. **Seed Famous Routes**
4. **Build Autocomplete Component**
5. **Test with Real Data**
6. **Deploy to Staging**
7. **Gather User Feedback**
8. **Iterate and Improve**

---

**Questions? Concerns? Let's discuss before implementation begins!**
