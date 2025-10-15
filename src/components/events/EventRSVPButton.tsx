// EventRSVPButton - RSVP action button with all edge cases handled
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, UserX, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRSVP, useRemoveRSVP } from '@/hooks/use-events';
import type { EventWithDetails, RSVPStatus } from '@/services/events';

interface EventRSVPButtonProps {
  event: EventWithDetails;
}

export function EventRSVPButton({ event }: EventRSVPButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const rsvpMutation = useRSVP();
  const removeRSVPMutation = useRemoveRSVP();

  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<RSVPStatus | null>(null);
  const [notes, setNotes] = useState('');

  // Edge Case 1: Not logged in
  if (!user) {
    return (
      <Button
        onClick={() => navigate('/login')}
        className="w-full bg-military-green hover:bg-military-green/90"
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Sign Up to RSVP
      </Button>
    );
  }

  const currentStatus = event.user_rsvp_status;
  const isOrganizer = event.organizer_id === user.id;

  // Edge Case 2: User is the organizer
  if (isOrganizer) {
    return (
      <div className="w-full">
        <Badge variant="outline" className="w-full justify-center py-2">
          <UserPlus className="h-4 w-4 mr-2" />
          You are the organizer
        </Badge>
      </div>
    );
  }

  // Edge Case 3: Event is full and user hasn't RSVP'd
  const isFull = event.is_full;
  if (isFull && !currentStatus) {
    return (
      <Button
        onClick={() => handleRSVP('waitlist')}
        variant="outline"
        className="w-full"
        disabled={rsvpMutation.isPending}
      >
        <Clock className="h-4 w-4 mr-2" />
        {rsvpMutation.isPending ? 'Joining Waitlist...' : 'Join Waitlist'}
      </Button>
    );
  }

  // Edge Case 4: User is on waitlist
  if (currentStatus === 'waitlist') {
    return (
      <div className="space-y-2">
        <Badge variant="secondary" className="w-full justify-center py-2">
          <Clock className="h-4 w-4 mr-2" />
          You're on the waitlist
        </Badge>
        <Button
          onClick={() => handleRemoveRSVP()}
          variant="outline"
          size="sm"
          className="w-full"
          disabled={removeRSVPMutation.isPending}
        >
          Leave Waitlist
        </Button>
      </div>
    );
  }

  const handleRSVP = async (status: RSVPStatus, withNotes: boolean = false) => {
    if (withNotes) {
      setSelectedStatus(status);
      setNotesDialogOpen(true);
      return;
    }

    await rsvpMutation.mutateAsync({
      eventId: event.id,
      userId: user.id,
      status,
      notes: notes || undefined,
    });

    // Reset notes after successful RSVP
    setNotes('');
    setNotesDialogOpen(false);
    setSelectedStatus(null);
  };

  const handleRemoveRSVP = async () => {
    await removeRSVPMutation.mutateAsync({
      eventId: event.id,
      userId: user.id,
    });
  };

  const handleNotesSubmit = async () => {
    if (selectedStatus) {
      await handleRSVP(selectedStatus, false);
    }
  };

  // Show current status and allow changes
  if (currentStatus && currentStatus !== 'waitlist') {
    return (
      <div className="space-y-2">
        {/* Current Status Badge */}
        <Badge
          variant={currentStatus === 'going' ? 'default' : 'secondary'}
          className="w-full justify-center py-2"
        >
          {currentStatus === 'going' && <CheckCircle2 className="h-4 w-4 mr-2" />}
          {currentStatus === 'maybe' && <Clock className="h-4 w-4 mr-2" />}
          {currentStatus === 'not_going' && <UserX className="h-4 w-4 mr-2" />}
          {currentStatus === 'going' && "You're going"}
          {currentStatus === 'maybe' && "You might go"}
          {currentStatus === 'not_going' && "You're not going"}
        </Badge>

        {/* Change RSVP Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full" size="sm">
              Change RSVP
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem
              onClick={() => handleRSVP('going')}
              disabled={rsvpMutation.isPending || currentStatus === 'going'}
            >
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
              Going
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleRSVP('maybe')}
              disabled={rsvpMutation.isPending || currentStatus === 'maybe'}
            >
              <Clock className="h-4 w-4 mr-2 text-amber-600" />
              Maybe
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleRSVP('not_going')}
              disabled={rsvpMutation.isPending || currentStatus === 'not_going'}
            >
              <UserX className="h-4 w-4 mr-2 text-red-600" />
              Not Going
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleRemoveRSVP}
              disabled={removeRSVPMutation.isPending}
              className="text-destructive"
            >
              <UserX className="h-4 w-4 mr-2" />
              Remove RSVP
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // No current RSVP - show options
  return (
    <>
      <div className="space-y-2">
        <Button
          onClick={() => handleRSVP('going')}
          className="w-full bg-military-green hover:bg-military-green/90"
          disabled={rsvpMutation.isPending}
        >
          <CheckCircle2 className="h-4 w-4 mr-2" />
          {rsvpMutation.isPending ? 'Saving...' : 'I\'m Going'}
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => handleRSVP('maybe')}
            variant="outline"
            disabled={rsvpMutation.isPending}
          >
            <Clock className="h-4 w-4 mr-2" />
            Maybe
          </Button>
          <Button
            onClick={() => handleRSVP('not_going')}
            variant="outline"
            disabled={rsvpMutation.isPending}
          >
            <UserX className="h-4 w-4 mr-2" />
            Can't Go
          </Button>
        </div>
      </div>

      {/* Notes Dialog */}
      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a Note (Optional)</DialogTitle>
            <DialogDescription>
              Let the organizer know if you have any questions or special requirements
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Your Note</Label>
              <Textarea
                id="notes"
                placeholder="E.g., I can bring recovery gear, or I have dietary restrictions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setNotesDialogOpen(false);
                setNotes('');
                setSelectedStatus(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleNotesSubmit}
              disabled={rsvpMutation.isPending}
              className="bg-military-green hover:bg-military-green/90"
            >
              {rsvpMutation.isPending ? 'Saving...' : 'Confirm RSVP'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
