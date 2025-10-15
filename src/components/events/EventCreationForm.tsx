// EventCreationForm - Form for creating/editing events
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Event, EventFormData, EventType } from '@/services/events';

const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  event_type: z.enum(['trip', 'working_bee', 'social', 'emergency_help', 'meetup']),
  start_date: z.date({
    required_error: 'Start date is required',
  }),
  end_date: z.date().optional(),
  location_name: z.string().optional(),
  location_address: z.string().optional(),
  location_lat: z.number().optional(),
  location_lng: z.number().optional(),
  max_participants: z.number().positive().optional(),
  vehicle_requirements: z.string().optional(),
  difficulty_level: z.enum(['easy', 'moderate', 'difficult', 'extreme']).optional(),
  estimated_duration_hours: z.number().positive().optional(),
  meeting_point: z.string().optional(),
  requirements: z.string().optional(),
  what_to_bring: z.string().optional(),
  visibility: z.enum(['public', 'private', 'friends_only']).default('public'),
  allow_waitlist: z.boolean().default(true),
});

interface EventCreationFormProps {
  event?: Event;
  onSuccess: () => void;
  onCancel: () => void;
  onSubmit: (data: EventFormData) => Promise<void>;
  isLoading?: boolean;
}

const EVENT_TYPE_OPTIONS: Array<{ value: EventType; label: string; description: string }> = [
  { value: 'trip', label: 'Trip', description: 'Off-road adventure or expedition' },
  { value: 'working_bee', label: 'Working Bee', description: 'Group maintenance or project' },
  { value: 'social', label: 'Social', description: 'Casual meetup or gathering' },
  { value: 'emergency_help', label: 'Emergency Help', description: 'Urgent assistance needed' },
  { value: 'meetup', label: 'Meetup', description: 'General community gathering' },
];

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'difficult', label: 'Difficult' },
  { value: 'extreme', label: 'Extreme' },
];

const VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public', description: 'Anyone can see and join' },
  { value: 'private', label: 'Private', description: 'Invitation only' },
  { value: 'friends_only', label: 'Friends Only', description: 'Only your connections can see' },
];

export function EventCreationForm({
  event,
  onSuccess,
  onCancel,
  onSubmit,
  isLoading = false,
}: EventCreationFormProps) {
  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: event
      ? {
          title: event.title,
          description: event.description || '',
          event_type: event.event_type,
          start_date: new Date(event.start_date),
          end_date: event.end_date ? new Date(event.end_date) : undefined,
          location_name: event.location_name || '',
          location_address: event.location_address || '',
          location_lat: event.location_lat || undefined,
          location_lng: event.location_lng || undefined,
          max_participants: event.max_participants || undefined,
          vehicle_requirements: event.vehicle_requirements || '',
          difficulty_level: event.difficulty_level || undefined,
          estimated_duration_hours: event.estimated_duration_hours || undefined,
          meeting_point: event.meeting_point || '',
          requirements: event.requirements || '',
          what_to_bring: event.what_to_bring || '',
          visibility: event.visibility,
          allow_waitlist: event.allow_waitlist,
        }
      : {
          visibility: 'public',
          allow_waitlist: true,
        },
  });

  const handleSubmit = async (data: z.infer<typeof eventSchema>) => {
    const formData: EventFormData = {
      title: data.title,
      description: data.description || null,
      event_type: data.event_type,
      start_date: data.start_date.toISOString(),
      end_date: data.end_date?.toISOString() || null,
      location_name: data.location_name || null,
      location_address: data.location_address || null,
      location_lat: data.location_lat || null,
      location_lng: data.location_lng || null,
      max_participants: data.max_participants || null,
      vehicle_requirements: data.vehicle_requirements || null,
      difficulty_level: data.difficulty_level || null,
      estimated_duration_hours: data.estimated_duration_hours || null,
      meeting_point: data.meeting_point || null,
      requirements: data.requirements || null,
      what_to_bring: data.what_to_bring || null,
      visibility: data.visibility,
      allow_waitlist: data.allow_waitlist,
    };

    await onSubmit(formData);
    onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="Weekend trip to Flinders Ranges" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your event, what to expect, and any important details..."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Event Type */}
        <FormField
          control={form.control}
          name="event_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {EVENT_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {option.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Start Date */}
        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date & Time</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                When does your event start?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* End Date */}
        <FormField
          control={form.control}
          name="end_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End Date (Optional)</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                For multi-day events
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location Name */}
        <FormField
          control={form.control}
          name="location_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location Name</FormLabel>
              <FormControl>
                <Input placeholder="Flinders Ranges National Park" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location Address */}
        <FormField
          control={form.control}
          name="location_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location Address</FormLabel>
              <FormControl>
                <Input placeholder="Wilpena Pound Rd, Hawker SA 5434" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Max Participants */}
        <FormField
          control={form.control}
          name="max_participants"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Participants (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="10"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                />
              </FormControl>
              <FormDescription>
                Leave empty for unlimited participants
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Difficulty Level */}
        <FormField
          control={form.control}
          name="difficulty_level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty Level (Optional)</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {DIFFICULTY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Vehicle Requirements */}
        <FormField
          control={form.control}
          name="vehicle_requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle Requirements (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="4WD with diff locks recommended, portal axles preferred..."
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* What to Bring */}
        <FormField
          control={form.control}
          name="what_to_bring"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What to Bring (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Recovery gear, camping equipment, spare parts..."
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Visibility */}
        <FormField
          control={form.control}
          name="visibility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Visibility</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {VISIBILITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {option.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Allow Waitlist */}
        <FormField
          control={form.control}
          name="allow_waitlist"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Enable Waitlist</FormLabel>
                <FormDescription>
                  Allow users to join a waitlist when event is full
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
