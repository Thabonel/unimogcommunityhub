# Events System Implementation Progress

## ✅ COMPLETED (Phase 1A)

### Database Schema
- **Migration**: `20250115000001_create_events_system.sql`
- **Tables**: `events`, `event_participants`, `event_invitations`
- **Functions**: 6 helper functions for proximity, capacity, summaries
- **RLS**: 13 policies for secure access
- **PostGIS**: Enabled for location-based matching

### Service Layer
- **`/src/services/events/types.ts`** - Complete TypeScript interfaces
- **`/src/services/events/eventService.ts`** - CRUD operations for events
- **`/src/services/events/rsvpService.ts`** - RSVP management
- **`/src/services/events/index.ts`** - Service exports

### UI Components (Started)
- **`/src/components/events/EventCard.tsx`** - Event display card

---

## 📋 TODO (Phase 1B - Complete Week 1)

### Remaining UI Components

#### 1. EventCalendar.tsx
```tsx
// Main calendar view - displays all events
// Features:
// - Grid/list toggle
// - Filter by event type
// - Search by title
// - Date range picker
// - Show only user's events toggle

import { useState } from 'react';
import { EventCard } from './EventCard';
import { EventFilters } from './EventFilters';
import { useEvents } from '@/hooks/use-events';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function EventCalendar() {
  // Implement calendar grid/list view
  // Use getEvents() from eventService
  // Show EventFilters component
  // Show EventCreationDialog on "Create Event" button
}
```

#### 2. Event

CreationDialog.tsx
```tsx
// Modal dialog for creating/editing events
// Features:
// - Dialog wrapper with form
// - Calls EventCreationForm component
// - Handles submit/cancel

import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { EventCreationForm } from './EventCreationForm';

export function EventCreationDialog({ open, onOpenChange, event }) {
  // Wrap EventCreationForm in dialog
  // Handle form submission
  // Close on success
}
```

#### 3. EventCreationForm.tsx
```tsx
// Form for creating/editing events
// Features:
// - All event fields with validation (react-hook-form + zod)
// - Event type selector
// - Date/time pickers
// - Location picker (Mapbox integration)
// - Max participants input
// - Vehicle requirements
// - Visibility toggle

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createEvent, updateEvent } from '@/services/events';

const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  event_type: z.enum(['trip', 'working_bee', 'social', 'emergency_help', 'meetup']),
  start_date: z.date(),
  end_date: z.date().optional(),
  location_name: z.string().optional(),
  max_participants: z.number().positive().optional(),
  // ... more fields
});

export function EventCreationForm({ event, onSuccess }) {
  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: event || {}
  });

  async function onSubmit(data) {
    if (event) {
      await updateEvent(event.id, data);
    } else {
      await createEvent(data, user.id);
    }
    onSuccess();
  }

  return <Form>...</Form>;
}
```

#### 4. EventDetailView.tsx
```tsx
// Full event details page
// Features:
// - Full event information
// - EventParticipantList component
// - EventRSVPButton component
// - Edit/cancel buttons (for organizer)
// - Map showing location
// - Comments section (future)

import { useParams } from 'react-router-dom';
import { useEventDetails } from '@/hooks/use-events';
import { EventRSVPButton } from './EventRSVPButton';
import { EventParticipantList } from './EventParticipantList';

export function EventDetailView() {
  const { eventId } = useParams();
  const { event, loading } = useEventDetails(eventId);

  // Show full event details
  // Embed map if location exists
  // Show participant list
  // Show RSVP button
}
```

#### 5. EventRSVPButton.tsx
```tsx
// RSVP action button with dropdown
// Features:
// - Going / Maybe / Not Going options
// - Add notes (optional)
// - Remove RSVP
// - Disabled if event full

import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { rsvpToEvent, removeRSVP } from '@/services/events';

export function EventRSVPButton({ event, currentStatus }) {
  // Show dropdown with RSVP options
  // Handle RSVP submit
  // Show notes dialog (optional)
}
```

