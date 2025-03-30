
import { useState, useEffect } from 'react';
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

export function useArticle(id: string | undefined) {
  const [article, setArticle] = useState<ArticleContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }
      
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
              originalFileUrl: data.source_url,
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

    fetchArticle();
  }, [id]);

  const handleFileDownload = async () => {
    if (article?.originalFileUrl) {
      try {
        window.open(article.originalFileUrl, '_blank');
      } catch (err) {
        console.error('Error downloading file:', err);
        alert('Could not download the file. Please try again later.');
      }
    }
  };

  return {
    article,
    isLoading,
    error,
    handleFileDownload
  };
}
