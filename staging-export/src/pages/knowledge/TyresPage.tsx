
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { FileText, Disc } from 'lucide-react';
import { ArticleSubmissionDialog } from '@/components/knowledge/ArticleSubmissionDialog';
import { CategoryArticlesList } from '@/components/admin/CategoryArticlesList';
import { KnowledgeNavigation } from '@/components/knowledge/KnowledgeNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const TyresPage = () => {
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const { data } = await supabase.rpc("has_role", {
          _role: "admin",
        });
        setIsAdmin(!!data);
      }
    };
    
    checkAdminStatus();
  }, [user]);
  
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
              <Disc className="h-8 w-8" />
              Tyres
            </h1>
            <p className="text-muted-foreground mt-2">
              Information about tyre selection, maintenance, and recommendations for your Unimog.
            </p>
          </div>
          <div>
            <Button onClick={() => setSubmissionDialogOpen(true)}>
              <FileText className="mr-2 h-4 w-4" />
              Submit Tyre Article
            </Button>
          </div>
        </div>
        
        <KnowledgeNavigation />
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Community Tyre Articles</h2>
          <CategoryArticlesList 
            category="Tyres" 
            isAdmin={isAdmin}
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
