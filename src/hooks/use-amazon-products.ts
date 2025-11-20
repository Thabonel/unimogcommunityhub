import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';
import { AmazonProduct } from '@/utils/amazonAffiliate';

interface UseAmazonProductsOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
}

export function useAmazonProducts(options: UseAmazonProductsOptions = {}) {
  return useQuery({
    queryKey: ['amazon-products', options],
    queryFn: async () => {
      let query = supabase
        .from('amazon_products')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (options.category) {
        query = query.eq('category', options.category);
      }

      if (options.minPrice !== undefined) {
        query = query.gte('price', options.minPrice);
      }

      if (options.maxPrice !== undefined) {
        query = query.lte('price', options.maxPrice);
      }

      if (options.searchTerm) {
        query = query.or(
          `title.ilike.%${options.searchTerm}%,description.ilike.%${options.searchTerm}%,tags.cs.{${options.searchTerm}}`
        );
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as AmazonProduct[];
    },
  });
}
