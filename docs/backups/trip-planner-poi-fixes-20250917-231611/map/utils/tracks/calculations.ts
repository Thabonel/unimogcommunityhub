
import { Track } from '@/types/track';

/**
 * Calculate the total distance of a track in kilometers
 */
export const calculateTrackDistance = (track: Track): number => {
  let totalDistance = 0;
  
  track.segments.forEach(segment => {
    const points = segment.points;
    for (let i = 1; i < points.length; i++) {
      totalDistance += calculateDistance(
        points[i-1].latitude, points[i-1].longitude,
        points[i].latitude, points[i].longitude
      );
    }
  });
  
  return parseFloat(totalDistance.toFixed(2));
};

/**
 * Calculate distance between two coordinates using the Haversine formula
 */
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};

export const deg2rad = (deg: number): number => {
  return deg * (Math.PI/180);
};

/**
 * Calculate the total elevation gain in meters
 */
export const calculateElevationGain = (track: Track): number | undefined => {
  let totalGain = 0;
  
  track.segments.forEach(segment => {
    const points = segment.points;
    for (let i = 1; i < points.length; i++) {
      const prevElevation = points[i-1].elevation;
      const currElevation = points[i].elevation;
      
      if (prevElevation !== undefined && currElevation !== undefined) {
        const diff = currElevation - prevElevation;
        if (diff > 0) totalGain += diff;
      }
    }
  });
  
  return totalGain > 0 ? Math.round(totalGain) : undefined;
};
