
import { useState } from "react";
import { toast } from "./use-toast";

export interface TrialSettings {
  trialEnabled: boolean;
  trialDurationDays: number;
  allowTrialExtension: boolean;
  extensionDurationDays: number;
  sendTrialStartEmail: boolean;
  sendTrialEndingReminder: boolean;
  reminderDaysBefore: number;
  customTrialMessage: string;
  trialEndMessage: string;
  automaticConversion: boolean;
}

export function useTrialSettings(initialSettings?: Partial<TrialSettings>) {
  const [trialSettings, setTrialSettings] = useState<TrialSettings>({
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
    ...initialSettings
  });

  const updateTrialSetting = <K extends keyof TrialSettings>(
    key: K, 
    value: TrialSettings[K]
  ) => {
    setTrialSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveTrialSettings = async () => {
    try {
      // Here you would typically make an API call to save the settings
      // For now, we'll just simulate success with a toast notification
      toast({
        title: "Trial settings saved",
        description: "Your trial period settings have been updated."
      });
      return true;
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your trial settings.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    trialSettings,
    setTrialSettings,
    updateTrialSetting,
    saveTrialSettings
  };
}
