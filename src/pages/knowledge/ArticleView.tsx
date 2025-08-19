import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase-client';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Clock, 
  ThumbsUp, 
  Eye, 
  Bookmark, 
  Share2,
  AlertCircle,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface ArticleData {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  published_at: string;
  reading_time: number;
  likes: number;
  views: number;
  category: string;
  cover_image?: string;
}

export default function ArticleView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!id) {
      setError('Article ID not provided');
      setLoading(false);
      return;
    }

    const fetchArticle = async () => {
      try {
        setLoading(true);
        
        // Fetch article data
        const { data, error } = await supabase
          .from('community_articles')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            setError('Article not found');
          } else {
            setError('Failed to load article');
          }
          return;
        }

        setArticle(data as ArticleData);

        // Increment view count
        await supabase
          .from('community_articles')
          .update({ views: (data.views || 0) + 1 })
          .eq('id', id);

        // Update local view count
        setArticle(prev => prev ? { ...prev, views: prev.views + 1 } : null);

      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to load article. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleRefresh = async () => {
    if (refreshing || !id) return;
    
    setRefreshing(true);
    try {
      // Force fresh fetch from database
      const { data, error } = await supabase
        .from('community_articles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      setArticle(data as ArticleData);
      toast({
        title: 'Content refreshed',
        description: 'Article has been updated with the latest content'
      });
    } catch (err) {
      console.error('Error refreshing article:', err);
      toast({
        title: 'Refresh failed',
        description: 'Failed to refresh article. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleLike = async () => {
    if (!user || !article) {
      toast({
        title: 'Please log in',
        description: 'You need to be logged in to like articles',
        variant: 'destructive'
      });
      return;
    }

    try {
      const newLikes = liked ? article.likes - 1 : article.likes + 1;
      
      // Update local state immediately for better UX
      setLiked(!liked);
      setArticle(prev => prev ? { ...prev, likes: newLikes } : null);

      // Update database
      const { error } = await supabase
        .from('community_articles')
        .update({ likes: newLikes })
        .eq('id', article.id);

      if (error) {
        // Revert on error
        setLiked(liked);
        setArticle(prev => prev ? { ...prev, likes: article.likes } : null);
        throw error;
      }

      toast({
        title: liked ? 'Like removed' : 'Article liked',
        description: liked ? 'You removed your like from this article' : 'Thanks for liking this article!'
      });

    } catch (error) {
      console.error('Error updating like:', error);
      toast({
        title: 'Error',
        description: 'Failed to update like. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title,
          text: article?.excerpt,
          url: url
        });
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: 'Link copied',
          description: 'Article link copied to clipboard'
        });
      } catch (err) {
        toast({
          title: 'Error',
          description: 'Failed to copy link',
          variant: 'destructive'
        });
      }
    }
  };

  if (loading) {
    return (
      <Layout isLoggedIn={!!user}>
        <div className="container max-w-4xl py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-64 w-full" />
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout isLoggedIn={!!user}>
        <div className="container max-w-4xl py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-6">
            <Button onClick={() => navigate('/knowledge')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Knowledge Base
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout isLoggedIn={!!user}>
        <div className="container max-w-4xl py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Article not found</AlertDescription>
          </Alert>
          <div className="mt-6">
            <Button onClick={() => navigate('/knowledge')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Knowledge Base
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isLoggedIn={!!user}>
      <div className="container max-w-4xl py-8">
        {/* Back button */}
        <div className="mb-6">
          <Button 
            onClick={() => navigate('/knowledge')} 
            variant="outline" 
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Knowledge Base
          </Button>
        </div>

        {/* Article header */}
        <article className="space-y-6">
          <header className="space-y-4">
            <Badge variant="secondary">{article.category}</Badge>
            
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {article.title}
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              {article.excerpt}
            </p>

            {/* Cover image */}
            {article.cover_image && (
              <div className="aspect-video overflow-hidden rounded-lg">
                <img 
                  src={article.cover_image} 
                  alt={article.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Article meta */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                    {article.author_avatar ? (
                      <img 
                        src={article.author_avatar} 
                        alt={article.author_name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      article.author_name.substring(0, 2).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{article.author_name}</p>
                    <div className="flex items-center text-sm text-muted-foreground space-x-3">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(article.published_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {article.reading_time} min read
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLike}
                  className={liked ? "text-primary" : ""}
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  {article.likes}
                </Button>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Eye className="h-4 w-4 mr-1" />
                  {article.views}
                </div>

                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>

                <Button 
                  variant="outline" 
                  size="sm"
                  className={saved ? "text-primary" : ""}
                >
                  <Bookmark className="h-4 w-4" />
                </Button>

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh}
                  disabled={refreshing}
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </header>

          {/* Article content */}
          <div 
            className="prose prose-lg max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
      </div>
    </Layout>
  );
}