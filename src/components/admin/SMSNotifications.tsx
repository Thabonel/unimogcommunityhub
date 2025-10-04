import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Bell, BellOff, MessageSquare, Users, ShoppingCart, MessageCircle, Mail, CreditCard, Map, AlertTriangle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface SMSPreferences {
  id: string;
  phone_number: string;
  enabled: boolean;
  notify_new_user: boolean;
  notify_new_post: boolean;
  notify_new_listing: boolean;
  notify_new_comment: boolean;
  notify_new_message: boolean;
  notify_feedback: boolean;
  notify_payment: boolean;
  notify_trip: boolean;
  notify_error: boolean;
}

interface SMSLog {
  id: string;
  event_type: string;
  message: string;
  phone_number: string;
  status: 'pending' | 'sent' | 'failed';
  error_message?: string;
  created_at: string;
}

export default function SMSNotifications() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<SMSPreferences | null>(null);
  const [logs, setLogs] = useState<SMSLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load preferences and logs
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        // Load preferences
        const { data: prefs, error: prefsError } = await supabase
          .from('admin_sms_preferences')
          .select('*')
          .eq('admin_user_id', user.id)
          .single();

        if (prefsError && prefsError.code !== 'PGRST116') {
          console.error('Error loading SMS preferences:', prefsError);
        } else if (prefs) {
          setPreferences(prefs);
        }

        // Load recent logs (last 50)
        const { data: logsData, error: logsError } = await supabase
          .from('admin_sms_log')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (logsError) {
          console.error('Error loading SMS logs:', logsError);
        } else {
          setLogs(logsData || []);
        }
      } catch (error) {
        console.error('Error loading SMS data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleSave = async () => {
    if (!preferences || !user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('admin_sms_preferences')
        .upsert({
          ...preferences,
          admin_user_id: user.id,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Your SMS notification preferences have been updated."
      });
    } catch (error: any) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Failed to save",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendTest = async () => {
    try {
      // Insert test notification
      const { error } = await supabase.rpc('queue_admin_sms', {
        p_event_type: 'error',
        p_event_id: crypto.randomUUID(),
        p_message: '🧪 Test SMS from Unimog Community Hub - Your notifications are working!'
      });

      if (error) throw error;

      toast({
        title: "Test SMS queued",
        description: "Check your phone within 1 minute. If enabled = true."
      });

      // Reload logs after 2 seconds
      setTimeout(async () => {
        const { data } = await supabase
          .from('admin_sms_log')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);
        if (data) setLogs(data);
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Failed to send test",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!preferences) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>SMS Notifications Not Configured</CardTitle>
          <CardDescription>
            Contact the site administrator to set up SMS notifications for your account.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const eventIcons: Record<string, any> = {
    new_user: Users,
    new_post: MessageSquare,
    new_listing: ShoppingCart,
    new_comment: MessageCircle,
    new_message: Mail,
    feedback: MessageCircle,
    payment: CreditCard,
    trip: Map,
    error: AlertTriangle
  };

  return (
    <div className="space-y-6">
      {/* Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            SMS Notification Settings
          </CardTitle>
          <CardDescription>
            Get instant text alerts when events happen on your site. Your phone: {preferences.phone_number}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Master Toggle */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              {preferences.enabled ? (
                <Bell className="h-5 w-5 text-primary" />
              ) : (
                <BellOff className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <Label className="text-base font-semibold">
                  {preferences.enabled ? 'SMS Notifications Enabled' : 'SMS Notifications Disabled'}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {preferences.enabled ? 'You will receive text alerts' : 'All SMS notifications are paused'}
                </p>
              </div>
            </div>
            <Switch
              checked={preferences.enabled}
              onCheckedChange={(checked) => setPreferences({ ...preferences, enabled: checked })}
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={preferences.phone_number}
              onChange={(e) => setPreferences({ ...preferences, phone_number: e.target.value })}
              placeholder="+61402091189"
            />
            <p className="text-xs text-muted-foreground">
              Include country code (e.g., +61 for Australia)
            </p>
          </div>

          {/* Event Toggles */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Event Types</Label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <EventToggle
                icon={Users}
                label="New Users"
                description="Someone signs up"
                checked={preferences.notify_new_user}
                onChange={(checked) => setPreferences({ ...preferences, notify_new_user: checked })}
              />
              <EventToggle
                icon={MessageSquare}
                label="New Posts"
                description="Community post created"
                checked={preferences.notify_new_post}
                onChange={(checked) => setPreferences({ ...preferences, notify_new_post: checked })}
              />
              <EventToggle
                icon={ShoppingCart}
                label="New Listings"
                description="Marketplace item posted"
                checked={preferences.notify_new_listing}
                onChange={(checked) => setPreferences({ ...preferences, notify_new_listing: checked })}
              />
              <EventToggle
                icon={MessageCircle}
                label="New Comments"
                description="Someone comments (high volume)"
                checked={preferences.notify_new_comment}
                onChange={(checked) => setPreferences({ ...preferences, notify_new_comment: checked })}
              />
              <EventToggle
                icon={Mail}
                label="New Messages"
                description="Direct messages (high volume)"
                checked={preferences.notify_new_message}
                onChange={(checked) => setPreferences({ ...preferences, notify_new_message: checked })}
              />
              <EventToggle
                icon={MessageCircle}
                label="Feedback"
                description="User feedback submitted"
                checked={preferences.notify_feedback}
                onChange={(checked) => setPreferences({ ...preferences, notify_feedback: checked })}
              />
              <EventToggle
                icon={CreditCard}
                label="Payments"
                description="Subscription purchases"
                checked={preferences.notify_payment}
                onChange={(checked) => setPreferences({ ...preferences, notify_payment: checked })}
              />
              <EventToggle
                icon={Map}
                label="New Trips"
                description="Trip planning activity"
                checked={preferences.notify_trip}
                onChange={(checked) => setPreferences({ ...preferences, notify_trip: checked })}
              />
              <EventToggle
                icon={AlertTriangle}
                label="Errors"
                description="System errors"
                checked={preferences.notify_error}
                onChange={(checked) => setPreferences({ ...preferences, notify_error: checked })}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Settings
            </Button>
            <Button variant="outline" onClick={handleSendTest}>
              Send Test SMS
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* SMS Log Card */}
      <Card>
        <CardHeader>
          <CardTitle>Recent SMS Notifications</CardTitle>
          <CardDescription>Last 50 text messages sent to your phone</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No SMS notifications sent yet
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => {
                    const Icon = eventIcons[log.event_type] || Bell;
                    return (
                      <TableRow key={log.id}>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {new Date(log.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{log.event_type.replace(/_/g, ' ')}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-md truncate">{log.message}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              log.status === 'sent'
                                ? 'default'
                                : log.status === 'failed'
                                ? 'destructive'
                                : 'secondary'
                            }
                          >
                            {log.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper component for event toggles
function EventToggle({
  icon: Icon,
  label,
  description,
  checked,
  onChange
}: {
  icon: any;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <div>
          <Label className="text-sm font-medium">{label}</Label>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
