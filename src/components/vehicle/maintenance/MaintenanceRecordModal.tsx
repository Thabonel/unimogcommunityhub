import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';
import { format } from 'date-fns';

const maintenanceRecordSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  maintenance_type: z.string().min(1, 'Maintenance type is required'),
  odometer: z.number().min(0, 'Odometer reading must be positive'),
  cost: z.number().min(0, 'Cost must be positive'),
  notes: z.string().optional(),
  location: z.string().optional(),
  completed_by: z.string().optional(),
  currency: z.string().default('USD')
});

type MaintenanceRecordForm = z.infer<typeof maintenanceRecordSchema>;

interface MaintenanceRecordModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleId: string;
  onRecordAdded?: () => void;
}

const maintenanceTypes = [
  'Oil Change',
  'Filter Replacement',
  'Brake Service',
  'Tire Service',
  'Transmission Service',
  'Coolant Service',
  'Annual Inspection',
  'Battery Service',
  'Belt Replacement',
  'Spark Plug Replacement',
  'Differential Service',
  'Portal Axle Service',
  'Hydraulic Service',
  'PTO Service',
  'Engine Tune-up',
  'Other'
];

export function MaintenanceRecordModal({
  isOpen,
  onOpenChange,
  vehicleId,
  onRecordAdded
}: MaintenanceRecordModalProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [customType, setCustomType] = useState('');
  const [typesOpen, setTypesOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<MaintenanceRecordForm>({
    resolver: zodResolver(maintenanceRecordSchema),
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      odometer: 0,
      cost: 0,
      currency: 'AUD'
    }
  });

  // Sync selected types to form field
  const updateFormValue = (types: string[], custom: string) => {
    const all = [...types];
    if (custom.trim()) all.push(custom.trim());
    setValue('maintenance_type', all.join(', '), { shouldValidate: true });
  };

  const toggleType = (type: string) => {
    const updated = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(updated);
    updateFormValue(updated, customType);
  };

  const removeType = (type: string) => {
    const updated = selectedTypes.filter(t => t !== type);
    setSelectedTypes(updated);
    updateFormValue(updated, customType);
  };

  const handleCustomTypeChange = (value: string) => {
    setCustomType(value);
    updateFormValue(selectedTypes, value);
  };

  const onSubmit = async (data: MaintenanceRecordForm) => {
    if (!user) {
      toast.error('You must be logged in to add maintenance records');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('maintenance_logs')
        .insert([
          {
            vehicle_id: vehicleId,
            date: data.date,
            maintenance_type: data.maintenance_type,
            odometer: data.odometer,
            cost: data.cost,
            currency: data.currency,
            notes: data.notes || null,
            location: data.location || null,
            completed_by: data.completed_by || null
          }
        ]);

      if (error) {
        console.error('Error adding maintenance record:', error);
        toast.error('Failed to add maintenance record');
        return;
      }

      toast.success('Maintenance record added successfully');
      reset();
      setSelectedTypes([]);
      setCustomType('');
      onOpenChange(false);
      onRecordAdded?.();
    } catch (error) {
      console.error('Error adding maintenance record:', error);
      toast.error('Failed to add maintenance record');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Maintenance Record</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                {...register('date')}
                className={errors.date ? 'border-red-500' : ''}
              />
              {errors.date && (
                <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="odometer">Odometer (km)</Label>
              <Input
                id="odometer"
                type="number"
                {...register('odometer', { valueAsNumber: true })}
                className={errors.odometer ? 'border-red-500' : ''}
              />
              {errors.odometer && (
                <p className="text-sm text-red-500 mt-1">{errors.odometer.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label>Work Performed (select all that apply)</Label>

            {/* Selected items as badges */}
            {(selectedTypes.length > 0 || customType.trim()) && (
              <div className="flex flex-wrap gap-1.5 mt-2 mb-2">
                {selectedTypes.map(type => (
                  <Badge key={type} variant="secondary" className="text-xs pl-2 pr-1 py-1">
                    {type}
                    <button type="button" onClick={() => removeType(type)} className="ml-1 hover:text-red-500">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {customType.trim() && (
                  <Badge variant="outline" className="text-xs pl-2 pr-1 py-1">
                    {customType}
                    <button type="button" onClick={() => handleCustomTypeChange('')} className="ml-1 hover:text-red-500">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}

            {/* Checkbox list */}
            <Popover open={typesOpen} onOpenChange={setTypesOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={`w-full justify-between font-normal ${errors.maintenance_type ? 'border-red-500' : ''}`}
                >
                  {selectedTypes.length > 0 || customType.trim()
                    ? `${selectedTypes.length + (customType.trim() ? 1 : 0)} item(s) selected`
                    : 'Select work performed...'}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[340px] p-0" align="start">
                <ScrollArea className="h-[280px] p-3">
                  <div className="space-y-2">
                    {maintenanceTypes.filter(t => t !== 'Other').map(type => (
                      <label
                        key={type}
                        className="flex items-center gap-2.5 py-1.5 px-2 rounded hover:bg-muted cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={() => toggleType(type)}
                        />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}

                    {/* Custom "Other" input */}
                    <div className="border-t pt-2 mt-2">
                      <label className="flex items-center gap-2.5 py-1.5 px-2">
                        <span className="text-sm font-medium">Other:</span>
                      </label>
                      <Input
                        placeholder="Type custom work here..."
                        value={customType}
                        onChange={(e) => handleCustomTypeChange(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </ScrollArea>
                <div className="border-t p-2">
                  <Button
                    type="button"
                    size="sm"
                    className="w-full"
                    onClick={() => setTypesOpen(false)}
                  >
                    Done
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <input type="hidden" {...register('maintenance_type')} />
            {errors.maintenance_type && (
              <p className="text-sm text-red-500 mt-1">{errors.maintenance_type.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cost">Cost ($)</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                {...register('cost', { valueAsNumber: true })}
                className={errors.cost ? 'border-red-500' : ''}
              />
              {errors.cost && (
                <p className="text-sm text-red-500 mt-1">{errors.cost.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="completed_by">Completed By (Optional)</Label>
              <Input
                id="completed_by"
                {...register('completed_by')}
                placeholder="Mechanic or service center"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                {...register('location')}
                placeholder="Service location"
              />
            </div>

            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select onValueChange={(value) => setValue('currency', value)} defaultValue="USD">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="CAD">CAD ($)</SelectItem>
                  <SelectItem value="AUD">AUD ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Additional notes about the maintenance"
              className="min-h-[80px]"
            />
          </div>

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
              {isSubmitting ? 'Adding...' : 'Add Record'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}