#### 6. EventParticipantList.tsx
```tsx
// List of participants with avatars
// Features:
// - Show going/maybe separately
// - Avatar grid
// - Tooltip with user info
// - Check-in status (for organizer)

import { useEventParticipants } from '@/hooks/use-events';
import { Avatar } from '@/components/ui/avatar';

export function EventParticipantList({ eventId, isOrganizer }) {
  const { participants } = useEventParticipants(eventId);

  // Group by status
  // Show avatars in grid
  // Add check-in functionality for organizers
}
```

#### 7. EventFilters.tsx
```tsx
// Filter controls for calendar view
// Features:
// - Event type select
// - Date range picker
// - Location radius slider
// - "My events only" checkbox

import { Select } from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-range-picker';

export function EventFilters({ filters, onFiltersChange }) {
  // Emit filter changes to parent
  // Use Select for event type
  // Use DateRangePicker for date range
}
```

---

### Custom Hooks Needed

#### `/src/hooks/use-events.ts`
```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEvents, getEventById, createEvent, updateEvent, deleteEvent } from '@/services/events';
import { rsvpToEvent, getEventParticipants } from '@/services/events';

export function useEvents(filters) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: () => getEvents(filters),
  });
}

export function useEventDetails(eventId) {
  return useQuery({
    queryKey: ['events', eventId],
    queryFn: () => getEventById(eventId),
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEvent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  });
}

export function useRSVP() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, userId, status }) => rsvpToEvent(eventId, userId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events', variables.eventId] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useEventParticipants(eventId) {
  return useQuery({
    queryKey: ['events', eventId, 'participants'],
    queryFn: () => getEventParticipants(eventId),
  });
}
```

---

### Routing

#### Add to `/src/routes/index.tsx`
```tsx
import EventCalendar from '@/pages/EventCalendar';
import EventDetailView from '@/pages/EventDetailView';

// In routes array:
{
  path: '/events',
  element: <EventCalendar />
},
{
  path: '/events/:eventId',
  element: <EventDetailView />
}
```

---

### Page Components

#### `/src/pages/EventCalendar.tsx`
```tsx
import { EventCalendar } from '@/components/events/EventCalendar';
import { MainLayout } from '@/components/layout/MainLayout';

export default function EventCalendarPage() {
  return (
    <MainLayout>
      <EventCalendar />
    </MainLayout>
  );
}
```

#### `/src/pages/EventDetailView.tsx`
```tsx
import { EventDetailView } from '@/components/events/EventDetailView';
import { MainLayout } from '@/components/layout/MainLayout';

export default function EventDetailPage() {
  return (
    <MainLayout>
      <EventDetailView />
    </MainLayout>
  );
}
```

---

## ⏭️ NEXT PHASE (Week 2)

### Option B: Barry Event Q&A
- Add event queries to Barry AI
- "What events are coming up?"
- "Are there any trips near me?"
- "Who's attending the Adelaide trip?"
- Uses existing event service layer
- Pure Q&A (reactive, not proactive)

---

## 📝 TESTING CHECKLIST

Before deploying to production:

- [ ] Create event successfully
- [ ] Edit event (organizer only)
- [ ] Cancel event
- [ ] RSVP to event (going/maybe/not going)
- [ ] Change RSVP status
- [ ] Remove RSVP
- [ ] View event full when max participants reached
- [ ] Waitlist functionality
- [ ] Filter events by type
- [ ] Search events
- [ ] View nearby events (if location enabled)
- [ ] Private events only visible to participants
- [ ] RLS policies prevent unauthorized access
- [ ] Mobile responsive

---

## 🚀 DEPLOYMENT NOTES

1. **Migration applied**: ✅ Already done
2. **Service layer**: ✅ Complete
3. **UI components**: 🚧 In progress (1/7 complete)
4. **Routing**: ❌ Not added yet
5. **Navigation**: ❌ Not added yet

**Estimated Completion**: 2-3 more days for full Event Calendar UI
