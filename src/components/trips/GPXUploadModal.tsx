/**
 * GPX Track Display Component
 * Renders GPX tracks and waypoints on Mapbox map
 */

import React, { useEffect, useRef, useState } from 'react';
import { Map as MapboxMap, Marker, Source, Layer } from 'react-map-gl';
import { MapPin, TrendingUp, Clock, Mountain, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { GPXTrack, GPXWaypoint, formatDistance, formatDuration, formatElevation } from '@/utils/gpxUtils';

interface GPXTrackDisplayProps {
  tracks: GPXTrack[];
  waypoints: GPXWaypoint[];
  map?: MapboxMap;
  onTrackSelect?: (track: GPXTrack | null) => void;
  selectedTrack?: GPXTrack | null;
  showElevationProfile?: boolean;
}

interface TrackLayerProps {
  track: GPXTrack;
  isSelected: boolean;
  isVisible: boolean;
  color: string;
}

const TRACK_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FFEAA7', // Yellow
  '#DDA0DD', // Plum
  '#98D8C8', // Mint
  '#F7DC6F', // Light Yellow
];

function TrackLayer({ track, isSelected, isVisible, color }: TrackLayerProps) {
  if (!isVisible || track.trackPoints.length === 0) return null;

  const coordinates = track.trackPoints.map(point => [point.lon, point.lat]);

  const lineStyle = {
    type: 'line' as const,
    paint: {
      'line-color': color,
      'line-width': isSelected ? 4 : 2,
      'line-opacity': isSelected ? 0.9 : 0.7,
    },
  };

  return (
    <Source
      id={`track-${track.id}`}
      type="geojson"
      data={{
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates,
        },
        properties: { name: track.name },
      }}
    >
      <Layer id={`track-layer-${track.id}`} {...lineStyle} />
    </Source>
  );
}

