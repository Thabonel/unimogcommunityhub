
import { Button } from "@/components/ui/button";
import { useTrialSettings } from "@/hooks/use-trial-settings";
import { TrialEnableSection } from "./trial/TrialEnableSection";
import { TrialDurationSection } from "./trial/TrialDurationSection";
import { TrialExtensionSection } from "./trial/TrialExtensionSection";
import { TrialNotificationSection } from "./trial/TrialNotificationSection";
import { TrialMessagesSection } from "./trial/TrialMessagesSection";
import { TrialConversionSection } from "./trial/TrialConversionSection";

export function TrialSettingsSection() {
  const { trialSettings, updateTrialSetting, saveTrialSettings } = useTrialSettings();

  return (
    <div className="space-y-6">
      <TrialEnableSection 
        trialEnabled={trialSettings.trialEnabled}
        onTrialEnabledChange={(checked) => updateTrialSetting("trialEnabled", checked)}
      />
      
      {trialSettings.trialEnabled && (
        <>
          <TrialDurationSection 
            trialDurationDays={trialSettings.trialDurationDays}
            reminderDaysBefore={trialSettings.reminderDaysBefore}
            onTrialDurationChange={(value) => updateTrialSetting("trialDurationDays", value)}
            onReminderDaysChange={(value) => updateTrialSetting("reminderDaysBefore", value)}
          />
          
          <TrialExtensionSection 
            allowTrialExtension={trialSettings.allowTrialExtension}
            extensionDurationDays={trialSettings.extensionDurationDays}
            onAllowExtensionChange={(checked) => updateTrialSetting("allowTrialExtension", checked)}
            onExtensionDurationChange={(value) => updateTrialSetting("extensionDurationDays", value)}
          />

          <TrialNotificationSection 
            sendTrialStartEmail={trialSettings.sendTrialStartEmail}
            sendTrialEndingReminder={trialSettings.sendTrialEndingReminder}
            onStartEmailChange={(checked) => updateTrialSetting("sendTrialStartEmail", checked)}
            onEndingReminderChange={(checked) => updateTrialSetting("sendTrialEndingReminder", checked)}
          />
          
          <TrialMessagesSection 
            customTrialMessage={trialSettings.customTrialMessage}
            trialEndMessage={trialSettings.trialEndMessage}
            onCustomMessageChange={(value) => updateTrialSetting("customTrialMessage", value)}
            onEndMessageChange={(value) => updateTrialSetting("trialEndMessage", value)}
          />
          
          <TrialConversionSection 
            automaticConversion={trialSettings.automaticConversion}
            onAutomaticConversionChange={(checked) => updateTrialSetting("automaticConversion", checked)}
          />
        </>
      )}

      <div className="flex justify-end pt-2">
        <Button onClick={saveTrialSettings}>Save Trial Settings</Button>
      </div>
    </div>
  );
}
