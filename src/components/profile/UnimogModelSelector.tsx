
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
import { isMasterUser } from '@/hooks/profile/use-master-profile';

interface UnimogModel {
  model_code: string;
  series: string;
  name: string;
  specs: Record<string, any>;
  features: string[];
  year_range?: string; // Make it optional
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
  const [loadingFailed, setLoadingFailed] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Add default Unimog models for master users to ensure the component works
  const defaultModels: UnimogModel[] = [
    {
      id: '1',
      model_code: 'U1700L',
      series: 'U1700',
      name: 'Unimog U1700L',
      specs: {
        engine: 'OM352A 5.7L',
        power: '124 hp',
        transmission: '8 forward, 8 reverse'
      },
      features: ['All-wheel drive', 'Portal axles', 'Coil springs'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      model_code: 'U4000',
      series: 'UHN',
      name: 'Unimog U4000',
      specs: {
        engine: 'OM924LA 4.8L',
        power: '218 hp',
        transmission: 'UG100 transmission'
      },
      features: ['Advanced electronics', 'High ground clearance', 'Central tire inflation'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      model_code: 'U5000',
      series: 'UHN',
      name: 'Unimog U5000',
      specs: {
        engine: 'OM924LA 4.8L',
        power: '218 hp',
        transmission: 'UG100 transmission'
      },
      features: ['Military grade', 'Extreme off-road capability', 'High payload capacity'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
  
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setIsLoading(true);
        setLoadingFailed(false);
        
        // If master user, use the default models to avoid database calls
        if (user && isMasterUser(user)) {
          console.log("Master user detected, using predefined models");
          setModels(defaultModels);
          setIsLoading(false);
          return;
        }
        
        // For regular users, fetch from the database
        const { data, error } = await supabase
          .from('unimog_models')
          .select('*')
          .order('model_code');
          
        if (error) {
          console.error('Error fetching Unimog models:', error);
          setLoadingFailed(true);
          throw error;
        }
        
        if (data && data.length > 0) {
          // Type assertion to ensure the data matches our UnimogModel interface
          setModels(data as UnimogModel[]);
        } else {
          // If no models found in database but not in development, use defaults
          console.log("No models found in database, using default models");
          setModels(defaultModels);
        }
      } catch (error) {
        console.error('Error fetching Unimog models:', error);
        // Use defaults as fallback
        setModels(defaultModels);
        
        toast({
          title: "Warning",
          description: "Could not load all Unimog models from database. Using basic models instead.",
          variant: "warning",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchModels();
  }, [toast, user]);
  
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
  
  // Render error state with retry button
  if (loadingFailed && !isLoading && models.length === 0) {
    return (
      <div className="space-y-2">
        <Label htmlFor="unimogModel">Unimog Model</Label>
        <div className="p-4 border border-red-200 rounded-md bg-red-50 text-red-800">
          <p className="text-sm">Failed to load model data</p>
          <button 
            onClick={() => {
              setIsLoading(true);
              setLoadingFailed(false);
              const fetchModels = async () => {
                try {
                  const { data, error } = await supabase
                    .from('unimog_models')
                    .select('*')
                    .order('model_code');
                  
                  if (error) throw error;
                  
                  if (data) {
                    setModels(data as UnimogModel[]);
                  } else {
                    setModels(defaultModels);
                  }
                  setLoadingFailed(false);
                } catch (error) {
                  console.error('Error retrying model fetch:', error);
                  setModels(defaultModels);
                  setLoadingFailed(true);
                } finally {
                  setIsLoading(false);
                }
              };
              fetchModels();
            }}
            className="mt-2 text-sm text-red-600 underline hover:text-red-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
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
