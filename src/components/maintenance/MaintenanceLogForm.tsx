
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useVehicleMaintenance, MaintenanceLog, MaintenanceType } from '@/hooks/use-vehicle-maintenance';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MaintenanceLogFormProps {
  vehicleId: string;
  existingLog?: MaintenanceLog;
  onSuccess?: (log: MaintenanceLog) => void;
  onCancel?: () => void;
}

interface MaintenanceLogFormValues {
  maintenance_type: MaintenanceType;
  date: Date;
  odometer: number;
  cost?: number;
  currency: string;
  notes?: string;
  completed_by?: string;
  location?: string;
  parts_replaced?: string;
}

export default function MaintenanceLogForm({ 
  vehicleId,
  existingLog,
  onSuccess,
  onCancel
}: MaintenanceLogFormProps) {
  const { addMaintenanceLog, updateMaintenanceLog } = useVehicleMaintenance();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const defaultValues: MaintenanceLogFormValues = existingLog ? {
    maintenance_type: existingLog.maintenance_type,
    date: new Date(existingLog.date),
    odometer: existingLog.odometer,
    cost: existingLog.cost,
    currency: existingLog.currency,
    notes: existingLog.notes,
    completed_by: existingLog.completed_by,
    location: existingLog.location,
    parts_replaced: existingLog.parts_replaced ? existingLog.parts_replaced.join(', ') : '',
  } : {
    maintenance_type: 'oil_change',
    date: new Date(),
    odometer: 0,
    currency: 'USD',
    notes: '',
  };
  
  const form = useForm<MaintenanceLogFormValues>({
    defaultValues
  });

  const onSubmit = async (data: MaintenanceLogFormValues) => {
    try {
      setIsSubmitting(true);
      
      const parts_replaced = data.parts_replaced ? 
        data.parts_replaced.split(',').map(part => part.trim()) : 
        undefined;
      
      const logData = {
        vehicle_id: vehicleId,
        maintenance_type: data.maintenance_type,
        date: format(data.date, 'yyyy-MM-dd'),
        odometer: Number(data.odometer),
        cost: data.cost || null,
        currency: data.currency,
        notes: data.notes || '',
        completed_by: data.completed_by || '',
        location: data.location || '',
        parts_replaced
      };
      
      let result;
      
      if (existingLog) {
        result = await updateMaintenanceLog(existingLog.id, logData);
      } else {
        result = await addMaintenanceLog(logData);
      }
      
      if (onSuccess) onSuccess(result);
      form.reset();
    } catch (error) {
      // Error handling is done in the useVehicleMaintenance hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="maintenance_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maintenance Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="oil_change">Oil Change</SelectItem>
                    <SelectItem value="tire_rotation">Tire Rotation</SelectItem>
                    <SelectItem value="brake_service">Brake Service</SelectItem>
                    <SelectItem value="inspection">Inspection</SelectItem>
                    <SelectItem value="repair">Repair</SelectItem>
                    <SelectItem value="modification">Modification</SelectItem>
                    <SelectItem value="fluid_change">Fluid Change</SelectItem>
                    <SelectItem value="filter_replacement">Filter Replacement</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
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
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="odometer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Odometer Reading</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    min="0"
                    {...field} 
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        min="0"
                        step="0.01"
                        {...field} 
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === '' ? undefined : parseFloat(value));
                        }}
                        value={field.value === undefined ? '' : field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="USD" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="CAD">CAD</SelectItem>
                      <SelectItem value="AUD">AUD</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="completed_by"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Completed By (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Name of person or shop" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Where the work was done" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="parts_replaced"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parts Replaced (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="List parts separated by commas" {...field} />
              </FormControl>
              <FormDescription>Example: Oil filter, Air filter</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Additional details about the maintenance"
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2 pt-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {existingLog ? 'Update Log' : 'Save Log'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
