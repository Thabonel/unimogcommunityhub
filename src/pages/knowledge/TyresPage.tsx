
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { FileText, Disc, Trash } from 'lucide-react';
import { ArticleSubmissionDialog } from '@/components/knowledge/ArticleSubmissionDialog';
import { CommunityArticlesList } from '@/components/knowledge/CommunityArticlesList';
import { KnowledgeNavigation } from '@/components/knowledge/KnowledgeNavigation';
import { DeleteArticle } from '@/scripts/deleteArticle';

const TyresPage = () => {
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const [showDeleteArticle, setShowDeleteArticle] = useState(false);
  const [refreshArticles, setRefreshArticles] = useState(0);
  
  // Mock user data - in a real app this would come from authentication
  const mockUser = {
    name: 'John Doe',
    avatarUrl: '/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png',
    unimogModel: 'U1700L'
  };

  const handleArticleDeleted = (success: boolean) => {
    if (success) {
      // Force refresh the article list
      setRefreshArticles(prev => prev + 1);
      // Hide the delete UI after a successful deletion
      setTimeout(() => setShowDeleteArticle(false), 2000);
    }
  };
  
  return (
    <Layout isLoggedIn={true} user={mockUser}>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-unimog-800 dark:text-unimog-200 flex items-center gap-2">
              <Disc className="h-8 w-8" />
              Tyres
            </h1>
            <p className="text-muted-foreground mt-2">
              Information about tyre selection, maintenance, and recommendations for your Unimog.
            </p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setSubmissionDialogOpen(true)}>
              <FileText className="mr-2 h-4 w-4" />
              Submit Tyre Article
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => setShowDeleteArticle(true)}
              className="flex items-center"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete Problem Article
            </Button>
          </div>
        </div>
        
        <KnowledgeNavigation />
        
        {showDeleteArticle && (
          <div className="p-4 mb-4 bg-muted rounded-md">
            <h3 className="text-lg font-medium mb-2">Delete Article</h3>
            <DeleteArticle 
              title="Everything about Tyre sizes" 
              onComplete={handleArticleDeleted}
            />
          </div>
        )}
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Community Tyre Articles</h2>
          <CommunityArticlesList 
            category="Tyres" 
            excludeTitle="Everything about Tyre sizes"
            key={`articles-list-${refreshArticles}`} // Force re-render on refresh
          />
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Tyre Recommendations</h2>
          <div className="bg-muted rounded-lg p-8 text-center">
            <Disc className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Coming Soon</h3>
            <p className="text-muted-foreground mb-4 max-w-lg mx-auto">
              We're compiling a comprehensive guide of tyre recommendations for various Unimog models and use cases.
              In the meantime, check out the community articles above.
            </p>
          </div>
        </div>
        
        {/* Article Submission Dialog */}
        <ArticleSubmissionDialog
          open={submissionDialogOpen}
          onOpenChange={setSubmissionDialogOpen}
          category="Tyres"
        />
      </div>
    </Layout>
  );
};

export default TyresPage;
