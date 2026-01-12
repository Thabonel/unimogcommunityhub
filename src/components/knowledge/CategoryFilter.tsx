import { Button } from '@/components/ui/button';

interface Category {
  id: string;
  label: string;
}

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CATEGORIES: Category[] = [
  { id: 'all', label: 'ALL RECOMMENDATIONS' },
  { id: 'repair', label: 'REPAIR' },
  { id: 'maintenance', label: 'MAINTENANCE' },
  { id: 'modifications', label: 'MODIFICATIONS' },
  { id: 'tyres', label: 'TYRES' },
  { id: 'adventures', label: 'ADVENTURES' },
  { id: 'safety', label: 'SAFETY TIPS' },
];

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
      {CATEGORIES.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          onClick={() => onCategoryChange(category.id)}
          className={`
            ${selectedCategory === category.id
              ? 'bg-military-green text-white hover:bg-military-green/90'
              : 'bg-background text-foreground border-border hover:bg-military-green/10'
            }
            font-rugged text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-md transition-colors whitespace-nowrap shrink-0
          `}
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
}