import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';

export interface DashboardVehicle {
  id: string;
  name: string;
  model: string;
  year: string;
  photos: string[] | null;
  thumbnail_url?: string | null;
}

export function useDashboardVehicle(userId: string | undefined) {
  return useQuery({
    queryKey: ['dashboard-vehicle', userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('vehicles')
        .select('id, name, model, year, photos, thumbnail_url')
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