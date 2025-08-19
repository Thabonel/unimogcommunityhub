
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Settings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Get user data from auth context
  const userData = {
    name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
    email: user?.email || '',
    avatarUrl: user?.user_metadata?.avatar_url || '',
    unimogModel: user?.user_metadata?.unimog_model || 'U1700L',
  };
  
  // Mock settings state
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      browser: true,
      messages: true,
      mentions: true,
      newsletters: false,
      marketplaceAlerts: true,
    },
    privacy: {
      profileVisibility: 'all',
      showEmail: false,
      showLocation: true,
      allowDirectMessages: true,
    },
  });
  
  const handleNotificationChange = (key: string) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key as keyof typeof settings.notifications],
      },
    });
  };
  
  const handlePrivacyChange = (key: string, value: any) => {
    setSettings({
      ...settings,
      privacy: {
        ...settings.privacy,
        [key]: value,
      },
    });
  };
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };
  
  return (
    <Layout isLoggedIn={true} user={userData}>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8 text-unimog-800 dark:text-unimog-200">
          Settings
        </h1>
        
        <Tabs defaultValue="account" className="max-w-4xl">
          <TabsList className="mb-6">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" value={userData.email} disabled />
                  <p className="text-xs text-muted-foreground">
                    To change your email, please contact support
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="flex space-x-2">
                    <Input id="password" type="password" value="************" disabled />
                    <Button variant="outline" onClick={() => toast({
                      title: "Password reset email sent",
                      description: "Check your inbox for instructions to reset your password.",
                    })}>
                      Change Password
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium text-lg mb-4">Danger Zone</h3>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <div>
                        <p className="font-medium">Download Your Data</p>
                        <p className="text-sm text-muted-foreground">
                          Get a copy of all your data stored in our systems
                        </p>
                      </div>
                      <Button variant="outline">
                        Download Data
                      </Button>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <div>
                        <p className="font-medium">Delete Account</p>
                        <p className="text-sm text-muted-foreground">
                          Permanently delete your account and all your data
                        </p>
                      </div>
                      <Button 
                        variant="destructive"
                        onClick={() => toast({
                          title: "Are you sure?",
                          description: "This action cannot be undone. Please contact support if you want to proceed.",
                          variant: "destructive",
                        })}
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Email Notifications</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch 
                      id="email-notifications" 
                      checked={settings.notifications.email}
                      onCheckedChange={() => handleNotificationChange('email')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="newsletter">Newsletter</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive our monthly newsletter
                      </p>
                    </div>
                    <Switch 
                      id="newsletter" 
                      checked={settings.notifications.newsletters}
                      onCheckedChange={() => handleNotificationChange('newsletters')}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-medium">On-Site Notifications</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="browser-notifications">Browser Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Show notifications in your browser
                      </p>
                    </div>
                    <Switch 
                      id="browser-notifications" 
                      checked={settings.notifications.browser}
                      onCheckedChange={() => handleNotificationChange('browser')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="message-notifications">Messages</Label>
                      <p className="text-sm text-muted-foreground">
                        Notify when you receive a new message
                      </p>
                    </div>
                    <Switch 
                      id="message-notifications" 
                      checked={settings.notifications.messages}
                      onCheckedChange={() => handleNotificationChange('messages')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="mention-notifications">Mentions</Label>
                      <p className="text-sm text-muted-foreground">
                        Notify when someone mentions you
                      </p>
                    </div>
                    <Switch 
                      id="mention-notifications" 
                      checked={settings.notifications.mentions}
                      onCheckedChange={() => handleNotificationChange('mentions')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketplace-notifications">Marketplace Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Notify about new listings matching your interests
                      </p>
                    </div>
                    <Switch 
                      id="marketplace-notifications" 
                      checked={settings.notifications.marketplaceAlerts}
                      onCheckedChange={() => handleNotificationChange('marketplaceAlerts')}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings}>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="profile-visibility">Profile Visibility</Label>
                    <Select 
                      value={settings.privacy.profileVisibility}
                      onValueChange={(value) => handlePrivacyChange('profileVisibility', value)}
                    >
                      <SelectTrigger id="profile-visibility">
                        <SelectValue placeholder="Select who can view your profile" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Everyone</SelectItem>
                        <SelectItem value="members">Members Only</SelectItem>
                        <SelectItem value="connections">My Connections</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-email">Show Email Address</Label>
                      <p className="text-sm text-muted-foreground">
                        Display your email on your public profile
                      </p>
                    </div>
                    <Switch 
                      id="show-email" 
                      checked={settings.privacy.showEmail}
                      onCheckedChange={(checked) => handlePrivacyChange('showEmail', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-location">Show Location</Label>
                      <p className="text-sm text-muted-foreground">
                        Display your location on your public profile
                      </p>
                    </div>
                    <Switch 
                      id="show-location" 
                      checked={settings.privacy.showLocation}
                      onCheckedChange={(checked) => handlePrivacyChange('showLocation', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="allow-messages">Allow Direct Messages</Label>
                      <p className="text-sm text-muted-foreground">
                        Let other members send you direct messages
                      </p>
                    </div>
                    <Switch 
                      id="allow-messages" 
                      checked={settings.privacy.allowDirectMessages}
                      onCheckedChange={(checked) => handlePrivacyChange('allowDirectMessages', checked)}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings}>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
