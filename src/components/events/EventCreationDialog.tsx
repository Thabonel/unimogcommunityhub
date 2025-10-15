// EventCreationDialog - Modal dialog for creating/editing events
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EventCreationForm } from './EventCreationForm';
import { useCreateEvent, useUpdateEvent } from '@/hooks/use-events';
import { useAuth } from '@/contexts/AuthContext';
import type { Event, EventFormData } from '@/services/events';

interface EventCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: Event;
}

export function EventCreationDialog({ open, onOpenChange, event }: EventCreationDialogProps) {
  const { user } = useAuth();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();

  const handleSubmit = async (formData: EventFormData) => {
    if (!user) {
      throw new Error('You must be logged in to create events');
    }

    if (event) {
      await updateEvent.mutateAsync({ eventId: event.id, formData });
    } else {
      await createEvent.mutateAsync({ formData, userId: user.id });
    }
  };

  const handleSuccess = () => {
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'Create New Event'}</DialogTitle>
          <DialogDescription>
            {event
              ? 'Update the details of your event below.'
              : 'Fill in the details to create a new community event.'}
          </DialogDescription>
        </DialogHeader>
        <EventCreationForm
          event={event}
          onSubmit={handleSubmit}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          isLoading={createEvent.isPending || updateEvent.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
