
import { supabase } from '@/lib/supabase-client';

// REMOVED: Phantom article creation function
// The "Insurance and Registration Guide" article was being auto-created
// This has been removed to prevent phantom articles from appearing
// Articles should only be created through the UI by users

export async function fetchArticles(category?: string) {
  try {
    let query = supabase
      .from('community_articles')
      .select('*')
      .order('published_at', { ascending: false });
    
    if (category) {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching articles:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Failed to fetch articles:', err);
    return [];
  }
}
