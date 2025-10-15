// EventDetailView - Full event details page with map and RSVP
import { useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  MapPin,
  Users,
  Clock,
  AlertCircle,
  Wrench,
  Coffee,
  Car,
  Edit,
  Trash2,
  Gauge,
  PackageCheck,
} from 'lucide-react';
import { useEventDetails } from '@/hooks/use-events';
import { EventRSVPButton } from './EventRSVPButton';
import { EventParticipantList } from './EventParticipantList';
import { useAuth } from '@/contexts/AuthContext';
import { useDeleteEvent } from '@/hooks/use-events';
import type { EventType } from '@/services/events';

const eventTypeConfig: Record<
  EventType,
  { icon: React.ElementType; color: string; label: string }
> = {
  trip: { icon: Car, color: 'bg-blue-500', label: 'Trip' },
  working_bee: { icon: Wrench, color: 'bg-amber-500', label: 'Working Bee' },
  social: { icon: Coffee, color: 'bg-green-500', label: 'Social' },
  emergency_help: { icon: AlertCircle, color: 'bg-red-500', label: 'Emergency' },
  meetup: { icon: Users, color: 'bg-purple-500', label: 'Meetup' },
};

export function EventDetailView() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: event, isLoading, error } = useEventDetails(eventId);
  const deleteEvent = useDeleteEvent();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  // Initialize map if event has location
  useEffect(() => {
    if (!event || !event.location_lat || !event.location_lng) return;
    if (map.current) return; // Map already initialized

    const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    if (!mapboxToken) {
      console.warn('Mapbox token not found');
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: [event.location_lng, event.location_lat],
        zoom: 12,
      });

      // Add marker for event location
      new mapboxgl.Marker({ color: '#4A5D23' })
        .setLngLat([event.location_lng, event.location_lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<div class="p-2">
              <h3 class="font-semibold">${event.location_name || 'Event Location'}</h3>
              ${event.location_address ? `<p class="text-sm text-muted-foreground">${event.location_address}</p>` : ''}
            </div>`
          )
        )
        .addTo(map.current);

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [event]);

  const handleDelete = async () => {
    if (!event || !confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    await deleteEvent.mutateAsync(event.id);
    navigate('/events');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sand-beige flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-military-green"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-sand-beige">
        <div className="container py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 mx-auto text-red-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Event Not Found</h3>
                <p className="text-muted-foreground mb-6">
                  This event may have been deleted or you don't have permission to view it.
                </p>
                <Button onClick={() => navigate('/events')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Events
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const config = eventTypeConfig[event.event_type];
  const Icon = config.icon;
  const isOrganizer = user?.id === event.organizer_id;
  const startDate = new Date(event.start_date);
  const endDate = event.end_date ? new Date(event.end_date) : null;

  return (
    <div className="min-h-screen bg-sand-beige">
      <div className="container py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/events')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Event Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`${config.color} p-2 rounded-md`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <Badge variant="secondary">{config.label}</Badge>
                      {event.is_barry_suggested && (
                        <Badge variant="outline">Barry Suggested</Badge>
                      )}
                      {event.is_full && (
                        <Badge variant="destructive">Full</Badge>
                      )}
                    </div>
                    <h1 className="text-3xl font-bold mb-2">{event.title}</h1>

                    {/* Date & Time */}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{format(startDate, 'EEEE, MMMM d, yyyy')}</span>
                      <span>•</span>
                      <Clock className="h-4 w-4" />
                      <span>
                        {format(startDate, 'h:mm a')}
                        {endDate && ` - ${format(endDate, 'h:mm a')}`}
                      </span>
                    </div>
                  </div>

                  {/* Organizer Actions */}
                  {isOrganizer && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                        disabled={deleteEvent.isPending}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
            </Card>

            {/* Description */}
            {event.description && (
              <Card>
                <CardHeader>
                  <CardTitle>About This Event</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-muted-foreground">
                    {event.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Location & Map */}
            {(event.location_name || event.location_address) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {event.location_name && (
                    <div>
                      <h4 className="font-semibold">{event.location_name}</h4>
                      {event.location_address && (
                        <p className="text-sm text-muted-foreground">
                          {event.location_address}
                        </p>
                      )}
                    </div>
                  )}

                  {event.location_lat && event.location_lng && (
                    <div
                      ref={mapContainer}
                      className="w-full h-64 rounded-lg overflow-hidden"
                    />
                  )}
                </CardContent>
              </Card>
            )}

            {/* Event Requirements */}
            {(event.difficulty_level ||
              event.vehicle_requirements ||
              event.requirements ||
              event.what_to_bring) && (
              <Card>
                <CardHeader>
                  <CardTitle>Requirements & Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {event.difficulty_level && (
                    <div className="flex items-start gap-2">
                      <Gauge className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Difficulty Level</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {event.difficulty_level}
                        </p>
                      </div>
                    </div>
                  )}

                  {event.vehicle_requirements && (
                    <div className="flex items-start gap-2">
                      <Car className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Vehicle Requirements</p>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {event.vehicle_requirements}
                        </p>
                      </div>
                    </div>
                  )}

                  {event.what_to_bring && (
                    <div className="flex items-start gap-2">
                      <PackageCheck className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">What to Bring</p>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {event.what_to_bring}
                        </p>
                      </div>
                    </div>
                  )}

                  {event.requirements && (
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Additional Requirements</p>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {event.requirements}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Participants */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Participants ({event.participant_count})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EventParticipantList eventId={event.id} isOrganizer={isOrganizer} />
              </CardContent>
            </Card>
          </div>

          {/* Right Column: RSVP & Organizer Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* RSVP Card */}
            <Card>
              <CardHeader>
                <CardTitle>RSVP</CardTitle>
              </CardHeader>
              <CardContent>
                <EventRSVPButton event={event} />

                {event.max_participants && (
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>
                      {event.participant_count} / {event.max_participants} spots filled
                    </p>
                    {!event.is_full && (
                      <p className="text-xs mt-1">
                        {event.max_participants - event.participant_count} spots remaining
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Organizer Info */}
            {event.organizer && (
              <Card>
                <CardHeader>
                  <CardTitle>Organized By</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={event.organizer.avatar_url || undefined} />
                      <AvatarFallback>
                        {event.organizer.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Link
                        to={`/profile/${event.organizer_id}`}
                        className="font-medium hover:underline"
                      >
                        {event.organizer.full_name || 'Unimog Owner'}
                      </Link>
                      <p className="text-xs text-muted-foreground">Event Organizer</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Event Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Event Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'}>
                    {event.status}
                  </Badge>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Visibility</span>
                  <span className="capitalize">{event.visibility}</span>
                </div>
                {event.estimated_duration_hours && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span>{event.estimated_duration_hours} hours</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
