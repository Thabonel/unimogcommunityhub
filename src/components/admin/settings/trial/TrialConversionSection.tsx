
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SettingsTooltip } from "../SettingsTooltip";

interface TrialConversionSectionProps {
  automaticConversion: boolean;
  onAutomaticConversionChange: (checked: boolean) => void;
}

export function TrialConversionSection({
  automaticConversion,
  onAutomaticConversionChange
}: TrialConversionSectionProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="automaticConversion" className="flex items-center cursor-pointer">
          Automatic Conversion Tracking
          <SettingsTooltip content="Track user conversion rates from trial to paid subscriptions" />
        </Label>
        <Switch 
          id="automaticConversion" 
          checked={automaticConversion}
          onCheckedChange={onAutomaticConversionChange}
        />
      </div>
    </div>
  );
}
