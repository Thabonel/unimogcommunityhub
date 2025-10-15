// EventCard - Display individual event in card format

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  AlertCircle,
  Wrench,
  Coffee,
  Car,
  Heart,
} from 'lucide-react';
import type { EventWithDetails, EventType } from '@/services/events';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface EventCardProps {
  event: EventWithDetails;
  showRSVPButton?: boolean;
  compact?: boolean;
}

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

export function EventCard({ event, showRSVPButton = true, compact = false }: EventCardProps) {
  const config = eventTypeConfig[event.event_type];
  const Icon = config.icon;

  const startDate = new Date(event.start_date);
  const endDate = event.end_date ? new Date(event.end_date) : null;

  const isUpcoming = event.status === 'upcoming';
  const isFull = event.is_full;

  // Calculate spots remaining
  const spotsRemaining = event.max_participants
    ? event.max_participants - event.participant_count
    : null;

  return (
    <Card className={`hover:shadow-md transition-shadow ${compact ? 'h-full' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className={`${config.color} p-1.5 rounded-md`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
              <Badge variant="secondary" className="text-xs">
                {config.label}
              </Badge>
              {event.is_barry_suggested && (
                <Badge variant="outline" className="text-xs">
                  Barry Suggested
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg">
              <Link
                to={`/events/${event.id}`}
                className="hover:underline"
              >
                {event.title}
              </Link>
            </CardTitle>
          </div>

          {event.user_rsvp_status && (
            <Badge
              variant={event.user_rsvp_status === 'going' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {event.user_rsvp_status === 'going' && 'Going'}
              {event.user_rsvp_status === 'maybe' && 'Maybe'}
              {event.user_rsvp_status === 'waitlist' && 'Waitlist'}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Date & Time */}
        <div className="flex items-start gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="font-medium">{format(startDate, 'EEEE, MMMM d, yyyy')}</p>
            <p className="text-muted-foreground text-xs">
              {format(startDate, 'h:mm a')}
              {endDate && ` - ${format(endDate, 'h:mm a')}`}
            </p>
          </div>
        </div>

        {/* Location */}
        {event.location_name && (
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">{event.location_name}</p>
              {event.location_address && (
                <p className="text-muted-foreground text-xs">{event.location_address}</p>
              )}
              {event.distance_km !== undefined && (
                <p className="text-muted-foreground text-xs">
                  {event.distance_km.toFixed(1)} km away
                </p>
              )}
            </div>
          </div>
        )}

        {/* Participants */}
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          <div className="flex items-center gap-1.5">
            <span className="font-medium">{event.participant_count}</span>
            <span className="text-muted-foreground">
              {event.going_count > 0 && `(${event.going_count} going`}
              {event.maybe_count > 0 && `, ${event.maybe_count} maybe)`}
              {event.going_count === 0 && event.maybe_count === 0 && 'participants'}
            </span>
            {event.max_participants && (
              <>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground text-xs">
                  {isFull ? (
                    <span className="text-red-600 font-medium">Full</span>
                  ) : (
                    `${spotsRemaining} spots left`
                  )}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Organizer */}
        {event.organizer && (
          <div className="flex items-center gap-2 pt-2 border-t">
            <Avatar className="h-6 w-6">
              <AvatarImage src={event.organizer.avatar_url || undefined} />
              <AvatarFallback className="text-xs">
                {event.organizer.full_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">
              Organized by{' '}
              <span className="font-medium">{event.organizer.full_name || 'User'}</span>
            </span>
          </div>
        )}

        {/* Description (truncated in compact mode) */}
        {!compact && event.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
        )}

        {/* RSVP Button */}
        {showRSVPButton && isUpcoming && !isFull && (
          <div className="pt-2">
            <Button asChild className="w-full" size="sm">
              <Link to={`/events/${event.id}`}>
                {event.user_rsvp_status ? 'View Details' : 'RSVP'}
              </Link>
            </Button>
          </div>
        )}

        {isFull && isUpcoming && (
          <div className="pt-2">
            <Button variant="secondary" disabled className="w-full" size="sm">
              Event Full
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
