import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';
import { 
  MaintenanceNotificationSettings,
  useMaintenanceSettings 
} from '@/hooks/vehicle-maintenance';

interface MaintenanceSettingsProps {
  vehicleId: string;
}

export default function MaintenanceSettings({ vehicleId }: MaintenanceSettingsProps) {
  const [loading, setLoading] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [notificationFrequency, setNotificationFrequency] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [mileageInterval, setMileageInterval] = useState(3000);
  const [timeInterval, setTimeInterval] = useState(6);
  const { toast } = useToast();
  const { getMaintenanceSettings, saveMaintenanceSettings } = useMaintenanceSettings();

  useEffect(() => {
    const loadSettings = async () => {
      if (!vehicleId) return;
      
      try {
        setLoading(true);
        const settings = await getMaintenanceSettings(vehicleId);
        
        if (settings) {
          setEmailNotifications(settings.email_notifications);
          setPushNotifications(settings.sms_notifications);
          setNotificationFrequency(settings.notification_frequency as "daily" | "weekly" | "monthly");
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, [vehicleId, getMaintenanceSettings]);

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      await saveMaintenanceSettings({
        vehicle_id: vehicleId,
        email_notifications: emailNotifications,
        sms_notifications: pushNotifications,
        notification_frequency: notificationFrequency,
      } as MaintenanceNotificationSettings);
      
      toast({
        title: "Settings saved",
        description: "Your maintenance notification settings have been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationFrequencyChange = (value: string) => {
    if (value === "daily" || value === "weekly" || value === "monthly") {
      setNotificationFrequency(value);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notification Preferences</h3>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications" className="flex-grow">
              Email Notifications
              <p className="text-sm text-muted-foreground">
                Receive maintenance reminders via email
              </p>
            </Label>
            <Switch 
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="push-notifications" className="flex-grow">
              Push Notifications
              <p className="text-sm text-muted-foreground">
                Receive maintenance reminders as push notifications
              </p>
            </Label>
            <Switch 
              id="push-notifications"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="notification-frequency">Notification Frequency</Label>
            <Select
              value={notificationFrequency}
              onValueChange={handleNotificationFrequencyChange}
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
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Maintenance Intervals</h3>
          
          <div className="grid gap-2">
            <Label htmlFor="mileage-interval">Mileage Check Interval (km)</Label>
            <Input 
              id="mileage-interval"
              type="number" 
              value={mileageInterval} 
              onChange={(e) => setMileageInterval(parseInt(e.target.value) || 0)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="time-interval">Time Check Interval (months)</Label>
            <Input 
              id="time-interval"
              type="number" 
              value={timeInterval} 
              onChange={(e) => setTimeInterval(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
        
        <Button 
          className="w-full sm:w-auto"
          onClick={handleSaveSettings}
          disabled={loading}
        >
          {loading ? (
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
      </CardContent>
    </Card>
  );
}
