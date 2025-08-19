
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';

interface LayerStateDisplayProps {
  layerId: string;
  label: string;
  isVisible: boolean;
  isToggling: boolean;
  onToggleLayer: (layerId: string) => void;
}

const LayerStateDisplay = ({
  layerId,
  label,
  isVisible,
  isToggling,
  onToggleLayer
}: LayerStateDisplayProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox 
        id={`${layerId}-toggle`}
        checked={isVisible}
        disabled={isToggling}
        onCheckedChange={() => onToggleLayer(layerId)}
      />
      <label 
        htmlFor={`${layerId}-toggle`}
        className="text-sm cursor-pointer flex items-center"
      >
        {label}
        {isToggling && (
          <Loader2 className="h-3 w-3 ml-2 animate-spin" />
        )}
      </label>
    </div>
  );
};

export default LayerStateDisplay;
