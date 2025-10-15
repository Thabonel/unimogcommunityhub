// Event types for UnimogCommunityHub
// Matches database schema from migration 20250115000001

export type EventType = 'trip' | 'working_bee' | 'social' | 'emergency_help' | 'meetup';

export type EventStatus = 'draft' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export type EventVisibility = 'public' | 'private' | 'friends_only';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type RSVPStatus = 'going' | 'maybe' | 'not_going' | 'waitlist';

export type EmergencySeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Event {
  id: string;
  title: string;
  description: string | null;
  organizer_id: string;

  // Event categorization
  event_type: EventType;
  category: string | null;
  tags: string[];

  // Scheduling
  start_date: string; // ISO timestamp
  end_date: string | null; // ISO timestamp
  rsvp_deadline: string | null; // ISO timestamp

  // Location
  location_name: string | null;
  location_address: string | null;
  location_lat: number | null;
  location_lng: number | null;

  // Participant management
  max_participants: number | null;
  min_participants: number;

  // Requirements
  vehicle_requirements: VehicleRequirements;
  skill_level: SkillLevel | null;
  required_equipment: string[] | null;

  // Visibility and status
  visibility: EventVisibility;
  status: EventStatus;
  is_barry_suggested: boolean;

  // Emergency fields
  is_emergency: boolean;
  emergency_severity: EmergencySeverity | null;
  emergency_resolved_at: string | null; // ISO timestamp

  // Metadata
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  cancelled_at: string | null; // ISO timestamp
  cancellation_reason: string | null;
}

export interface VehicleRequirements {
  model?: string; // e.g., "U1700L"
  four_wd?: boolean;
  winch?: boolean;
  recovery_gear?: boolean;
  [key: string]: unknown;
}

export interface EventParticipant {
  id: string;
  event_id: string;
  user_id: string;

  status: RSVPStatus;

  rsvp_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  checked_in: boolean;
  checked_in_at: string | null; // ISO timestamp

  notes: string | null;
  can_provide: string[] | null;
}

export interface EventInvitation {
  id: string;
  event_id: string;
  invited_user_id: string;
  invited_by_user_id: string | null;

  status: 'pending' | 'accepted' | 'declined';

  created_at: string; // ISO timestamp
  responded_at: string | null; // ISO timestamp
}

// Extended event with participant info (for display)
export interface EventWithDetails extends Event {
  organizer?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  participant_count: number;
  going_count: number;
  maybe_count: number;
  user_rsvp_status: RSVPStatus | null; // Current user's RSVP status
  is_full: boolean;
  distance_km?: number; // For proximity results
}

// Form data for creating/editing events
export interface EventFormData {
  title: string;
  description: string;
  event_type: EventType;
  category?: string;
  tags: string[];

  start_date: Date;
  end_date?: Date;
  rsvp_deadline?: Date;

  location_name?: string;
  location_address?: string;
  location_lat?: number;
  location_lng?: number;

  max_participants?: number;
  min_participants: number;

  vehicle_requirements: VehicleRequirements;
  skill_level?: SkillLevel;
  required_equipment: string[];

  visibility: EventVisibility;
}

// Event filters for calendar view
export interface EventFilters {
  event_type?: EventType;
  status?: EventStatus;
  start_date_from?: Date;
  start_date_to?: Date;
  location_radius_km?: number; // For proximity filter
  organizer_id?: string; // Show only events by specific user
  participating?: boolean; // Show only events user RSVP'd to
}

// Event summary from helper function
export interface EventSummary {
  event_id: string;
  title: string;
  event_type: EventType;
  status: EventStatus;
  start_date: string;
  organizer_id: string;
  participant_stats: {
    going: number;
    maybe: number;
    not_going: number;
    total: number;
    max_participants: number | null;
    is_full: boolean;
  };
  location: {
    name: string | null;
    address: string | null;
    lat: number | null;
    lng: number | null;
  };
}

// Nearby event result from find_events_nearby()
export interface NearbyEvent {
  event_id: string;
  title: string;
  event_type: EventType;
  start_date: string;
  distance_km: number;
  organizer_id: string;
  location_name: string | null;
  participant_count: number;
  max_participants: number | null;
}
