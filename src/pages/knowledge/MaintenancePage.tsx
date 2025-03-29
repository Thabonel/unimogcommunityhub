
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { FileText, Wrench } from 'lucide-react';
import { ArticleSubmissionDialog } from '@/components/knowledge/ArticleSubmissionDialog';
import { CommunityArticlesList } from '@/components/knowledge/CommunityArticlesList';
import { KnowledgeNavigation } from '@/components/knowledge/KnowledgeNavigation';

const MaintenancePage = () => {
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  
  // Mock user data - in a real app this would come from authentication
  const mockUser = {
    name: 'John Doe',
    avatarUrl: '/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png',
    unimogModel: 'U1700L'
  };
  
  return (
    <Layout isLoggedIn={true} user={mockUser}>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-unimog-800 dark:text-unimog-200 flex items-center gap-2">
              <Wrench className="h-8 w-8" />
              Maintenance
            </h1>
            <p className="text-muted-foreground mt-2">
              Maintenance guides, schedules, and tips to keep your Unimog running smoothly.
            </p>
          </div>
          <Button onClick={() => setSubmissionDialogOpen(true)}>
            <FileText className="mr-2 h-4 w-4" />
            Submit Maintenance Article
          </Button>
        </div>
        
        <KnowledgeNavigation />
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Community Maintenance Articles</h2>
          <CommunityArticlesList category="Maintenance" />
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Official Maintenance Guides</h2>
          <div className="bg-muted rounded-lg p-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Coming Soon</h3>
            <p className="text-muted-foreground mb-4 max-w-lg mx-auto">
              We're working on adding official maintenance guides for various Unimog models.
              In the meantime, check out the community articles above.
            </p>
          </div>
        </div>
        
        {/* Article Submission Dialog */}
        <ArticleSubmissionDialog
          open={submissionDialogOpen}
          onOpenChange={setSubmissionDialogOpen}
        />
      </div>
    </Layout>
  );
};

export default MaintenancePage;
