
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface LayerToggleProps {
  layerId: string;
  label: string;
  isVisible: boolean;
  onToggle: (layerId: string) => void;
  disabled?: boolean;
}

export const LayerToggle = ({
  layerId,
  label,
  isVisible,
  onToggle,
  disabled = false
}: LayerToggleProps) => {
  return (
    <div className="flex items-center justify-between py-1">
      <Label htmlFor={`layer-${layerId}`} className="cursor-pointer text-sm font-normal">
        {label}
      </Label>
      <Switch
        id={`layer-${layerId}`}
        checked={isVisible}
        onCheckedChange={() => onToggle(layerId)}
        disabled={disabled}
        aria-label={`Toggle ${label}`}
      />
    </div>
  );
};

export default LayerToggle;