export function GPXTrackDisplay({
  tracks,
  waypoints,
  map,
  onTrackSelect,
  selectedTrack,
  showElevationProfile = false,
}: GPXTrackDisplayProps) {
  const [visibleTracks, setVisibleTracks] = useState<Set<string>>(
    new Set(tracks.map(track => track.id))
  );
  const [visibleWaypoints, setVisibleWaypoints] = useState(true);

  const toggleTrackVisibility = (trackId: string) => {
    setVisibleTracks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(trackId)) {
        newSet.delete(trackId);
      } else {
        newSet.add(trackId);
      }
      return newSet;
    });
  };

  const handleTrackSelect = (track: GPXTrack) => {
    const newSelection = selectedTrack?.id === track.id ? null : track;
    onTrackSelect?.(newSelection);
  };

  const fitToTracks = () => {
    if (!map || tracks.length === 0) return;

    const visibleTracksList = tracks.filter(track => visibleTracks.has(track.id));
    if (visibleTracksList.length === 0) return;

    // Calculate bounds of all visible tracks
    let minLat = Infinity;
    let maxLat = -Infinity;
    let minLon = Infinity;
    let maxLon = -Infinity;

    visibleTracksList.forEach(track => {
      track.trackPoints.forEach(point => {
        minLat = Math.min(minLat, point.lat);
        maxLat = Math.max(maxLat, point.lat);
        minLon = Math.min(minLon, point.lon);
        maxLon = Math.max(maxLon, point.lon);
      });
    });

    // Add padding
    const padding = 0.01;
    map.fitBounds([
      [minLon - padding, minLat - padding],
      [maxLon + padding, maxLat + padding],
    ], { padding: 50 });
  };

  useEffect(() => {
    // Fit to tracks when component mounts or tracks change
    if (tracks.length > 0) {
      setTimeout(fitToTracks, 100); // Small delay to ensure map is ready
    }
  }, [tracks]);

  return (
    <div className="space-y-4">
      {/* Track Layers */}
      {tracks.map((track, index) => (
        <TrackLayer
          key={track.id}
          track={track}
          isSelected={selectedTrack?.id === track.id}
          isVisible={visibleTracks.has(track.id)}
          color={TRACK_COLORS[index % TRACK_COLORS.length]}
        />
      ))}

      {/* Waypoint Markers */}
      {visibleWaypoints && waypoints.map(waypoint => (
        <Marker
          key={waypoint.id}
          longitude={waypoint.lon}
          latitude={waypoint.lat}
          anchor="bottom"
        >
          <div className="bg-red-500 text-white p-2 rounded-full shadow-lg">
            <MapPin className="h-4 w-4" />
          </div>
        </Marker>
      ))}

      {/* Track Control Panel */}
      <Card className="absolute top-4 right-4 w-80 max-h-96 overflow-y-auto bg-white/95 backdrop-blur">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">GPX Tracks</CardTitle>
            <Button size="sm" variant="outline" onClick={fitToTracks}>
              Fit to View
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Waypoints Toggle */}
          {waypoints.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Waypoints ({waypoints.length})
                </span>
              </div>
              <Switch
                checked={visibleWaypoints}
                onCheckedChange={setVisibleWaypoints}
              />
            </div>
          )}

          {/* Track List */}
          <div className="space-y-3">
            {tracks.map((track, index) => {
              const isSelected = selectedTrack?.id === track.id;
              const isVisible = visibleTracks.has(track.id);
              const color = TRACK_COLORS[index % TRACK_COLORS.length];

              return (
                <div
                  key={track.id}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleTrackSelect(track)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="font-medium text-sm truncate max-w-32">
                        {track.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Badge variant="secondary" className="text-xs">
                        Track {index + 1}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTrackVisibility(track.id);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        {isVisible ? (
                          <Eye className="h-3 w-3" />
                        ) : (
                          <EyeOff className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div className="flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {formatDistance(track.distance)}
                    </div>
                    {track.duration && (
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDuration(track.duration)}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Mountain className="h-3 w-3 mr-1" />
                      +{formatElevation(track.elevation.gain)}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {track.trackPoints.length} pts
                    </div>
                  </div>

                  {track.description && isSelected && (
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      {track.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {tracks.length === 0 && (
            <div className="text-center py-8">
              <TrendingUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No tracks loaded</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Elevation Profile */}
      {showElevationProfile && selectedTrack && (
        <ElevationProfile track={selectedTrack} />
      )}
    </div>
  );
}

interface ElevationProfileProps {
  track: GPXTrack;
}

function ElevationProfile({ track }: ElevationProfileProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || track.trackPoints.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get elevation data
    const elevationPoints = track.trackPoints
      .filter(point => point.elevation !== undefined)
      .map((point, index) => ({
        distance: point.distance || 0,
        elevation: point.elevation!,
        index,
      }));

    if (elevationPoints.length === 0) return;

    // Canvas dimensions
    const width = canvas.width;
    const height = canvas.height;
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate scales
    const maxDistance = Math.max(...elevationPoints.map(p => p.distance));
    const minElevation = Math.min(...elevationPoints.map(p => p.elevation));
    const maxElevation = Math.max(...elevationPoints.map(p => p.elevation));
    const elevationRange = maxElevation - minElevation;

    const xScale = chartWidth / maxDistance;
    const yScale = chartHeight / (elevationRange || 1);

    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Vertical grid lines (distance)
    for (let i = 0; i <= 5; i++) {
      const x = padding.left + (chartWidth * i) / 5;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, padding.top + chartHeight);
      ctx.stroke();
    }

    // Horizontal grid lines (elevation)
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight * i) / 4;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartWidth, y);
      ctx.stroke();
    }

    // Draw elevation profile
    ctx.strokeStyle = '#3b82f6';
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top + chartHeight);

    elevationPoints.forEach((point, index) => {
      const x = padding.left + point.distance * xScale;
      const y = padding.top + chartHeight - (point.elevation - minElevation) * yScale;
      
      if (index === 0) {
        ctx.lineTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    // Fill area under curve
    ctx.lineTo(padding.left + maxDistance * xScale, padding.top + chartHeight);
    ctx.lineTo(padding.left, padding.top + chartHeight);
    ctx.fill();

    // Draw the line
    ctx.beginPath();
    elevationPoints.forEach((point, index) => {
      const x = padding.left + point.distance * xScale;
      const y = padding.top + chartHeight - (point.elevation - minElevation) * yScale;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw labels
    ctx.fillStyle = '#374151';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';

    // Distance labels (bottom)
    for (let i = 0; i <= 5; i++) {
      const distance = (maxDistance * i) / 5;
      const x = padding.left + (chartWidth * i) / 5;
      ctx.fillText(
        formatDistance(distance),
        x,
        height - 10
      );
    }

    // Elevation labels (left)
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const elevation = minElevation + (elevationRange * (4 - i)) / 4;
      const y = padding.top + (chartHeight * i) / 4;
      ctx.fillText(
        formatElevation(elevation),
        padding.left - 10,
        y + 4
      );
    }

  }, [track]);

  const elevationPoints = track.trackPoints.filter(p => p.elevation !== undefined);
  
  if (elevationPoints.length === 0) {
    return null;
  }

  return (
    <Card className="absolute bottom-4 left-4 w-96 bg-white/95 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Mountain className="h-5 w-5 mr-2" />
          Elevation Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <canvas
          ref={canvasRef}
          width={350}
          height={200}
          className="w-full h-auto border rounded"
        />
        <div className="flex justify-between text-xs text-gray-600 mt-2">
          <span>Min: {formatElevation(track.elevation.min)}</span>
          <span>Max: {formatElevation(track.elevation.max)}</span>
          <span>Gain: +{formatElevation(track.elevation.gain)}</span>
        </div>
      </CardContent>
    </Card>
  );
}