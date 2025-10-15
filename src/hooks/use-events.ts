// Custom hooks for event management
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  findNearbyEvents,
  type EventFilters,
  type EventFormData,
} from '@/services/events/eventService';
import {
  rsvpToEvent,
  updateRSVP,
  removeRSVP,
  getEventParticipants,
  checkInParticipant,
  type RSVPStatus,
} from '@/services/events/rsvpService';
import { useToast } from '@/hooks/use-toast';

/**
 * Fetch events with optional filters
 */
export function useEvents(filters?: EventFilters) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: () => getEvents(filters),
  });
}

/**
 * Fetch single event by ID with full details
 */
export function useEventDetails(eventId: string | undefined) {
  return useQuery({
    queryKey: ['events', eventId],
    queryFn: () => {
      if (!eventId) throw new Error('Event ID required');
      return getEventById(eventId);
    },
    enabled: !!eventId,
  });
}

/**
 * Create new event
 */
export function useCreateEvent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ formData, userId }: { formData: EventFormData; userId: string }) =>
      createEvent(formData, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: 'Event created',
        description: 'Your event has been created successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to create event',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Update existing event
 */
export function useUpdateEvent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ eventId, formData }: { eventId: string; formData: Partial<EventFormData> }) =>
      updateEvent(eventId, formData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events', variables.eventId] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: 'Event updated',
        description: 'Your event has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update event',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Delete event
 */
export function useDeleteEvent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (eventId: string) => deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: 'Event deleted',
        description: 'Your event has been deleted.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to delete event',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * RSVP to an event
 */
export function useRSVP() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      eventId,
      userId,
      status,
      notes,
    }: {
      eventId: string;
      userId: string;
      status: RSVPStatus;
      notes?: string;
    }) => rsvpToEvent(eventId, userId, status, notes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events', variables.eventId] });
      queryClient.invalidateQueries({ queryKey: ['events', variables.eventId, 'participants'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });

      const statusText = variables.status === 'going' ? 'attending' :
                        variables.status === 'maybe' ? 'maybe attending' : 'not attending';

      toast({
        title: 'RSVP updated',
        description: `You are now marked as ${statusText}.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to RSVP',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Update existing RSVP
 */
export function useUpdateRSVP() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      eventId,
      userId,
      status,
      notes,
    }: {
      eventId: string;
      userId: string;
      status: RSVPStatus;
      notes?: string;
    }) => updateRSVP(eventId, userId, status, notes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events', variables.eventId] });
      queryClient.invalidateQueries({ queryKey: ['events', variables.eventId, 'participants'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });

      toast({
        title: 'RSVP updated',
        description: 'Your RSVP has been updated.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update RSVP',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Remove RSVP
 */
export function useRemoveRSVP() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ eventId, userId }: { eventId: string; userId: string }) =>
      removeRSVP(eventId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events', variables.eventId] });
      queryClient.invalidateQueries({ queryKey: ['events', variables.eventId, 'participants'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });

      toast({
        title: 'RSVP removed',
        description: 'Your RSVP has been removed.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to remove RSVP',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Get event participants
 */
export function useEventParticipants(eventId: string | undefined) {
  return useQuery({
    queryKey: ['events', eventId, 'participants'],
    queryFn: () => {
      if (!eventId) throw new Error('Event ID required');
      return getEventParticipants(eventId);
    },
    enabled: !!eventId,
  });
}

/**
 * Check in participant (organizer only)
 */
export function useCheckInParticipant() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ eventId, userId }: { eventId: string; userId: string }) =>
      checkInParticipant(eventId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events', variables.eventId, 'participants'] });
      toast({
        title: 'Participant checked in',
        description: 'Participant has been marked as checked in.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to check in participant',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Find nearby events based on user location
 */
export function useNearbyEvents(lat?: number, lng?: number, radiusKm: number = 50) {
  return useQuery({
    queryKey: ['events', 'nearby', lat, lng, radiusKm],
    queryFn: () => {
      if (!lat || !lng) throw new Error('Location required');
      return findNearbyEvents(lat, lng, radiusKm);
    },
    enabled: !!lat && !!lng,
  });
}
