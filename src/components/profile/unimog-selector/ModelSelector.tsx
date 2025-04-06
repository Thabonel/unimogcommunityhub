
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  return (
    <>
      <Select
        value={currentModel || undefined}
        onValueChange={onModelChange}
        disabled={disabled || isUpdating}
      >
        <SelectTrigger id="unimogModel" className="w-full">
          <SelectValue placeholder="Select a Unimog model" />
        </SelectTrigger>
        <SelectContent>
          {models.map((model) => (
            <SelectItem key={model.model_code} value={model.model_code}>
              {model.model_code} - {model.series} Series{' '}
              {model.year_range ? `(${model.year_range})` : ''}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
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
