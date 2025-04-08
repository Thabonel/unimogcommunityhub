
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';

interface LayerToggleProps {
  id: string;
  label: string;
  checked: boolean;
  disabled: boolean;
  isToggling: boolean;
  onCheckedChange: () => void;
}

const LayerToggle = ({
  id,
  label,
  checked,
  disabled,
  isToggling,
  onCheckedChange
}: LayerToggleProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox 
        id={id} 
        checked={checked} 
        disabled={disabled || isToggling}
        onCheckedChange={onCheckedChange}
      />
      <label 
        htmlFor={id} 
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

export default LayerToggle;
