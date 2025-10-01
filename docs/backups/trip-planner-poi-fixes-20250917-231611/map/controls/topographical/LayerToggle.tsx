
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface LayerToggleProps {
  layerId: string;
  label: string;
  isVisible: boolean;
  onToggle: (layerId: string) => void;
  disabled?: boolean;
  isToggling?: boolean;
}

export const LayerToggle = ({
  layerId,
  label,
  isVisible,
  onToggle,
  disabled = false,
  isToggling = false
}: LayerToggleProps) => {
  return (
    <div className="flex items-center justify-between py-1">
      <Label htmlFor={`layer-${layerId}`} className="cursor-pointer text-sm font-normal flex items-center">
        {label}
        {isToggling && (
          <Loader2 className="h-3 w-3 ml-2 animate-spin" />
        )}
      </Label>
      <Switch
        id={`layer-${layerId}`}
        checked={isVisible}
        onCheckedChange={() => onToggle(layerId)}
        disabled={disabled || isToggling}
        aria-label={`Toggle ${label}`}
      />
    </div>
  );
};

export default LayerToggle;
