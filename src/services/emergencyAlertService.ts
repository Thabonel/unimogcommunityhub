import axios from 'axios';
import { EmergencyAlert } from '@/types/track';

// Function to convert severity from API to our app's format
const mapSeverity = (apiSeverity: string): 'low' | 'medium' | 'high' | 'extreme' => {
  const severityMap: Record<string, 'low' | 'medium' | 'high' | 'extreme'> = {
    'Minor': 'low',
    'Moderate': 'medium',
    'Severe': 'high',
    'Extreme': 'extreme',
    // Add more mappings as needed
  };
  
  return severityMap[apiSeverity] || 'medium';
};

// Function to convert event type from API to our app's format
const mapEventType = (apiEventType: string): 'fire' | 'flood' | 'storm' | 'road' | 'other' => {
  if (apiEventType.includes('Fire')) return 'fire';
  if (apiEventType.includes('Flood')) return 'flood';
  if (apiEventType.includes('Storm') || apiEventType.includes('Hurricane') || apiEventType.includes('Tornado')) return 'storm';
  if (apiEventType.includes('Road') || apiEventType.includes('Traffic')) return 'road';
  return 'other';
};

/**
 * Fetch emergency alerts from the IPAWS OPEN API
 * Note: This is a mock implementation, as the actual IPAWS API requires authorization
 * In a real app, this would call a backend service with proper API authentication
 */
