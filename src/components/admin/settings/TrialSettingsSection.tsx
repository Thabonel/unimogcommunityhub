
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SettingsTooltip } from "./SettingsTooltip";
import { toast } from "@/hooks/use-toast";

export function TrialSettingsSection() {
  const [trialSettings, setTrialSettings] = useState({
    trialEnabled: true,
    trialDurationDays: 14,
    allowTrialExtension: false,
    extensionDurationDays: 7,
    sendTrialStartEmail: true,
    sendTrialEndingReminder: true,
    reminderDaysBefore: 3,
    customTrialMessage: "Try out all premium features free for {{duration}} days. No credit card required.",
    trialEndMessage: "Your trial is ending soon! Subscribe now to keep enjoying premium features.",
    automaticConversion: true,
  });

  const handleSave = () => {
    toast({
      title: "Trial settings saved",
      description: "Your trial period settings have been updated."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center">
            <Label htmlFor="trialEnabled" className="text-base font-medium cursor-pointer">Enable Free Trial</Label>
            <SettingsTooltip content="Allow new users to try premium features before subscribing" />
          </div>
          <p className="text-sm text-muted-foreground">
            When enabled, new users will be given a free trial period
          </p>
        </div>
        <Switch 
          id="trialEnabled" 
          checked={trialSettings.trialEnabled}
          onCheckedChange={(checked) => setTrialSettings({...trialSettings, trialEnabled: checked})}
        />
      </div>
      
      {trialSettings.trialEnabled && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trialDurationDays">
                Trial Duration (Days)
                <SettingsTooltip content="Number of days users can access premium features for free" />
              </Label>
              <Input 
                id="trialDurationDays" 
                type="number"
                min="1"
                value={trialSettings.trialDurationDays}
                onChange={(e) => setTrialSettings({
                  ...trialSettings, 
                  trialDurationDays: parseInt(e.target.value) || 14
                })} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reminderDaysBefore">
                Reminder Days Before End
                <SettingsTooltip content="Send a reminder email this many days before trial expires" />
              </Label>
              <Input 
                id="reminderDaysBefore" 
                type="number"
                min="1"
                value={trialSettings.reminderDaysBefore}
                onChange={(e) => setTrialSettings({
                  ...trialSettings, 
                  reminderDaysBefore: parseInt(e.target.value) || 3
                })} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="allowTrialExtension" className="flex items-center cursor-pointer">
                  Allow Trial Extension
                  <SettingsTooltip content="Enable administrators to extend trial periods for users" />
                </Label>
              </div>
              <Switch 
                id="allowTrialExtension" 
                checked={trialSettings.allowTrialExtension}
                onCheckedChange={(checked) => setTrialSettings({...trialSettings, allowTrialExtension: checked})}
              />
            </div>
            
            {trialSettings.allowTrialExtension && (
              <div className="ml-6 mt-2">
                <Label htmlFor="extensionDurationDays">Extension Duration (Days)</Label>
                <Input 
                  id="extensionDurationDays" 
                  type="number"
                  min="1"
                  value={trialSettings.extensionDurationDays}
                  onChange={(e) => setTrialSettings({
                    ...trialSettings, 
                    extensionDurationDays: parseInt(e.target.value) || 7
                  })} 
                  className="w-32 mt-1"
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium">Trial Notifications</Label>
            
            <div className="space-y-2 ml-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="sendTrialStartEmail" className="flex items-center cursor-pointer">
                  Send trial start email
                  <SettingsTooltip content="Send a welcome email when users start their trial" />
                </Label>
                <Switch 
                  id="sendTrialStartEmail" 
                  checked={trialSettings.sendTrialStartEmail}
                  onCheckedChange={(checked) => setTrialSettings({...trialSettings, sendTrialStartEmail: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="sendTrialEndingReminder" className="flex items-center cursor-pointer">
                  Send trial ending reminder
                  <SettingsTooltip content="Send a reminder before the trial period ends" />
                </Label>
                <Switch 
                  id="sendTrialEndingReminder" 
                  checked={trialSettings.sendTrialEndingReminder}
                  onCheckedChange={(checked) => setTrialSettings({...trialSettings, sendTrialEndingReminder: checked})}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customTrialMessage">
              Trial Welcome Message
              <SettingsTooltip content="Message shown to users when they start a trial" />
            </Label>
            <Textarea 
              id="customTrialMessage" 
              value={trialSettings.customTrialMessage}
              onChange={(e) => setTrialSettings({...trialSettings, customTrialMessage: e.target.value})}
              placeholder="Enter custom trial message"
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              Use {`{{duration}}`} to include the trial duration in days
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="trialEndMessage">
              Trial Ending Message
              <SettingsTooltip content="Message shown to users when their trial is about to end" />
            </Label>
            <Textarea 
              id="trialEndMessage" 
              value={trialSettings.trialEndMessage}
              onChange={(e) => setTrialSettings({...trialSettings, trialEndMessage: e.target.value})}
              placeholder="Enter trial ending message"
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="automaticConversion" className="flex items-center cursor-pointer">
                Automatic Conversion Tracking
                <SettingsTooltip content="Track user conversion rates from trial to paid subscriptions" />
              </Label>
              <Switch 
                id="automaticConversion" 
                checked={trialSettings.automaticConversion}
                onCheckedChange={(checked) => setTrialSettings({...trialSettings, automaticConversion: checked})}
              />
            </div>
          </div>
        </>
      )}

      <div className="flex justify-end pt-2">
        <Button onClick={handleSave}>Save Trial Settings</Button>
      </div>
    </div>
  );
}
