import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';
import Layout from '@/components/Layout';
import { Package } from 'lucide-react';
import { GearList } from '@/components/shop/GearList';
import { gearCatalog, AMAZON_AU_TAG } from '@/data/gearCatalog';
import type { GearItem } from '@/data/gearCatalog';

const CATEGORY_LABELS: Record<string, string> = {
  recovery_gear: 'Recovery Gear',
  camping_expedition: 'Camping & Expedition',
  tools_maintenance: 'Tools & Maintenance',
  parts_upgrades: 'Parts & Upgrades',
  books_manuals: 'Books & Manuals',
  apparel_merchandise: 'Apparel & Merchandise',
  electronics: 'Electronics',
  outdoor_gear: 'Outdoor Gear',
};

function titleToAuSearch(title: string): string {
  return `https://www.amazon.com.au/s?k=${encodeURIComponent(title)}&tag=${AMAZON_AU_TAG}`;
}

function titleToLocalSearch(title: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(title)}`;
}

interface DbProduct {
  id: string;
  title: string;
  short_description: string | null;
  category: string;
  affiliate_provider: string;
  image_url: string | null;
}

const Shop = () => {
  const { data: dbProducts = [], isLoading } = useQuery({
    queryKey: ['affiliate-products-gear'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('affiliate_products')
        .select('id, title, short_description, category, affiliate_provider, image_url')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DbProduct[];
    },
  });

  const allItems = useMemo(() => {
    const dbItems: GearItem[] = dbProducts.map((p) => ({
      id: p.id,
      category: CATEGORY_LABELS[p.category] ?? p.category,
      title: p.title,
      why: p.short_description ?? '',
      amazonAuSearchUrl: titleToAuSearch(p.title),
      localSearchUrl: titleToLocalSearch(p.title),
      imageUrl: p.image_url ?? undefined,
    }));

    // Curated items first, then DB items (skip duplicates by title match)
    const curatedTitles = new Set(
      gearCatalog.map((g) => g.title.toLowerCase()),
    );
    const uniqueDbItems = dbItems.filter(
      (d) => !curatedTitles.has(d.title.toLowerCase()),
    );

    return [...gearCatalog, ...uniqueDbItems];
  }, [dbProducts]);

  return (
    <Layout>
      <div className="container py-8">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">Recommended Gear</h1>
            <p className="text-muted-foreground text-lg">
              Curated gear and accessories for Unimog owners and adventurers
            </p>
            <p className="text-sm text-muted-foreground">
              Supporting links help keep this community running
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 animate-pulse mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Loading gear...</p>
            </div>
          ) : (
            <GearList items={allItems} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
