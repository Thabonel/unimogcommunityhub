
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SettingsTooltip } from "../SettingsTooltip";

interface TrialNotificationSectionProps {
  sendTrialStartEmail: boolean;
  sendTrialEndingReminder: boolean;
  onStartEmailChange: (checked: boolean) => void;
  onEndingReminderChange: (checked: boolean) => void;
}

export function TrialNotificationSection({
  sendTrialStartEmail,
  sendTrialEndingReminder,
  onStartEmailChange,
  onEndingReminderChange
}: TrialNotificationSectionProps) {
  return (
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
            checked={sendTrialStartEmail}
            onCheckedChange={onStartEmailChange}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="sendTrialEndingReminder" className="flex items-center cursor-pointer">
            Send trial ending reminder
            <SettingsTooltip content="Send a reminder before the trial period ends" />
          </Label>
          <Switch 
            id="sendTrialEndingReminder" 
            checked={sendTrialEndingReminder}
            onCheckedChange={onEndingReminderChange}
          />
        </div>
      </div>
    </div>
  );
}
