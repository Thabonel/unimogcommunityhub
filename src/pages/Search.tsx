
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import UserSearchResults from '@/components/search/UserSearchResults';
import PostSearchResults from '@/components/search/PostSearchResults';
import { useSearchResults } from '@/hooks/use-search-results';

const Search = () => {
  const location = useLocation();
  const { user } = useAuth();
  const query = new URLSearchParams(location.search).get('q') || '';
  const [activeTab, setActiveTab] = useState<string>("users");
  
  const { 
    isLoadingUsers, 
    isLoadingPosts, 
    userResults, 
    postResults 
  } = useSearchResults(query);

  // Update active tab based on URL parameter or default to users
  useEffect(() => {
    const tabParam = new URLSearchParams(location.search).get('tab');
    if (tabParam && (tabParam === 'users' || tabParam === 'posts')) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  const isLoading = isLoadingUsers || isLoadingPosts;

  return (
    <Layout isLoggedIn={!!user}>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        <p className="text-muted-foreground mb-6">
          {query ? `Showing results for "${query}"` : 'Enter a search term to find users and posts'}
        </p>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Loading results...</span>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="users">
                Users ({userResults.length})
              </TabsTrigger>
              <TabsTrigger value="posts">
                Posts ({postResults.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="users">
              <UserSearchResults results={userResults} query={query} />
            </TabsContent>
            
            <TabsContent value="posts">
              <PostSearchResults results={postResults} query={query} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default Search;
