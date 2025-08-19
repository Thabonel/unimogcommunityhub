
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { ArticleData } from './types';

export function useArticleData(id: string | undefined) {
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true);
      try {
        // Fetch from Supabase database
        if (id) {
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
          } else {
            setError('Article not found');
          }
        } else {
          setError('Invalid article ID');
        }
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
        window.open(article.originalFileUrl, '_blank');
      } catch (err) {
        console.error('Error downloading file:', err);
        alert('Could not download the file. Please try again later.');
      }
    }
  };

  return { article, isLoading, error, handleFileDownload };
}
