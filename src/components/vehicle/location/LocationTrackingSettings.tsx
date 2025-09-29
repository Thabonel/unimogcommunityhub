import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';
import { MapPin, Shield, Smartphone, Edit3 } from 'lucide-react';

interface LocationSettings {
  tracking_mode: 'automatic' | 'manual' | 'disabled';
  auto_tracking_enabled: boolean;
  share_location_data: boolean;
  minimum_trip_distance_km: number;
  auto_detect_trip_start: boolean;
  privacy_mode: boolean;
}

interface LocationTrackingSettingsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LocationTrackingSettings({ isOpen, onOpenChange }: LocationTrackingSettingsProps) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<LocationSettings>({
    tracking_mode: 'manual',
    auto_tracking_enabled: false,
    share_location_data: false,
    minimum_trip_distance_km: 1.0,
    auto_detect_trip_start: true,
    privacy_mode: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);

  // Load user settings
  useEffect(() => {
    if (user && isOpen) {
      loadSettings();
      checkLocationPermission();
    }
  }, [user, isOpen]);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('location_tracking_settings')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading location settings:', error);
        return;
      }

      if (data) {
        setSettings({
          tracking_mode: data.tracking_mode,
          auto_tracking_enabled: data.auto_tracking_enabled,
          share_location_data: data.share_location_data,
          minimum_trip_distance_km: data.minimum_trip_distance_km,
          auto_detect_trip_start: data.auto_detect_trip_start,
          privacy_mode: data.privacy_mode
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkLocationPermission = async () => {
    if ('geolocation' in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        setHasLocationPermission(permission.state === 'granted');

        permission.addEventListener('change', () => {
          setHasLocationPermission(permission.state === 'granted');
        });
      } catch (error) {
        console.error('Error checking location permission:', error);
        setHasLocationPermission(false);
      }
    } else {
      setHasLocationPermission(false);
    }
  };

  const requestLocationPermission = async () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setHasLocationPermission(true);
          toast.success('Location permission granted!');
        },
        (error) => {
          console.error('Location permission denied:', error);
          setHasLocationPermission(false);
          toast.error('Location permission denied. Automatic tracking requires location access.');
        }
      );
    }
  };

  const saveSettings = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('location_tracking_settings')
        .upsert([
          {
            user_id: user.id,
            ...settings,
            updated_at: new Date().toISOString()
          }
        ]);

      if (error) {
        console.error('Error saving location settings:', error);
        toast.error('Failed to save location settings');
        return;
      }

      toast.success('Location tracking settings saved');
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save location settings');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: keyof LocationSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location Tracking Settings
          </CardTitle>
          <CardDescription>
            Choose how you want to track your vehicle's location and trips
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="text-center py-4">Loading settings...</div>
          ) : (
            <>
              {/* Tracking Mode */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Tracking Mode</Label>
                <Select
                  value={settings.tracking_mode}
                  onValueChange={(value) => updateSetting('tracking_mode', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="automatic">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        Automatic GPS Tracking
                      </div>
                    </SelectItem>
                    <SelectItem value="manual">
                      <div className="flex items-center gap-2">
                        <Edit3 className="h-4 w-4" />
                        Manual Entry Only
                      </div>
                    </SelectItem>
                    <SelectItem value="disabled">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Disabled (No Tracking)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location Permission Status */}
              {settings.tracking_mode === 'automatic' && (
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Location Permission</h4>
                      <p className="text-sm text-muted-foreground">
                        {hasLocationPermission === null ? 'Checking...' :
                         hasLocationPermission ? 'Granted ✓' : 'Required for automatic tracking'}
                      </p>
                    </div>
                    {hasLocationPermission === false && (
                      <Button onClick={requestLocationPermission} size="sm">
                        Grant Permission
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Automatic Tracking Settings */}
              {settings.tracking_mode === 'automatic' && (
                <div className="space-y-4 p-4 border rounded-lg">
                  <h4 className="font-medium">Automatic Tracking Options</h4>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-tracking">Enable Background Tracking</Label>
                      <p className="text-sm text-muted-foreground">
                        Track trips automatically when app is open
                      </p>
                    </div>
                    <Switch
                      id="auto-tracking"
                      checked={settings.auto_tracking_enabled}
                      onCheckedChange={(checked) => updateSetting('auto_tracking_enabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-detect">Auto-detect Trip Start</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically start logging when movement is detected
                      </p>
                    </div>
                    <Switch
                      id="auto-detect"
                      checked={settings.auto_detect_trip_start}
                      onCheckedChange={(checked) => updateSetting('auto_detect_trip_start', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="min-distance">Minimum Trip Distance (km)</Label>
                    <Input
                      id="min-distance"
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="10"
                      value={settings.minimum_trip_distance_km}
                      onChange={(e) => updateSetting('minimum_trip_distance_km', parseFloat(e.target.value))}
                      className="w-32"
                    />
                    <p className="text-xs text-muted-foreground">
                      Ignore trips shorter than this distance
                    </p>
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Privacy Settings
                </h4>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="privacy-mode">Privacy Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Store location data locally only (limits features)
                    </p>
                  </div>
                  <Switch
                    id="privacy-mode"
                    checked={settings.privacy_mode}
                    onCheckedChange={(checked) => updateSetting('privacy_mode', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="share-data">Share Location Data</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow anonymous usage statistics for feature improvements
                    </p>
                  </div>
                  <Switch
                    id="share-data"
                    checked={settings.share_location_data}
                    onCheckedChange={(checked) => updateSetting('share_location_data', checked)}
                  />
                </div>
              </div>

              {/* Explanation */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">How Location Tracking Works</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>Automatic:</strong> Uses your device's GPS to track trips when the app is open</p>
                  <p><strong>Manual:</strong> You log trips and locations manually using simple forms</p>
                  <p><strong>Disabled:</strong> No location tracking - usage statistics won't be available</p>
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={saveSettings}
              disabled={isSaving}
              className="flex-1"
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}