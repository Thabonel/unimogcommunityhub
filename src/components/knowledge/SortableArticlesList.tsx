
import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { supabase } from "@/integrations/supabase/client";
import ArticleCard from "./ArticleCard";
import { Button } from "@/components/ui/button";
import { FileText, RefreshCw, GripVertical } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SortableArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author_id: string;
  author_name: string;
  order: number;
  published_at: string;
  reading_time: number;
  cover_image?: string;
  source_url?: string;
}

interface ArticleForDisplay {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string | undefined;
  author: {
    id: string;
    name: string;
  };
  publishedAt: string;
  readingTime: number;
  likes: number;
  views: number;
  categories: string[];
  sourceUrl?: string;
  order: number;
}

interface SortableArticlesListProps {
  category?: string;
  limit?: number;
  excludeTitle?: string;
  isAdmin?: boolean;
}

export function SortableArticlesList({ category, limit = 6, excludeTitle, isAdmin = false }: SortableArticlesListProps) {
  const [articles, setArticles] = useState<ArticleForDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const handleArticleDelete = async (articleId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('community_articles')
        .delete()
        .eq('id', articleId);
      
      if (deleteError) {
        throw deleteError;
      }
      
      // Trigger a refetch by incrementing refreshTrigger
      setRefreshTrigger(prev => prev + 1);
      toast({
        title: "Article deleted",
        description: "The article has been successfully removed",
      });
    } catch (err) {
      console.error("Error deleting article:", err);
      toast({
        title: "Error",
        description: "Failed to delete the article. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('community_articles')
        .select('*')
        .order('order', { ascending: true })
        .eq(category ? 'category' : 'is_approved', category || true)
        .limit(limit);
      
      if (fetchError) {
        throw fetchError;
      }
      
      let filteredData = data;
      
      // Filter out articles with the excluded title if provided
      if (excludeTitle) {
        filteredData = data.filter((article: SortableArticle) => 
          article.title !== excludeTitle
        );
      }
      
      // Transform to match ArticleCard props format
      const formattedArticles = filteredData.map((article: SortableArticle) => ({
        id: article.id,
        title: article.title,
        excerpt: article.excerpt,
        coverImage: article.cover_image || undefined,
        author: {
          id: article.author_id,
          name: article.author_name,
        },
        publishedAt: new Date(article.published_at).toLocaleDateString(),
        readingTime: article.reading_time || 3,
        likes: 0,
        views: 0,
        categories: [article.category],
        sourceUrl: article.source_url,
        order: article.order || 9999,
      }));
      
      setArticles(formattedArticles);
    } catch (err) {
      console.error("Error fetching community articles:", err);
      setError("Failed to load community articles");
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(articles);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update the order property for each item based on their new position
    const updatedArticles = items.map((item, index) => ({
      ...item,
      order: index + 1 // Start ordering from 1
    }));
    
    setArticles(updatedArticles);
    
    // Update the order in the database
    setIsSaving(true);
    
    try {
      // Prepare the updates
      const updates = updatedArticles.map(article => ({
        id: article.id,
        order: article.order
      }));
      
      // Update each article's order
      for (const update of updates) {
        const { error } = await supabase
          .from('community_articles')
          .update({ order: update.order })
          .eq('id', update.id);
        
        if (error) throw error;
      }
      
      toast({
        title: "Order updated",
        description: "Article order has been saved successfully",
      });
    } catch (err) {
      console.error("Error updating article order:", err);
      toast({
        title: "Error",
        description: "Failed to save the article order. Please try again.",
        variant: "destructive",
      });
      // Refetch to restore original order
      fetchArticles();
    } finally {
      setIsSaving(false);
    }
  };

  useState(() => {
    fetchArticles();
  }, [category, limit, excludeTitle, refreshTrigger]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-muted-foreground">Loading articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchArticles}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No articles found</h3>
          <p className="text-muted-foreground mb-4">
            {category 
              ? `There are no ${category.toLowerCase()} articles available yet.` 
              : "There are no community articles available yet."}
          </p>
          <p className="text-muted-foreground">
            Be the first to share your knowledge with the community!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {isSaving ? "Saving order..." : "Drag articles to reorder them"}
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchArticles}
          disabled={isSaving}
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="articles">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {articles.map((article, index) => (
                <Draggable key={article.id} draggableId={article.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`${
                        snapshot.isDragging ? "opacity-70" : ""
                      }`}
                    >
                      <div className="relative">
                        <div 
                          {...provided.dragHandleProps}
                          className="absolute top-2 left-2 bg-gray-800 bg-opacity-50 text-white p-1 rounded-md cursor-grab hover:bg-opacity-70 z-10"
                        >
                          <GripVertical size={16} />
                        </div>
                        <ArticleCard 
                          {...article} 
                          onDelete={() => handleArticleDelete(article.id)}
                        />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
