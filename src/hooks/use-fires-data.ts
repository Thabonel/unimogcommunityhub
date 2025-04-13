
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface IncidentCoordinates {
  latitude: number;
  longitude: number;
}

export interface FireIncident {
  id: string;
  title: string;
  location: string;
  status: string;
  type: string;
  alert_level?: string;
  council_area?: string;
  size?: string;
  updated: string;
  description?: string;
  coordinates: IncidentCoordinates;
  publication_date: string;
  uri?: string;
}

export function useFiresData() {
  const [incidents, setIncidents] = useState<FireIncident[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const fetchFiresData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('https://www.rfs.nsw.gov.au/feeds/majorIncidents.json');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch fire data: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Process the GeoJSON data
      const processedIncidents = data.features.map((feature: any) => {
        const { properties, geometry } = feature;
        
        return {
          id: properties.guid || `fire-${Math.random().toString(36).substring(2, 9)}`,
          title: properties.title || 'Unknown Incident',
          location: properties.location || 'Unknown Location',
          status: properties.status || 'Unknown Status',
          type: properties.category || properties.type || 'Fire',
          alert_level: properties.alert_level,
          council_area: properties.council_area,
          size: properties.size,
          updated: properties.updated || properties.pubDate,
          description: properties.description,
          coordinates: {
            latitude: geometry.coordinates[1],
            longitude: geometry.coordinates[0]
          },
          publication_date: properties.pubDate,
          uri: properties.guid
        };
      });
      
      setIncidents(processedIncidents);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching fire data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load fire incidents data');
      toast.error('Failed to load fire incidents data');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Fetch data on component mount
  useEffect(() => {
    fetchFiresData();
    
    // Refresh data every 30 minutes (same as the feed update frequency)
    const intervalId = setInterval(() => {
      fetchFiresData();
    }, 30 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [fetchFiresData]);
  
  return {
    incidents,
    isLoading,
    error,
    lastUpdated,
    refetch: fetchFiresData
  };
}
