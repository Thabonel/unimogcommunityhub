// Event Service - CRUD operations for community events
// Uses Supabase client with RLS policies

import { supabase } from '@/lib/supabase-client';
import type {
  Event,
  EventFormData,
  EventWithDetails,
  EventFilters,
  EventSummary,
  NearbyEvent,
} from './types';

/**
 * Get all events with optional filters
 */
export async function getEvents(filters?: EventFilters): Promise<EventWithDetails[]> {
  let query = supabase
    .from('events')
    .select('*')
    .order('start_date', { ascending: true });

  // Apply filters
  if (filters?.event_type) {
    query = query.eq('event_type', filters.event_type);
  }

  if (filters?.status) {
    query = query.eq('status', filters.status);
  } else {
    // Default: only show upcoming and ongoing events
    query = query.in('status', ['upcoming', 'ongoing']);
  }

  if (filters?.start_date_from) {
    query = query.gte('start_date', filters.start_date_from.toISOString());
  }

  if (filters?.start_date_to) {
    query = query.lte('start_date', filters.start_date_to.toISOString());
  }

  if (filters?.organizer_id) {
    query = query.eq('organizer_id', filters.organizer_id);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching events:', error);
    throw new Error(`Failed to fetch events: ${error.message}`);
  }

  // Fetch participant counts and user RSVP status for each event
  const eventsWithDetails = await Promise.all(
    (data || []).map(async (event) => {
      const participantData = await getEventParticipantStats(event.id);
      return {
        ...event,
        ...participantData,
      };
    })
  );

  return eventsWithDetails;
}

/**
 * Get a single event by ID with full details
 */
