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
  { id: 'ai-mechanic', label: 'AI MECHANIC' },
  { id: 'safety', label: 'SAFETY TIPS' },
];

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
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
            font-rugged text-sm px-4 py-2 rounded-md transition-colors
          `}
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
}