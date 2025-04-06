
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Track } from '@/types/track';

// Type for track comments
export interface TrackComment {
  id: string;
  track_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user: {
    display_name?: string;
    full_name?: string;
    email?: string;
    avatar_url?: string;
  };
}

// Get all comments for a track
export async function getTrackComments(trackId: string): Promise<TrackComment[]> {
  try {
    const { data, error } = await supabase
      .from('track_comments')
      .select(`
        id,
        track_id,
        user_id,
        content,
        created_at,
        updated_at,
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
    
    // Format the comments with user data
    return data.map(comment => {
      const userData = comment.profiles || {};
      
      return {
        ...comment,
        user: {
          display_name: userData.display_name || '',
          full_name: userData.full_name || '',
          email: userData.email || '',
          avatar_url: userData.avatar_url || ''
        }
      };
    });
  } catch (error) {
    console.error('Error getting track comments:', error);
    toast.error('Failed to load comments');
    return [];
  }
}

// Add a comment to a track
export async function addTrackComment(trackId: string, content: string): Promise<TrackComment | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('You must be logged in to comment');
      return null;
    }
    
    // Insert the comment
    const { data, error } = await supabase
      .from('track_comments')
      .insert({
        track_id: trackId,
        user_id: user.id,
        content
      })
      .select(`
        id,
        track_id,
        user_id,
        content,
        created_at,
        updated_at,
        profiles:user_id (
          display_name, 
          full_name,
          email,
          avatar_url
        )
      `)
      .single();
    
    if (error) {
      throw error;
    }
    
    // Format the comment with user data
    const userData = data.profiles || {};
    
    const formattedComment: TrackComment = {
      ...data,
      user: {
        display_name: userData.display_name || '',
        full_name: userData.full_name || '',
        email: userData.email || '',
        avatar_url: userData.avatar_url || ''
      }
    };
    
    return formattedComment;
  } catch (error) {
    console.error('Error adding track comment:', error);
    toast.error('Failed to add comment');
    return null;
  }
}

// Delete a comment
export async function deleteTrackComment(commentId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('You must be logged in to delete comments');
      return false;
    }
    
    const { error } = await supabase
      .from('track_comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', user.id); // Only allow users to delete their own comments
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting track comment:', error);
    toast.error('Failed to delete comment');
    return false;
  }
}

// Save a track to the database
export async function saveTrack(track: Track): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('You must be logged in to save tracks');
      return null;
    }
    
    const { data, error } = await supabase
      .from('tracks')
      .insert({
        name: track.name,
        description: track.description,
        segments: track.segments,
        created_by: user.id,
        source_type: track.source_type,
        distance_km: track.distance_km,
        elevation_gain: track.elevation_gain,
        trip_id: track.trip_id,
        is_public: track.is_public,
        color: track.color,
        difficulty: track.difficulty as string, // Cast to string to match DB schema
        visible: track.visible
      })
      .select('id')
      .single();
    
    if (error) {
      throw error;
    }
    
    return data.id;
  } catch (error) {
    console.error('Error saving track:', error);
    toast.error('Failed to save track');
    return null;
  }
}

// Get all public tracks
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
    
    // Cast the difficulty to the correct type when mapping
    return data.map(track => ({
      ...track,
      difficulty: (track.difficulty || 'beginner') as 'beginner' | 'intermediate' | 'advanced' | 'expert'
    })) as Track[];
  } catch (error) {
    console.error('Error getting public tracks:', error);
    toast.error('Failed to load public tracks');
    return [];
  }
}

// Get tracks created by the current user
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
    
    // Cast the difficulty to the correct type when mapping
    return data.map(track => ({
      ...track,
      difficulty: (track.difficulty || 'beginner') as 'beginner' | 'intermediate' | 'advanced' | 'expert'
    })) as Track[];
  } catch (error) {
    console.error('Error getting user tracks:', error);
    toast.error('Failed to load your tracks');
    return [];
  }
}

// Get tracks (either all tracks or ones created by the current user)
export async function getTracks(onlyMine: boolean = false): Promise<Track[]> {
  try {
    let query = supabase.from('tracks').select('*');
    
    if (onlyMine) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        query = query.eq('created_by', user.id);
      }
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    // Cast the difficulty to the correct type when mapping
    return data.map(track => ({
      ...track,
      difficulty: (track.difficulty || 'beginner') as 'beginner' | 'intermediate' | 'advanced' | 'expert'
    })) as Track[];
  } catch (error) {
    console.error('Error getting tracks:', error);
    toast.error('Failed to load tracks');
    return [];
  }
}

// Get a single track by ID
export async function getTrackById(trackId: string): Promise<Track | null> {
  try {
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .eq('id', trackId)
      .single();
    
    if (error) {
      throw error;
    }
    
    // Cast the difficulty to the correct type
    return {
      ...data,
      difficulty: (data.difficulty || 'beginner') as 'beginner' | 'intermediate' | 'advanced' | 'expert'
    } as Track;
  } catch (error) {
    console.error('Error getting track:', error);
    toast.error('Failed to load track');
    return null;
  }
}
