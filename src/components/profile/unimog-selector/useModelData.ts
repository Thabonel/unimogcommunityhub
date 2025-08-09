
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase-client';
import { UnimogModel, getDefaultModels, isMasterUser } from './types';
// Removed useErrorHandler import since we're using graceful fallback instead

export const useModelData = () => {
  const [models, setModels] = useState<UnimogModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [loadingFailed, setLoadingFailed] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  // Removed useErrorHandler since we're using graceful fallback
  
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
        // Don't throw error, use fallback instead
        console.log("Database fetch failed, using default models as fallback");
        setModels(getDefaultModels());
        setLoadingFailed(false);
        setIsLoading(false);
        return;
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
      console.log("Using fallback models due to:", error);
      
      // Don't show error toast when we have fallback models available
      // Only log to console for debugging
      if (process.env.NODE_ENV === 'development') {
        console.error('Database fetch failed, using default models:', error);
      }
      
      // Use defaults as fallback - this is expected behavior
      setModels(getDefaultModels());
      setLoadingFailed(false); // Don't show error state when fallback works
      
      // Don't call handleError here since we have a successful fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, [user]); // Removed toast dependency since we're not using toasts for errors anymore

  return {
    models,
    isLoading,
    isUpdating,
    setIsUpdating,
    loadingFailed,
    fetchModels
  };
};
