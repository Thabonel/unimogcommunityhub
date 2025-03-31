
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WikipediaData {
  title: string;
  extract: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  content_urls: {
    desktop: {
      page: string;
    };
  };
}

interface UnimogModel {
  id: string;
  model_code: string;
  series: string;
  name: string;
  specs: Record<string, any>;
  history?: string;
  capabilities?: string;
  features?: string[];
  wiki_data?: WikipediaData;
}

export function useUnimogData(modelCode?: string) {
  const [data, setData] = useState<UnimogModel | null>(null);
  const [wikiData, setWikiData] = useState<WikipediaData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Fetch Unimog data from our database
  useEffect(() => {
    const fetchUnimogData = async () => {
      if (!modelCode) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('unimog_models')
          .select('*')
          .eq('model_code', modelCode)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          setData(data);
          if (data.wiki_data) {
            setWikiData(data.wiki_data);
          }
        }
      } catch (err) {
        console.error('Error fetching Unimog data:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch Unimog data'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUnimogData();
  }, [modelCode]);

  // Fetch data from Wikipedia if not in our database
  useEffect(() => {
    const fetchWikipediaData = async () => {
      if (!modelCode || wikiData || !data) return;
      
      try {
        setIsLoading(true);
        const response = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/Unimog');
        
        if (!response.ok) {
          throw new Error('Failed to fetch Unimog information from Wikipedia');
        }
        
        const wikiResponse = await response.json();
        setWikiData(wikiResponse);
        
        // Save the wiki data to the unimog model
        const { error: updateError } = await supabase
          .from('unimog_models')
          .update({ wiki_data: wikiResponse })
          .eq('id', data.id);
        
        if (updateError) {
          console.error('Error updating wiki data:', updateError);
        }
        
      } catch (err) {
        console.error('Error fetching Wikipedia data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWikipediaData();
  }, [data, modelCode, wikiData]);
  
  // Save Wikipedia data to user profile
  const saveWikiDataToProfile = async (userId: string) => {
    if (!wikiData) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ unimog_wiki_data: wikiData })
        .eq('id', userId);
      
      if (error) throw error;
      
      toast({
        title: "Vehicle information updated",
        description: "Your vehicle data has been enriched with additional information",
      });
      
      return true;
    } catch (err) {
      console.error('Error saving wiki data to profile:', err);
      toast({
        title: "Update failed",
        description: "Could not save vehicle information to your profile",
        variant: "destructive"
      });
      return false;
    }
  };
  
  return {
    unimogData: data,
    wikiData,
    isLoading,
    error,
    saveWikiDataToProfile
  };
}
