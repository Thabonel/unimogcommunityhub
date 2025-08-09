
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LoadingState, 
  ErrorState, 
  ModelSelector, 
  useModelData,
  UnimogModelSelectorProps, 
  isMasterUser 
} from './unimog-selector';

const UnimogModelSelector = ({ 
  currentModel, 
  onChange, 
  disabled = false 
}: UnimogModelSelectorProps) => {
  const { 
    models, 
    isLoading, 
    isUpdating, 
    setIsUpdating, 
    loadingFailed, 
    fetchModels 
  } = useModelData();
  
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleModelChange = async (modelCode: string) => {
    if (!user) return;
    
    try {
      setIsUpdating(true);
      
      const selectedModel = models.find(model => model.model_code === modelCode);
      
      if (selectedModel) {
        // Call the onChange callback with the selected model data
        onChange(
          selectedModel.model_code,
          selectedModel.series,
          selectedModel.specs,
          selectedModel.features
        );
        
        // Skip wiki data fetching for master users
        if (isMasterUser(user)) {
          console.log("Master user detected, skipping wiki data fetch");
          return;
        }
        
        // Note: Wiki data fetching functionality would go here if needed
        // Currently disabled as these Supabase functions don't exist yet
      }
    } catch (error) {
      console.error('Error updating Unimog model:', error);
      toast({
        title: "Error",
        description: "Failed to update Unimog model",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor="unimogModel">Unimog Model</Label>
      
      {isLoading && <LoadingState />}
      
      {loadingFailed && !isLoading && models.length === 0 && (
        <ErrorState onRetry={fetchModels} />
      )}
      
      {!isLoading && !loadingFailed && models.length > 0 && (
        <ModelSelector
          models={models}
          currentModel={currentModel}
          onModelChange={handleModelChange}
          disabled={disabled}
          isUpdating={isUpdating}
        />
      )}
    </div>
  );
};

export default UnimogModelSelector;
