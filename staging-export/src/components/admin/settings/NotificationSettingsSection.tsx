
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SettingsTooltip } from "./SettingsTooltip";
import { toast } from "@/hooks/use-toast";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  enabled: boolean;
}

export function NotificationSettingsSection() {
  const [emailSettings, setEmailSettings] = useState({
    enableUserSignup: true,
    enablePasswordReset: true,
    enableContentNotifications: true,
    enableMarketplaceNotifications: true,
    enableAdminAlerts: true,
    fromName: "Unimog Community Hub",
    fromEmail: "noreply@unimogcommunityhub.com"
  });

  const [appNotifications, setAppNotifications] = useState({
    enableInAppNotifications: true,
    notificationDuration: 5,
    enableSound: false,
    enableBrowserNotifications: true,
  });

  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([
    { 
      id: "welcome", 
      name: "Welcome Email", 
      subject: "Welcome to Unimog Community Hub!",
      body: "Hello {{name}},\n\nWelcome to the Unimog Community Hub! We're excited to have you join our community.\n\nBest regards,\nThe Unimog Team", 
      enabled: true 
    },
    { 
      id: "password-reset", 
      name: "Password Reset", 
      subject: "Password Reset Instructions",
      body: "Hello {{name}},\n\nYou requested a password reset. Please click the link below to reset your password:\n\n{{resetLink}}\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nThe Unimog Team", 
      enabled: true 
    },
    { 
      id: "new-content", 
      name: "New Content Alert", 
      subject: "New Content Available: {{contentTitle}}",
      body: "Hello {{name}},\n\nWe wanted to let you know that new content has been published that might interest you:\n\n{{contentTitle}}\n\nCheck it out here: {{contentLink}}\n\nBest regards,\nThe Unimog Team", 
      enabled: true 
    }
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);

  const handleSaveEmailSettings = () => {
    toast({
      title: "Email settings saved",
      description: "Your email notification settings have been updated."
    });
  };

  const handleSaveAppSettings = () => {
    toast({
      title: "In-app notification settings saved",
      description: "Your in-app notification settings have been updated."
    });
  };

  const handleTemplateChange = (template: EmailTemplate) => {
    setEmailTemplates(templates => templates.map(t => 
      t.id === template.id ? template : t
    ));
  };

  const handleTemplateToggle = (id: string, enabled: boolean) => {
    setEmailTemplates(templates => templates.map(t => 
      t.id === id ? { ...t, enabled } : t
    ));
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="email">
        <TabsList>
          <TabsTrigger value="email">Email Notifications</TabsTrigger>
          <TabsTrigger value="in-app">In-App Notifications</TabsTrigger>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="email" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">User Account Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Configure emails sent for user account activities
                  </p>
                </div>
              </div>

              <div className="ml-6 space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableUserSignup" className="flex items-center cursor-pointer">
                    New user signup 
                    <SettingsTooltip content="Send a welcome email when new users sign up" />
                  </Label>
                  <Switch 
                    id="enableUserSignup" 
                    checked={emailSettings.enableUserSignup}
                    onCheckedChange={(checked) => setEmailSettings({...emailSettings, enableUserSignup: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="enablePasswordReset" className="flex items-center cursor-pointer">
                    Password reset 
                    <SettingsTooltip content="Send emails for password reset requests" />
                  </Label>
                  <Switch 
                    id="enablePasswordReset" 
                    checked={emailSettings.enablePasswordReset}
                    onCheckedChange={(checked) => setEmailSettings({...emailSettings, enablePasswordReset: checked})}
                  />
                </div>
              </div>

              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Content Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Configure emails sent for content updates
                  </p>
                </div>
              </div>

              <div className="ml-6 space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableContentNotifications" className="flex items-center cursor-pointer">
                    New content alerts 
                    <SettingsTooltip content="Notify users when new articles or manuals are published" />
                  </Label>
                  <Switch 
                    id="enableContentNotifications" 
                    checked={emailSettings.enableContentNotifications}
                    onCheckedChange={(checked) => setEmailSettings({...emailSettings, enableContentNotifications: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableMarketplaceNotifications" className="flex items-center cursor-pointer">
                    Marketplace notifications 
                    <SettingsTooltip content="Notify users about marketplace activities like new listings or purchases" />
                  </Label>
                  <Switch 
                    id="enableMarketplaceNotifications" 
                    checked={emailSettings.enableMarketplaceNotifications}
                    onCheckedChange={(checked) => setEmailSettings({...emailSettings, enableMarketplaceNotifications: checked})}
                  />
                </div>
              </div>

              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Admin Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Configure emails sent to administrators
                  </p>
                </div>
              </div>

              <div className="ml-6 space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableAdminAlerts" className="flex items-center cursor-pointer">
                    Admin alerts 
                    <SettingsTooltip content="Send notifications to admins about important events" />
                  </Label>
                  <Switch 
                    id="enableAdminAlerts" 
                    checked={emailSettings.enableAdminAlerts}
                    onCheckedChange={(checked) => setEmailSettings({...emailSettings, enableAdminAlerts: checked})}
                  />
                </div>
              </div>

              <Separator />
              
              <div className="space-y-4">
                <Label className="text-base">Email Configuration</Label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fromName">From Name</Label>
                    <Input 
                      id="fromName" 
                      value={emailSettings.fromName} 
                      onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fromEmail">From Email</Label>
                    <Input 
                      id="fromEmail" 
                      value={emailSettings.fromEmail} 
                      onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})} 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={handleSaveEmailSettings}>Save Email Settings</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="in-app" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="enableInAppNotifications" className="flex items-center cursor-pointer">
                  Enable in-app notifications
                  <SettingsTooltip content="Show notification toasts within the application" />
                </Label>
                <Switch 
                  id="enableInAppNotifications" 
                  checked={appNotifications.enableInAppNotifications}
                  onCheckedChange={(checked) => setAppNotifications({...appNotifications, enableInAppNotifications: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="enableSound" className="flex items-center cursor-pointer">
                  Enable notification sounds 
                  <SettingsTooltip content="Play a sound when notifications appear" />
                </Label>
                <Switch 
                  id="enableSound" 
                  checked={appNotifications.enableSound}
                  onCheckedChange={(checked) => setAppNotifications({...appNotifications, enableSound: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="enableBrowserNotifications" className="flex items-center cursor-pointer">
                  Enable browser notifications 
                  <SettingsTooltip content="Show browser notifications when the app is in the background" />
                </Label>
                <Switch 
                  id="enableBrowserNotifications" 
                  checked={appNotifications.enableBrowserNotifications}
                  onCheckedChange={(checked) => setAppNotifications({...appNotifications, enableBrowserNotifications: checked})}
                />
              </div>
              
              <div className="space-y-2 mt-4">
                <Label htmlFor="notificationDuration">
                  Notification duration (seconds)
                </Label>
                <Input 
                  id="notificationDuration" 
                  type="number"
                  min="1"
                  max="20"
                  value={appNotifications.notificationDuration}
                  onChange={(e) => setAppNotifications({
                    ...appNotifications, 
                    notificationDuration: parseInt(e.target.value) || 5
                  })} 
                  className="w-32"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={handleSaveAppSettings}>Save In-App Settings</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4 pt-4">
          <div className="grid md:grid-cols-[300px_1fr] gap-6">
            <div className="space-y-4">
              <div className="font-medium">Email Templates</div>
              <div className="space-y-1">
                {emailTemplates.map(template => (
                  <div 
                    key={template.id}
                    className={`flex items-center justify-between p-2 rounded hover:bg-muted cursor-pointer ${selectedTemplate?.id === template.id ? "bg-muted" : ""}`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <span>{template.name}</span>
                    <Switch 
                      checked={template.enabled} 
                      onCheckedChange={(checked) => {
                        handleTemplateToggle(template.id, checked);
                        event?.stopPropagation();
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 border-l pl-6">
              {selectedTemplate ? (
                <>
                  <h3 className="text-lg font-medium">{selectedTemplate.name}</h3>
                  <div className="space-y-2">
                    <Label htmlFor="templateSubject">Subject</Label>
                    <Input 
                      id="templateSubject" 
                      value={selectedTemplate.subject} 
                      onChange={(e) => handleTemplateChange({...selectedTemplate, subject: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="templateBody">Email Body</Label>
                    <Textarea 
                      id="templateBody" 
                      value={selectedTemplate.body} 
                      onChange={(e) => handleTemplateChange({...selectedTemplate, body: e.target.value})}
                      className="min-h-[250px] font-mono text-sm"
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Available variables:</p>
                    <ul className="list-disc ml-5 mt-1">
                      <li>{"{{name}}"} - User's name</li>
                      <li>{"{{email}}"} - User's email</li>
                      {selectedTemplate.id === "password-reset" && (
                        <li>{"{{resetLink}}"} - Password reset link</li>
                      )}
                      {selectedTemplate.id === "new-content" && (
                        <>
                          <li>{"{{contentTitle}}"} - Title of the new content</li>
                          <li>{"{{contentLink}}"} - Link to the new content</li>
                        </>
                      )}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-[400px] border rounded border-dashed">
                  <p className="text-muted-foreground">Select a template to edit</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