export async function getEventById(eventId: string): Promise<EventWithDetails | null> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single();

  if (error) {
    console.error('Error fetching event:', error);
    throw new Error(`Failed to fetch event: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  // Fetch participant stats
  const participantData = await getEventParticipantStats(eventId);

  return {
    ...data,
    ...participantData,
  };
}

/**
 * Create a new event
 */
export async function createEvent(formData: EventFormData, userId: string): Promise<Event> {
  const eventData = {
    title: formData.title,
    description: formData.description || null,
    organizer_id: userId,

    event_type: formData.event_type,
    category: formData.category || null,
    tags: formData.tags,

    start_date: formData.start_date.toISOString(),
    end_date: formData.end_date?.toISOString() || null,
    rsvp_deadline: formData.rsvp_deadline?.toISOString() || null,

    location_name: formData.location_name || null,
    location_address: formData.location_address || null,
    location_lat: formData.location_lat || null,
    location_lng: formData.location_lng || null,

    max_participants: formData.max_participants || null,
    min_participants: formData.min_participants,

    vehicle_requirements: formData.vehicle_requirements,
    skill_level: formData.skill_level || null,
    required_equipment: formData.required_equipment,

    visibility: formData.visibility,
    status: 'upcoming' as const,
  };

  const { data, error } = await supabase
    .from('events')
    .insert(eventData)
    .select()
    .single();

  if (error) {
    console.error('Error creating event:', error);
    throw new Error(`Failed to create event: ${error.message}`);
  }

  return data;
}

/**
 * Update an existing event
 */
export async function updateEvent(
  eventId: string,
  formData: Partial<EventFormData>
): Promise<Event> {
  const updateData: Partial<Event> = {};

  if (formData.title !== undefined) updateData.title = formData.title;
  if (formData.description !== undefined) updateData.description = formData.description;
  if (formData.event_type !== undefined) updateData.event_type = formData.event_type;
  if (formData.category !== undefined) updateData.category = formData.category || null;
  if (formData.tags !== undefined) updateData.tags = formData.tags;

  if (formData.start_date !== undefined)
    updateData.start_date = formData.start_date.toISOString();
  if (formData.end_date !== undefined)
    updateData.end_date = formData.end_date?.toISOString() || null;
  if (formData.rsvp_deadline !== undefined)
    updateData.rsvp_deadline = formData.rsvp_deadline?.toISOString() || null;

  if (formData.location_name !== undefined)
    updateData.location_name = formData.location_name || null;
  if (formData.location_address !== undefined)
    updateData.location_address = formData.location_address || null;
  if (formData.location_lat !== undefined)
    updateData.location_lat = formData.location_lat || null;
  if (formData.location_lng !== undefined)
    updateData.location_lng = formData.location_lng || null;

  if (formData.max_participants !== undefined)
    updateData.max_participants = formData.max_participants || null;
  if (formData.min_participants !== undefined)
    updateData.min_participants = formData.min_participants;

  if (formData.vehicle_requirements !== undefined)
    updateData.vehicle_requirements = formData.vehicle_requirements;
  if (formData.skill_level !== undefined)
    updateData.skill_level = formData.skill_level || null;
  if (formData.required_equipment !== undefined)
    updateData.required_equipment = formData.required_equipment;

  if (formData.visibility !== undefined) updateData.visibility = formData.visibility;

  const { data, error } = await supabase
    .from('events')
    .update(updateData)
    .eq('id', eventId)
    .select()
    .single();

  if (error) {
    console.error('Error updating event:', error);
    throw new Error(`Failed to update event: ${error.message}`);
  }

  return data;
}

/**
 * Cancel an event (soft delete)
 */
export async function cancelEvent(eventId: string, reason: string): Promise<void> {
  const { error } = await supabase
    .from('events')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
      cancellation_reason: reason,
    })
    .eq('id', eventId);

  if (error) {
    console.error('Error cancelling event:', error);
    throw new Error(`Failed to cancel event: ${error.message}`);
  }
}

/**
 * Delete an event (hard delete)
 */
export async function deleteEvent(eventId: string): Promise<void> {
  const { error } = await supabase.from('events').delete().eq('id', eventId);

  if (error) {
    console.error('Error deleting event:', error);
    throw new Error(`Failed to delete event: ${error.message}`);
  }
}

/**
 * Get event summary using database helper function
 */
export async function getEventSummary(eventId: string): Promise<EventSummary | null> {
  const { data, error } = await supabase.rpc('get_event_summary', {
    p_event_id: eventId,
  });

  if (error) {
    console.error('Error fetching event summary:', error);
    return null;
  }

  return data;
}

/**
 * Find nearby events using PostGIS
 */
export async function findNearbyEvents(
  lat: number,
  lng: number,
  radiusKm: number = 50,
  eventType?: string
): Promise<NearbyEvent[]> {
  const { data, error } = await supabase.rpc('find_events_nearby', {
    user_lat: lat,
    user_lng: lng,
    radius_km: radiusKm,
    p_event_type: eventType || null,
  });

  if (error) {
    console.error('Error finding nearby events:', error);
    throw new Error(`Failed to find nearby events: ${error.message}`);
  }

  return data || [];
}

/**
 * Get events user is participating in
 */
export async function getUserEvents(userId: string): Promise<EventWithDetails[]> {
  const { data, error} = await supabase
    .from('event_participants')
    .select(`
      status,
      events:event_id (*)
    `)
    .eq('user_id', userId)
    .in('status', ['going', 'maybe']);

  if (error) {
    console.error('Error fetching user events:', error);
    throw new Error(`Failed to fetch user events: ${error.message}`);
  }

  // Extract events and add participant stats
  const events = (data || [])
    .map((item) => item.events)
    .filter((event): event is Event => event !== null);

  const eventsWithDetails = await Promise.all(
    events.map(async (event) => {
      const participantData = await getEventParticipantStats(event.id);
      return {
        ...event,
        ...participantData,
      };
    })
  );

  return eventsWithDetails;
}

/**
 * Helper: Get participant statistics for an event
 */
async function getEventParticipantStats(eventId: string) {
  const { data: userData } = await supabase.auth.getUser();
  const currentUserId = userData?.user?.id;

  // Get all participants for this event
  const { data: participants } = await supabase
    .from('event_participants')
    .select('status, user_id')
    .eq('event_id', eventId);

  const going_count = participants?.filter((p) => p.status === 'going').length || 0;
  const maybe_count = participants?.filter((p) => p.status === 'maybe').length || 0;
  const participant_count = going_count + maybe_count;

  // Find current user's RSVP status
  const userRsvp = participants?.find((p) => p.user_id === currentUserId);

  // Check if event is full
  const { data: isFullData } = await supabase.rpc('is_event_full', {
    p_event_id: eventId,
  });

  return {
    participant_count,
    going_count,
    maybe_count,
    user_rsvp_status: userRsvp?.status || null,
    is_full: isFullData || false,
  };
}
