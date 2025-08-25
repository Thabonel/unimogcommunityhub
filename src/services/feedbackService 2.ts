
import { supabase } from '@/lib/supabase-client';
import { v4 as uuidv4 } from 'uuid';

export type FeedbackType = 'suggestion' | 'bug' | 'feature_request' | 'general';
export type FeedbackRating = 1 | 2 | 3 | 4 | 5;

export interface Feedback {
  id: string;
  user_id: string | null;
  type: FeedbackType;
  content: string;
  rating?: FeedbackRating;
  created_at: string;
  status?: 'pending' | 'reviewing' | 'implemented' | 'declined';
  votes?: number;
  metadata?: Record<string, any>;
}

export interface FeedbackSubmission {
  type: FeedbackType;
  content: string;
  rating?: FeedbackRating;
  metadata?: Record<string, any>;
}

export async function submitFeedback(feedback: FeedbackSubmission): Promise<Feedback | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const user_id = user?.id || null;

    const { data, error } = await supabase
      .from('feedback')
      .insert({
        id: uuidv4(),
        user_id,
        type: feedback.type,
        content: feedback.content,
        rating: feedback.rating,
        metadata: feedback.metadata || {},
        votes: 0,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error submitting feedback:', error);
      return null;
    }

    // Also track this activity
    const { error: activityError } = await supabase
      .from('user_activities')
      .insert({
        user_id,
        event_type: 'feedback_submission',
        session_id: sessionStorage.getItem('session_id') || uuidv4(),
        event_data: {
          feedback_id: data.id,
          feedback_type: feedback.type,
          has_rating: !!feedback.rating
        }
      });

    if (activityError) {
      console.error('Error logging feedback activity:', activityError);
    }

    return data;
  } catch (error) {
    console.error('Unexpected error in submitFeedback:', error);
    return null;
  }
}

export async function getFeatureRequests(): Promise<Feedback[]> {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('type', 'feature_request')
      .order('votes', { ascending: false });

    if (error) {
      console.error('Error fetching feature requests:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error in getFeatureRequests:', error);
    return [];
  }
}

export async function voteForFeature(feedbackId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const user_id = user?.id;

    if (!user_id) {
      console.error('User must be authenticated to vote');
      return false;
    }

    // Check if user already voted
    const { data: existingVote } = await supabase
      .from('feedback_votes')
      .select('id')
      .eq('feedback_id', feedbackId)
      .eq('user_id', user_id)
      .single();

    if (existingVote) {
      // Remove vote
      const { error: removeError } = await supabase
        .from('feedback_votes')
        .delete()
        .eq('feedback_id', feedbackId)
        .eq('user_id', user_id);

      if (removeError) {
        console.error('Error removing vote:', removeError);
        return false;
      }

      // Decrement vote counter
      const { error: updateError } = await supabase.rpc('decrement_feedback_votes', {
        feedback_id: feedbackId
      });

      if (updateError) {
        console.error('Error decrementing votes:', updateError);
        return false;
      }

      return true;
    } else {
      // Add vote
      const { error: addError } = await supabase
        .from('feedback_votes')
        .insert({
          feedback_id: feedbackId,
          user_id: user_id
        });

      if (addError) {
        console.error('Error adding vote:', addError);
        return false;
      }

      // Increment vote counter
      const { error: updateError } = await supabase.rpc('increment_feedback_votes', {
        feedback_id: feedbackId
      });

      if (updateError) {
        console.error('Error incrementing votes:', updateError);
        return false;
      }

      // Track voting activity
      const { error: activityError } = await supabase
        .from('user_activities')
        .insert({
          user_id,
          event_type: 'feedback_vote',
          session_id: sessionStorage.getItem('session_id') || uuidv4(),
          event_data: {
            feedback_id: feedbackId,
            action: 'add'
          }
        });

      if (activityError) {
        console.error('Error logging vote activity:', activityError);
      }

      return true;
    }
  } catch (error) {
    console.error('Unexpected error in voteForFeature:', error);
    return false;
  }
}

export async function hasUserVotedForFeature(feedbackId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const user_id = user?.id;

    if (!user_id) return false;

    const { data } = await supabase
      .from('feedback_votes')
      .select('id')
      .eq('feedback_id', feedbackId)
      .eq('user_id', user_id)
      .single();

    return !!data;
  } catch (error) {
    console.error('Error checking user vote:', error);
    return false;
  }
}

export async function getUserFeedback(): Promise<Feedback[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const user_id = user?.id;

    if (!user_id) {
      return [];
    }

    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user feedback:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error in getUserFeedback:', error);
    return [];
  }
}
