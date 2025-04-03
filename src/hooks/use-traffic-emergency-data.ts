import { useState, useEffect } from 'react';
import { useUserLocation } from '@/hooks/use-user-location';
import { useToast } from '@/hooks/use-toast';

export interface TrafficIncident {
  id: string;
  type: 'accident' | 'congestion' | 'construction' | 'closure' | 'event' | 'other';
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  startTime: string;
  endTime?: string;
  affectedRoads?: string[];
}

export interface EmergencyAlert {
  id: string;
  type: 'weather' | 'fire' | 'flood' | 'earthquake' | 'other';
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    radius?: number; // in km
  };
  severity: 'advisory' | 'watch' | 'warning';
  startTime: string;
  endTime?: string;
}

interface TrafficEmergencyData {
  trafficIncidents: TrafficIncident[];
  emergencyAlerts: EmergencyAlert[];
  lastUpdated: Date | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

// This is a mock implementation for demonstration purposes
// In a real application, you would connect to an actual traffic and emergency API
export function useTrafficEmergencyData(radiusKm: number = 50): TrafficEmergencyData {
  const { location, isLoading: isLocationLoading } = useUserLocation();
  const [trafficIncidents, setTrafficIncidents] = useState<TrafficIncident[]>([]);
  const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { toast } = useToast();

  // Function to fetch traffic and emergency data
  const fetchData = async () => {
    if (!location) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, these would be API calls to traffic and emergency services
      // For now, we'll simulate with mock data based on the user's location
      
      // Mock traffic incidents
      const mockTrafficData = generateMockTrafficData(location.latitude, location.longitude, radiusKm);
      setTrafficIncidents(mockTrafficData);
      
      // Mock emergency alerts
      const mockEmergencyData = generateMockEmergencyData(location.latitude, location.longitude, radiusKm);
      setEmergencyAlerts(mockEmergencyData);
      
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching traffic and emergency data:', err);
      setError('Failed to fetch traffic and emergency information. Please try again later.');
      toast({
        title: "Data Fetch Error",
        description: "Could not retrieve traffic and emergency information",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initially fetch data when location is available
  useEffect(() => {
    if (location && !isLocationLoading) {
      fetchData();
    }
  }, [location, isLocationLoading, radiusKm]);
  
  // Function to manually refetch data
  const refetch = () => {
    if (location) {
      fetchData();
    } else {
      toast({
        title: "Location Required",
        description: "Cannot fetch traffic data without a location",
        variant: "default" // Changed from warning to default since warning is not a valid variant
      });
    }
  };
  
  return {
    trafficIncidents,
    emergencyAlerts,
    isLoading: isLoading || isLocationLoading,
    error,
    lastUpdated,
    refetch
  };
}

// Helper function to generate mock traffic data
function generateMockTrafficData(
  centerLat: number, 
  centerLng: number, 
  radiusKm: number
): TrafficIncident[] {
  // For demonstration, generate 0-5 random incidents
  const count = Math.floor(Math.random() * 6);
  const incidents: TrafficIncident[] = [];
  
  const incidentTypes: Array<TrafficIncident['type']> = ['accident', 'congestion', 'construction', 'closure', 'event', 'other'];
  const severityLevels: Array<TrafficIncident['severity']> = ['low', 'medium', 'high', 'critical'];
  
  for (let i = 0; i < count; i++) {
    // Generate a random position within the radius
    const randomPoint = getRandomPointInRadius(centerLat, centerLng, radiusKm);
    
    incidents.push({
      id: `traffic-${Date.now()}-${i}`,
      type: incidentTypes[Math.floor(Math.random() * incidentTypes.length)],
      description: getRandomTrafficDescription(),
      location: {
        latitude: randomPoint.lat,
        longitude: randomPoint.lng
      },
      severity: severityLevels[Math.floor(Math.random() * severityLevels.length)],
      startTime: new Date(Date.now() - Math.random() * 3600000).toISOString(), // Random start time within the last hour
      affectedRoads: ['A1', 'B237', 'L302'].slice(0, Math.floor(Math.random() * 3) + 1)
    });
  }
  
  return incidents;
}

// Helper function to generate mock emergency alerts
function generateMockEmergencyData(
  centerLat: number, 
  centerLng: number, 
  radiusKm: number
): EmergencyAlert[] {
  // For demonstration, generate 0-3 random emergency alerts
  const count = Math.floor(Math.random() * 4);
  const alerts: EmergencyAlert[] = [];
  
  const alertTypes: Array<EmergencyAlert['type']> = ['weather', 'fire', 'flood', 'earthquake', 'other'];
  const severityLevels: Array<EmergencyAlert['severity']> = ['advisory', 'watch', 'warning'];
  
  for (let i = 0; i < count; i++) {
    // Generate a random position within the radius
    const randomPoint = getRandomPointInRadius(centerLat, centerLng, radiusKm);
    
    alerts.push({
      id: `alert-${Date.now()}-${i}`,
      type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
      title: getRandomAlertTitle(),
      description: getRandomAlertDescription(),
      location: {
        latitude: randomPoint.lat,
        longitude: randomPoint.lng,
        radius: Math.floor(Math.random() * 20) + 5 // Random radius between 5-25km
      },
      severity: severityLevels[Math.floor(Math.random() * severityLevels.length)],
      startTime: new Date(Date.now() - Math.random() * 7200000).toISOString(), // Random start time within the last 2 hours
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

function getRandomTrafficDescription(): string {
  const descriptions = [
    "Heavy traffic due to road construction",
    "Lane closure due to accident",
    "Road blocked due to fallen tree",
    "Slow moving traffic due to event",
    "Traffic congestion in city center",
    "Temporary road closure for maintenance",
    "Traffic jam due to rush hour",
    "Accident causing delays",
    "Vehicle breakdown affecting traffic flow",
    "Traffic diversion due to road work"
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function getRandomAlertTitle(): string {
  const titles = [
    "Severe Weather Warning",
    "Flash Flood Alert",
    "High Wind Advisory",
    "Thunderstorm Watch",
    "Forest Fire Danger",
    "Heavy Snowfall Alert",
    "Earthquake Advisory",
    "Extreme Heat Warning",
    "Hazardous Road Conditions",
    "Air Quality Alert"
  ];
  return titles[Math.floor(Math.random() * titles.length)];
}

function getRandomAlertDescription(): string {
  const descriptions = [
    "Heavy rainfall expected. Potential for localized flooding.",
    "Strong winds forecast with gusts up to 80 km/h.",
    "Thunderstorms likely with possibility of hail.",
    "Fire danger is high due to dry conditions and strong winds.",
    "Heavy snowfall expected, accumulation of 15-20 cm possible.",
    "Minor earthquake reported in the region.",
    "Extreme heat conditions, stay hydrated and avoid outdoor activities.",
    "Poor air quality due to increased pollution levels.",
    "Icy road conditions in mountainous areas.",
    "Dense fog reducing visibility on major highways."
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}
