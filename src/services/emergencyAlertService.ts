
import { supabase } from "@/lib/supabase";
import { EmergencyAlert } from "@/types/track";

interface WeatherAlert {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'extreme';
  location: {
    latitude: number;
    longitude: number;
  };
  issued_at: string;
  expires_at?: string;
  source: string;
}

interface RoadClosure {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'extreme';
  location: {
    latitude: number;
    longitude: number;
  };
  start_time: string;
  end_time?: string;
  detour_available: boolean;
  source: string;
}

// Mock data for demonstration
const mockWeatherAlerts: WeatherAlert[] = [
  {
    id: 'wa1',
    type: 'storm',
    title: 'Severe Thunderstorm Warning',
    description: 'Strong winds and heavy rain expected. Potential for flash flooding in low-lying areas.',
    severity: 'high',
    location: {
      latitude: 40.712776,
      longitude: -74.005974
    },
    issued_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    source: 'National Weather Service'
  },
  {
    id: 'wa2',
    type: 'fire',
    title: 'Wildfire Alert',
    description: 'Active wildfire in the area. Avoid travel and follow evacuation orders if issued.',
    severity: 'extreme',
    location: {
      latitude: 34.052235,
      longitude: -118.243683
    },
    issued_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    source: 'CalFire'
  }
];

const mockRoadClosures: RoadClosure[] = [
  {
    id: 'rc1',
    title: 'Highway 101 Closure',
    description: 'Road closed due to construction. Expected to reopen by end of week.',
    severity: 'medium',
    location: {
      latitude: 37.773972,
      longitude: -122.431297
    },
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    detour_available: true,
    source: 'Department of Transportation'
  },
  {
    id: 'rc2',
    title: 'Bridge Closure',
    description: 'Bridge closed due to structural damage. Indefinite closure.',
    severity: 'high',
    location: {
      latitude: 45.523064,
      longitude: -122.676483
    },
    start_time: new Date().toISOString(),
    end_time: undefined,
    detour_available: true,
    source: 'County Roads Department'
  }
];

// Convert weather alerts to EmergencyAlert format
function convertWeatherAlertToEmergencyAlert(alert: WeatherAlert): EmergencyAlert {
  return {
    id: alert.id,
    type: alert.type as 'fire' | 'flood' | 'storm' | 'other',
    severity: alert.severity,
    title: alert.title,
    description: alert.description,
    location: alert.location,
    affected_area: {
      radius_km: 50
    },
    issued_at: alert.issued_at,
    expires_at: alert.expires_at,
    source: alert.source,
    link: ''
  };
}

// Convert road closures to EmergencyAlert format
function convertRoadClosureToEmergencyAlert(closure: RoadClosure): EmergencyAlert {
  return {
    id: closure.id,
    type: 'road',
    severity: closure.severity,
    title: closure.title,
    description: closure.description,
    location: closure.location,
    affected_area: {
      radius_km: 10
    },
    issued_at: closure.start_time,
    expires_at: closure.end_time,
    source: closure.source,
    link: ''
  };
}

// Function to get all emergency alerts
export async function getEmergencyAlerts(): Promise<EmergencyAlert[]> {
  try {
    // In a real implementation, this would fetch from an API or database
    // For now, we'll use mock data
    
    // Combine weather alerts and road closures
    const weatherAlerts = mockWeatherAlerts.map(convertWeatherAlertToEmergencyAlert);
    const roadClosures = mockRoadClosures.map(convertRoadClosureToEmergencyAlert);
    
    return [...weatherAlerts, ...roadClosures];
  } catch (error) {
    console.error('Error fetching emergency alerts:', error);
    return [];
  }
}

// Function to get emergency alerts within a specific radius of a location
export async function getEmergencyAlertsNearLocation(
  latitude: number, 
  longitude: number, 
  radiusKm: number = 100
): Promise<EmergencyAlert[]> {
  try {
    const allAlerts = await getEmergencyAlerts();
    
    // Filter alerts based on distance from the provided location
    // This is a simplified calculation and doesn't account for the curvature of the Earth
    return allAlerts.filter(alert => {
      if (!alert.location) return false;
      
      const distance = calculateDistance(
        latitude, 
        longitude, 
        alert.location.latitude, 
        alert.location.longitude
      );
      
      return distance <= radiusKm;
    });
  } catch (error) {
    console.error('Error fetching nearby emergency alerts:', error);
    return [];
  }
}

