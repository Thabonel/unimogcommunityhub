import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';

export interface DashboardVehicle {
  id: string;
  user_id: string;
  name: string;
  model: string;
  year: string;
  description?: string;
  modifications?: string;
  country_code?: string;
  country?: string;
  region?: string;
  city?: string;
  is_showcase: boolean;
  photos: string[];
  thumbnail_url?: string | null;
  purchase_odometer?: number;
  current_odometer?: number;
  odometer_unit?: string;
  created_at: string;
  updated_at: string;
}

export function useDashboardVehicle(userId: string | undefined) {
  return useQuery({
    queryKey: ['dashboard-vehicle', userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('user_id', userId)
        .eq('is_showcase', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching dashboard vehicle:', error);
        return null;
      }

      return data as DashboardVehicle | null;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
