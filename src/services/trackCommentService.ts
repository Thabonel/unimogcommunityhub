
import { supabase } from '@/lib/supabase';
import { Track, TrackComment } from '@/types/track';
import { toast } from 'sonner';

// Get comments for a specific track
export async function getTrackComments(trackId: string): Promise<TrackComment[]> {
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
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Transform the data to match our expected format
    const comments: TrackComment[] = data.map(item => {
      // Type casting and null safety
      const profile = item.profiles as any || {};
      return {
        id: item.id,
        track_id: item.track_id,
        user_id: item.user_id,
        user: {
          display_name: profile.display_name || '',
          full_name: profile.full_name || '',
          email: profile.email || '',
          avatar_url: profile.avatar_url || ''
        },
        content: item.content,
        created_at: item.created_at,
        updated_at: item.updated_at
      };
    });
    
    return comments;
  } catch (error) {
    console.error('Error fetching track comments:', error);
    toast.error('Failed to load comments');
    return [];
  }
}

// Add a comment to a track
export async function addTrackComment(
  trackId: string,
  content: string
): Promise<TrackComment | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('You must be logged in to comment');
      return null;
    }
    
    const now = new Date().toISOString();
    const newComment = {
      track_id: trackId,
      user_id: user.id,
      content,
      created_at: now,
      updated_at: now
    };
    
    const { data, error } = await supabase
      .from('track_comments')
      .insert(newComment)
      .select(`
        *,
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
    
    // Type casting and null safety
    const profile = data.profiles as any || {};
    
    const comment: TrackComment = {
      id: data.id,
      track_id: data.track_id,
      user_id: data.user_id,
      user: {
        display_name: profile.display_name || '',
        full_name: profile.full_name || '',
        email: profile.email || '',
        avatar_url: profile.avatar_url || ''
      },
      content: data.content,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    toast.success('Comment added successfully');
    return comment;
  } catch (error) {
    console.error('Error adding track comment:', error);
    toast.error('Failed to add comment');
    return null;
  }
}

// Delete a track comment
export async function deleteTrackComment(commentId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('You must be logged in to delete comments');
      return false;
    }
    
    // First check if the comment belongs to the user
    const { data: comment, error: checkError } = await supabase
      .from('track_comments')
      .select('user_id')
      .eq('id', commentId)
      .single();
    
    if (checkError) {
      throw checkError;
    }
    
    if (comment.user_id !== user.id) {
      toast.error('You can only delete your own comments');
      return false;
    }
    
    const { error } = await supabase
      .from('track_comments')
      .delete()
      .eq('id', commentId);
    
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

// Save a track to the database
export async function saveTrack(track: Track): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('You must be logged in to save tracks');
      return null;
    }
    
    // Prepare the track data for saving
    const trackData = {
      ...track,
      created_by: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Insert or update the track
    const { data, error } = await supabase
      .from('tracks')
      .upsert(trackData)
      .select('id')
      .single();
    
    if (error) {
      throw error;
    }
    
    toast.success('Track saved successfully');
    return data.id;
  } catch (error) {
    console.error('Error saving track:', error);
    toast.error('Failed to save track');
    return null;
  }
}

// Fetch public tracks
export async function fetchPublicTracks(): Promise<Track[]> {
  try {
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .eq('is_public', true)
      .eq('visible', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Convert the raw data to our Track type
    return data.map(track => ({
      ...track,
      // Ensure the difficulty is one of the expected values
      difficulty: (track.difficulty as "beginner" | "intermediate" | "advanced" | "expert") || "beginner",
      // Ensure segments is correctly parsed from JSON if needed
      segments: typeof track.segments === 'string' ? JSON.parse(track.segments) : track.segments
    })) as Track[];
  } catch (error) {
    console.error('Error fetching public tracks:', error);
    toast.error('Failed to load public tracks');
    return [];
  }
}

// Fetch user's tracks
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
      .eq('visible', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Convert the raw data to our Track type with appropriate type casting
    return data.map(track => ({
      ...track,
      // Ensure the difficulty is one of the expected values
      difficulty: (track.difficulty as "beginner" | "intermediate" | "advanced" | "expert") || "beginner",
      // Ensure segments is correctly parsed from JSON if needed
      segments: typeof track.segments === 'string' ? JSON.parse(track.segments) : track.segments
    })) as Track[];
  } catch (error) {
    console.error('Error fetching user tracks:', error);
    toast.error('Failed to load your tracks');
    return [];
  }
}
