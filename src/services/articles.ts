
import { supabase } from '@/integrations/supabase/client';
import { unimogInsuranceArticle } from '@/content/articles/unimog-insurance-australia';

export async function createSystemArticle() {
  const { data, error } = await supabase
    .from('community_articles')
    .insert([unimogInsuranceArticle])
    .select()
    .single();

  if (error) {
    console.error('Error creating system article:', error);
    throw error;
  }

  return data;
}
