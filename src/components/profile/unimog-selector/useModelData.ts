
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { UnimogModel, getDefaultModels, isMasterUser } from './types';

export const useModelData = () => {
  const [models, setModels] = useState<UnimogModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [loadingFailed, setLoadingFailed] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const fetchModels = async () => {
    try {
      setIsLoading(true);
      setLoadingFailed(false);
      
      // If master user, use the default models to avoid database calls
      if (user && isMasterUser(user)) {
        console.log("Master user detected, using predefined models");
        setModels(getDefaultModels());
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
        setModels(getDefaultModels());
      }
    } catch (error) {
      console.error('Error fetching Unimog models:', error);
      // Use defaults as fallback
      setModels(getDefaultModels());
      
      toast({
        title: "Warning",
        description: "Could not load all Unimog models from database. Using basic models instead.",
        variant: "warning",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, [toast, user]);

  return {
    models,
    isLoading,
    isUpdating,
    setIsUpdating,
    loadingFailed,
    fetchModels
  };
};
