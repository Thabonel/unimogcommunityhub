
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';

export function VehicleOdometer() {
  const form = useFormContext();
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="current_odometer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Current Odometer</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="0" 
                min="0"
                {...field} 
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="odometer_unit"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Unit</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="km">Kilometers</SelectItem>
                <SelectItem value="mi">Miles</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
