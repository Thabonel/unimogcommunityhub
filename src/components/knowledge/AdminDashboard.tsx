import { useState } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AdminArticleList } from './AdminArticleList';
import { AdminTabNavigation } from './AdminTabNavigation';
import { useAdminArticles } from '@/hooks/use-admin-articles';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<string>("allArticles");
  
  // Convert tab name to category name with proper capitalization
  // "maintenance" tab should map to "Maintenance" category, etc.
  const getCategoryFromTab = (tab: string): string | undefined => {
    if (tab === "allArticles") return undefined;
    // Capitalize first letter for category name in the database
    return tab.charAt(0).toUpperCase() + tab.slice(1);
  };
  
  const category = getCategoryFromTab(activeTab);
  
  // Use the category for filtering articles
  const { articles, isLoading, error, refresh, removeArticle } = useAdminArticles(category);
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleArticleDeleted = (articleId: string) => {
    console.log("AdminDashboard: Article deleted with ID:", articleId);
    // Update the local state immediately
    removeArticle(articleId);
  };
  
  const handleArticleMoved = (articleId: string) => {
    console.log("AdminDashboard: Article moved, refreshing data");
    // Refresh the data since the category has changed
    refresh();
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Knowledge Base Administration</h1>
        <p className="text-muted-foreground">
          Manage all community-submitted content from this dashboard. You can delete articles, 
          move them between categories, and manage manual submissions.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <AdminTabNavigation 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
        />
        
        <TabsContent value={activeTab} className="mt-6">
          <AdminArticleList 
            category={category}
            isLoading={isLoading}
            error={error}
            onRetry={refresh}
            articles={articles}
            onArticleDeleted={handleArticleDeleted}
            onArticleMoved={handleArticleMoved}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
