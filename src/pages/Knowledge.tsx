import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import { KnowledgeNavigation } from '@/components/knowledge/KnowledgeNavigation';
import ArticleCard from '@/components/knowledge/ArticleCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, BookOpen, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRedditPosts } from '@/hooks/use-reddit-posts';
import { ArticleSubmissionDialog } from '@/components/knowledge/ArticleSubmissionDialog';
import { CommunityArticlesList } from '@/components/knowledge/CommunityArticlesList';

const Knowledge = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [subreddit, setSubreddit] = useState('unimog');
  const { articles, isLoading, error } = useRedditPosts(subreddit);
  const location = useLocation();
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  
  // Get the category from URL query params
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category');
  
  // Check if we are on the Reddit tab
  const isRedditTab = category === 'reddit';
  // Check if we are on community tab (no category or category is community)
  const isCommunityTab = !category || category === 'community';
  
  // Filter articles based on search query
  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Mock user data - in a real app this would come from authentication
  const mockUser = {
    name: 'John Doe',
    avatarUrl: '/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png',
    unimogModel: 'U1700L'
  };
  
  return (
    <Layout isLoggedIn={true} user={mockUser}>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-unimog-800 dark:text-unimog-200 mb-2">
              Knowledge Base
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Explore our collection of articles, guides, and resources to help you get the most out of your Unimog.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={16} />
              <span>Filter</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2" asChild>
              <Link to="/knowledge/manuals">
                <FileText size={16} />
                <span>Vehicle Manuals</span>
              </Link>
            </Button>
            <Button 
              className="bg-primary"
              onClick={() => setSubmissionDialogOpen(true)}
            >
              <BookOpen size={16} className="mr-2" />
              New Article
            </Button>
          </div>
        </div>
        
        <KnowledgeNavigation />
        
        {isRedditTab ? (
          <div>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Input
                  type="search"
                  placeholder="Search Reddit articles..."
                  className="w-full pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              </div>
              
              <div className="md:w-1/4">
                <select 
                  value={subreddit}
                  onChange={(e) => setSubreddit(e.target.value)}
                  className="w-full h-10 px-4 rounded-md border border-input bg-background"
                >
                  <option value="unimog">r/unimog</option>
                  <option value="4x4">r/4x4</option>
                  <option value="Overlanding">r/Overlanding</option>
                  <option value="MercedesBenz">r/MercedesBenz</option>
                </select>
              </div>
            </div>
            
            {isLoading ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">Loading articles from Reddit...</p>
              </div>
            ) : error ? (
              <div className="text-center py-10">
                <p className="text-red-500">{error}</p>
                <p className="text-muted-foreground mt-2">Using fallback articles instead</p>
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No articles found matching your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {filteredArticles.map((article) => (
                  <ArticleCard key={article.id} {...article} />
                ))}
              </div>
            )}
          </div>
        ) : isCommunityTab ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Community Articles</h2>
              <Button 
                onClick={() => setSubmissionDialogOpen(true)}
                variant="outline"
                size="sm"
              >
                Submit Article
              </Button>
            </div>
            <CommunityArticlesList />
          </div>
        ) : (
          <div className="py-10 text-center">
            <h2 className="text-2xl font-semibold mb-4">
              {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Content` : 'Knowledge Base Content'}
            </h2>
            <p className="text-muted-foreground mb-6">
              Browse through our articles and guides for your Unimog.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild variant="outline">
                <Link to="/knowledge?category=community">
                  View Community Articles
                </Link>
              </Button>
              <Button asChild>
                <Link to="/knowledge?category=reddit">
                  View Reddit Community Posts
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Article Submission Dialog */}
      <ArticleSubmissionDialog 
        open={submissionDialogOpen} 
        onOpenChange={setSubmissionDialogOpen} 
      />
    </Layout>
  );
};

export default Knowledge;
