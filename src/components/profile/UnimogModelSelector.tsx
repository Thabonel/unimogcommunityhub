
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface UnimogModel {
  model_code: string;
  series: string;
  name: string;
  specs: Record<string, any>;
  features: string[];
  // Remove the required year_range property that doesn't exist in the database
  year_range?: string; // Make it optional
  // Add other fields from the database that we might need
  id: string;
  capabilities?: string;
  history?: string;
  wiki_data?: any;
  created_at: string;
  updated_at: string;
}

interface UnimogModelSelectorProps {
  currentModel: string | null;
  onChange: (model: string, series: string, specs: Record<string, any>, features: string[]) => void;
  disabled?: boolean;
}

const UnimogModelSelector = ({ currentModel, onChange, disabled = false }: UnimogModelSelectorProps) => {
  const [models, setModels] = useState<UnimogModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('unimog_models')
          .select('*')
          .order('model_code');
          
        if (error) throw error;
        
        if (data) {
          // Type assertion to ensure the data matches our UnimogModel interface
          setModels(data as UnimogModel[]);
        }
      } catch (error) {
        console.error('Error fetching Unimog models:', error);
        toast({
          title: "Error",
          description: "Could not load Unimog models. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchModels();
  }, [toast]);
  
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
        
        // Fetch additional information from Wikipedia if available
        try {
          await supabase.functions.invoke('fetch-wikipedia', {
            body: { modelCode }
          });
          
          // Update user profile with wiki data (this happens in a separate function)
          await supabase.functions.invoke('update-profile-unimog', {
            body: { userId: user.id, modelCode }
          });
        } catch (wikiError) {
          console.error('Error fetching model wiki data:', wikiError);
          // Continue anyway - this is optional enrichment data
        }
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
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-muted-foreground">Loading models...</span>
        </div>
      ) : (
        <Select
          value={currentModel || undefined}
          onValueChange={handleModelChange}
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
      )}
      {isUpdating && (
        <div className="flex items-center gap-2 mt-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-muted-foreground">Updating model information...</span>
        </div>
      )}
    </div>
  );
};

export default UnimogModelSelector;
