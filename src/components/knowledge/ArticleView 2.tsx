
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useArticleData } from './article/useArticleData';
import { ArticleContent } from './article/ArticleContent';
import { ArticleError } from './article/ArticleError';
import { ArticleLoading } from './article/ArticleLoading';

export function ArticleView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { article, isLoading, error, handleFileDownload } = useArticleData(id);

  // Mock user data - in a real app this would come from authentication
  const mockUser = {
    name: 'John Doe',
    avatarUrl: '/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png',
    unimogModel: 'U1700L'
  };

  return (
    <Layout isLoggedIn={true} user={mockUser}>
      <div className="container py-8">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center" 
          onClick={() => navigate('/knowledge')}
        >
          <ArrowLeft className="mr-2" size={16} />
          Back to Knowledge Base
        </Button>
        
        {isLoading ? (
          <ArticleLoading />
        ) : error ? (
          <ArticleError error={error} />
        ) : article ? (
          <ArticleContent article={article} handleFileDownload={handleFileDownload} />
        ) : (
          <ArticleError error="Article not found." />
        )}
      </div>
    </Layout>
  );
}
