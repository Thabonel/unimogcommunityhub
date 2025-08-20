
import { SortableArticlesList } from "@/components/knowledge/SortableArticlesList";

interface CategoryArticlesListProps {
  category?: string;
  isAdmin?: boolean;
}

export function CategoryArticlesList({ category, isAdmin = false }: CategoryArticlesListProps) {
  if (!isAdmin) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Community articles system has been removed.</p>
        <p className="text-sm text-muted-foreground mt-2">Use the Knowledge Base and WIS system instead.</p>
      </div>
    );
  }

  return (
    <div>
      <SortableArticlesList category={category} isAdmin={true} />
    </div>
  );
}
