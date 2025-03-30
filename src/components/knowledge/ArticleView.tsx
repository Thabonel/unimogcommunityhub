
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useArticle } from '@/hooks/use-article';
import { BackToKnowledge } from './BackToKnowledge';
import { ArticleHeader } from './ArticleHeader';
import { ArticleMetadata } from './ArticleMetadata';
import { OriginalFileDownload } from './OriginalFileDownload';
import { ArticleContent } from './ArticleContent';
import { ArticleLoadingState } from './ArticleLoadingState';
import { AdminArticleControls } from './AdminArticleControls';

interface ArticleViewProps {
  isAdmin?: boolean;
}

export function ArticleView({ isAdmin = false }: ArticleViewProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { article, isLoading, error, handleFileDownload } = useArticle(id);

  const handleArticleDeleted = () => {
    navigate('/knowledge');
  };

  const handleArticleMoved = () => {
    // Reload the article data
    window.location.reload();
  };

  // Mock user data - in a real app this would come from authentication
  const mockUser = {
    name: 'John Doe',
    avatarUrl: '/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png',
    unimogModel: 'U1700L'
  };

  return (
    <Layout isLoggedIn={true} user={mockUser}>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <BackToKnowledge />
          
          {isAdmin && article && (
            <AdminArticleControls 
              articleId={article.id}
              category={article.categories[0]}
              onArticleDeleted={handleArticleDeleted}
              onArticleMoved={handleArticleMoved}
            />
          )}
        </div>
        
        <ArticleLoadingState isLoading={isLoading} error={error} />
        
        {!isLoading && !error && article ? (
          <div className="max-w-4xl mx-auto">
            <ArticleHeader 
              title={article.title} 
              categories={article.categories} 
            />
            
            <ArticleMetadata 
              author={article.author}
              publishedAt={article.publishedAt}
              readingTime={article.readingTime}
              likes={article.likes}
              views={article.views}
              isSaved={article.isSaved}
            />
            
            {article.originalFileUrl && (
              <OriginalFileDownload
                originalFileUrl={article.originalFileUrl}
                onDownload={handleFileDownload}
              />
            )}
            
            <ArticleContent content={article.content} />
          </div>
        ) : null}
      </div>
    </Layout>
  );
}
