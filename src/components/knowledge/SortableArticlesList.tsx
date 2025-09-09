
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabase-client';
import { Loader2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArticleData } from "@/types/article";

interface SortableArticlesListProps {
  category?: string;
  isAdmin: boolean;
}

export function SortableArticlesList({ category, isAdmin }: SortableArticlesListProps) {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  // Fetch articles for this category
  useEffect(() => {
    fetchArticles();
  }, [category]);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('community_articles')
        .select('*')
        .eq('is_approved', true)
        .eq('is_archived', false);
        
      if (category) {
        query = query.eq('category', category);
      }
      
      // Get articles sorted by the order field
      const { data, error } = await query.order('order', { ascending: true });
      
      if (error) throw error;
      
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast({
        title: "Error",
        description: "Failed to load articles",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDragEnd = (result: any) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }
    
    const startIndex = result.source.index;
    const endIndex = result.destination.index;
    
    // If position didn't change
    if (startIndex === endIndex) {
      return;
    }
    
    // Reorder the articles array
    const reordered = Array.from(articles);
    const [removed] = reordered.splice(startIndex, 1);
    reordered.splice(endIndex, 0, removed);
    
    // Update the order property for each article based on new position
    const updatedArticles = reordered.map((article, index) => ({
      ...article,
      order: index + 1
    }));
    
    // Update the state with the new order
    setArticles(updatedArticles);
    setHasChanges(true);
  };
  
  const saveNewOrder = async () => {
    if (!isAdmin) return;
    
    setIsSaving(true);
    
    try {
      // Prepare updates for each article
      const updates = articles.map(article => ({
        id: article.id,
        order: article.order
      }));
      
      // Loop through updates and apply them
      for (const update of updates) {
        const { error } = await supabase
          .from('community_articles')
          .update({ order: update.order })
          .eq('id', update.id);
          
        if (error) throw error;
      }
      
      toast({
        title: "Order saved",
        description: "Article order has been updated successfully",
      });
      
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving article order:', error);
      toast({
        title: "Error",
        description: "Failed to save article order",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No articles found in this category.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {hasChanges && (
        <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 p-4 rounded-md mb-4 flex justify-between items-center">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            You have unsaved changes to the article order.
          </p>
          <Button 
            variant="default" 
            onClick={saveNewOrder}
            disabled={isSaving}
            className="bg-amber-600 hover:bg-amber-700"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : "Save Order"}
          </Button>
        </div>
      )}
    
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="articles">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {articles.map((article, index) => (
                <Draggable key={article.id} draggableId={article.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={cn(
                        "border rounded-lg p-4 bg-card",
                        snapshot.isDragging ? "shadow-lg" : "",
                        snapshot.isDragging ? "ring-2 ring-primary" : ""
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div 
                          {...provided.dragHandleProps}
                          className="mt-1 p-1 rounded-md hover:bg-muted cursor-grab active:cursor-grabbing"
                        >
                          <GripVertical className="h-5 w-5 text-muted-foreground" />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {article.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <span>By {article.author_name}</span>
                            <span>•</span>
                            <span>{new Date(article.published_at).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{article.reading_time} min read</span>
                          </div>
                        </div>
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
