import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { CommunityArticlesList } from '@/components/knowledge/CommunityArticlesList';
import { ArticleSubmissionDialog } from '@/components/knowledge/ArticleSubmissionDialog';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/profile';

const CommunityArticlesPage = () => {
  const navigate = useNavigate();
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const { user } = useAuth();
  const { userData } = useProfile();
  
  const layoutUser = userData ? {
    name: userData.name || user?.email?.split('@')[0] || 'User',
    avatarUrl: (userData.useVehiclePhotoAsProfile && userData.vehiclePhotoUrl) 
      ? userData.vehiclePhotoUrl 
      : userData.avatarUrl,
    unimogModel: userData.unimogModel || '',
    vehiclePhotoUrl: userData.vehiclePhotoUrl || '',
    useVehiclePhotoAsProfile: userData.useVehiclePhotoAsProfile || false
  } : undefined;

  return (
    <Layout isLoggedIn={!!user} user={layoutUser}>
      <div className="container py-8">
        {/* Header with Back Button */}
        <Button
          onClick={() => navigate('/knowledge')}
          variant="outline"
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Knowledge Base
        </Button>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-unimog-800 dark:text-unimog-200 mb-2">
              Community Articles
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Browse guides, tips, and experiences shared by fellow Unimog owners from around the world.
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              className="bg-primary"
              onClick={() => setSubmissionDialogOpen(true)}
            >
              <BookOpen size={16} className="mr-2" />
              New Article
            </Button>
          </div>
        </div>

        {/* Community Articles List Component */}
        <CommunityArticlesList />
      </div>

      {/* Article Submission Dialog */}
      <ArticleSubmissionDialog 
        open={submissionDialogOpen} 
        onOpenChange={setSubmissionDialogOpen} 
      />
    </Layout>
  );
};

export default CommunityArticlesPage;