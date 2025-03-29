
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ThumbsUp, Eye, Bookmark, Calendar, Clock, User } from 'lucide-react';

interface ArticleContent {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  publishedAt: string;
  readingTime: number;
  likes: number;
  views: number;
  categories: string[];
  isSaved?: boolean;
}

export function ArticleView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<ArticleContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://www.reddit.com/comments/${id}.json`);
        if (!response.ok) {
          throw new Error('Failed to fetch article');
        }
        
        const data = await response.json();
        const post = data[0].data.children[0].data;
        
        // Calculate reading time (roughly 200 words per minute)
        const wordCount = (post.selftext || '').split(/\s+/).length;
        const readingTime = Math.max(1, Math.ceil(wordCount / 200));
        
        // Format date
        const date = new Date(post.created_utc * 1000);
        const formattedDate = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric', 
          year: 'numeric'
        });

        setArticle({
          id: post.id,
          title: post.title,
          content: post.selftext,
          author: {
            id: post.author,
            name: post.author,
          },
          publishedAt: formattedDate,
          readingTime,
          likes: post.ups,
          views: Math.floor(post.ups * 2.5), // Estimate views
          categories: [post.subreddit],
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

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
          <div className="text-center py-10">
            <p className="text-muted-foreground">Loading article...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
            <Button 
              onClick={() => navigate('/knowledge')}
              className="mt-4"
            >
              Return to Knowledge Base
            </Button>
          </div>
        ) : article ? (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {article.categories.map((category, index) => (
                <span 
                  key={index}
                  className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                >
                  {category}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-between mb-8 text-muted-foreground border-b border-t py-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <User size={16} className="mr-2" />
                  <span>{article.author.name}</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2" />
                  <span>{article.publishedAt}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-2" />
                  <span>{article.readingTime} min read</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <ThumbsUp size={16} className="mr-1" />
                  <span>{article.likes}</span>
                </div>
                <div className="flex items-center">
                  <Eye size={16} className="mr-1" />
                  <span>{article.views}</span>
                </div>
                <div>
                  <Bookmark size={16} className={article.isSaved ? "text-primary" : ""} />
                </div>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none dark:prose-invert">
              {article.content ? (
                article.content.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))
              ) : (
                <p className="text-muted-foreground">No content available for this article.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Article not found.</p>
            <Button 
              onClick={() => navigate('/knowledge')}
              className="mt-4"
            >
              Return to Knowledge Base
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
