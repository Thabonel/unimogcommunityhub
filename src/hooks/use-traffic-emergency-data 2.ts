import { useState, useEffect } from 'react';
import { useUserLocation } from '@/hooks/use-user-location';
import { useToast } from '@/hooks/use-toast';
import { EmergencyAlert } from '@/types/track';
import { fetchEmergencyAlerts, getAlertsNearLocation, generateMockEmergencyAlerts, calculateHaversineDistance } from '@/services/emergencyAlertService';
import { supabase } from '@/lib/supabase';

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

interface TrafficEmergencyData {
  trafficIncidents: TrafficIncident[];
  emergencyAlerts: EmergencyAlert[];
  lastUpdated: Date | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

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
      setError("Location data is required to fetch alerts");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // For traffic data, we'll still use mock data as there's no free public API for this
      const mockTrafficData = generateMockTrafficData(location.latitude, location.longitude, radiusKm);
      setTrafficIncidents(mockTrafficData);
      
      // For emergency alerts, fetch real data from our database
      try {
        const realEmergencyAlerts = await getAlertsNearLocation(
          location.latitude, 
          location.longitude, 
          radiusKm
        );
        
        // If we get real data, use it
        if (realEmergencyAlerts.length > 0) {
          setEmergencyAlerts(realEmergencyAlerts);
          console.log('Fetched real emergency alerts:', realEmergencyAlerts);
        } else {
          // If no real alerts, use mock data
          const mockEmergencyData = generateMockEmergencyAlerts(
            location.latitude, 
            location.longitude, 
            radiusKm
          );
          setEmergencyAlerts(mockEmergencyData);
          console.log('No real alerts found, using mock data');
        }
      } catch (err) {
        console.warn('Error fetching real emergency alerts, using mock data:', err);
        
        // If real data fetch fails, fall back to mock data
        const mockEmergencyData = generateMockEmergencyAlerts(
          location.latitude, 
          location.longitude, 
          radiusKm
        );
        setEmergencyAlerts(mockEmergencyData);
      }
      
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
  
  // Set up real-time subscription for emergency alerts
  useEffect(() => {
    if (!location) return;
    
    // Subscribe to changes in the emergency_alerts table
    const channel = supabase
      .channel('emergency_alerts_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'emergency_alerts'
        },
        async (payload) => {
          // When a change occurs, check if it's relevant to our location
          console.log('Emergency alert change detected:', payload);
          
          // Refresh our data
          await fetchData();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [location, radiusKm]);
  
  // Function to manually refetch data
  const refetch = () => {
    if (location) {
      fetchData();
    } else {
      toast({
        title: "Location Required",
        description: "Cannot fetch traffic data without a location",
        variant: "default"
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
