import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mountain, TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface ElevationPoint {
  distance: number; // Distance along route in meters
  elevation: number; // Elevation in meters
}

interface ElevationProfileProps {
  elevationData: ElevationPoint[];
  totalDistance: number;
  className?: string;
}

export function ElevationProfile({ elevationData, totalDistance, className }: ElevationProfileProps) {
  if (!elevationData || elevationData.length < 2) {
    return (
      <Card className={className}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-sm">
            <Mountain className="w-4 h-4 mr-2" />
            Elevation Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No elevation data available for this route
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate elevation statistics
  const elevations = elevationData.map(point => point.elevation);
  const minElevation = Math.min(...elevations);
  const maxElevation = Math.max(...elevations);
  const elevationGain = elevations[elevations.length - 1] - elevations[0];
  const totalClimb = elevationData.reduce((acc, point, index) => {
    if (index === 0) return 0;
    const diff = point.elevation - elevationData[index - 1].elevation;
    return acc + (diff > 0 ? diff : 0);
  }, 0);
  const totalDescent = elevationData.reduce((acc, point, index) => {
    if (index === 0) return 0;
    const diff = elevationData[index - 1].elevation - point.elevation;
    return acc + (diff > 0 ? diff : 0);
  }, 0);

  // Create SVG path for elevation profile
  const width = 400;
  const height = 120;
  const padding = 20;
  const chartWidth = width - (padding * 2);
  const chartHeight = height - (padding * 2);
  
  const elevationRange = maxElevation - minElevation;
  const distanceRange = totalDistance;
  
  const points = elevationData.map(point => {
    const x = padding + (point.distance / distanceRange) * chartWidth;
    const y = padding + chartHeight - ((point.elevation - minElevation) / elevationRange) * chartHeight;
    return `${x},${y}`;
  }).join(' ');
  
  const pathData = `M ${points.split(' ').map((point, index) => {
    return index === 0 ? `M ${point}` : `L ${point}`;
  }).join(' ')}`;

  // Create area fill path
  const firstPoint = elevationData[0];
  const lastPoint = elevationData[elevationData.length - 1];
  const firstX = padding + (firstPoint.distance / distanceRange) * chartWidth;
  const lastX = padding + (lastPoint.distance / distanceRange) * chartWidth;
  const bottomY = padding + chartHeight;
  
  const areaPath = `${pathData} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;

  const formatElevation = (meters: number) => `${Math.round(meters)}m`;
  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${Math.round(meters)}m`;
    return `${(meters / 1000).toFixed(1)}km`;
  };

  // Determine difficulty based on elevation gain and gradient
  const averageGradient = (elevationGain / totalDistance) * 100;
  const getDifficulty = () => {
    if (totalClimb > 500 || Math.abs(averageGradient) > 8) return 'Expert';
    if (totalClimb > 200 || Math.abs(averageGradient) > 5) return 'Advanced';
    if (totalClimb > 50 || Math.abs(averageGradient) > 2) return 'Intermediate';
    return 'Beginner';
  };

  const difficulty = getDifficulty();
  const difficultyColor = {
    'Beginner': 'bg-green-100 text-green-800',
    'Intermediate': 'bg-yellow-100 text-yellow-800', 
    'Advanced': 'bg-orange-100 text-orange-800',
    'Expert': 'bg-red-100 text-red-800'
  }[difficulty];

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-sm">
            <Mountain className="w-4 h-4 mr-2" />
            Elevation Profile
          </CardTitle>
          <Badge className={difficultyColor}>
            <Activity className="w-3 h-3 mr-1" />
            {difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Elevation Chart */}
        <div className="relative">
          <svg width={width} height={height} className="border rounded bg-slate-50">
            {/* Grid lines */}
            <defs>
              <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Area fill */}
            <path 
              d={areaPath} 
              fill="rgba(34, 197, 94, 0.1)" 
              stroke="none" 
            />
            
            {/* Elevation line */}
            <path 
              d={pathData} 
              fill="none" 
              stroke="#22c55e" 
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Min/Max elevation markers */}
            <text x={padding} y={padding - 5} fontSize="10" fill="#64748b">
              {formatElevation(maxElevation)}
            </text>
            <text x={padding} y={height - 5} fontSize="10" fill="#64748b">
              {formatElevation(minElevation)}
            </text>
            
            {/* Distance markers */}
            <text x={padding} y={height - 5} fontSize="10" fill="#64748b">
              0
            </text>
            <text x={width - padding - 20} y={height - 5} fontSize="10" fill="#64748b">
              {formatDistance(totalDistance)}
            </text>
          </svg>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Min Elevation:</span>
              <span className="font-medium">{formatElevation(minElevation)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Max Elevation:</span>
              <span className="font-medium">{formatElevation(maxElevation)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                Total Climb:
              </span>
              <span className="font-medium text-green-600">{formatElevation(totalClimb)}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Elevation Gain:</span>
              <span className="font-medium">{formatElevation(elevationGain)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Avg Gradient:</span>
              <span className="font-medium">{averageGradient.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center">
                <TrendingDown className="w-3 h-3 mr-1" />
                Total Descent:
              </span>
              <span className="font-medium text-blue-600">{formatElevation(totalDescent)}</span>
            </div>
          </div>
        </div>

        {/* Unimog-specific advice */}
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <h4 className="text-sm font-medium text-amber-800 mb-1">🚛 Unimog Tip</h4>
          <p className="text-xs text-amber-700">
            {difficulty === 'Expert' && 'Use low range and diff locks. Consider portal axle clearance on steep descents.'}
            {difficulty === 'Advanced' && 'Engage diff locks for steep climbs. Monitor engine temp on long ascents.'}
            {difficulty === 'Intermediate' && 'Standard driving mode suitable. Portal axles provide excellent clearance.'}
            {difficulty === 'Beginner' && 'Perfect terrain for your Unimog. Enjoy the superior ride comfort!'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}