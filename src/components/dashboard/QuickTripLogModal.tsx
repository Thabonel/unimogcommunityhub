import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Map, CloudOff, Sparkles } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useOfflineQueue } from '@/hooks/useOfflineQueue';
import { useAuth } from '@/contexts/AuthContext';
import { useVehicles } from '@/hooks/vehicle-maintenance/use-vehicles';

const TRIP_TYPES = [
  { value: 'on-road', label: 'On-Road' },
  { value: 'off-road', label: 'Off-Road' },
  { value: 'mixed', label: 'Mixed' },
] as const;

const quickTripSchema = z.object({
  trip_name: z.string().min(1, 'Trip name is required'),
  trip_type: z.enum(['on-road', 'off-road', 'mixed']),
  distance_km: z.number().min(0, 'Distance must be 0 or more').optional(),
  notes: z.string().optional(),
});

type QuickTripValues = z.infer<typeof quickTripSchema>;

interface QuickTripLogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const INSIGHTS = [
  "Every trip adds to your Unimog's story!",
  "Adventure logged - memories captured!",
  "Another journey documented.",
  "Building your expedition history.",
  "Your travels, preserved forever.",
  "Keep exploring, keep logging!",
  "The road ahead thanks you.",
  "Adventure awaits - and so does your log!",
];

export function QuickTripLogModal({
  open,
  onOpenChange,
  onSuccess,
}: QuickTripLogModalProps) {
  const { user } = useAuth();
  const { vehicles, isLoading: vehiclesLoading } = useVehicles(user?.id);
  const { addTripLog, isOnline } = useOfflineQueue();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [insight, setInsight] = useState('');

  const primaryVehicle = vehicles?.[0];

  const form = useForm<QuickTripValues>({
    resolver: zodResolver(quickTripSchema),
    defaultValues: {
      trip_name: '',
      trip_type: 'on-road',
      distance_km: undefined,
      notes: '',
    },
  });

  useEffect(() => {
    if (open && primaryVehicle) {
      setSelectedVehicleId(primaryVehicle.id);
    }
  }, [open, primaryVehicle]);

  const handleSubmit = async (data: QuickTripValues) => {
    if (!selectedVehicleId || !user?.id) {
      toast.error('Please select a vehicle');
      return;
    }

    setIsSubmitting(true);

    try {
      await addTripLog(
        {
          vehicle_id: selectedVehicleId,
          trip_name: data.trip_name,
          start_time: new Date().toISOString(),
          trip_type: data.trip_type,
          distance_km: data.distance_km,
          notes: data.notes,
          tracking_method: 'manual',
        },
        user.id,
        selectedVehicleId
      );

      const randomInsight = INSIGHTS[Math.floor(Math.random() * INSIGHTS.length)];
      setInsight(randomInsight);
      setShowSuccess(true);

      if (!isOnline) {
        toast.success('Trip saved locally', {
          description: "Will sync when you're back online",
          icon: <CloudOff className="h-4 w-4" />,
        });
      } else {
        toast.success('Trip logged!', {
          description: randomInsight,
          icon: <Sparkles className="h-4 w-4" />,
        });
      }

      setTimeout(() => {
        setShowSuccess(false);
        onOpenChange(false);
        form.reset();
        onSuccess?.();
      }, 1500);
    } catch (error) {
      toast.error('Failed to save trip');
      console.error('Trip log error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4 animate-in zoom-in-50 duration-300">
              <Sparkles className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-green-600 mb-2">
              Logged!
            </h3>
            <p className="text-muted-foreground">{insight}</p>
            {!isOnline && (
              <div className="mt-4 flex items-center gap-2 text-sm text-amber-600">
                <CloudOff className="h-4 w-4" />
                <span>Will sync when online</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Map className="h-5 w-5 text-green-500" />
            Quick Trip Log
          </DialogTitle>
          <DialogDescription>
            {!isOnline && (
              <span className="flex items-center gap-1 text-amber-600">
                <CloudOff className="h-3 w-3" />
                Offline mode - will sync later
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {/* Vehicle selector (only if multiple) */}
          {vehicles && vehicles.length > 1 && (
            <div className="space-y-2">
              <Label>Vehicle</Label>
              <Select
                value={selectedVehicleId}
                onValueChange={setSelectedVehicleId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Trip name */}
          <div className="space-y-2">
            <Label htmlFor="trip_name">Trip Name</Label>
            <Input
              id="trip_name"
              placeholder="e.g., Weekend trail run"
              {...form.register('trip_name')}
              className={cn(
                form.formState.errors.trip_name && 'border-red-500'
              )}
            />
            {form.formState.errors.trip_name && (
              <p className="text-xs text-red-500">
                {form.formState.errors.trip_name.message}
              </p>
            )}
          </div>

          {/* Trip type */}
          <div className="space-y-2">
            <Label>Trip Type</Label>
            <Select
              value={form.watch('trip_type')}
              onValueChange={(value: 'on-road' | 'off-road' | 'mixed') =>
                form.setValue('trip_type', value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select trip type" />
              </SelectTrigger>
              <SelectContent>
                {TRIP_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Distance */}
          <div className="space-y-2">
            <Label htmlFor="distance_km">Distance (km) - optional</Label>
            <Input
              id="distance_km"
              type="number"
              step="0.1"
              placeholder="0"
              {...form.register('distance_km', { valueAsNumber: true })}
              className={cn(
                form.formState.errors.distance_km && 'border-red-500'
              )}
            />
            {form.formState.errors.distance_km && (
              <p className="text-xs text-red-500">
                {form.formState.errors.distance_km.message}
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any details about your trip..."
              {...form.register('notes')}
              className="min-h-[60px]"
            />
          </div>

          {/* Submit button */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-green-500 hover:bg-green-600"
              disabled={isSubmitting || vehiclesLoading}
            >
              {isSubmitting ? 'Saving...' : 'Log Trip'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
