import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';
import { useToast } from '@/hooks/use-toast';

export interface UserPreferences {
  id: string;
  user_id: string;
  show_vehicle_on_dashboard: boolean;
  dashboard_display_mode: 'my-vehicle' | 'any-user';
  created_at: string;
  updated_at: string;
}

export interface UserPreferencesUpdate {
  show_vehicle_on_dashboard?: boolean;
  dashboard_display_mode?: 'my-vehicle' | 'any-user';
}

export function useUserPreferences(userId: string | undefined) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user preferences
  const { data: preferences, isLoading } = useQuery({
    queryKey: ['user-preferences', userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "no rows returned" - that's fine, we'll create defaults
        console.error('Error fetching user preferences:', error);
        throw error;
      }

      // Return data or defaults
      return data as UserPreferences | null;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Update or create user preferences
  const updatePreferences = useMutation({
    mutationFn: async (updates: UserPreferencesUpdate) => {
      if (!userId) throw new Error('User ID is required');

      // Check if preferences exist
      const { data: existing } = await supabase
        .from('user_preferences')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { data, error } = await supabase
          .from('user_preferences')
          .update(updates)
          .eq('user_id', userId)
          .select()
          .single();

        if (error) throw error;
        return data as UserPreferences;
      } else {
        // Create new
        const { data, error } = await supabase
          .from('user_preferences')
          .insert({
            user_id: userId,
            ...updates,
          })
          .select()
          .single();

        if (error) throw error;
        return data as UserPreferences;
      }
    },
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.setQueryData(['user-preferences', userId], data);
      toast({
        title: 'Settings saved',
        description: 'Your preferences have been updated successfully.',
      });
    },
    onError: (error) => {
      console.error('Error updating preferences:', error);
      toast({
        title: 'Error saving settings',
        description: 'Failed to save your preferences. Please try again.',
        variant: 'destructive',
      });
    },
  });

  return {
    preferences,
    isLoading,
    updatePreferences: updatePreferences.mutate,
    isUpdating: updatePreferences.isPending,
  };
}