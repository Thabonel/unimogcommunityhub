import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { EmergencyAlert } from '@/types/track';

// Fetch emergency alerts
export async function fetchEmergencyAlerts(): Promise<EmergencyAlert[]> {
  try {
    const { data, error } = await supabase
      .from('emergency_alerts')
      .select('*')
      .eq('active', true)
      .lt('expires_at', new Date().toISOString())
      .order('severity', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data as EmergencyAlert[];
  } catch (error) {
    console.error('Error fetching emergency alerts:', error);
    toast.error('Failed to load emergency alerts');
    return [];
  }
}

// Get alerts for a specific region or coordinates
export async function getAlertsNearLocation(
  lat: number, 
  lng: number, 
  radiusKm: number = 50
): Promise<EmergencyAlert[]> {
  // In a real app, you would use a geospatial query or PostGIS
  // For this demo, we'll just return all alerts and filter in memory
  try {
    const allAlerts = await fetchEmergencyAlerts();
    
    // Simple distance-based filtering (very naive approach)
    return allAlerts.filter(alert => {
      // Handle both location formats (object or array)
      const alertLat = Array.isArray(alert.location) ? alert.location[1] : alert.location.latitude;
      const alertLng = Array.isArray(alert.location) ? alert.location[0] : alert.location.longitude;
      
      if (alertLat === undefined || alertLng === undefined) return false;
      
      // Simple distance calculation (not very accurate but OK for demo)
      const latDiff = alertLat - lat;
      const lngDiff = alertLng - lng;
      const distSquared = latDiff * latDiff + lngDiff * lngDiff;
      
      // Rough approximation - 1 degree is about 111km at the equator
      // So our threshold is (radiusKm/111)²
      const thresholdSquared = Math.pow(radiusKm/111, 2);
      
      return distSquared <= thresholdSquared;
    });
  } catch (error) {
    console.error('Error getting alerts near location:', error);
    return [];
  }
}

// Report a new emergency alert
export async function reportEmergencyAlert(
  alert: Omit<EmergencyAlert, 'id' | 'issued_at'>
): Promise<EmergencyAlert | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('You must be logged in to report alerts');
      return null;
    }
    
    const newAlert = {
      ...alert,
      issued_at: new Date().toISOString(),
      source: `user:${user.id}`
    };
    
    const { data, error } = await supabase
      .from('emergency_alerts')
      .insert(newAlert)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    toast.success('Emergency alert reported successfully');
    return data as EmergencyAlert;
  } catch (error) {
    console.error('Error reporting emergency alert:', error);
    toast.error('Failed to report emergency alert');
    return null;
  }
}

// Create mock emergency alerts for testing or demo purposes
export function generateMockEmergencyAlerts(
  centerLat: number,
  centerLng: number,
  radiusKm: number = 50
): EmergencyAlert[] {
  // For demonstration, generate 0-3 random alerts
  const count = Math.floor(Math.random() * 4);
  const alerts: EmergencyAlert[] = [];
  
  const alertTypes: Array<NonNullable<EmergencyAlert['type']>> = ['fire', 'flood', 'storm', 'road', 'other'];
  const severityLevels: Array<NonNullable<EmergencyAlert['severity']>> = ['low', 'medium', 'high', 'extreme'];
  
  for (let i = 0; i < count; i++) {
    // Generate a random position within the radius
    const randomPoint = getRandomPointInRadius(centerLat, centerLng, radiusKm);
    
    // Randomize alert attributes
    const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const severity = severityLevels[Math.floor(Math.random() * severityLevels.length)];
    
    alerts.push({
      id: `emergency-${Date.now()}-${i}`,
      type: alertType,
      severity: severity,
      title: getRandomAlertTitle(alertType),
      description: getRandomAlertDescription(alertType),
      location: {
        latitude: randomPoint.lat,
        longitude: randomPoint.lng
      },
      affected_area: {
        radius_km: Math.floor(Math.random() * 10) + 5
      },
      issued_at: new Date(Date.now() - Math.random() * 86400000).toISOString(), // Random time within the last 24 hours
      expires_at: new Date(Date.now() + Math.random() * 86400000 * 7).toISOString(), // Expires in 0-7 days
      source: getRandomSource(),
      link: Math.random() > 0.7 ? 'https://example.com/emergency-details' : undefined
    });
  }
  
  return alerts;
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

// Helper functions to generate random alert content
function getRandomAlertTitle(type: NonNullable<EmergencyAlert['type']>): string {
  const titles = {
    fire: [
      'Wildfire in progress', 
      'Forest fire warning', 
      'Brush fire alert'
    ],
    flood: [
      'Flash flood warning', 
      'River overflow alert', 
      'Flood risk in low areas'
    ],
    storm: [
      'Severe thunderstorm warning', 
      'High wind advisory', 
      'Lightning storm alert'
    ],
    road: [
      'Major road closure', 
      'Highway accident', 
      'Road washout warning'
    ],
    other: [
      'Hazardous materials incident', 
      'Public safety alert', 
      'Emergency evacuation notice'
    ]
  };
  
  const typeSpecificTitles = titles[type] || titles.other;
  return typeSpecificTitles[Math.floor(Math.random() * typeSpecificTitles.length)];
}

function getRandomAlertDescription(type: NonNullable<EmergencyAlert['type']>): string {
  const descriptions = {
    fire: [
      'Active wildfire spreading rapidly. Evacuate immediately if in affected area.',
      'Forest fire detected. Authorities are responding. Avoid the area.',
      'Brush fire reported. Stay alert and follow official guidance.'
    ],
    flood: [
      'Flash flooding reported in low-lying areas. Do not attempt to cross flooded roads.',
      'River levels rising rapidly. Prepare for possible evacuation.',
      'Flood warning issued. Move to higher ground if nearby.'
    ],
    storm: [
      'Severe thunderstorm with potential for dangerous lightning and high winds.',
      'Strong winds and heavy rain expected. Secure loose objects and stay indoors.',
      'Storm system approaching with risk of flash flooding and power outages.'
    ],
    road: [
      'Major accident has closed all lanes. Seek alternative routes.',
      'Road closed due to hazardous conditions. Follow detour signs.',
      'Traffic at standstill due to multiple vehicle collision. Emergency services on scene.'
    ],
    other: [
      'Hazardous situation reported. Please avoid the area until further notice.',
      'Emergency services responding to incident. Follow official instructions.',
      'Public safety alert issued. Monitor local news for updates.'
    ]
  };
  
  const typeSpecificDescriptions = descriptions[type] || descriptions.other;
  return typeSpecificDescriptions[Math.floor(Math.random() * typeSpecificDescriptions.length)];
}

function getRandomSource(): string {
  const sources = [
    'Emergency Services',
    'Weather Service',
    'Traffic Authority',
    'Fire Department',
    'Police Department',
    'Civil Defense',
    'National Alert System'
  ];
  
  return sources[Math.floor(Math.random() * sources.length)];
}
