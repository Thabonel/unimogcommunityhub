
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsTooltip } from "../SettingsTooltip";

interface TrialDurationSectionProps {
  trialDurationDays: number;
  reminderDaysBefore: number;
  onTrialDurationChange: (value: number) => void;
  onReminderDaysChange: (value: number) => void;
}

export function TrialDurationSection({
  trialDurationDays,
  reminderDaysBefore,
  onTrialDurationChange,
  onReminderDaysChange
}: TrialDurationSectionProps) {
  return (
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
          value={trialDurationDays}
          onChange={(e) => onTrialDurationChange(parseInt(e.target.value) || 14)} 
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
          value={reminderDaysBefore}
          onChange={(e) => onReminderDaysChange(parseInt(e.target.value) || 3)} 
        />
      </div>
    </div>
  );
}
