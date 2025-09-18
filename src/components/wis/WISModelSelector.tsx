// WISModelSelector - Vehicle model selection component
import React from 'react';
import { useWISModels } from '@/hooks/useWIS';
import { useWISActions, useWISNavigation, useWISUI } from '@/stores/wisStore';
import { cn } from '@/lib/utils';

// UI Components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

// Icons
import { Truck, AlertCircle } from 'lucide-react';

interface WISModelSelectorProps {
  className?: string;
}

export const WISModelSelector: React.FC<WISModelSelectorProps> = ({
  className,
}) => {
  const { data: models, isLoading, error } = useWISModels();
  const navigation = useWISNavigation();
  const ui = useWISUI();
  const actions = useWISActions();

  const selectedModel = models?.find(m => m.id === navigation.selectedModel);

  const handleModelChange = (modelId: string) => {
    actions.setSelectedModel(modelId);
    actions.setViewMode('tree'); // Switch to tree view when model selected
  };

  if (isLoading) {
    return (
      <div className={cn("p-4 border-b border-gray-200", className)}>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("p-4 border-b border-red-200 bg-red-50", className)}>
        <div className="flex items-center space-x-2 text-red-700">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">Failed to load models</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("p-4 border-b border-gray-200 bg-gray-50", className)}>
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700 uppercase tracking-wide">
          Vehicle Model
        </label>
        <Select
          value={navigation.selectedModel || ''}
          onValueChange={handleModelChange}
        >
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="Select Vehicle Model">
              {selectedModel && (
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4 text-gray-600" />
                  <div className="flex flex-col items-start">
                    <span className="font-semibold text-blue-700">
                      {selectedModel.model_code}
                    </span>
                    <span className="text-xs text-gray-600">
                      {selectedModel.model_name}
                    </span>
                  </div>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {models?.map(model => (
              <SelectItem key={model.id} value={model.id}>
                <div className="flex items-center space-x-3 py-1">
                  <Truck className="h-4 w-4 text-gray-600" />
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-blue-700">
                        {model.model_code}
                      </span>
                      {model.year_range && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {model.year_range}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-700">
                      {model.model_name}
                    </span>
                    {model.description && (
                      <span className="text-xs text-gray-500 max-w-xs truncate">
                        {model.description}
                      </span>
                    )}
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Model Information */}
        {selectedModel && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">
                  {selectedModel.model_code} - {selectedModel.model_name}
                </span>
                {selectedModel.year_range && (
                  <span className="text-xs text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                    {selectedModel.year_range}
                  </span>
                )}
              </div>
              {selectedModel.description && (
                <p className="text-xs text-blue-700">
                  {selectedModel.description}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {selectedModel && (
          <div className="mt-2 flex space-x-2 text-xs">
            <button
              onClick={() => actions.clearNavigation()}
              className="text-gray-600 hover:text-gray-900 underline"
            >
              Clear Selection
            </button>
          </div>
        )}
      </div>
    </div>
  );
};