export const fetchEmergencyAlerts = async (
  latitude: number, 
  longitude: number, 
  radiusKm: number = 50
): Promise<EmergencyAlert[]> => {
  try {
    // In a real implementation, we would call the actual API with proper authentication
    // This would typically be done through a backend service to keep API keys secure
    // For now, we'll use a mock implementation with some public data sources
    
    // Example URL for NOAA weather alerts (public API)
    const response = await axios.get(
      `https://api.weather.gov/alerts/active?point=${latitude},${longitude}`
    );
    
    // Transform the API response to our EmergencyAlert format
    if (response.data && response.data.features) {
      return response.data.features.map((feature: any) => {
        const props = feature.properties;
        
        // Extract coordinates if available
        let location = null;
        if (feature.geometry && feature.geometry.coordinates) {
          const [longitude, latitude] = feature.geometry.coordinates;
          location = { latitude, longitude };
        }
        
        return {
          id: props.id || `emergency-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: mapEventType(props.event || ''),
          title: props.headline || props.event || 'Emergency Alert',
          description: props.description || props.instruction || '',
          severity: mapSeverity(props.severity || ''),
          location,
          issued_at: props.sent || props.effective || new Date().toISOString(),
          expires_at: props.expires || props.ends || undefined,
          source: props.senderName || 'NOAA Weather Service',
          link: props.url
        };
      });
    }
    
    // If no data or empty response, return empty array
    return [];
  } catch (error) {
    console.error('Error fetching emergency alerts:', error);
    
    // In case of API failure, return empty array
    // In a production app, consider returning cached data or showing an error state
    return [];
  }
};

/**
 * Fallback function to generate mock emergency alerts when the API fails
 * or for development/testing purposes
 */
export const generateMockEmergencyAlerts = (
  centerLat: number, 
  centerLng: number, 
  radiusKm: number
): EmergencyAlert[] => {
  // For demonstration, generate 0-3 random emergency alerts
  const count = Math.floor(Math.random() * 4);
  const alerts: EmergencyAlert[] = [];
  
  const alertTypes: Array<EmergencyAlert['type']> = ['fire', 'flood', 'storm', 'road', 'other'];
  const severityLevels: Array<EmergencyAlert['severity']> = ['low', 'medium', 'high', 'extreme'];
  
  for (let i = 0; i < count; i++) {
    // Generate a random position within the radius
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * radiusKm * 0.8; // 80% of radius to keep it within view
    
    // Convert to approx lat/lng offset
    const latOffset = (distance / 111) * Math.cos(angle);
    const lngOffset = (distance / (111 * Math.cos(centerLat * Math.PI / 180))) * Math.sin(angle);
    
    const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    
    alerts.push({
      id: `alert-${Date.now()}-${i}`,
      type,
      title: getRandomAlertTitle(type),
      description: getRandomAlertDescription(type),
      severity: severityLevels[Math.floor(Math.random() * severityLevels.length)],
      location: {
        latitude: centerLat + latOffset,
        longitude: centerLng + lngOffset
      },
      affected_area: {
        type: 'circle',
        coordinates: null,
        radius_km: Math.floor(Math.random() * 20) + 5 // Random radius between 5-25km
      },
      issued_at: new Date(Date.now() - Math.random() * 7200000).toISOString(), // Random start time within the last 2 hours
      expires_at: new Date(Date.now() + Math.random() * 86400000).toISOString(), // Random expiration within 24 hours
      source: getRandomAlertSource(),
      link: type === 'fire' ? 'https://www.fire.ca.gov/incidents/' : undefined
    });
  }
  
  return alerts;
};

// Helper functions for mock data generation
function getRandomAlertTitle(type: EmergencyAlert['type']): string {
  const titlesByType: Record<EmergencyAlert['type'], string[]> = {
    'fire': [
      'Wildfire Warning', 
      'Forest Fire Alert', 
      'Brush Fire Evacuation Notice'
    ],
    'flood': [
      'Flash Flood Warning', 
      'Flood Advisory', 
      'River Overflow Alert'
    ],
    'storm': [
      'Severe Thunderstorm Warning', 
      'Tornado Watch', 
      'Hurricane Evacuation Order'
    ],
    'road': [
      'Major Highway Closure', 
      'Bridge Collapse Warning', 
      'Hazardous Road Conditions'
    ],
    'other': [
      'Hazardous Materials Spill', 
      'Shelter in Place Order', 
      'Civil Emergency'
    ]
  };
  
  const options = titlesByType[type];
  return options[Math.floor(Math.random() * options.length)];
}

function getRandomAlertDescription(type: EmergencyAlert['type']): string {
  const descriptionsByType: Record<EmergencyAlert['type'], string[]> = {
    'fire': [
      'Active wildfire spreading rapidly. Evacuation orders in effect for the following areas. Prepare to leave immediately.',
      'Uncontained forest fire threatening residential areas. Fire crews deployed. Stay alert for evacuation notices.',
      'Mandatory evacuation in effect due to approaching fire. Take only essential items and follow designated routes.'
    ],
    'flood': [
      'Heavy rainfall causing flash flooding. Avoid low-lying areas and do not attempt to cross flooded roadways.',
      'River levels rising rapidly. Residents in flood-prone areas should prepare for possible evacuation.',
      'Dam overflow warning. Immediate evacuation required for downstream communities.'
    ],
    'storm': [
      'Severe thunderstorm with damaging winds and hail. Seek shelter in a sturdy building away from windows.',
      'Tornado sighted in the area. Take cover immediately in basement or interior room.',
      'Hurricane approaching. Mandatory evacuation for coastal areas. Inland residents should prepare for high winds and flooding.'
    ],
    'road': [
      'Multi-vehicle accident has closed all lanes. Seek alternate routes. Expected clearing time: 2 hours.',
      'Bridge structural damage detected. Closed to all traffic until further notice.',
      'Hazardous ice conditions on major highways. Avoid travel if possible. Multiple accidents reported.'
    ],
    'other': [
      'Chemical spill from overturned truck. Shelter in place with windows and doors closed. Turn off HVAC systems.',
      'Civil disturbance in downtown area. Avoid vicinity until further notice. Police presence increased.',
      'Public water supply contamination detected. Do not consume tap water. Distribution centers being established.'
    ]
  };
  
  const options = descriptionsByType[type];
  return options[Math.floor(Math.random() * options.length)];
}

function getRandomAlertSource(): string {
  const sources = [
    'National Weather Service',
    'Department of Forestry',
    'County Emergency Management',
    'Department of Transportation',
    'State Highway Patrol',
    'FEMA',
    'Department of Public Safety'
  ];
  
  return sources[Math.floor(Math.random() * sources.length)];
}
