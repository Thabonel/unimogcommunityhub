
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SettingsTooltip } from "../SettingsTooltip";

interface TrialEnableSectionProps {
  trialEnabled: boolean;
  onTrialEnabledChange: (checked: boolean) => void;
}

export function TrialEnableSection({
  trialEnabled,
  onTrialEnabledChange
}: TrialEnableSectionProps) {
  return (
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
        checked={trialEnabled}
        onCheckedChange={onTrialEnabledChange}
      />
    </div>
  );
}
