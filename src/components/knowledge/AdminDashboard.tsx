
import { useState } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AdminArticleList } from './AdminArticleList';
import { AdminTabNavigation } from './AdminTabNavigation';
import { useAdminArticles } from '@/hooks/use-admin-articles';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<string>("allArticles");
  const category = activeTab !== "allArticles" ? activeTab : undefined;
  const { isLoading, error, fetchArticles } = useAdminArticles(category);
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
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
            onRetry={fetchArticles}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
