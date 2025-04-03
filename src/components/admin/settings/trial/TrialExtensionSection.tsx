
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SettingsTooltip } from "../SettingsTooltip";

interface TrialExtensionSectionProps {
  allowTrialExtension: boolean;
  extensionDurationDays: number;
  onAllowExtensionChange: (checked: boolean) => void;
  onExtensionDurationChange: (value: number) => void;
}

export function TrialExtensionSection({
  allowTrialExtension,
  extensionDurationDays,
  onAllowExtensionChange,
  onExtensionDurationChange
}: TrialExtensionSectionProps) {
  return (
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
          checked={allowTrialExtension}
          onCheckedChange={onAllowExtensionChange}
        />
      </div>
      
      {allowTrialExtension && (
        <div className="ml-6 mt-2">
          <Label htmlFor="extensionDurationDays">Extension Duration (Days)</Label>
          <Input 
            id="extensionDurationDays" 
            type="number"
            min="1"
            value={extensionDurationDays}
            onChange={(e) => onExtensionDurationChange(parseInt(e.target.value) || 7)} 
            className="w-32 mt-1"
          />
        </div>
      )}
    </div>
  );
}
