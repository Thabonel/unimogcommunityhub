import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Fuel, CloudOff, Sparkles, TrendingUp } from 'lucide-react';

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
import { Checkbox } from '@/components/ui/checkbox';
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

const quickFuelSchema = z.object({
  odometer: z.number().positive('Odometer must be positive'),
  fuel_amount: z.number().positive('Fuel amount must be positive'),
  fuel_price_per_unit: z.number().positive('Price must be positive'),
  full_tank: z.boolean(),
});

type QuickFuelValues = z.infer<typeof quickFuelSchema>;

interface QuickFuelLogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const INSIGHTS = [
  "You're tracking like a pro!",
  "Every log builds your vehicle's story.",
  "Consistent tracking = better maintenance predictions.",
  "Your Unimog thanks you for the attention.",
  "Another data point for the journey ahead.",
  "Building your vehicle's complete history.",
  "Smart tracking leads to smarter maintenance.",
  "You're on a roll - keep it up!",
];

export function QuickFuelLogModal({
  open,
  onOpenChange,
  onSuccess,
}: QuickFuelLogModalProps) {
  const { user } = useAuth();
  const { vehicles, isLoading: vehiclesLoading } = useVehicles(user?.id);
  const { addFuelLog, isOnline, getLastValues } = useOfflineQueue();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [lastOdometer, setLastOdometer] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [insight, setInsight] = useState('');

  const primaryVehicle = vehicles?.[0];

  const form = useForm<QuickFuelValues>({
    resolver: zodResolver(quickFuelSchema),
    defaultValues: {
      odometer: 0,
      fuel_amount: 0,
      fuel_price_per_unit: 0,
      full_tank: true,
    },
  });

  useEffect(() => {
    if (open && primaryVehicle) {
      setSelectedVehicleId(primaryVehicle.id);
      loadLastValues(primaryVehicle.id);
    }
  }, [open, primaryVehicle]);

  const loadLastValues = async (vehicleId: string) => {
    const lastValues = await getLastValues(vehicleId);
    if (lastValues) {
      setLastOdometer(lastValues.lastOdometer);
      form.setValue('odometer', lastValues.lastOdometer);
      form.setValue('fuel_price_per_unit', lastValues.lastFuelPrice);
    } else if (primaryVehicle) {
      setLastOdometer(primaryVehicle.current_odometer || 0);
      form.setValue('odometer', primaryVehicle.current_odometer || 0);
    }
  };

  const handleSubmit = async (data: QuickFuelValues) => {
    if (!selectedVehicleId || !user?.id) {
      toast.error('Please select a vehicle');
      return;
    }

    setIsSubmitting(true);

    try {
      const totalCost = Number((data.fuel_amount * data.fuel_price_per_unit).toFixed(2));

      await addFuelLog(
        {
          vehicle_id: selectedVehicleId,
          odometer: data.odometer,
          fill_date: new Date().toISOString(),
          fuel_amount: data.fuel_amount,
          fuel_price_per_unit: data.fuel_price_per_unit,
          total_cost: totalCost,
          fuel_type: 'diesel',
          currency: 'EUR',
          full_tank: data.full_tank,
        },
        user.id,
        selectedVehicleId
      );

      const randomInsight = INSIGHTS[Math.floor(Math.random() * INSIGHTS.length)];
      setInsight(randomInsight);
      setShowSuccess(true);

      if (!isOnline) {
        toast.success('Fuel log saved locally', {
          description: 'Will sync when you\'re back online',
          icon: <CloudOff className="h-4 w-4" />,
        });
      } else {
        toast.success('Fuel log added!', {
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
      toast.error('Failed to save fuel log');
      console.error('Fuel log error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchOdometer = form.watch('odometer');
  const distanceSinceLast = watchOdometer - lastOdometer;

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
            <Fuel className="h-5 w-5 text-amber-500" />
            Quick Fuel Log
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
                onValueChange={(value) => {
                  setSelectedVehicleId(value);
                  loadLastValues(value);
                }}
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

          {/* Odometer with distance indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="odometer">Odometer (km)</Label>
              {distanceSinceLast > 0 && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  +{distanceSinceLast.toLocaleString()} km since last
                </span>
              )}
            </div>
            <Input
              id="odometer"
              type="number"
              {...form.register('odometer', { valueAsNumber: true })}
              className={cn(
                form.formState.errors.odometer && 'border-red-500'
              )}
            />
            {form.formState.errors.odometer && (
              <p className="text-xs text-red-500">
                {form.formState.errors.odometer.message}
              </p>
            )}
          </div>

          {/* Fuel amount */}
          <div className="space-y-2">
            <Label htmlFor="fuel_amount">Fuel Amount (L)</Label>
            <Input
              id="fuel_amount"
              type="number"
              step="0.01"
              {...form.register('fuel_amount', { valueAsNumber: true })}
              className={cn(
                form.formState.errors.fuel_amount && 'border-red-500'
              )}
            />
            {form.formState.errors.fuel_amount && (
              <p className="text-xs text-red-500">
                {form.formState.errors.fuel_amount.message}
              </p>
            )}
          </div>

          {/* Price per liter */}
          <div className="space-y-2">
            <Label htmlFor="fuel_price_per_unit">Price per Liter</Label>
            <Input
              id="fuel_price_per_unit"
              type="number"
              step="0.001"
              {...form.register('fuel_price_per_unit', { valueAsNumber: true })}
              className={cn(
                form.formState.errors.fuel_price_per_unit && 'border-red-500'
              )}
            />
            {form.formState.errors.fuel_price_per_unit && (
              <p className="text-xs text-red-500">
                {form.formState.errors.fuel_price_per_unit.message}
              </p>
            )}
          </div>

          {/* Total cost preview */}
          {form.watch('fuel_amount') > 0 && form.watch('fuel_price_per_unit') > 0 && (
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Cost</span>
                <span className="font-semibold">
                  {(form.watch('fuel_amount') * form.watch('fuel_price_per_unit')).toFixed(2)} EUR
                </span>
              </div>
            </div>
          )}

          {/* Full tank checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="full_tank"
              checked={form.watch('full_tank')}
              onCheckedChange={(checked) =>
                form.setValue('full_tank', checked as boolean)
              }
            />
            <Label htmlFor="full_tank" className="text-sm">
              Full tank fill-up
            </Label>
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
              className="flex-1 bg-amber-500 hover:bg-amber-600"
              disabled={isSubmitting || vehiclesLoading}
            >
              {isSubmitting ? 'Saving...' : 'Log Fuel'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
