
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface WikipediaData {
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

export interface UnimogModel {
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
          // Convert the data to match our UnimogModel type
          const unimogData: UnimogModel = {
            id: data.id,
            model_code: data.model_code,
            series: data.series,
            name: data.name,
            specs: data.specs as Record<string, any>,
            history: data.history,
            capabilities: data.capabilities,
            features: data.features as string[],
            wiki_data: data.wiki_data ? parseWikiData(data.wiki_data) : undefined
          };
          
          setData(unimogData);
          if (unimogData.wiki_data) {
            setWikiData(unimogData.wiki_data);
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

  // Parse wiki data from JSON to ensure it matches our interface
  const parseWikiData = (data: any): WikipediaData => {
    return {
      title: data.title || '',
      extract: data.extract || '',
      thumbnail: data.thumbnail,
      content_urls: data.content_urls || { desktop: { page: '' } }
    };
  };

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
        const typedWikiResponse = parseWikiData(wikiResponse);
        
        setWikiData(typedWikiResponse);
        
        // Save the wiki data to the unimog model
        const { error: updateError } = await supabase
          .from('unimog_models')
          .update({ 
            wiki_data: {
              title: typedWikiResponse.title,
              extract: typedWikiResponse.extract,
              thumbnail: typedWikiResponse.thumbnail,
              content_urls: typedWikiResponse.content_urls
            } 
          })
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
      // Convert WikipediaData to a plain object for storage
      const wikiDataForStorage = {
        title: wikiData.title,
        extract: wikiData.extract,
        thumbnail: wikiData.thumbnail,
        content_urls: wikiData.content_urls
      };
      
      const { error } = await supabase
        .from('profiles')
        .update({ unimog_wiki_data: wikiDataForStorage })
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
