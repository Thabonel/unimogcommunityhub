
import { useState } from "react";
import { SortableArticlesList } from "@/components/knowledge/SortableArticlesList";
import { CommunityArticlesList } from "@/components/knowledge/CommunityArticlesList";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface CategoryArticlesListProps {
  category?: string;
  isAdmin?: boolean;
}

export function CategoryArticlesList({ category, isAdmin = false }: CategoryArticlesListProps) {
  const [enableSorting, setEnableSorting] = useState(false);

  if (!isAdmin) {
    return <CommunityArticlesList category={category} />;
  }

  return (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <Switch 
          id="article-sorting"
          checked={enableSorting}
          onCheckedChange={setEnableSorting}
        />
        <Label htmlFor="article-sorting">
          {enableSorting ? "Sorting Mode (Drag to reorder)" : "Enable Sorting Mode"}
        </Label>
      </div>
      
      {enableSorting ? (
        <SortableArticlesList category={category} isAdmin={true} />
      ) : (
        <CommunityArticlesList category={category} />
      )}
    </div>
  );
}
