
import { supabase } from "@/integrations/supabase/client";
import { Article } from "@/types/article";

/**
 * Fetches articles from the database with optional category filtering
 */
export async function fetchAdminArticles(category?: string, limit: number = 50): Promise<{
  data: Article[] | null;
  error: any;
}> {
  // Build the query without filtering by is_approved
  let query = supabase
    .from('community_articles')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(limit);
  
  // Only filter by category if one is provided
  if (category) {
    query = query.eq('category', category);
  }
  
  return await query;
}
