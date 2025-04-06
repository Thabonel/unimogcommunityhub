
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Track } from '@/types/track';

export interface TrackComment {
  id: string;
  track_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user?: {
    avatar_url?: string;
    display_name?: string;
    full_name?: string;
    email?: string;
  };
}

/**
 * Fetch comments for a specific track
 */
export const fetchTrackComments = async (trackId: string): Promise<TrackComment[]> => {
  try {
    const { data, error } = await supabase
      .from('track_comments')
      .select(`
        *,
        user:user_id (
          avatar_url,
          display_name,
          full_name,
          email
        )
      `)
      .eq('track_id', trackId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching track comments:', error);
    toast({ 
      title: 'Error', 
      description: 'Failed to load comments', 
      variant: 'destructive' 
    });
    return [];
  }
};

/**
 * Add a comment to a track
 */
export const addTrackComment = async (trackId: string, content: string): Promise<TrackComment | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      toast({ 
        title: 'Authentication Required', 
        description: 'Please log in to add comments', 
        variant: 'destructive' 
      });
      return null;
    }

    const { data, error } = await supabase
      .from('track_comments')
      .insert([{ 
        track_id: trackId, 
        user_id: user.user.id, 
        content 
      }])
      .select(`
        *,
        user:user_id (
          avatar_url,
          display_name,
          full_name,
          email
        )
      `)
      .single();
    
    if (error) throw error;
    
    toast({ 
      title: 'Success', 
      description: 'Comment added successfully' 
    });
    
    return data;
  } catch (error) {
    console.error('Error adding track comment:', error);
    toast({ 
      title: 'Error', 
      description: 'Failed to add comment', 
      variant: 'destructive' 
    });
    return null;
  }
};

/**
 * Update a track comment
 */
export const updateTrackComment = async (commentId: string, content: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('track_comments')
      .update({ 
        content,
        updated_at: new Date().toISOString()
      })
      .eq('id', commentId);
    
    if (error) throw error;
    
    toast({ 
      title: 'Success', 
      description: 'Comment updated successfully' 
    });
    
    return true;
  } catch (error) {
    console.error('Error updating track comment:', error);
    toast({ 
      title: 'Error', 
      description: 'Failed to update comment', 
      variant: 'destructive' 
    });
    return false;
  }
};

/**
 * Delete a track comment
 */
export const deleteTrackComment = async (commentId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('track_comments')
      .delete()
      .eq('id', commentId);
    
    if (error) throw error;
    
    toast({ 
      title: 'Success', 
      description: 'Comment deleted successfully' 
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting track comment:', error);
    toast({ 
      title: 'Error', 
      description: 'Failed to delete comment', 
      variant: 'destructive' 
    });
    return false;
  }
};

/**
 * Save a track to the database
 */
export const saveTrack = async (track: Track): Promise<string | null> => {
  try {
    // Check if user is authenticated
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      toast({ 
        title: 'Authentication Required', 
        description: 'Please log in to save tracks', 
        variant: 'destructive' 
      });
      return null;
    }
    
    // Convert Track to database format
    const trackData = {
      name: track.name,
      description: track.description || '',
      source_type: track.source_type,
      segments: track.segments,
      created_by: userData.user.id,
      is_public: track.is_public,
      color: track.color,
      visible: track.visible !== false,
      distance_km: track.distance_km,
      elevation_gain: track.elevation_gain,
      difficulty: track.difficulty
    };
    
    const { data, error } = await supabase
      .from('tracks')
      .insert([trackData])
      .select()
      .single();
    
    if (error) throw error;
    
    toast({ 
      title: 'Success', 
      description: 'Track saved successfully' 
    });
    
    return data.id;
  } catch (error) {
    console.error('Error saving track:', error);
    toast({ 
      title: 'Error', 
      description: 'Failed to save track', 
      variant: 'destructive' 
    });
    return null;
  }
};

/**
 * Fetch all public tracks
 */
export const fetchPublicTracks = async (): Promise<Track[]> => {
  try {
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .eq('is_public', true);
    
    if (error) throw error;
    
    // Convert database format to Track type
    return (data || []).map(track => ({
      id: track.id,
      name: track.name,
      description: track.description,
      source_type: track.source_type,
      segments: track.segments,
      created_at: track.created_at,
      created_by: track.created_by,
      is_public: track.is_public,
      color: track.color,
      visible: track.visible,
      trip_id: track.trip_id,
      distance_km: track.distance_km,
      elevation_gain: track.elevation_gain,
      difficulty: track.difficulty
    }));
  } catch (error) {
    console.error('Error fetching public tracks:', error);
    toast({ 
      title: 'Error', 
      description: 'Failed to load public tracks', 
      variant: 'destructive' 
    });
    return [];
  }
};

/**
 * Fetch tracks created by the current user
 */
export const fetchUserTracks = async (): Promise<Track[]> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return [];
    
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .eq('created_by', userData.user.id);
    
    if (error) throw error;
    
    // Convert database format to Track type
    return (data || []).map(track => ({
      id: track.id,
      name: track.name,
      description: track.description,
      source_type: track.source_type,
      segments: track.segments,
      created_at: track.created_at,
      created_by: track.created_by,
      is_public: track.is_public,
      color: track.color,
      visible: track.visible,
      trip_id: track.trip_id,
      distance_km: track.distance_km,
      elevation_gain: track.elevation_gain,
      difficulty: track.difficulty
    }));
  } catch (error) {
    console.error('Error fetching user tracks:', error);
    toast({ 
      title: 'Error', 
      description: 'Failed to load your tracks', 
      variant: 'destructive' 
    });
    return [];
  }
};
