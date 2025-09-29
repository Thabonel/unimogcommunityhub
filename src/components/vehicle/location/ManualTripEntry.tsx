import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';
import { MapPin, Clock, Fuel, Route } from 'lucide-react';
import { format } from 'date-fns';

const tripEntrySchema = z.object({
  trip_name: z.string().optional(),
  start_location: z.string().min(1, 'Start location is required'),
  end_location: z.string().min(1, 'End location is required'),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  distance_km: z.number().min(0.1, 'Distance must be at least 0.1 km'),
  trip_type: z.enum(['on-road', 'off-road', 'mixed', 'work-site', 'maintenance']),
  fuel_consumed_liters: z.number().optional(),
  notes: z.string().optional()
}).refine((data) => {
  const start = new Date(data.start_time);
  const end = new Date(data.end_time);
  return end > start;
}, {
  message: "End time must be after start time",
  path: ["end_time"]
});

type TripEntryForm = z.infer<typeof tripEntrySchema>;

interface ManualTripEntryProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleId: string;
  onTripAdded?: () => void;
}

export function ManualTripEntry({
  isOpen,
  onOpenChange,
  vehicleId,
  onTripAdded
}: ManualTripEntryProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<TripEntryForm>({
    resolver: zodResolver(tripEntrySchema),
    defaultValues: {
      start_time: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'),
      end_time: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'),
      trip_type: 'mixed',
      distance_km: 0
    }
  });

  const selectedTripType = watch('trip_type');
  const startTime = watch('start_time');
  const endTime = watch('end_time');
  const distance = watch('distance_km');

  // Calculate duration and average speed
  const calculateStats = () => {
    if (startTime && endTime && distance > 0) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

      if (durationHours > 0) {
        const averageSpeed = distance / durationHours;
        return {
          duration: durationHours * 60, // minutes
          averageSpeed: Math.round(averageSpeed * 10) / 10 // rounded to 1 decimal
        };
      }
    }
    return { duration: 0, averageSpeed: 0 };
  };

  const stats = calculateStats();

  const onSubmit = async (data: TripEntryForm) => {
    if (!user || !vehicleId) {
      toast.error('You must be logged in to add trips');
      return;
    }

    setIsSubmitting(true);
    try {
      const startDate = new Date(data.start_time);
      const endDate = new Date(data.end_time);

      const { error } = await supabase
        .from('trip_logs')
        .insert([
          {
            user_id: user.id,
            vehicle_id: vehicleId,
            trip_name: data.trip_name || `${data.start_location} to ${data.end_location}`,
            start_location: data.start_location,
            end_location: data.end_location,
            start_time: startDate.toISOString(),
            end_time: endDate.toISOString(),
            distance_km: data.distance_km,
            duration_minutes: stats.duration,
            trip_type: data.trip_type,
            tracking_method: 'manual',
            average_speed_kmh: stats.averageSpeed,
            fuel_consumed_liters: data.fuel_consumed_liters || null,
            notes: data.notes || null,
            is_active: false
          }
        ]);

      if (error) {
        console.error('Error adding trip:', error);
        toast.error('Failed to add trip');
        return;
      }

      toast.success('Trip added successfully');
      reset();
      onOpenChange(false);
      onTripAdded?.();
    } catch (error) {
      console.error('Error adding trip:', error);
      toast.error('Failed to add trip');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTripTypeIcon = (type: string) => {
    switch (type) {
      case 'on-road': return '🛣️';
      case 'off-road': return '🏞️';
      case 'work-site': return '🏗️';
      case 'maintenance': return '🔧';
      default: return '🚛';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Add Trip Manually
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Trip Name */}
          <div>
            <Label htmlFor="trip_name">Trip Name (Optional)</Label>
            <Input
              id="trip_name"
              {...register('trip_name')}
              placeholder="e.g., Morning commute, Off-road adventure"
            />
          </div>

          {/* Locations */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="start_location">From *</Label>
              <Input
                id="start_location"
                {...register('start_location')}
                placeholder="Starting location"
                className={errors.start_location ? 'border-red-500' : ''}
              />
              {errors.start_location && (
                <p className="text-sm text-red-500 mt-1">{errors.start_location.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="end_location">To *</Label>
              <Input
                id="end_location"
                {...register('end_location')}
                placeholder="Destination"
                className={errors.end_location ? 'border-red-500' : ''}
              />
              {errors.end_location && (
                <p className="text-sm text-red-500 mt-1">{errors.end_location.message}</p>
              )}
            </div>
          </div>

          {/* Time and Distance */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_time">Start Time *</Label>
              <Input
                id="start_time"
                type="datetime-local"
                {...register('start_time')}
                className={errors.start_time ? 'border-red-500' : ''}
              />
              {errors.start_time && (
                <p className="text-sm text-red-500 mt-1">{errors.start_time.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="end_time">End Time *</Label>
              <Input
                id="end_time"
                type="datetime-local"
                {...register('end_time')}
                className={errors.end_time ? 'border-red-500' : ''}
              />
              {errors.end_time && (
                <p className="text-sm text-red-500 mt-1">{errors.end_time.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="distance_km">Distance (km) *</Label>
              <Input
                id="distance_km"
                type="number"
                step="0.1"
                {...register('distance_km', { valueAsNumber: true })}
                className={errors.distance_km ? 'border-red-500' : ''}
              />
              {errors.distance_km && (
                <p className="text-sm text-red-500 mt-1">{errors.distance_km.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="fuel_consumed_liters">Fuel Used (L)</Label>
              <Input
                id="fuel_consumed_liters"
                type="number"
                step="0.1"
                {...register('fuel_consumed_liters', { valueAsNumber: true })}
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Trip Type */}
          <div>
            <Label htmlFor="trip_type">Trip Type *</Label>
            <Select
              value={selectedTripType}
              onValueChange={(value) => setValue('trip_type', value as any)}
            >
              <SelectTrigger className={errors.trip_type ? 'border-red-500' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="on-road">
                  🛣️ On-Road (highways, streets)
                </SelectItem>
                <SelectItem value="off-road">
                  🏞️ Off-Road (trails, fields)
                </SelectItem>
                <SelectItem value="mixed">
                  🚛 Mixed (both on/off road)
                </SelectItem>
                <SelectItem value="work-site">
                  🏗️ Work Site
                </SelectItem>
                <SelectItem value="maintenance">
                  🔧 Maintenance/Service
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.trip_type && (
              <p className="text-sm text-red-500 mt-1">{errors.trip_type.message}</p>
            )}
          </div>

          {/* Calculated Stats */}
          {stats.duration > 0 && (
            <div className="p-3 bg-muted rounded-lg">
              <h4 className="font-medium text-sm mb-2">Calculated Stats:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{Math.round(stats.duration)} minutes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Route className="h-3 w-3" />
                  <span>{stats.averageSpeed} km/h avg</span>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Additional notes about this trip..."
              className="min-h-[60px]"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Adding...' : 'Add Trip'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}