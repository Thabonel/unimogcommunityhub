
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from "@/components/ui/skeleton";
import { Vehicle } from '@/hooks/use-vehicle-maintenance';

interface MaintenanceSettingsProps {
  vehicleId: string;
}

interface NotificationSettings {
  id?: string;
  vehicle_id: string;
  email_notifications: boolean;
  sms_notifications: boolean;
  notification_frequency: string;
  phone_number: string | null;
}

export default function MaintenanceSettings({ vehicleId }: MaintenanceSettingsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    vehicle_id: vehicleId,
    email_notifications: true,
    sms_notifications: false,
    notification_frequency: 'weekly',
    phone_number: null,
  });
  const { toast } = useToast();

  // Vehicle details form state
  const [vehicleDetails, setVehicleDetails] = useState({
    name: '',
    model: '',
    year: '',
    license_plate: '',
    current_odometer: 0,
    odometer_unit: 'mi',
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch vehicle details
        const { data: vehicleData, error: vehicleError } = await supabase
          .from('vehicles')
          .select('*')
          .eq('id', vehicleId)
          .single();
          
        if (vehicleError) throw vehicleError;
        setVehicle(vehicleData as Vehicle);
        setVehicleDetails({
          name: vehicleData.name,
          model: vehicleData.model,
          year: vehicleData.year,
          license_plate: vehicleData.license_plate || '',
          current_odometer: vehicleData.current_odometer,
          odometer_unit: vehicleData.odometer_unit,
        });
        
        // Fetch notification settings
        const { data: notificationData, error: notificationError } = await supabase
          .from('maintenance_notification_settings')
          .select('*')
          .eq('vehicle_id', vehicleId)
          .maybeSingle();
          
        if (notificationError) throw notificationError;
        
        if (notificationData) {
          setNotificationSettings({
            id: notificationData.id,
            vehicle_id: vehicleId,
            email_notifications: notificationData.email_notifications,
            sms_notifications: notificationData.sms_notifications,
            notification_frequency: notificationData.notification_frequency,
            phone_number: notificationData.phone_number,
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load settings',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (vehicleId) {
      fetchData();
    }
  }, [vehicleId, toast]);

  const updateVehicle = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('vehicles')
        .update({
          name: vehicleDetails.name,
          model: vehicleDetails.model,
          year: vehicleDetails.year,
          license_plate: vehicleDetails.license_plate || null,
          current_odometer: vehicleDetails.current_odometer,
          odometer_unit: vehicleDetails.odometer_unit,
        })
        .eq('id', vehicleId);
        
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Vehicle details updated successfully',
      });
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast({
        title: 'Error',
        description: 'Failed to update vehicle details',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateNotificationSettings = async () => {
    setIsSaving(true);
    try {
      // Check if notification settings already exist
      if (notificationSettings.id) {
        // Update existing settings
        const { error } = await supabase
          .from('maintenance_notification_settings')
          .update({
            email_notifications: notificationSettings.email_notifications,
            sms_notifications: notificationSettings.sms_notifications,
            notification_frequency: notificationSettings.notification_frequency,
            phone_number: notificationSettings.phone_number,
          })
          .eq('id', notificationSettings.id);
          
        if (error) throw error;
      } else {
        // Create new settings
        const { data, error } = await supabase
          .from('maintenance_notification_settings')
          .insert([{
            vehicle_id: vehicleId,
            email_notifications: notificationSettings.email_notifications,
            sms_notifications: notificationSettings.sms_notifications,
            notification_frequency: notificationSettings.notification_frequency,
            phone_number: notificationSettings.phone_number,
          }])
          .select();
          
        if (error) throw error;
        
        // Update state with the new record ID
        if (data && data[0]) {
          setNotificationSettings(prevState => ({
            ...prevState,
            id: data[0].id,
          }));
        }
      }
      
      toast({
        title: 'Success',
        description: 'Notification settings updated successfully',
      });
    } catch (error) {
      console.error('Error updating notification settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update notification settings',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="vehicle">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="vehicle">Vehicle Details</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vehicle">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Information</CardTitle>
              <CardDescription>
                Update your vehicle's details and current information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Vehicle Name</Label>
                  <Input 
                    id="name" 
                    value={vehicleDetails.name} 
                    onChange={(e) => setVehicleDetails({ ...vehicleDetails, name: e.target.value })} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input 
                    id="model" 
                    value={vehicleDetails.model} 
                    onChange={(e) => setVehicleDetails({ ...vehicleDetails, model: e.target.value })} 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input 
                    id="year" 
                    value={vehicleDetails.year} 
                    onChange={(e) => setVehicleDetails({ ...vehicleDetails, year: e.target.value })} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="license">License Plate</Label>
                  <Input 
                    id="license" 
                    value={vehicleDetails.license_plate || ''} 
                    onChange={(e) => setVehicleDetails({ ...vehicleDetails, license_plate: e.target.value })} 
                    placeholder="Optional"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="odometer">Current Odometer</Label>
                  <Input 
                    id="odometer" 
                    type="number" 
                    value={vehicleDetails.current_odometer} 
                    onChange={(e) => setVehicleDetails({ 
                      ...vehicleDetails, 
                      current_odometer: parseInt(e.target.value) || 0 
                    })} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select 
                    value={vehicleDetails.odometer_unit}
                    onValueChange={(value) => setVehicleDetails({ ...vehicleDetails, odometer_unit: value })}
                  >
                    <SelectTrigger id="unit">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="km">Kilometers (km)</SelectItem>
                      <SelectItem value="mi">Miles (mi)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={updateVehicle} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you want to be notified about upcoming maintenance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive maintenance alerts via email
                    </p>
                  </div>
                  <Switch 
                    id="email-notifications"
                    checked={notificationSettings.email_notifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, email_notifications: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive text message alerts for maintenance
                    </p>
                  </div>
                  <Switch 
                    id="sms-notifications"
                    checked={notificationSettings.sms_notifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, sms_notifications: checked })
                    }
                  />
                </div>
              </div>
              
              <div className="space-y-2 pt-2">
                <Label htmlFor="frequency">Notification Frequency</Label>
                <Select
                  value={notificationSettings.notification_frequency}
                  onValueChange={(value) => setNotificationSettings({ ...notificationSettings, notification_frequency: value })}
                >
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediately">Immediately</SelectItem>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                    <SelectItem value="weekly">Weekly Summary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {notificationSettings.sms_notifications && (
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1234567890"
                    value={notificationSettings.phone_number || ''}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, phone_number: e.target.value })}
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter your phone number with country code, e.g. +1234567890
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={updateNotificationSettings} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Notification Settings'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
