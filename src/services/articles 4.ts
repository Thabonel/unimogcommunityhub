
import { supabase } from '@/integrations/supabase/client';
import { unimogInsuranceArticle } from '@/content/articles/unimog-insurance-australia';

export async function createSystemArticle() {
  try {
    // Check if article already exists
    const { data: existing } = await supabase
      .from('community_articles')
      .select('id')
      .eq('title', unimogInsuranceArticle.title)
      .single();
    
    if (existing) {
      console.log('System article already exists');
      return existing;
    }

    // Create article without ID (let database generate it)
    const { data, error } = await supabase
      .from('community_articles')
      .insert([{
        ...unimogInsuranceArticle,
        author_id: null // System articles don't have an author
      }])
      .select()
      .single();

    if (error) {
      // Only log if it's not a duplicate error
      if (!error.message?.includes('duplicate')) {
        console.error('Error creating system article:', error);
      }
      return null;
    }

    return data;
  } catch (err) {
    console.error('Failed to create system article:', err);
    return null;
  }
}
