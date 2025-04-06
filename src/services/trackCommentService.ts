import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TrackComment, Track } from '@/types/track';

export async function fetchTrackComments(trackId: string): Promise<TrackComment[]> {
  try {
    const { data, error } = await supabase
      .from('track_comments')
      .select(`
        *,
        profiles:user_id (
          display_name,
          full_name,
          email,
          avatar_url
        )
      `)
      .eq('track_id', trackId)
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    // Transform data to match the expected format
    return data.map(item => ({
      id: item.id,
      track_id: item.track_id,
      user_id: item.user_id,
      user: item.profiles ? {
        display_name: item.profiles.display_name,
        full_name: item.profiles.full_name,
        email: item.profiles.email,
        avatar_url: item.profiles.avatar_url
      } : undefined,
      content: item.content,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
  } catch (error) {
    console.error('Error fetching track comments:', error);
    return [];
  }
}

export async function addTrackComment(trackId: string, content: string): Promise<TrackComment | null> {
  try {
    const user = await supabase.auth.getUser();
    
    if (!user.data.user) {
      toast.error('You must be logged in to add comments');
      return null;
    }
    
    const { data, error } = await supabase
      .from('track_comments')
      .insert({
        track_id: trackId,
        user_id: user.data.user.id,
        content: content
      })
      .select('*, profiles:user_id(*)')
      .single();
    
    if (error) {
      throw error;
    }
    
    toast.success('Comment added successfully');
    
    return {
      id: data.id,
      track_id: data.track_id,
      user_id: data.user_id,
      user: data.profiles ? {
        display_name: data.profiles.display_name,
        full_name: data.profiles.full_name,
        email: data.profiles.email,
        avatar_url: data.profiles.avatar_url
      } : undefined,
      content: data.content,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error('Error adding track comment:', error);
    toast.error('Failed to add comment');
    return null;
  }
}

export async function updateTrackComment(commentId: string, content: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('track_comments')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', commentId)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
    
    if (error) {
      throw error;
    }
    
    toast.success('Comment updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating track comment:', error);
    toast.error('Failed to update comment');
    return false;
  }
}

export async function deleteTrackComment(commentId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('track_comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
    
    if (error) {
      throw error;
    }
    
    toast.success('Comment deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting track comment:', error);
    toast.error('Failed to delete comment');
    return false;
  }
}

// Add functions for TrackCommunity component
export async function fetchPublicTracks(): Promise<Track[]> {
  try {
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching public tracks:', error);
    return [];
  }
}

export async function fetchUserTracks(): Promise<Track[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .eq('created_by', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching user tracks:', error);
    return [];
  }
}

export async function saveTrack(track: Track): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('You must be logged in to save tracks');
      return null;
    }
    
    // If the track has an ID, update it
    if (track.id && track.id !== '') {
      const { error } = await supabase
        .from('tracks')
        .update({
          name: track.name,
          description: track.description,
          is_public: track.is_public,
          difficulty: track.difficulty
        })
        .eq('id', track.id)
        .eq('created_by', user.id);
      
      if (error) throw error;
      
      return track.id;
    } 
    // Otherwise, insert a new track
    else {
      const { data, error } = await supabase
        .from('tracks')
        .insert({
          name: track.name,
          description: track.description,
          segments: track.segments,
          source_type: track.source_type,
          color: track.color,
          distance_km: track.distance_km,
          elevation_gain: track.elevation_gain,
          created_by: user.id,
          is_public: track.is_public,
          visible: true,
          difficulty: track.difficulty
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return data.id;
    }
  } catch (error) {
    console.error('Error saving track:', error);
    toast.error('Failed to save track');
    return null;
  }
}