// Generate mock emergency alerts for testing
export function generateMockEmergencyAlerts(
  centerLat: number, 
  longitude: number, 
  radiusKm: number = 50
): EmergencyAlert[] {
  // For demonstration, generate a few random alerts
  const count = Math.floor(Math.random() * 4) + 1; // 1-4 alerts
  const alerts: EmergencyAlert[] = [];
  
  const types: Array<EmergencyAlert['type']> = ['fire', 'flood', 'storm', 'road', 'other'];
  const severities: Array<EmergencyAlert['severity']> = ['low', 'medium', 'high', 'extreme'];
  
  for (let i = 0; i < count; i++) {
    // Generate a random position within the radius
    const randomPoint = getRandomPointInRadius(centerLat, longitude, radiusKm);
    
    alerts.push({
      id: `alert-${Date.now()}-${i}`,
      type: types[Math.floor(Math.random() * types.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      title: getRandomAlertTitle(),
      description: getRandomAlertDescription(),
      location: {
        latitude: randomPoint.lat,
        longitude: randomPoint.lng
      },
      affected_area: {
        radius_km: Math.floor(Math.random() * 20) + 5 // 5-25km radius
      },
      issued_at: new Date(Date.now() - Math.random() * 86400000).toISOString(), // Within the last day
      expires_at: new Date(Date.now() + Math.random() * 86400000 * 3).toISOString(), // Expires in 1-3 days
      source: getRandomAlertSource(),
      link: ''
    });
  }
  
  return alerts;
}

// Calculate distance between two points using the Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}

// Helper function to get a random point within a radius of a center point
function getRandomPointInRadius(centerLat: number, centerLng: number, radiusKm: number) {
  // Convert radius from kilometers to degrees (approximate)
  const radiusDeg = radiusKm / 111.32; // 1 degree is approximately 111.32 km
  
  // Get a random distance within the radius
  const u = Math.random();
  const v = Math.random();
  const w = radiusDeg * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);
  
  // Adjust the x-coordinate for the shrinking of the east-west distances
  const newLng = x / Math.cos(centerLat * Math.PI / 180) + centerLng;
  const newLat = y + centerLat;
  
  return { lat: newLat, lng: newLng };
}

function getRandomAlertTitle(): string {
  const titles = [
    'Flash Flood Warning',
    'Severe Thunderstorm Alert',
    'Tornado Warning',
    'Wildfire Alert',
    'Road Closure Notice',
    'Avalanche Warning',
    'Dust Storm Warning',
    'Hurricane Warning',
    'Winter Storm Warning',
    'Extreme Heat Advisory'
  ];
  return titles[Math.floor(Math.random() * titles.length)];
}

function getRandomAlertDescription(): string {
  const descriptions = [
    'Seek shelter immediately. This is not a drill.',
    'Avoid travel in the affected area if possible.',
    'Emergency services are on high alert in the region.',
    'Monitor local news for updates on this developing situation.',
    'Prepare emergency supplies and follow evacuation orders if issued.',
    'Road conditions are deteriorating rapidly in the affected area.',
    'Visibility is severely reduced. Drive with extreme caution.',
    'Multiple incidents reported in the vicinity. Stay alert.',
    'Infrastructure damage reported. Avoid the area if possible.',
    'Follow instructions from local authorities.'
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function getRandomAlertSource(): string {
  const sources = [
    'National Weather Service',
    'Emergency Management Agency',
    'Department of Transportation',
    'Forest Service',
    'Local Police Department',
    'Fire Department',
    'Coast Guard',
    'State Emergency Services',
    'Highway Patrol',
    'Public Safety Office'
  ];
  return sources[Math.floor(Math.random() * sources.length)];
}
