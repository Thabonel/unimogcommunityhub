
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
      if (!alert.location) return false;
      
      // Simple distance calculation (not very accurate but OK for demo)
      const latDiff = alert.location.latitude - lat;
      const lngDiff = alert.location.longitude - lng;
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
