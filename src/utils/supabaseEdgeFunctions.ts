
import { supabase } from '@/lib/supabase-client';

export async function fetchWikipediaData(modelCode: string) {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-wikipedia', {
      body: { modelCode },
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching Wikipedia data:', error);
    throw error;
  }
}

export async function saveUnimogDataToProfile(userId: string, modelCode: string, wikiData: any) {
  try {
    const { data, error } = await supabase.functions.invoke('update-profile-unimog', {
      body: { 
        userId,
        modelCode,
        wikiData
      },
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving Unimog data to profile:', error);
    throw error;
  }
}
