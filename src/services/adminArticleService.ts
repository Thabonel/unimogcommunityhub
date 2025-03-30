
import { supabase } from "@/integrations/supabase/client";
import { Article } from "@/types/article";

interface FetchOptions {
  cacheBuster?: number;
}

/**
 * Fetch articles for admin management with optional filtering by category
 */
export async function fetchAdminArticles(
  category?: string, 
  limit: number = 50,
  options?: FetchOptions
): Promise<{ data: Article[] | null; error: any }> {
  console.log("Fetching admin articles with category:", category, "options:", options);
  
  try {
    // Build the query
    let query = supabase
      .from('community_articles')
      .select('*')
      .order('published_at', { ascending: false });
    
    if (category) {
      console.log("Filtering by category:", category);
      query = query.eq('category', category);
    }
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Supabase error fetching admin articles:", error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error("Exception fetching admin articles:", error);
    return { data: null, error };
  }
}
