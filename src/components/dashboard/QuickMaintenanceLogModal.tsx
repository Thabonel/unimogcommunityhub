import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Wrench, CloudOff, Sparkles, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useOfflineQueue } from '@/hooks/useOfflineQueue';
import { useAuth } from '@/contexts/AuthContext';
import { useVehicles } from '@/hooks/vehicle-maintenance/use-vehicles';

const SERVICE_TYPES = [
  { value: 'oil_change', label: 'Oil Change' },
  { value: 'filter_replacement', label: 'Filter Replacement' },
  { value: 'brake_service', label: 'Brake Service' },
  { value: 'tire_rotation', label: 'Tire Rotation' },
  { value: 'inspection', label: 'Inspection' },
  { value: 'transmission', label: 'Transmission Service' },
  { value: 'coolant', label: 'Coolant Service' },
  { value: 'electrical', label: 'Electrical Work' },
  { value: 'suspension', label: 'Suspension Work' },
  { value: 'other', label: 'Other' },
];

const quickMaintenanceSchema = z.object({
  service_type: z.string().min(1, 'Select a service type'),
  description: z.string().min(1, 'Description is required'),
  cost: z.number().min(0, 'Cost must be 0 or more'),
  service_date: z.date(),
});

type QuickMaintenanceValues = z.infer<typeof quickMaintenanceSchema>;

interface QuickMaintenanceLogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const INSIGHTS = [
  "Proactive maintenance = happy Unimog!",
  "Well documented service history adds value.",
  "Your future self will thank you for this.",
  "Every service record tells a story.",
  "Maintenance logged - one less thing to remember.",
  "Building a complete ownership record.",
  "Smart owners track everything.",
  "This data will be gold for troubleshooting.",
];

export function QuickMaintenanceLogModal({
  open,
  onOpenChange,
  onSuccess,
}: QuickMaintenanceLogModalProps) {
  const { user } = useAuth();
  const { vehicles, isLoading: vehiclesLoading } = useVehicles(user?.id);
  const { addMaintenanceLog, isOnline } = useOfflineQueue();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [insight, setInsight] = useState('');

  const primaryVehicle = vehicles?.[0];

  const form = useForm<QuickMaintenanceValues>({
    resolver: zodResolver(quickMaintenanceSchema),
    defaultValues: {
      service_type: '',
      description: '',
      cost: 0,
      service_date: new Date(),
    },
  });

  useEffect(() => {
    if (open && primaryVehicle) {
      setSelectedVehicleId(primaryVehicle.id);
    }
  }, [open, primaryVehicle]);

  const handleSubmit = async (data: QuickMaintenanceValues) => {
    if (!selectedVehicleId || !user?.id) {
      toast.error('Please select a vehicle');
      return;
    }

    setIsSubmitting(true);

    try {
      await addMaintenanceLog(
        {
          vehicle_id: selectedVehicleId,
          service_date: data.service_date.toISOString(),
          service_type: data.service_type,
          description: data.description,
          cost: data.cost,
        },
        user.id,
        selectedVehicleId
      );

      const randomInsight = INSIGHTS[Math.floor(Math.random() * INSIGHTS.length)];
      setInsight(randomInsight);
      setShowSuccess(true);

      if (!isOnline) {
        toast.success('Service log saved locally', {
          description: 'Will sync when you\'re back online',
          icon: <CloudOff className="h-4 w-4" />,
        });
      } else {
        toast.success('Service logged!', {
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
      toast.error('Failed to save service log');
      console.error('Maintenance log error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4 animate-in zoom-in-50 duration-300">
              <Sparkles className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-blue-600 mb-2">
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
            <Wrench className="h-5 w-5 text-blue-500" />
            Quick Service Log
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

          {/* Service type */}
          <div className="space-y-2">
            <Label>Service Type</Label>
            <Select
              value={form.watch('service_type')}
              onValueChange={(value) => form.setValue('service_type', value)}
            >
              <SelectTrigger
                className={cn(
                  form.formState.errors.service_type && 'border-red-500'
                )}
              >
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.service_type && (
              <p className="text-xs text-red-500">
                {form.formState.errors.service_type.message}
              </p>
            )}
          </div>

          {/* Service date */}
          <div className="space-y-2">
            <Label>Service Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !form.watch('service_date') && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.watch('service_date') ? (
                    format(form.watch('service_date'), 'PPP')
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={form.watch('service_date')}
                  onSelect={(date) =>
                    form.setValue('service_date', date || new Date())
                  }
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What was done?"
              {...form.register('description')}
              className={cn(
                'min-h-[80px]',
                form.formState.errors.description && 'border-red-500'
              )}
            />
            {form.formState.errors.description && (
              <p className="text-xs text-red-500">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          {/* Cost */}
          <div className="space-y-2">
            <Label htmlFor="cost">Cost (EUR)</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              {...form.register('cost', { valueAsNumber: true })}
              className={cn(form.formState.errors.cost && 'border-red-500')}
            />
            {form.formState.errors.cost && (
              <p className="text-xs text-red-500">
                {form.formState.errors.cost.message}
              </p>
            )}
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
              className="flex-1 bg-blue-500 hover:bg-blue-600"
              disabled={isSubmitting || vehiclesLoading}
            >
              {isSubmitting ? 'Saving...' : 'Log Service'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
