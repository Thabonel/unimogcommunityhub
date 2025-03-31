
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Vehicle, MaintenanceNotificationSettings } from '@/hooks/use-vehicle-maintenance';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MaintenanceSettingsProps {
  vehicleId: string;
}

export default function MaintenanceSettings({ vehicleId }: MaintenanceSettingsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [settings, setSettings] = useState<MaintenanceNotificationSettings>({
    id: '',
    vehicle_id: vehicleId,
    email_notifications: true,
    sms_notifications: false,
    notification_frequency: 'weekly',
    phone_number: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetch vehicle data
        const { data: vehicleData, error: vehicleError } = await supabase
          .from('vehicles')
          .select('*')
          .eq('id', vehicleId)
          .single();
        
        if (vehicleError) throw vehicleError;
        setVehicle(vehicleData as Vehicle);
        
        // Fetch notification settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('maintenance_notification_settings')
          .select('*')
          .eq('vehicle_id', vehicleId)
          .maybeSingle();
        
        if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;
        
        if (settingsData) {
          setSettings({
            id: settingsData.id,
            vehicle_id: settingsData.vehicle_id,
            email_notifications: settingsData.email_notifications,
            sms_notifications: settingsData.sms_notifications,
            notification_frequency: settingsData.notification_frequency,
            phone_number: settingsData.phone_number || '',
          });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        toast({
          variant: 'destructive',
          title: 'Error loading settings',
          description: 'Failed to load vehicle settings. Please try again.'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (vehicleId) {
      loadData();
    }
  }, [vehicleId, toast]);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      let response;
      
      if (settings.id) {
        // Update existing settings
        response = await supabase
          .from('maintenance_notification_settings')
          .update({
            email_notifications: settings.email_notifications,
            sms_notifications: settings.sms_notifications,
            notification_frequency: settings.notification_frequency,
            phone_number: settings.phone_number || null
          })
          .eq('id', settings.id)
          .select();
      } else {
        // Create new settings
        response = await supabase
          .from('maintenance_notification_settings')
          .insert([{
            vehicle_id: vehicleId,
            email_notifications: settings.email_notifications,
            sms_notifications: settings.sms_notifications,
            notification_frequency: settings.notification_frequency,
            phone_number: settings.phone_number || null
          }])
          .select();
      }
      
      if (response.error) throw response.error;
      
      // Update the settings with the new data
      if (response.data[0]) {
        setSettings({
          ...response.data[0],
          phone_number: response.data[0].phone_number || ''
        } as MaintenanceNotificationSettings);
      }
      
      toast({
        title: 'Settings saved',
        description: 'Your maintenance notification settings have been updated.',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        variant: 'destructive',
        title: 'Error saving settings',
        description: 'Failed to save notification settings. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof MaintenanceNotificationSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Details</CardTitle>
          <CardDescription>
            Manage your vehicle information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {vehicle && (
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                <dd className="text-base">{vehicle.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Model</dt>
                <dd className="text-base">{vehicle.model}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Year</dt>
                <dd className="text-base">{vehicle.year}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">License Plate</dt>
                <dd className="text-base">{vehicle.license_plate || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Current Odometer</dt>
                <dd className="text-base">{vehicle.current_odometer.toLocaleString()} {vehicle.odometer_unit}</dd>
              </div>
            </dl>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>
            Configure how you want to receive maintenance reminders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive maintenance reminders via email
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={settings.email_notifications}
                onCheckedChange={(checked) => handleInputChange('email_notifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sms-notifications">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive maintenance reminders via text message
                </p>
              </div>
              <Switch
                id="sms-notifications"
                checked={settings.sms_notifications}
                onCheckedChange={(checked) => handleInputChange('sms_notifications', checked)}
              />
            </div>
            
            {settings.sms_notifications && (
              <div className="space-y-2">
                <Label htmlFor="phone-number">Phone Number</Label>
                <Input
                  id="phone-number"
                  placeholder="+1 (555) 123-4567"
                  value={settings.phone_number}
                  onChange={(e) => handleInputChange('phone_number', e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Enter your phone number to receive SMS notifications
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="notification-frequency">Notification Frequency</Label>
              <Select
                value={settings.notification_frequency}
                onValueChange={(value) => handleInputChange('notification_frequency', value)}
              >
                <SelectTrigger id="notification-frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                How often would you like to receive maintenance reminders
              </p>
            </div>
            
            <Button 
              className="w-full"
              onClick={handleSaveSettings}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
