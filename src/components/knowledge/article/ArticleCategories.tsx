
import { Badge } from '@/components/ui/badge';

interface ArticleCategoriesProps {
  categories: string[];
}

export function ArticleCategories({ categories }: ArticleCategoriesProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {categories.map((category, index) => (
        <Badge 
          key={index}
          variant="secondary"
          className="bg-primary/10 text-primary"
        >
          {category}
        </Badge>
      ))}
    </div>
  );
}
