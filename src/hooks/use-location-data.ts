import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';

interface UsageStatistics {
  total_distance_km: number;
  total_operating_hours: number;
  off_road_percentage: number;
  average_speed_kmh: number;
  trip_count: number;
}

interface LocationHistory {
  id: string;
  location_name: string;
  activity_type: string;
  checked_in_at: string;
  time_ago: string;
}

interface TripLog {
  id: string;
  trip_name: string;
  start_location: string;
  end_location: string;
  start_time: string;
  end_time: string;
  distance_km: number;
  duration_minutes: number;
  trip_type: string;
  tracking_method: string;
  average_speed_kmh: number;
}

export function useLocationData(userId?: string, vehicleId?: string, periodDays: number = 30) {
  const [usageStats, setUsageStats] = useState<UsageStatistics | null>(null);
  const [locationHistory, setLocationHistory] = useState<LocationHistory[]>([]);
  const [recentTrips, setRecentTrips] = useState<TripLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadLocationData();
    }
  }, [userId, vehicleId, periodDays]);

  const loadLocationData = async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Load usage statistics
      await loadUsageStatistics();

      // Load location history (check-ins)
      await loadLocationHistory();

      // Load recent trips
      await loadRecentTrips();
    } catch (err) {
      console.error('Error loading location data:', err);
      setError('Failed to load location data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsageStatistics = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_usage_statistics', {
          p_user_id: userId,
          p_vehicle_id: vehicleId || null,
          p_period_days: periodDays
        });

      if (error) {
        console.error('Error loading usage statistics:', error);
        return;
      }

      if (data && data.length > 0) {
        setUsageStats({
          total_distance_km: parseFloat(data[0].total_distance_km) || 0,
          total_operating_hours: parseFloat(data[0].total_operating_hours) || 0,
          off_road_percentage: parseFloat(data[0].off_road_percentage) || 0,
          average_speed_kmh: parseFloat(data[0].average_speed_kmh) || 0,
          trip_count: parseInt(data[0].trip_count) || 0
        });
      } else {
        // No data available - set defaults
        setUsageStats({
          total_distance_km: 0,
          total_operating_hours: 0,
          off_road_percentage: 0,
          average_speed_kmh: 0,
          trip_count: 0
        });
      }
    } catch (error) {
      console.error('Error in loadUsageStatistics:', error);
    }
  };

  const loadLocationHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('location_checkins')
        .select('id, location_name, activity_type, checked_in_at')
        .eq('user_id', userId)
        .eq('vehicle_id', vehicleId || '')
        .order('checked_in_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error loading location history:', error);
        return;
      }

      const historyWithTimeAgo = (data || []).map(item => ({
        ...item,
        time_ago: getTimeAgo(new Date(item.checked_in_at))
      }));

      setLocationHistory(historyWithTimeAgo);
    } catch (error) {
      console.error('Error in loadLocationHistory:', error);
    }
  };

  const loadRecentTrips = async () => {
    try {
      const { data, error } = await supabase
        .from('trip_logs')
        .select('*')
        .eq('user_id', userId)
        .eq('vehicle_id', vehicleId || '')
        .not('end_time', 'is', null) // Only completed trips
        .order('start_time', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error loading recent trips:', error);
        return;
      }

      setRecentTrips(data || []);
    } catch (error) {
      console.error('Error in loadRecentTrips:', error);
    }
  };

  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getActivityTypeDisplay = (type: string): { icon: string; label: string } => {
    switch (type) {
      case 'work':
        return { icon: '🏗️', label: 'Work site' };
      case 'maintenance':
        return { icon: '🔧', label: 'Maintenance' };
      case 'fuel':
        return { icon: '⛽', label: 'Fuel stop' };
      case 'rest':
        return { icon: '☕', label: 'Rest stop' };
      case 'destination':
        return { icon: '🎯', label: 'Destination' };
      default:
        return { icon: '📍', label: 'General' };
    }
  };

  const getTripTypeDisplay = (type: string): { icon: string; label: string } => {
    switch (type) {
      case 'on-road':
        return { icon: '🛣️', label: 'On-road' };
      case 'off-road':
        return { icon: '🏞️', label: 'Off-road' };
      case 'work-site':
        return { icon: '🏗️', label: 'Work site' };
      case 'maintenance':
        return { icon: '🔧', label: 'Maintenance' };
      default:
        return { icon: '🚛', label: 'Mixed' };
    }
  };

  const refreshData = () => {
    loadLocationData();
  };

  return {
    usageStats,
    locationHistory,
    recentTrips,
    isLoading,
    error,
    refreshData,
    getActivityTypeDisplay,
    getTripTypeDisplay
  };
}