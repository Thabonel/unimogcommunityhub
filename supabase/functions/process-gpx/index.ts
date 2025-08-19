import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-requested-with',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
  'Access-Control-Max-Age': '86400',
}

interface GPXTrackPoint {
  lat: number;
  lon: number;
  elevation?: number;
  time?: string;
  distance?: number;
}

interface GPXTrack {
  name: string;
  description?: string;
  distance: number;
  elevation: {
    min: number;
    max: number;
    gain: number;
    loss: number;
  };
  duration?: number;
  trackPoints: GPXTrackPoint[];
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

interface GPXWaypoint {
  name: string;
  description?: string;
  lat: number;
  lon: number;
  elevation?: number;
  type?: string;
  symbol?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: corsHeaders,
      status: 200,
    })
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get request body
    const { gpxContent, filename, tripId } = await req.json()
    if (!gpxContent) {
      return new Response(
        JSON.stringify({ error: 'GPX content is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`Processing GPX file: ${filename || 'unnamed'} for user: ${user.id}`)

    // Parse GPX content
    const parseResult = await parseGPXContent(gpxContent)
    
    if (!parseResult.tracks.length && !parseResult.waypoints.length) {
      return new Response(
        JSON.stringify({ error: 'No tracks or waypoints found in GPX file' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Store tracks in database
    const storedTracks = []
    for (const track of parseResult.tracks) {
      // Insert track
      const { data: trackData, error: trackError } = await supabaseClient
        .from('gpx_tracks')
        .insert({
          name: track.name,
          description: track.description,
          distance: track.distance,
          elevation_min: track.elevation.min,
          elevation_max: track.elevation.max,
          elevation_gain: track.elevation.gain,
          elevation_loss: track.elevation.loss,
          duration: track.duration,
          bounds_north: track.bounds.north,
          bounds_south: track.bounds.south,
          bounds_east: track.bounds.east,
          bounds_west: track.bounds.west,
          point_count: track.trackPoints.length,
          user_id: user.id,
          trip_id: tripId || null,
          filename: filename || null,
        })
        .select()
        .single()

      if (trackError) {
        console.error('Error inserting track:', trackError)
        continue
      }

      // Insert track points in batches
      const batchSize = 1000
      for (let i = 0; i < track.trackPoints.length; i += batchSize) {
        const batch = track.trackPoints.slice(i, i + batchSize).map((point, index) => ({
          track_id: trackData.id,
          point_index: i + index,
          latitude: point.lat,
          longitude: point.lon,
          elevation: point.elevation,
          timestamp: point.time,
          distance: point.distance,
        }))

        const { error: pointsError } = await supabaseClient
          .from('gpx_track_points')
          .insert(batch)

        if (pointsError) {
          console.error(`Error inserting track points batch ${i}:`, pointsError)
        }
      }

      storedTracks.push({
        id: trackData.id,
        ...track,
      })
    }

    // Store waypoints
    const storedWaypoints = []
    for (const waypoint of parseResult.waypoints) {
      const { data: waypointData, error: waypointError } = await supabaseClient
        .from('gpx_waypoints')
        .insert({
          name: waypoint.name,
          description: waypoint.description,
          latitude: waypoint.lat,
          longitude: waypoint.lon,
          elevation: waypoint.elevation,
          type: waypoint.type,
          symbol: waypoint.symbol,
          user_id: user.id,
          trip_id: tripId || null,
        })
        .select()
        .single()

      if (waypointError) {
        console.error('Error inserting waypoint:', waypointError)
        continue
      }

      storedWaypoints.push({
        id: waypointData.id,
        ...waypoint,
      })
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        tracks: storedTracks,
        waypoints: storedWaypoints,
        summary: {
          trackCount: storedTracks.length,
          waypointCount: storedWaypoints.length,
          totalDistance: storedTracks.reduce((sum, track) => sum + track.distance, 0),
          totalPoints: storedTracks.reduce((sum, track) => sum + track.trackPoints.length, 0),
        },
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

/**
 * Parse GPX content using DOMParser
 */
async function parseGPXContent(gpxContent: string) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(gpxContent, 'application/xml')
  
  // Check for parsing errors
  const errorNode = doc.querySelector('parsererror')
  if (errorNode) {
    throw new Error('Invalid GPX XML format')
  }

  const gpxElement = doc.querySelector('gpx')
  if (!gpxElement) {
    throw new Error('No GPX root element found')
  }

  const tracks: GPXTrack[] = []
  const waypoints: GPXWaypoint[] = []

  // Parse tracks
  const trackElements = doc.querySelectorAll('trk')
  for (const trackElement of trackElements) {
    const track = parseTrack(trackElement)
    if (track) {
      tracks.push(track)
    }
  }

  // Parse waypoints
  const waypointElements = doc.querySelectorAll('wpt')
  for (const waypointElement of waypointElements) {
    const waypoint = parseWaypoint(waypointElement)
    if (waypoint) {
      waypoints.push(waypoint)
    }
  }

  return {
    tracks,
    waypoints,
    metadata: {
      name: doc.querySelector('metadata name')?.textContent || undefined,
      description: doc.querySelector('metadata desc')?.textContent || undefined,
    },
  }
}

/**
 * Parse a single track element
 */
function parseTrack(trackElement: Element): GPXTrack | null {
  const name = trackElement.querySelector('name')?.textContent || 'Unnamed Track'
  const description = trackElement.querySelector('desc')?.textContent || undefined

  const trackPoints: GPXTrackPoint[] = []
  const segmentElements = trackElement.querySelectorAll('trkseg')

  for (const segmentElement of segmentElements) {
    const pointElements = segmentElement.querySelectorAll('trkpt')
    
    for (const pointElement of pointElements) {
      const lat = parseFloat(pointElement.getAttribute('lat') || '0')
      const lon = parseFloat(pointElement.getAttribute('lon') || '0')
      
      if (!isNaN(lat) && !isNaN(lon)) {
        const elevation = pointElement.querySelector('ele')?.textContent
        const time = pointElement.querySelector('time')?.textContent

        trackPoints.push({
          lat,
          lon,
          elevation: elevation ? parseFloat(elevation) : undefined,
          time: time || undefined,
        })
      }
    }
  }

  if (trackPoints.length === 0) {
    return null
  }

  // Calculate cumulative distances
  let cumulativeDistance = 0
  for (let i = 0; i < trackPoints.length; i++) {
    trackPoints[i].distance = cumulativeDistance
    if (i > 0) {
      const distance = calculateDistance(
        trackPoints[i - 1].lat,
        trackPoints[i - 1].lon,
        trackPoints[i].lat,
        trackPoints[i].lon
      )
      cumulativeDistance += distance
    }
  }

  // Calculate elevation data
  const elevations = trackPoints
    .map(p => p.elevation)
    .filter(e => e !== undefined) as number[]
  
  const elevation = {
    min: elevations.length > 0 ? Math.min(...elevations) : 0,
    max: elevations.length > 0 ? Math.max(...elevations) : 0,
    gain: 0,
    loss: 0,
  }

  // Calculate elevation gain/loss
  for (let i = 1; i < elevations.length; i++) {
    const diff = elevations[i] - elevations[i - 1]
    if (diff > 0) {
      elevation.gain += diff
    } else {
      elevation.loss += Math.abs(diff)
    }
  }

  // Calculate bounds
  const lats = trackPoints.map(p => p.lat)
  const lons = trackPoints.map(p => p.lon)
  const bounds = {
    north: Math.max(...lats),
    south: Math.min(...lats),
    east: Math.max(...lons),
    west: Math.min(...lons),
  }

  // Calculate duration if time data is available
  let duration: number | undefined
  const timePoints = trackPoints.filter(p => p.time).map(p => new Date(p.time!))
  if (timePoints.length > 1) {
    duration = (timePoints[timePoints.length - 1].getTime() - timePoints[0].getTime()) / 1000
  }

  return {
    name,
    description,
    distance: cumulativeDistance,
    elevation,
    duration,
    trackPoints,
    bounds,
  }
}

/**
 * Parse a single waypoint element
 */
function parseWaypoint(waypointElement: Element): GPXWaypoint | null {
  const lat = parseFloat(waypointElement.getAttribute('lat') || '0')
  const lon = parseFloat(waypointElement.getAttribute('lon') || '0')
  
  if (isNaN(lat) || isNaN(lon)) {
    return null
  }

  const name = waypointElement.querySelector('name')?.textContent || 'Unnamed Waypoint'
  const description = waypointElement.querySelector('desc')?.textContent || undefined
  const elevation = waypointElement.querySelector('ele')?.textContent
  const type = waypointElement.querySelector('type')?.textContent || undefined
  const symbol = waypointElement.querySelector('sym')?.textContent || undefined

  return {
    name,
    description,
    lat,
    lon,
    elevation: elevation ? parseFloat(elevation) : undefined,
    type,
    symbol,
  }
}

/**
 * Calculate distance between two points using Haversine formula
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000 // Earth's radius in meters
  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}