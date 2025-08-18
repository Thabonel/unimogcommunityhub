import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const useVehicleLikes = () => {
  const { user } = useAuth();
  const [isLiking, setIsLiking] = useState(false);

  const toggleLike = useCallback(async (vehicleId: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to like vehicles.',
        variant: 'destructive'
      });
      return false;
    }

    setIsLiking(true);

    try {
      // Check if user has already liked this vehicle
      const { data: existingLike, error: checkError } = await supabase
        .from('vehicle_likes')
        .select('id')
        .eq('vehicle_id', vehicleId)
        .eq('user_id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingLike) {
        // Unlike - remove the like
        const { error: deleteError } = await supabase
          .from('vehicle_likes')
          .delete()
          .eq('vehicle_id', vehicleId)
          .eq('user_id', user.id);

        if (deleteError) throw deleteError;

        toast({
          title: 'Removed like',
          description: 'You unliked this vehicle.',
          duration: 2000,
        });

        return false;
      } else {
        // Like - add the like
        const { error: insertError } = await supabase
          .from('vehicle_likes')
          .insert({
            vehicle_id: vehicleId,
            user_id: user.id
          });

        if (insertError) throw insertError;

        toast({
          title: 'Liked!',
          description: 'You liked this vehicle.',
          duration: 2000,
        });

        return true;
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: 'Error',
        description: 'Failed to update like status. Please try again.',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLiking(false);
    }
  }, [user]);

  const getLikeStatus = useCallback(async (vehicleId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('vehicle_likes')
        .select('id')
        .eq('vehicle_id', vehicleId)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('Error getting like status:', error);
      return false;
    }
  }, [user]);

  const getLikeCount = useCallback(async (vehicleId: string): Promise<number> => {
    try {
      const { count, error } = await supabase
        .from('vehicle_likes')
        .select('*', { count: 'exact' })
        .eq('vehicle_id', vehicleId);

      if (error) throw error;

      return count || 0;
    } catch (error) {
      console.error('Error getting like count:', error);
      return 0;
    }
  }, []);

  const getTopLikedVehicles = useCallback(async (limit: number = 10): Promise<string[]> => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('id, likes_count')
        .eq('is_showcase', true)
        .order('likes_count', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data?.map(vehicle => vehicle.id) || [];
    } catch (error) {
      console.error('Error getting top liked vehicles:', error);
      return [];
    }
  }, []);

  const getUserLikedVehicles = useCallback(async (userId?: string): Promise<string[]> => {
    const targetUserId = userId || user?.id;
    if (!targetUserId) return [];

    try {
      const { data, error } = await supabase
        .from('vehicle_likes')
        .select('vehicle_id')
        .eq('user_id', targetUserId);

      if (error) throw error;

      return data?.map(like => like.vehicle_id) || [];
    } catch (error) {
      console.error('Error getting user liked vehicles:', error);
      return [];
    }
  }, [user]);

  return {
    toggleLike,
    getLikeStatus,
    getLikeCount,
    getTopLikedVehicles,
    getUserLikedVehicles,
    isLiking
  };
};