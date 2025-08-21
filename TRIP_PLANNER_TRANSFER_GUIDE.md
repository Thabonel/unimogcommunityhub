# Trip Planner Transfer Guide
Complete documentation for transferring the UnimogCommunityHub trip planning system to another project

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Database Schema](#database-schema)
4. [Frontend Components](#frontend-components)
5. [Services & Utilities](#services--utilities)
6. [Dependencies](#dependencies)
7. [Environment Configuration](#environment-configuration)
8. [Implementation Steps](#implementation-steps)
9. [API Integration](#api-integration)
10. [Testing Checklist](#testing-checklist)

## Overview

The Trip Planner is a comprehensive GPX-based route planning and navigation system designed for off-road vehicle navigation. It includes:

- **GPX File Support**: Upload, parse, display, and analyze GPX tracks
- **Route Planning**: Interactive route creation with OpenRouteService integration
- **Elevation Profiles**: Terrain analysis with difficulty assessment
- **Waypoint Management**: Save and organize points of interest
- **Track Library**: Store and manage saved routes
- **Offline Support**: PWA capabilities for remote areas

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Trip Planner Architecture                 │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React + TypeScript)                              │
│  ┌─────────────────┐ ┌─────────────────┐ ┌──────────────┐  │
│  │ TripLibrary Page│ │ Maps Page       │ │ Components   │  │
│  │ - Track list    │ │ - Interactive   │ │ - GPX Upload │  │
│  │ - Management    │ │ - Route builder │ │ - Save Route │  │
│  └─────────────────┘ └─────────────────┘ └──────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  Services Layer                                             │
│  ┌─────────────────┐ ┌─────────────────┐ ┌──────────────┐  │
│  │ RoutingService  │ │ MapboxService   │ │ TripService  │  │
│  │ - ORS routing   │ │ - Map rendering │ │ - CRUD ops   │  │
│  └─────────────────┘ └─────────────────┘ └──────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  Utilities                                                  │
│  ┌─────────────────┐ ┌─────────────────┐ ┌──────────────┐  │
│  │ GPX Parser      │ │ Elevation Calc  │ │ Geo Utils    │  │
│  │ - XML parsing   │ │ - Profile gen   │ │ - Distance   │  │
│  └─────────────────┘ └─────────────────┘ └──────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  Backend (Supabase)                                         │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ PostgreSQL Database + Storage + Edge Functions          │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema

### Required Tables

#### 1. trips
```sql
CREATE TABLE IF NOT EXISTS trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_location TEXT,
    end_location TEXT,
    planned_start_date TIMESTAMP WITH TIME ZONE,
    planned_end_date TIMESTAMP WITH TIME ZONE,
    actual_start_date TIMESTAMP WITH TIME ZONE,
    actual_end_date TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'cancelled')),
    privacy TEXT DEFAULT 'private' CHECK (privacy IN ('private', 'friends', 'public')),
    total_distance DECIMAL,
    estimated_duration INTEGER,
    difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'moderate', 'hard', 'extreme')),
    tags TEXT[],
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
```

#### 2. gpx_tracks
```sql
CREATE TABLE IF NOT EXISTS gpx_tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    file_name TEXT,
    file_size INTEGER,
    file_url TEXT,
    total_distance DECIMAL,
    total_elevation_gain DECIMAL,
    total_elevation_loss DECIMAL,
    max_elevation DECIMAL,
    min_elevation DECIMAL,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    duration INTEGER,
    bounds JSONB,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE gpx_tracks ENABLE ROW LEVEL SECURITY;
```

#### 3. gpx_track_points
```sql
CREATE TABLE IF NOT EXISTS gpx_track_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    track_id UUID REFERENCES gpx_tracks(id) ON DELETE CASCADE NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    elevation DECIMAL,
    time_stamp TIMESTAMP WITH TIME ZONE,
    segment_index INTEGER DEFAULT 0,
    point_index INTEGER NOT NULL,
    speed DECIMAL,
    course DECIMAL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE gpx_track_points ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_gpx_track_points_track_id ON gpx_track_points(track_id);
CREATE INDEX idx_gpx_track_points_coords ON gpx_track_points(latitude, longitude);
CREATE INDEX idx_gpx_track_points_sequence ON gpx_track_points(track_id, segment_index, point_index);
```

#### 4. gpx_waypoints
```sql
CREATE TABLE IF NOT EXISTS gpx_waypoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
    track_id UUID REFERENCES gpx_tracks(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    elevation DECIMAL,
    waypoint_type TEXT DEFAULT 'poi' CHECK (waypoint_type IN ('poi', 'camping', 'fuel', 'food', 'repair', 'scenic', 'warning', 'checkpoint')),
    symbol TEXT,
    time_stamp TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE gpx_waypoints ENABLE ROW LEVEL SECURITY;
```

#### 5. routes
```sql
CREATE TABLE IF NOT EXISTS routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    start_point JSONB NOT NULL,
    end_point JSONB NOT NULL,
    waypoints JSONB DEFAULT '[]',
    route_profile TEXT DEFAULT 'driving-car',
    avoid_options TEXT[] DEFAULT '{}',
    distance_km DECIMAL,
    duration_minutes INTEGER,
    elevation_gain DECIMAL,
    elevation_loss DECIMAL,
    difficulty_score INTEGER CHECK (difficulty_score >= 1 AND difficulty_score <= 10),
    route_geometry JSONB,
    instructions JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
```

### RLS Policies

```sql
-- Example for gpx_tracks table (apply similar pattern to all tables)
CREATE POLICY "Users can view own tracks" ON gpx_tracks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tracks" ON gpx_tracks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tracks" ON gpx_tracks
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tracks" ON gpx_tracks
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public tracks are viewable" ON gpx_tracks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM trips 
            WHERE trips.id = trip_id 
            AND trips.privacy = 'public'
        )
    );
```

### Storage Bucket

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'gpx-files',
    'gpx-files',
    false,
    52428800,
    ARRAY['application/gpx+xml', 'text/xml', 'application/xml']
) ON CONFLICT (id) DO NOTHING;
```

## Frontend Components

### Core Components Structure

```
src/
├── pages/
│   ├── TripLibrary.tsx       # Main trip library page
│   └── Maps.tsx              # Interactive map page
├── components/
│   ├── GPXUploadModal.tsx    # GPX file upload modal
│   ├── SaveRouteModal.tsx    # Save route modal
│   └── GPXTrackDisplay.tsx   # Track display with elevation
├── services/
│   ├── routingService.ts     # OpenRouteService integration
│   ├── mapboxService.ts      # Mapbox map management
│   └── tripService.ts        # Trip CRUD operations
└── utils/
    ├── gpxUtils.ts           # GPX parsing utilities
    ├── elevationProfile.ts   # Elevation calculations
    └── geoUtils.ts          # Geospatial utilities
```

### 1. GPXUploadModal Component

```typescript
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload } from 'lucide-react';
import { tripService } from '@/services/tripService';
import { parseGPXFile } from '@/utils/gpxUtils';

interface GPXUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (track: any) => void;
}

export function GPXUploadModal({ isOpen, onClose, onUploadSuccess }: GPXUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.name.endsWith('.gpx')) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      const text = await file.text();
      const parsedGPX = parseGPXFile(text);
      
      setUploadProgress(50);
      
      const track = await tripService.uploadGPXTrack(file, parsedGPX);
      
      setUploadProgress(100);
      onUploadSuccess(track);
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload GPX Track</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <input
              type="file"
              accept=".gpx"
              onChange={handleFileSelect}
              className="mt-2"
            />
            {file && <p className="mt-2 text-sm">{file.name}</p>}
          </div>
          
          {isUploading && (
            <Progress value={uploadProgress} className="w-full" />
          )}
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={!file || isUploading}
            >
              Upload
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### 2. SaveRouteModal Component

```typescript
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { tripService } from '@/services/tripService';

interface SaveRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  routeData: any;
  onSaveSuccess: () => void;
}

export function SaveRouteModal({ isOpen, onClose, routeData, onSaveSuccess }: SaveRouteModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    difficulty: 'moderate',
    isPublic: false
  });

  const handleSave = async () => {
    try {
      await tripService.saveRoute({
        ...formData,
        ...routeData
      });
      onSaveSuccess();
      onClose();
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Route</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Route Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="My Epic Trail"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your route..."
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Route
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

## Services & Utilities

### 1. Routing Service

```typescript
// src/services/routingService.ts
export class RoutingService {
  private static instance: RoutingService;
  private readonly openRouteServiceKey: string;
  private readonly baseUrl = 'https://api.openrouteservice.org/v2';

  private constructor() {
    this.openRouteServiceKey = import.meta.env.VITE_OPENROUTESERVICE_API_KEY || '';
  }

  public static getInstance(): RoutingService {
    if (!RoutingService.instance) {
      RoutingService.instance = new RoutingService();
    }
    return RoutingService.instance;
  }

  async calculateRoute(
    start: Position,
    end: Position,
    profile: RoutingProfile = 'driving-hgv',
    options: RouteOptions = {}
  ): Promise<RouteResult> {
    const coordinates = [
      [start.lng, start.lat],
      [end.lng, end.lat]
    ];

    if (options.waypoints) {
      coordinates.splice(1, 0, ...options.waypoints.map(wp => [wp.lng, wp.lat]));
    }

    const body = {
      coordinates,
      format: 'geojson',
      elevation: true,
      extra_info: ['waytype', 'surface', 'steepness'],
      options: {
        avoid_features: options.avoidTolls ? ['tollways'] : [],
        vehicle_type: 'hgv',
        profile_params: {
          restrictions: {
            axleload: options.maxAxleLoad || 10000,
            width: options.maxWidth || 2.5,
            height: options.maxHeight || 3.5,
            weight: options.maxWeight || 15000
          }
        }
      }
    };

    const response = await fetch(`${this.baseUrl}/directions/${profile}/geojson`, {
      method: 'POST',
      headers: {
        'Authorization': this.openRouteServiceKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`Routing request failed: ${response.statusText}`);
    }

    return await response.json();
  }
}
```

### 2. GPX Parser Utility

```typescript
// src/utils/gpxUtils.ts
export interface GPXData {
  name: string;
  description?: string;
  tracks: GPXTrack[];
  waypoints: GPXWaypoint[];
  bounds: Bounds;
  stats: GPXStats;
}

export function parseGPXFile(xmlString: string): GPXData {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'text/xml');
  
  const name = doc.querySelector('name')?.textContent || 'Unnamed Track';
  const description = doc.querySelector('desc')?.textContent;
  
  const tracks: GPXTrack[] = [];
  const waypoints: GPXWaypoint[] = [];
  
  // Parse tracks
  const trackElements = doc.querySelectorAll('trk');
  trackElements.forEach(trk => {
    const trackName = trk.querySelector('name')?.textContent || 'Track';
    const segments: GPXSegment[] = [];
    
    const segmentElements = trk.querySelectorAll('trkseg');
    segmentElements.forEach(seg => {
      const points: GPXPoint[] = [];
      
      const pointElements = seg.querySelectorAll('trkpt');
      pointElements.forEach(pt => {
        const lat = parseFloat(pt.getAttribute('lat') || '0');
        const lon = parseFloat(pt.getAttribute('lon') || '0');
        const ele = parseFloat(pt.querySelector('ele')?.textContent || '0');
        const time = pt.querySelector('time')?.textContent;
        
        points.push({ lat, lon, ele, time });
      });
      
      segments.push({ points });
    });
    
    tracks.push({ name: trackName, segments });
  });
  
  // Parse waypoints
  const waypointElements = doc.querySelectorAll('wpt');
  waypointElements.forEach(wpt => {
    const lat = parseFloat(wpt.getAttribute('lat') || '0');
    const lon = parseFloat(wpt.getAttribute('lon') || '0');
    const ele = parseFloat(wpt.querySelector('ele')?.textContent || '0');
    const name = wpt.querySelector('name')?.textContent || 'Waypoint';
    const desc = wpt.querySelector('desc')?.textContent;
    
    waypoints.push({ lat, lon, ele, name, desc });
  });
  
  // Calculate bounds and stats
  const bounds = calculateBounds(tracks, waypoints);
  const stats = calculateStats(tracks);
  
  return {
    name,
    description,
    tracks,
    waypoints,
    bounds,
    stats
  };
}

function calculateStats(tracks: GPXTrack[]): GPXStats {
  let totalDistance = 0;
  let totalElevationGain = 0;
  let totalElevationLoss = 0;
  let maxElevation = -Infinity;
  let minElevation = Infinity;
  
  tracks.forEach(track => {
    track.segments.forEach(segment => {
      for (let i = 1; i < segment.points.length; i++) {
        const p1 = segment.points[i - 1];
        const p2 = segment.points[i];
        
        // Calculate distance
        totalDistance += calculateDistance(p1, p2);
        
        // Calculate elevation changes
        const elevDiff = p2.ele - p1.ele;
        if (elevDiff > 0) {
          totalElevationGain += elevDiff;
        } else {
          totalElevationLoss += Math.abs(elevDiff);
        }
        
        // Track min/max elevation
        maxElevation = Math.max(maxElevation, p2.ele);
        minElevation = Math.min(minElevation, p2.ele);
      }
    });
  });
  
  return {
    totalDistance,
    totalElevationGain,
    totalElevationLoss,
    maxElevation: maxElevation === -Infinity ? 0 : maxElevation,
    minElevation: minElevation === Infinity ? 0 : minElevation
  };
}
```

### 3. Elevation Profile Utility

```typescript
// src/utils/elevationProfile.ts
export interface ElevationPoint {
  distance: number;
  elevation: number;
  grade?: number;
  lat?: number;
  lng?: number;
}

export function calculateElevationProfile(coordinates: number[][]): {
  profile: ElevationPoint[];
  stats: ElevationStats;
} {
  const profile: ElevationPoint[] = [];
  let totalDistance = 0;
  let totalAscent = 0;
  let totalDescent = 0;
  let maxElevation = -Infinity;
  let minElevation = Infinity;
  let grades: number[] = [];

  for (let i = 0; i < coordinates.length; i++) {
    const [lng, lat, elevation = 0] = coordinates[i];
    
    if (i > 0) {
      const prevCoord = coordinates[i - 1];
      const distance = calculateDistance(
        prevCoord[1], prevCoord[0],
        lat, lng
      );
      totalDistance += distance;

      const elevationDiff = elevation - (prevCoord[2] || 0);
      if (elevationDiff > 0) {
        totalAscent += elevationDiff;
      } else {
        totalDescent += Math.abs(elevationDiff);
      }

      const grade = distance > 0 ? (elevationDiff / distance) * 100 : 0;
      grades.push(grade);
    }

    maxElevation = Math.max(maxElevation, elevation);
    minElevation = Math.min(minElevation, elevation);

    profile.push({
      distance: totalDistance,
      elevation,
      lat,
      lng,
      grade: grades.length > 0 ? grades[grades.length - 1] : 0
    });
  }

  return {
    profile,
    stats: {
      totalAscent,
      totalDescent,
      maxElevation,
      minElevation,
      maxGrade: Math.max(...grades, 0),
      minGrade: Math.min(...grades, 0),
      averageGrade: grades.reduce((a, b) => a + b, 0) / grades.length
    }
  };
}
```

## Dependencies

### NPM Package Installation

```bash
npm install --save \
  mapbox-gl@^3.0.1 \
  @types/mapbox-gl@^2.7.19 \
  react-map-gl@^7.1.7 \
  gpx-parser-builder@^1.9.1 \
  file-saver@^2.0.5 \
  @types/file-saver@^2.0.7 \
  @supabase/supabase-js@^2.38.4 \
  lucide-react@^0.263.1 \
  @radix-ui/react-dialog@^1.0.4 \
  @radix-ui/react-toast@^1.1.4 \
  class-variance-authority@^0.7.0 \
  clsx@^2.0.0 \
  tailwind-merge@^1.14.0
```

### Package.json Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.2",
    "mapbox-gl": "^3.0.1",
    "@types/mapbox-gl": "^2.7.19",
    "react-map-gl": "^7.1.7",
    "gpx-parser-builder": "^1.9.1",
    "file-saver": "^2.0.5",
    "@supabase/supabase-js": "^2.38.4",
    "lucide-react": "^0.263.1",
    "@radix-ui/react-dialog": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.4",
    "tailwindcss": "^3.3.0",
    "@tailwindcss/forms": "^0.5.7"
  },
  "devDependencies": {
    "@types/react": "^18.0.28",
    "@types/react-dom": "^18.0.11",
    "@types/file-saver": "^2.0.7",
    "vite": "^4.4.5",
    "@vitejs/plugin-react": "^4.0.3"
  }
}
```

## Environment Configuration

### .env File Setup

```bash
# Supabase Configuration (Required)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id

# Mapbox Configuration (Required)
VITE_MAPBOX_ACCESS_TOKEN=pk.your_mapbox_public_token

# OpenRouteService Configuration (Required for routing)
VITE_OPENROUTESERVICE_API_KEY=your_openroute_api_key

# Optional Configuration
VITE_APP_NAME="Trip Planner"
VITE_APP_SHORT_NAME="TripPlanner"
VITE_ENABLE_DEV_LOGIN=false
```

### Environment Type Definitions

```typescript
// src/vite-env.d.ts
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_SUPABASE_PROJECT_ID: string
  readonly VITE_MAPBOX_ACCESS_TOKEN: string
  readonly VITE_OPENROUTESERVICE_API_KEY: string
  readonly VITE_APP_NAME?: string
  readonly VITE_APP_SHORT_NAME?: string
  readonly VITE_ENABLE_DEV_LOGIN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

## Implementation Steps

### Step 1: Set Up Infrastructure

1. **Create Supabase Project**
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Initialize Supabase
   supabase init
   
   # Link to your project
   supabase link --project-ref your_project_id
   ```

2. **Run Database Migrations**
   ```bash
   # Create migration files
   supabase migration new create_trip_tables
   
   # Apply migrations
   supabase db push
   ```

3. **Create Storage Bucket**
   ```sql
   -- Run in Supabase SQL editor
   INSERT INTO storage.buckets (id, name, public)
   VALUES ('gpx-files', 'gpx-files', false);
   ```

### Step 2: Configure External Services

1. **Mapbox Setup**
   - Create account at https://mapbox.com
   - Generate public access token
   - Add to environment variables

2. **OpenRouteService Setup**
   - Create account at https://openrouteservice.org
   - Generate API key
   - Add to environment variables

### Step 3: Install Frontend

1. **Copy Required Files**
   ```
   src/
   ├── components/
   │   ├── GPXUploadModal.tsx
   │   ├── SaveRouteModal.tsx
   │   └── GPXTrackDisplay.tsx
   ├── services/
   │   ├── routingService.ts
   │   ├── mapboxService.ts
   │   └── tripService.ts
   ├── utils/
   │   ├── gpxUtils.ts
   │   ├── elevationProfile.ts
   │   └── geoUtils.ts
   └── pages/
       ├── TripLibrary.tsx
       └── Maps.tsx
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Tailwind**
   ```javascript
   // tailwind.config.js
   module.exports = {
     content: ["./src/**/*.{js,ts,jsx,tsx}"],
     theme: {
       extend: {
         colors: {
           'military-green': '#4a5d23',
           'camo-brown': '#8b7355'
         }
       }
     },
     plugins: [require("@tailwindcss/forms")]
   }
   ```

### Step 4: Configure Build System

1. **Vite Configuration**
   ```typescript
   // vite.config.ts
   import { defineConfig } from 'vite';
   import react from '@vitejs/plugin-react';
   import path from 'path';

   export default defineConfig({
     plugins: [react()],
     resolve: {
       alias: {
         '@': path.resolve(__dirname, './src')
       }
     },
     optimizeDeps: {
       include: ['mapbox-gl']
     }
   });
   ```

2. **Add CSS Imports**
   ```css
   /* src/index.css */
   @import 'mapbox-gl/dist/mapbox-gl.css';
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

### Step 5: Deploy Edge Functions

1. **Create Edge Function**
   ```typescript
   // supabase/functions/process-gpx/index.ts
   import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
   
   serve(async (req) => {
     // GPX processing logic
     return new Response(JSON.stringify({ success: true }));
   });
   ```

2. **Deploy Function**
   ```bash
   supabase functions deploy process-gpx
   ```

## API Integration

### Mapbox Integration

```typescript
// Initialize Mapbox
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/outdoors-v12',
  center: [lng, lat],
  zoom: 10
});
```

### OpenRouteService Integration

```typescript
// Calculate route
const response = await fetch('https://api.openrouteservice.org/v2/directions/driving-hgv/geojson', {
  method: 'POST',
  headers: {
    'Authorization': apiKey,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    coordinates: [[lng1, lat1], [lng2, lat2]],
    format: 'geojson',
    elevation: true
  })
});
```

### Supabase Integration

```typescript
// Initialize Supabase client
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Upload GPX track
const { data, error } = await supabase
  .from('gpx_tracks')
  .insert({ name, description, gpx_data });
```

## Testing Checklist

### Functionality Tests

- [ ] **GPX Upload**
  - [ ] Can select and upload .gpx files
  - [ ] File parsing works correctly
  - [ ] Track points are saved to database
  - [ ] Elevation profile is calculated

- [ ] **Route Planning**
  - [ ] Can create routes by clicking on map
  - [ ] Routing service returns valid routes
  - [ ] Can add waypoints
  - [ ] Route difficulty is calculated

- [ ] **Map Display**
  - [ ] Map loads without errors
  - [ ] GPX tracks display correctly
  - [ ] Elevation profile chart works
  - [ ] Map controls are responsive

- [ ] **Data Management**
  - [ ] Can save routes to database
  - [ ] Can load saved routes
  - [ ] Can delete routes
  - [ ] Privacy settings work

### Performance Tests

- [ ] Large GPX files (>10MB) upload successfully
- [ ] Map renders smoothly with multiple tracks
- [ ] Elevation calculations complete in <2 seconds
- [ ] Database queries are optimized

### Security Tests

- [ ] RLS policies prevent unauthorized access
- [ ] API keys are not exposed in client
- [ ] File uploads are validated
- [ ] User data is properly isolated

### Browser Compatibility

- [ ] Chrome 90+
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Edge 90+
- [ ] Mobile browsers

## Troubleshooting

### Common Issues

1. **Map not loading**
   - Check Mapbox access token
   - Verify token has correct scopes
   - Check browser console for errors

2. **Routing fails**
   - Verify OpenRouteService API key
   - Check rate limits (2000/day free tier)
   - Validate coordinate format

3. **GPX upload errors**
   - Verify file is valid GPX format
   - Check file size limits
   - Ensure storage bucket exists

4. **Database errors**
   - Run migrations in correct order
   - Check RLS policies
   - Verify user authentication

### Debug Commands

```bash
# Check Supabase status
supabase status

# View database logs
supabase db logs

# Test edge function locally
supabase functions serve process-gpx

# Check storage buckets
supabase storage ls
```

## Additional Resources

- [Mapbox GL JS Documentation](https://docs.mapbox.com/mapbox-gl-js/)
- [OpenRouteService API Docs](https://openrouteservice.org/dev/#/api-docs)
- [Supabase Documentation](https://supabase.com/docs)
- [GPX Format Specification](https://www.topografix.com/gpx.asp)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License & Attribution

This trip planner system was originally developed for the UnimogCommunityHub project. When implementing in your project, please ensure you:

1. Obtain your own API keys for all services
2. Follow the terms of service for Mapbox and OpenRouteService
3. Implement appropriate data privacy measures
4. Credit original sources where appropriate

---

*This guide provides everything needed to transfer the trip planner functionality to a new project. For questions or issues, refer to the troubleshooting section or consult the original codebase.*