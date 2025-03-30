
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommunityArticlesList } from './CommunityArticlesList';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<string>("allArticles");
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Knowledge Base Administration</h1>
      <p className="text-muted-foreground">
        Manage all community-submitted content from this dashboard. You can delete articles, 
        move them between categories, and manage manual submissions.
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="allArticles">All Articles</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="repair">Repair</TabsTrigger>
        </TabsList>
        <TabsList className="grid w-full grid-cols-3 mt-1">
          <TabsTrigger value="adventures">Adventures</TabsTrigger>
          <TabsTrigger value="modifications">Modifications</TabsTrigger>
          <TabsTrigger value="tyres">Tyres</TabsTrigger>
        </TabsList>
        
        <TabsContent value="allArticles" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">All Articles</h2>
          <CommunityArticlesList limit={50} isAdmin={true} />
        </TabsContent>
        
        <TabsContent value="maintenance" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Maintenance Articles</h2>
          <CommunityArticlesList category="Maintenance" limit={50} isAdmin={true} />
        </TabsContent>
        
        <TabsContent value="repair" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Repair Articles</h2>
          <CommunityArticlesList category="Repair" limit={50} isAdmin={true} />
        </TabsContent>
        
        <TabsContent value="adventures" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Adventures Articles</h2>
          <CommunityArticlesList category="Adventures" limit={50} isAdmin={true} />
        </TabsContent>
        
        <TabsContent value="modifications" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Modifications Articles</h2>
          <CommunityArticlesList category="Modifications" limit={50} isAdmin={true} />
        </TabsContent>
        
        <TabsContent value="tyres" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Tyres Articles</h2>
          <CommunityArticlesList category="Tyres" limit={50} isAdmin={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
