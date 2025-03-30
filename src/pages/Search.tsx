
import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import UserSearchResults from '@/components/search/UserSearchResults';
import PostSearchResults from '@/components/search/PostSearchResults';
import { useSearchResults } from '@/hooks/use-search-results';

const Search = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState<string>("users");
  
  const { 
    isLoadingUsers, 
    isLoadingPosts, 
    userResults, 
    postResults 
  } = useSearchResults(query);

  // Update active tab based on URL parameter or default to users
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && (tabParam === 'users' || tabParam === 'posts')) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    searchParams.set('tab', value);
    setSearchParams(searchParams);
  };

  const isLoading = isLoadingUsers || isLoadingPosts;

  return (
    <Layout isLoggedIn={!!user}>
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-unimog-800 dark:text-unimog-100">Search Results</h1>
          <p className="text-muted-foreground">
            {query ? `Showing results for "${query}"` : 'Enter a search term to find users and posts'}
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <span className="text-unimog-600 dark:text-unimog-300">Loading results...</span>
          </div>
        ) : (
          <div className="bg-white dark:bg-unimog-900 shadow-sm rounded-lg p-6 border border-unimog-100 dark:border-unimog-800">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="mb-6 bg-unimog-100 dark:bg-unimog-800">
                <TabsTrigger 
                  value="users"
                  className="data-[state=active]:bg-terrain-500 data-[state=active]:text-white"
                >
                  Users ({userResults.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="posts"
                  className="data-[state=active]:bg-terrain-500 data-[state=active]:text-white"
                >
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
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Search;
