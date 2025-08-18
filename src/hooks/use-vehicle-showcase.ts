import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase-client';
import { VehicleShowcaseInfo } from '@/hooks/vehicle-maintenance/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface ShowcaseFilters {
  country?: string;
  search?: string;
  model?: string;
  year?: string;
}

interface GlobalStats {
  totalVehicles: number;
  totalCountries: number;
  totalViews: number;
  totalLikes: number;
}

export const useVehicleShowcase = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const fetchShowcaseVehicles = useCallback(async (
    filters: ShowcaseFilters = {},
    sortBy: string = 'trending',
    limit: number = 50
  ): Promise<VehicleShowcaseInfo[]> => {
    setIsLoading(true);
    
    try {
      let query = supabase
        .from('vehicles')
        .select(`
          *,
          profiles!vehicles_user_id_fkey (
            display_name,
            avatar_url
          )
        `)
        .eq('is_showcase', true);

      // Apply filters
      if (filters.country) {
        query = query.eq('country_code', filters.country);
      }

      if (filters.model) {
        query = query.ilike('model', `%${filters.model}%`);
      }

      if (filters.year) {
        if (filters.year === '2020s') {
          query = query.gte('year', '2020');
        } else if (filters.year === '2010s') {
          query = query.gte('year', '2010').lt('year', '2020');
        } else if (filters.year === '2000s') {
          query = query.gte('year', '2000').lt('year', '2010');
        } else if (filters.year === '1990s') {
          query = query.gte('year', '1990').lt('year', '2000');
        } else if (filters.year === '1980s') {
          query = query.gte('year', '1980').lt('year', '1990');
        } else if (filters.year === 'older') {
          query = query.lt('year', '1980');
        }
      }

      if (filters.search) {
        query = query.or(`
          name.ilike.%${filters.search}%,
          description.ilike.%${filters.search}%,
          modifications.ilike.%${filters.search}%,
          model.ilike.%${filters.search}%
        `);
      }

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'most_liked':
          query = query.order('likes_count', { ascending: false });
          break;
        case 'most_viewed':
          query = query.order('views_count', { ascending: false });
          break;
        case 'random':
          // PostgreSQL random ordering
          query = query.order('created_at', { ascending: false }); // Fallback to newest for now
          break;
        case 'trending':
        default:
          // Order by trending score (calculated in database)
          query = query.order('likes_count', { ascending: false })
                      .order('views_count', { ascending: false })
                      .order('created_at', { ascending: false });
          break;
      }

      query = query.limit(limit);

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching showcase vehicles:', error);
        // Check if it's a column not found error
        if (error.message?.includes('column') || error.code === '42703') {
          console.warn('Vehicle showcase columns not yet available in database');
          return [];
        }
        throw error;
      }

      // Process the data to include social engagement info
      const vehicles: VehicleShowcaseInfo[] = await Promise.all(
        (data || []).map(async (vehicle: any) => {
          // Get like status for current user
          let userHasLiked = false;
          if (user) {
            const { data: likeData } = await supabase
              .from('vehicle_likes')
              .select('id')
              .eq('vehicle_id', vehicle.id)
              .eq('user_id', user.id)
              .single();
            
            userHasLiked = !!likeData;
          }

          // Get comment count
          const { count: commentCount } = await supabase
            .from('vehicle_comments')
            .select('*', { count: 'exact' })
            .eq('vehicle_id', vehicle.id);

          // Calculate trending score
          const daysOld = Math.max(1, Math.floor(
            (Date.now() - new Date(vehicle.created_at).getTime()) / (1000 * 60 * 60 * 24)
          ));
          
          const trendingScore = (
            (vehicle.likes_count || 0) * 2 + 
            (vehicle.views_count || 0) * 0.1 + 
            (commentCount || 0) * 5
          ) / (1 + daysOld * 0.1);

          return {
            ...vehicle,
            owner_name: vehicle.profiles?.display_name || 'Unknown Owner',
            owner_avatar: vehicle.profiles?.avatar_url,
            total_likes: vehicle.likes_count || 0,
            total_views: vehicle.views_count || 0,
            total_comments: commentCount || 0,
            user_has_liked: userHasLiked,
            trending_score: trendingScore
          };
        })
      );

      return vehicles;
    } catch (error) {
      console.error('Error in fetchShowcaseVehicles:', error);
      toast({
        title: 'Error loading vehicles',
        description: 'Failed to load vehicle showcase. Please try again.',
        variant: 'destructive'
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const getGlobalStats = useCallback(async (): Promise<GlobalStats> => {
    try {
      // Get total vehicles
      const { count: totalVehicles } = await supabase
        .from('vehicles')
        .select('*', { count: 'exact' })
        .eq('is_showcase', true);

      // Get total countries
      const { data: countryData } = await supabase
        .from('vehicles')
        .select('country_code')
        .eq('is_showcase', true)
        .not('country_code', 'is', null);
      
      const uniqueCountries = new Set(countryData?.map(v => v.country_code)).size;

      // Get total views and likes
      const { data: statsData } = await supabase
        .from('vehicles')
        .select('views_count, likes_count')
        .eq('is_showcase', true);

      const totalViews = statsData?.reduce((sum, v) => sum + (v.views_count || 0), 0) || 0;
      const totalLikes = statsData?.reduce((sum, v) => sum + (v.likes_count || 0), 0) || 0;

      return {
        totalVehicles: totalVehicles || 0,
        totalCountries: uniqueCountries || 0,
        totalViews,
        totalLikes
      };
    } catch (error) {
      console.error('Error getting global stats:', error);
      return {
        totalVehicles: 0,
        totalCountries: 0,
        totalViews: 0,
        totalLikes: 0
      };
    }
  }, []);

  const getCountryStats = useCallback(async (): Promise<Record<string, number>> => {
    try {
      const { data } = await supabase
        .from('vehicles')
        .select('country_code')
        .eq('is_showcase', true)
        .not('country_code', 'is', null);

      const countryCounts: Record<string, number> = {};
      data?.forEach(vehicle => {
        if (vehicle.country_code) {
          countryCounts[vehicle.country_code] = (countryCounts[vehicle.country_code] || 0) + 1;
        }
      });

      return countryCounts;
    } catch (error) {
      console.error('Error getting country stats:', error);
      return {};
    }
  }, []);

  const getTrendingVehicles = useCallback(async (limit: number = 10): Promise<VehicleShowcaseInfo[]> => {
    // Get vehicles from the last 30 days with high engagement
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return fetchShowcaseVehicles({}, 'trending', limit);
  }, [fetchShowcaseVehicles]);

  const getFeaturedVehicles = useCallback(async (limit: number = 5): Promise<VehicleShowcaseInfo[]> => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select(`
          *,
          profiles!vehicles_user_id_fkey (
            display_name,
            avatar_url
          )
        `)
        .eq('is_showcase', true)
        .not('showcase_order', 'is', null)
        .order('showcase_order', { ascending: true })
        .limit(limit);

      if (error) throw error;

      // Process similar to fetchShowcaseVehicles
      const vehicles: VehicleShowcaseInfo[] = await Promise.all(
        (data || []).map(async (vehicle: any) => {
          let userHasLiked = false;
          if (user) {
            const { data: likeData } = await supabase
              .from('vehicle_likes')
              .select('id')
              .eq('vehicle_id', vehicle.id)
              .eq('user_id', user.id)
              .single();
            
            userHasLiked = !!likeData;
          }

          const { count: commentCount } = await supabase
            .from('vehicle_comments')
            .select('*', { count: 'exact' })
            .eq('vehicle_id', vehicle.id);

          return {
            ...vehicle,
            owner_name: vehicle.profiles?.display_name || 'Unknown Owner',
            owner_avatar: vehicle.profiles?.avatar_url,
            total_likes: vehicle.likes_count || 0,
            total_views: vehicle.views_count || 0,
            total_comments: commentCount || 0,
            user_has_liked: userHasLiked,
            trending_score: 0
          };
        })
      );

      return vehicles;
    } catch (error) {
      console.error('Error getting featured vehicles:', error);
      return [];
    }
  }, [user]);

  return {
    fetchShowcaseVehicles,
    getGlobalStats,
    getCountryStats,
    getTrendingVehicles,
    getFeaturedVehicles,
    isLoading
  };
};