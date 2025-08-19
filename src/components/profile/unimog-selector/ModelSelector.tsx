
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { UnimogModel } from './types';

interface ModelSelectorProps {
  models: UnimogModel[];
  currentModel: string | null;
  onModelChange: (modelCode: string) => void;
  disabled: boolean;
  isUpdating: boolean;
}

const ModelSelector = ({ 
  models, 
  currentModel, 
  onModelChange, 
  disabled, 
  isUpdating 
}: ModelSelectorProps) => {
  const [showCustomInput, setShowCustomInput] = useState(currentModel === 'CUSTOM');
  const [customModel, setCustomModel] = useState('');

  const handleSelectChange = (value: string) => {
    if (value === 'CUSTOM') {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
      onModelChange(value);
    }
  };

  const handleCustomModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomModel(value);
    if (value.trim()) {
      onModelChange(`CUSTOM:${value}`);
    }
  };

  return (
    <>
      <Select
        value={showCustomInput ? 'CUSTOM' : (currentModel || undefined)}
        onValueChange={handleSelectChange}
        disabled={disabled || isUpdating}
      >
        <SelectTrigger id="unimogModel" className="w-full">
          <SelectValue placeholder="Select a Unimog model" />
        </SelectTrigger>
        <SelectContent>
          {models.map((model) => (
            <SelectItem key={model.model_code} value={model.model_code}>
              <div className="flex flex-col">
                <span className="font-medium">{model.name}</span>
                {model.year_range && (
                  <span className="text-sm text-muted-foreground">{model.year_range}</span>
                )}
              </div>
            </SelectItem>
          ))}
          <SelectItem value="CUSTOM">
            <span className="font-medium">Other / Custom Model</span>
          </SelectItem>
        </SelectContent>
      </Select>
      
      {showCustomInput && (
        <div className="mt-2">
          <Input
            placeholder="Enter your Unimog model (e.g., U435 Custom)"
            value={customModel}
            onChange={handleCustomModelChange}
            disabled={disabled || isUpdating}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter your custom or modified Unimog model designation
          </p>
        </div>
      )}
      
      {isUpdating && (
        <div className="flex items-center gap-2 mt-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-muted-foreground">Updating model information...</span>
        </div>
      )}
    </>
  );
};

export default ModelSelector;
