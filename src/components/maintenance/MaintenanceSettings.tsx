
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { useVehicleMaintenance, Vehicle } from '@/hooks/use-vehicle-maintenance';
import { Loader2, Settings2, Bell, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MaintenanceSettingsProps {
  vehicleId: string;
}

interface VehicleSettingsFormData {
  name: string;
  license_plate?: string;
  current_odometer: number;
  odometer_unit: 'km' | 'mi';
}

interface NotificationSettingsFormData {
  email_notifications: boolean;
  sms_notifications: boolean;
  notification_frequency: 'immediately' | 'daily' | 'weekly';
  phone_number?: string;
}

export default function MaintenanceSettings({ vehicleId }: MaintenanceSettingsProps) {
  const { toast } = useToast();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { updateVehicle, deleteVehicle } = useVehicleMaintenance();
  
  // Vehicle settings form
  const vehicleForm = useForm<VehicleSettingsFormData>({
    defaultValues: {
      name: '',
      license_plate: '',
      current_odometer: 0,
      odometer_unit: 'km',
    }
  });
  
  // Notification settings form
  const notificationForm = useForm<NotificationSettingsFormData>({
    defaultValues: {
      email_notifications: true,
      sms_notifications: false,
      notification_frequency: 'weekly',
      phone_number: '',
    }
  });

  useEffect(() => {
    const loadVehicleData = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .eq('id', vehicleId)
          .single();
        
        if (error) throw error;
        
        setVehicle(data);
        
        // Set form defaults
        vehicleForm.reset({
          name: data.name,
          license_plate: data.license_plate || '',
          current_odometer: data.current_odometer,
          odometer_unit: data.odometer_unit,
        });
        
        // Load notification settings
        const { data: notificationData, error: notificationError } = await supabase
          .from('maintenance_notification_settings')
          .select('*')
          .eq('vehicle_id', vehicleId)
          .single();
        
        if (!notificationError && notificationData) {
          notificationForm.reset({
            email_notifications: notificationData.email_notifications,
            sms_notifications: notificationData.sms_notifications,
            notification_frequency: notificationData.notification_frequency,
            phone_number: notificationData.phone_number || '',
          });
        }
      } catch (error) {
        console.error('Error loading vehicle data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadVehicleData();
  }, [vehicleId]);

  const onSaveVehicleSettings = async (data: VehicleSettingsFormData) => {
    try {
      setIsSaving(true);
      await updateVehicle(vehicleId, {
        name: data.name,
        license_plate: data.license_plate,
        current_odometer: Number(data.current_odometer),
        odometer_unit: data.odometer_unit,
      });
      
      toast({
        title: 'Settings saved',
        description: 'Vehicle settings have been updated',
      });
    } catch (error) {
      console.error('Error saving vehicle settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const onSaveNotificationSettings = async (data: NotificationSettingsFormData) => {
    try {
      setIsSaving(true);
      
      const { data: existingSettings, error: checkError } = await supabase
        .from('maintenance_notification_settings')
        .select('id')
        .eq('vehicle_id', vehicleId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      // Either update existing or insert new
      if (existingSettings) {
        const { error } = await supabase
          .from('maintenance_notification_settings')
          .update({
            email_notifications: data.email_notifications,
            sms_notifications: data.sms_notifications,
            notification_frequency: data.notification_frequency,
            phone_number: data.phone_number || null,
          })
          .eq('id', existingSettings.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('maintenance_notification_settings')
          .insert([
            {
              vehicle_id: vehicleId,
              email_notifications: data.email_notifications,
              sms_notifications: data.sms_notifications,
              notification_frequency: data.notification_frequency,
              phone_number: data.phone_number || null,
            }
          ]);
        
        if (error) throw error;
      }
      
      toast({
        title: 'Settings saved',
        description: 'Notification settings have been updated',
      });
    } catch (error) {
      console.error('Error saving notification settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteVehicle = async () => {
    try {
      setIsDeleting(true);
      await deleteVehicle(vehicleId);
      // Redirect will be handled by the parent component
      window.location.href = '/vehicle-dashboard';
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Vehicle Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Vehicle Settings
          </CardTitle>
          <CardDescription>
            Update your vehicle information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...vehicleForm}>
            <form onSubmit={vehicleForm.handleSubmit(onSaveVehicleSettings)} className="space-y-4">
              <FormField
                control={vehicleForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={vehicleForm.control}
                  name="license_plate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License Plate (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={vehicleForm.control}
                  name="current_odometer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Odometer</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0"
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={vehicleForm.control}
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
              
              <div className="flex justify-end">
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>
            Configure how you want to receive maintenance notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...notificationForm}>
            <form onSubmit={notificationForm.handleSubmit(onSaveNotificationSettings)} className="space-y-4">
              <FormField
                control={notificationForm.control}
                name="email_notifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Email Notifications</FormLabel>
                      <FormDescription>
                        Receive maintenance reminders via email
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={notificationForm.control}
                name="sms_notifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">SMS Notifications</FormLabel>
                      <FormDescription>
                        Receive maintenance reminders via text message
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {notificationForm.watch('sms_notifications') && (
                <FormField
                  control={notificationForm.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1234567890" {...field} />
                      </FormControl>
                      <FormDescription>
                        Include country code (e.g., +1 for US)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={notificationForm.control}
                name="notification_frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notification Frequency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="immediately">Immediately</SelectItem>
                        <SelectItem value="daily">Daily Digest</SelectItem>
                        <SelectItem value="weekly">Weekly Digest</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Notification Settings
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border border-destructive rounded-lg">
            <div>
              <h4 className="font-semibold">Delete Vehicle</h4>
              <p className="text-sm text-muted-foreground">
                Remove this vehicle and all its maintenance records permanently
              </p>
            </div>
            <Button 
              variant="destructive" 
              onClick={handleDeleteVehicle} 
              disabled={isDeleting}
              className="gap-2"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete Vehicle
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
