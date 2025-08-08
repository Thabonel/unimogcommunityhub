
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { getPrivacySettings, updatePrivacySettings } from '@/services/analytics/privacyService';
import { useToast } from '@/hooks/use-toast';

export interface PrivacyPreferences {
  allowAnalytics: boolean;
  allowActivityTracking: boolean;
  allowPersonalization: boolean;
  anonymizeData: boolean;
}

export function PrivacySettings() {
  const [settings, setSettings] = useState<PrivacyPreferences>({
    allowAnalytics: true,
    allowActivityTracking: true,
    allowPersonalization: true,
    anonymizeData: false,
  });
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load saved privacy settings
    const savedSettings = getPrivacySettings();
    if (savedSettings) {
      setSettings(savedSettings);
    }
    setLoading(false);
  }, []);

  const handleToggle = (key: keyof PrivacyPreferences) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    updatePrivacySettings(newSettings);
  };

  const handleSave = () => {
    updatePrivacySettings(settings);
    toast({
      title: "Privacy settings updated",
      description: "Your privacy preferences have been saved.",
    });
  };

  if (loading) {
    return <div>Loading privacy settings...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
        <CardDescription>
          Control how your data is collected and used on our platform
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow-analytics">Allow Analytics</Label>
              <p className="text-sm text-muted-foreground">
                Permit us to collect anonymous usage data to improve our services
              </p>
            </div>
            <Switch 
              id="allow-analytics" 
              checked={settings.allowAnalytics}
              onCheckedChange={() => handleToggle('allowAnalytics')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="activity-tracking">Activity Tracking</Label>
              <p className="text-sm text-muted-foreground">
                Track which features you use and how you interact with them
              </p>
            </div>
            <Switch 
              id="activity-tracking" 
              checked={settings.allowActivityTracking}
              onCheckedChange={() => handleToggle('allowActivityTracking')}
              disabled={!settings.allowAnalytics}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allow-personalization">Personalization</Label>
              <p className="text-sm text-muted-foreground">
                Allow us to personalize your experience based on your usage patterns
              </p>
            </div>
            <Switch 
              id="allow-personalization" 
              checked={settings.allowPersonalization}
              onCheckedChange={() => handleToggle('allowPersonalization')}
              disabled={!settings.allowAnalytics}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="anonymize-data">Anonymize My Data</Label>
              <p className="text-sm text-muted-foreground">
                Remove personal identifiers from analytics data we collect
              </p>
            </div>
            <Switch 
              id="anonymize-data" 
              checked={settings.anonymizeData}
              onCheckedChange={() => handleToggle('anonymizeData')}
              disabled={!settings.allowAnalytics}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave}>
            Save Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
