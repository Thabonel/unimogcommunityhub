
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ThumbsUp, Eye, Bookmark, Calendar, Clock, User, FileText, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ArticleContent {
  id: string;
  title: string;
  content: string;
  originalFileUrl?: string;
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
        // First try to fetch from Supabase
        if (id && !id.includes('_')) {
          const { data, error } = await supabase
            .from('community_articles')
            .select('*')
            .eq('id', id)
            .single();
            
          if (data && !error) {
            // If found in Supabase, format and use that
            setArticle({
              id: data.id,
              title: data.title,
              content: data.content,
              originalFileUrl: data.source_url, // This could be changed to a dedicated originalFileUrl field
              author: {
                id: data.author_id,
                name: data.author_name,
              },
              publishedAt: new Date(data.published_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric', 
                year: 'numeric'
              }),
              readingTime: data.reading_time || 3,
              likes: data.likes || 0,
              views: data.views || 0,
              categories: [data.category],
            });
            
            // Update view count
            await supabase
              .from('community_articles')
              .update({ views: (data.views || 0) + 1 })
              .eq('id', id);
            
            setError(null);
            setIsLoading(false);
            return;
          }
        }
        
        // Fallback to Reddit API
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

  const handleFileDownload = async () => {
    if (article?.originalFileUrl) {
      try {
        // Extract the file path from the URL
        const urlParts = article.originalFileUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        
        window.open(article.originalFileUrl, '_blank');
        
        // Alternatively, download the file
        // const { data, error } = await supabase.storage
        //   .from('article_files')
        //   .download(fileName);
          
        // if (error) {
        //   throw error;
        // }
        
        // // Create a download link
        // const url = URL.createObjectURL(data);
        // const a = document.createElement('a');
        // a.href = url;
        // a.download = fileName;
        // document.body.appendChild(a);
        // a.click();
        // URL.revokeObjectURL(url);
        // a.remove();
      } catch (err) {
        console.error('Error downloading file:', err);
        alert('Could not download the file. Please try again later.');
      }
    }
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
            
            {article.originalFileUrl && (
              <div className="mb-6 flex items-center justify-between p-4 border rounded-md bg-secondary/10">
                <div className="flex items-center">
                  <FileText className="mr-3 text-primary" />
                  <span>Original document available</span>
                </div>
                <Button onClick={handleFileDownload} variant="outline" size="sm" className="flex items-center gap-1">
                  <Download size={16} />
                  <span>View Original</span>
                </Button>
              </div>
            )}
            
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
