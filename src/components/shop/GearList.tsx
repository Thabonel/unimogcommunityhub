import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GearItemCard } from './GearItemCard';
import type { GearItem } from '@/data/gearCatalog';

interface GearListProps {
  items: GearItem[];
}

export function GearList({ items }: GearListProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(items.map((i) => i.category))),
    [items],
  );

  const filtered = useMemo(() => {
    let result = items;

    if (activeCategory) {
      result = result.filter((i) => i.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.why.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q),
      );
    }

    return result;
  }, [items, search, activeCategory]);

  const grouped = useMemo(() => {
    const map = new Map<string, GearItem[]>();
    for (const item of filtered) {
      const list = map.get(item.category) ?? [];
      list.push(item);
      map.set(item.category, list);
    }
    return map;
  }, [filtered]);

  return (
    <div className="space-y-6">
      {/* Search + category filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search gear..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Button
            size="sm"
            variant={activeCategory === null ? 'default' : 'outline'}
            onClick={() => setActiveCategory(null)}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              size="sm"
              variant={activeCategory === cat ? 'default' : 'outline'}
              onClick={() =>
                setActiveCategory(activeCategory === cat ? null : cat)
              }
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Grouped items */}
      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          No gear matches your search.
        </p>
      ) : (
        Array.from(grouped.entries()).map(([category, categoryItems]) => (
          <section key={category} className="space-y-3">
            <h2 className="text-xl font-semibold">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryItems.map((item) => (
                <GearItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
