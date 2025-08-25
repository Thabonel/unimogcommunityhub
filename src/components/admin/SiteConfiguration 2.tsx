
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsSection } from "./settings/SettingsSection";
import { NotificationSettingsSection } from "./settings/NotificationSettingsSection";
import { TrialSettingsSection } from "./settings/TrialSettingsSection";
import { BrandingSection } from "./settings/BrandingSection";
import { SecuritySettingsSection } from "./settings/SecuritySettingsSection";
import { Settings, Bell, Clock, Palette, Shield } from "lucide-react";

export const SiteConfiguration = () => {
  return (
    <div className="space-y-8">
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="border-b w-full rounded-none justify-start mb-4 pb-0">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="trial" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Trial</span>
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span>Branding</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <SettingsSection 
            title="General Settings"
            description="Configure basic site settings"
            icon={Settings}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="site-title" className="text-sm font-medium">Site Title</label>
                  <input 
                    id="site-title" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue="Unimog Community Hub" 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="site-description" className="text-sm font-medium">Site Description</label>
                  <input 
                    id="site-description" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue="A community platform for Unimog enthusiasts" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="site-url" className="text-sm font-medium">Site URL</label>
                <input 
                  id="site-url" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue="https://unimogcommunityhub.com" 
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="admin-email" className="text-sm font-medium">Admin Email</label>
                <input 
                  id="admin-email" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue="admin@unimogcommunityhub.com" 
                />
              </div>

              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="maintenance-mode" 
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="maintenance-mode" className="text-sm font-medium">Enable Maintenance Mode</label>
              </div>

              <div className="flex justify-end">
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                  Save Changes
                </button>
              </div>
            </div>
          </SettingsSection>
        </TabsContent>

        <TabsContent value="notifications">
          <SettingsSection 
            title="Notification Settings"
            description="Configure email and in-app notifications"
            icon={Bell}
          >
            <NotificationSettingsSection />
          </SettingsSection>
        </TabsContent>

        <TabsContent value="trial">
          <SettingsSection 
            title="Trial Period Settings"
            description="Configure free trial options and conversion tracking"
            icon={Clock}
          >
            <TrialSettingsSection />
          </SettingsSection>
        </TabsContent>

        <TabsContent value="branding">
          <SettingsSection 
            title="Branding Options"
            description="Customize the look and feel of your platform"
            icon={Palette}
          >
            <BrandingSection />
          </SettingsSection>
        </TabsContent>

        <TabsContent value="security">
          <SettingsSection 
            title="Security Settings"
            description="Configure authentication and security options"
            icon={Shield}
          >
            <SecuritySettingsSection />
          </SettingsSection>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Also export as default for compatibility with React.lazy()
export default SiteConfiguration;
