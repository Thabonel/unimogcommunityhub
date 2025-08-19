import { useCallback } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';

export const useVehicleViews = () => {
  const { user } = useAuth();

  const trackView = useCallback(async (vehicleId: string): Promise<void> => {
    try {
      // Get user's IP address for anonymous tracking
      let ipAddress = null;
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        ipAddress = data.ip;
      } catch (ipError) {
        console.warn('Failed to get IP address for view tracking:', ipError);
      }

      // Check if this user/IP has viewed this vehicle recently (last 24 hours)
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      let existingViewQuery = supabase
        .from('vehicle_views')
        .select('id')
        .eq('vehicle_id', vehicleId)
        .gte('created_at', twentyFourHoursAgo.toISOString());

      if (user) {
        existingViewQuery = existingViewQuery.eq('user_id', user.id);
      } else if (ipAddress) {
        existingViewQuery = existingViewQuery.eq('ip_address', ipAddress);
      } else {
        // Can't track without user or IP, skip
        return;
      }

      const { data: existingView, error: checkError } = await existingViewQuery.single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      // Only track if no recent view found
      if (!existingView) {
        const viewData: any = {
          vehicle_id: vehicleId,
          user_id: user?.id || null,
          ip_address: ipAddress
        };

        // Get user agent for analytics
        if (typeof navigator !== 'undefined') {
          viewData.user_agent = navigator.userAgent;
        }

        const { error: insertError } = await supabase
          .from('vehicle_views')
          .insert(viewData);

        if (insertError) {
          console.error('Error tracking view:', insertError);
        }
      }
    } catch (error) {
      console.error('Error in trackView:', error);
      // Don't show user-facing errors for view tracking
    }
  }, [user]);

  const getViewCount = useCallback(async (vehicleId: string): Promise<number> => {
    try {
      const { count, error } = await supabase
        .from('vehicle_views')
        .select('*', { count: 'exact' })
        .eq('vehicle_id', vehicleId);

      if (error) throw error;

      return count || 0;
    } catch (error) {
      console.error('Error getting view count:', error);
      return 0;
    }
  }, []);

  const getTopViewedVehicles = useCallback(async (limit: number = 10): Promise<string[]> => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('id, views_count')
        .eq('is_showcase', true)
        .order('views_count', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data?.map(vehicle => vehicle.id) || [];
    } catch (error) {
      console.error('Error getting top viewed vehicles:', error);
      return [];
    }
  }, []);

  const getViewAnalytics = useCallback(async (vehicleId: string, days: number = 30) => {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('vehicle_views')
        .select('created_at, user_id, ip_address')
        .eq('vehicle_id', vehicleId)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process analytics data
      const analytics = {
        totalViews: data?.length || 0,
        uniqueUsers: new Set(data?.filter(v => v.user_id).map(v => v.user_id)).size,
        uniqueIPs: new Set(data?.filter(v => v.ip_address).map(v => v.ip_address)).size,
        viewsByDay: {} as Record<string, number>
      };

      // Group views by day
      data?.forEach(view => {
        const date = new Date(view.created_at).toDateString();
        analytics.viewsByDay[date] = (analytics.viewsByDay[date] || 0) + 1;
      });

      return analytics;
    } catch (error) {
      console.error('Error getting view analytics:', error);
      return {
        totalViews: 0,
        uniqueUsers: 0,
        uniqueIPs: 0,
        viewsByDay: {}
      };
    }
  }, []);

  const getBulkViewCounts = useCallback(async (vehicleIds: string[]): Promise<Record<string, number>> => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('id, views_count')
        .in('id', vehicleIds);

      if (error) throw error;

      const viewCounts: Record<string, number> = {};
      data?.forEach(vehicle => {
        viewCounts[vehicle.id] = vehicle.views_count || 0;
      });

      return viewCounts;
    } catch (error) {
      console.error('Error getting bulk view counts:', error);
      return {};
    }
  }, []);

  return {
    trackView,
    getViewCount,
    getTopViewedVehicles,
    getViewAnalytics,
    getBulkViewCounts
  };
};