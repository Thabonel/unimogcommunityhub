// RSVP Service - Manage event participant RSVPs
// Uses Supabase client with RLS policies

import { supabase } from '@/lib/supabase-client';
import type { EventParticipant, RSVPStatus } from './types';

/**
 * RSVP to an event
 */
export async function rsvpToEvent(
  eventId: string,
  userId: string,
  status: RSVPStatus,
  notes?: string,
  canProvide?: string[]
): Promise<EventParticipant> {
  const rsvpData = {
    event_id: eventId,
    user_id: userId,
    status,
    notes: notes || null,
    can_provide: canProvide || null,
  };

  // Use upsert to handle both create and update
  const { data, error } = await supabase
    .from('event_participants')
    .upsert(rsvpData, {
      onConflict: 'event_id,user_id',
    })
    .select()
    .single();

  if (error) {
    console.error('Error RSVPing to event:', error);
    throw new Error(`Failed to RSVP: ${error.message}`);
  }

  return data;
}

/**
 * Update RSVP status
 */
export async function updateRSVP(
  eventId: string,
  userId: string,
  status: RSVPStatus,
  notes?: string
): Promise<EventParticipant> {
  const updateData: Partial<EventParticipant> = {
    status,
  };

  if (notes !== undefined) {
    updateData.notes = notes;
  }

  const { data, error } = await supabase
    .from('event_participants')
    .update(updateData)
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating RSVP:', error);
    throw new Error(`Failed to update RSVP: ${error.message}`);
  }

  return data;
}

/**
 * Remove RSVP (user withdraws from event)
 */
export async function removeRSVP(eventId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('event_participants')
    .delete()
    .eq('event_id', eventId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error removing RSVP:', error);
    throw new Error(`Failed to remove RSVP: ${error.message}`);
  }
}

/**
 * Get all participants for an event
 */
export async function getEventParticipants(eventId: string): Promise<
  Array<
    EventParticipant & {
      user: {
        id: string;
        full_name: string | null;
        avatar_url: string | null;
      } | null;
    }
  >
> {
  const { data, error } = await supabase
    .from('event_participants')
    .select(`
      *,
      user:profiles!event_participants_user_id_fkey(id, full_name, avatar_url)
    `)
    .eq('event_id', eventId)
    .order('rsvp_at', { ascending: true });

  if (error) {
    console.error('Error fetching event participants:', error);
    throw new Error(`Failed to fetch participants: ${error.message}`);
  }

  return data || [];
}

/**
 * Get user's RSVP status for an event
 */
export async function getUserRSVPStatus(
  eventId: string,
  userId: string
): Promise<RSVPStatus | null> {
  const { data, error } = await supabase
    .from('event_participants')
    .select('status')
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching RSVP status:', error);
    return null;
  }

  return data?.status || null;
}

/**
 * Check in a participant (event organizer only)
 */
export async function checkInParticipant(
  eventId: string,
  userId: string
): Promise<EventParticipant> {
  const { data, error } = await supabase
    .from('event_participants')
    .update({
      checked_in: true,
      checked_in_at: new Date().toISOString(),
    })
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error checking in participant:', error);
    throw new Error(`Failed to check in participant: ${error.message}`);
  }

  return data;
}

/**
 * Get participant count by status
 */
export async function getParticipantCountByStatus(
  eventId: string
): Promise<{
  going: number;
  maybe: number;
  not_going: number;
  total: number;
}> {
  const { data, error } = await supabase
    .from('event_participants')
    .select('status')
    .eq('event_id', eventId);

  if (error) {
    console.error('Error fetching participant counts:', error);
    return { going: 0, maybe: 0, not_going: 0, total: 0 };
  }

  const going = data?.filter((p) => p.status === 'going').length || 0;
  const maybe = data?.filter((p) => p.status === 'maybe').length || 0;
  const not_going = data?.filter((p) => p.status === 'not_going').length || 0;

  return {
    going,
    maybe,
    not_going,
    total: going + maybe,
  };
}
