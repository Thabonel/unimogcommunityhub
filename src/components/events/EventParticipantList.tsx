// EventParticipantList - Display list of event participants with avatars
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Clock, User } from 'lucide-react';
import { useEventParticipants, useCheckInParticipant } from '@/hooks/use-events';
import type { EventParticipant } from '@/services/events';

interface EventParticipantListProps {
  eventId: string;
  isOrganizer?: boolean;
}

export function EventParticipantList({ eventId, isOrganizer = false }: EventParticipantListProps) {
  const { data: participants, isLoading } = useEventParticipants(eventId);
  const checkIn = useCheckInParticipant();

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading participants...</div>;
  }

  if (!participants || participants.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            No participants yet. Be the first to RSVP!
          </p>
        </CardContent>
      </Card>
    );
  }

  const going = participants.filter((p) => p.status === 'going');
  const maybe = participants.filter((p) => p.status === 'maybe');
  const waitlist = participants.filter((p) => p.status === 'waitlist');

  const handleCheckIn = async (userId: string) => {
    await checkIn.mutateAsync({ eventId, userId });
  };

  const renderParticipant = (
    participant: EventParticipant & {
      user: { id: string; full_name: string | null; avatar_url: string | null } | null;
    }
  ) => {
    const userName = participant.user?.full_name || 'Unknown User';
    const userInitial = userName.charAt(0).toUpperCase();

    return (
      <TooltipProvider key={participant.user_id}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative inline-block">
              <Avatar className="h-10 w-10 border-2 border-background">
                <AvatarImage src={participant.user?.avatar_url || undefined} />
                <AvatarFallback>{userInitial}</AvatarFallback>
              </Avatar>
              {participant.checked_in && (
                <CheckCircle2 className="absolute -bottom-1 -right-1 h-4 w-4 text-green-600 bg-background rounded-full" />
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              <p className="font-medium">{userName}</p>
              {participant.notes && (
                <p className="text-xs text-muted-foreground">{participant.notes}</p>
              )}
              {participant.can_provide && participant.can_provide.length > 0 && (
                <p className="text-xs">
                  <span className="font-medium">Can provide:</span>{' '}
                  {participant.can_provide.join(', ')}
                </p>
              )}
              {isOrganizer && !participant.checked_in && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => handleCheckIn(participant.user_id)}
                  disabled={checkIn.isPending}
                >
                  Check In
                </Button>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="space-y-4">
      {/* Going */}
      {going.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Going ({going.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">{going.map(renderParticipant)}</div>
          </CardContent>
        </Card>
      )}

      {/* Maybe */}
      {maybe.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-600" />
              Maybe ({maybe.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">{maybe.map(renderParticipant)}</div>
          </CardContent>
        </Card>
      )}

      {/* Waitlist */}
      {waitlist.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              Waitlist ({waitlist.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">{waitlist.map(renderParticipant)}</div>
            <p className="text-xs text-muted-foreground mt-3">
              Waitlist participants will be notified if spots become available
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
