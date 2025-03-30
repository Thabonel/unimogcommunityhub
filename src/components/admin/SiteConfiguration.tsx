import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Settings, BellRing, Palette, Globe } from "lucide-react";

export const SiteConfiguration = () => {
  // State for site configuration options (placeholders)
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [siteTitle, setSiteTitle] = useState("Unimog Community Hub");
  const [siteDescription, setSiteDescription] = useState("A community platform for Unimog enthusiasts");

  const handleSaveChanges = () => {
    // In a real app, this would persist the settings to a database
    toast({
      title: "Settings saved",
      description: "Your site configuration has been updated",
    });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            General Settings
          </CardTitle>
          <CardDescription>
            Configure basic site settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site-title">Site Title</Label>
            <Input 
              id="site-title" 
              value={siteTitle} 
              onChange={(e) => setSiteTitle(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="site-description">Site Description</Label>
            <Input 
              id="site-description" 
              value={siteDescription} 
              onChange={(e) => setSiteDescription(e.target.value)} 
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize the look and feel of your site
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="dark-mode" 
              checked={darkMode} 
              onCheckedChange={setDarkMode} 
            />
            <Label htmlFor="dark-mode">Default to Dark Mode</Label>
          </div>
          <Separator />
          <p className="text-sm text-muted-foreground">
            More theme customization options will be available in the future.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellRing className="h-5 w-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>
            Configure site-wide notification defaults
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="email-notifications" 
              checked={emailNotifications} 
              onCheckedChange={setEmailNotifications} 
            />
            <Label htmlFor="email-notifications">Enable Email Notifications</Label>
          </div>
          <Separator />
          <p className="text-sm text-muted-foreground">
            Additional notification settings will be available in a future update.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Regional Settings
          </CardTitle>
          <CardDescription>
            Configure language and timezone preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground py-8 text-center">
            Regional settings configuration will be available in a future update.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

// Also export as default for compatibility with React.lazy()
export default SiteConfiguration;
