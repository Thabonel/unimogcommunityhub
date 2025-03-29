
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  author: string;
  created_utc: number;
  url: string;
  permalink: string;
  num_comments: number;
  ups: number;
  is_video: boolean;
  thumbnail: string;
  subreddit: string;
  stickied?: boolean;
}

interface ProcessedArticle {
  id: string;
  title: string;
  excerpt: string;
  coverImage?: string;
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

export function useRedditPosts(subreddit: string = 'unimog') {
  const [articles, setArticles] = useState<ProcessedArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRedditPosts = async () => {
      setIsLoading(true);
      try {
        // First try to fetch posts from our database
        const { data: dbPosts, error: dbError } = await supabase
          .from('reddit_articles')
          .select('*')
          .eq('subreddit', subreddit)
          .order('likes', { ascending: false });
          
        // If we have posts in the database, use them
        if (dbPosts && dbPosts.length > 0) {
          // Transform the database posts to our expected format
          const processedArticles: ProcessedArticle[] = dbPosts.map((post: any) => {
            // Format date
            const date = new Date(post.published_at);
            const formattedDate = date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric', 
              year: 'numeric'
            });
            
            return {
              id: post.id,
              title: post.title,
              excerpt: post.excerpt,
              coverImage: post.coverImage,
              author: {
                id: post.author_id,
                name: post.author_name,
              },
              publishedAt: formattedDate,
              readingTime: post.reading_time,
              likes: post.likes,
              views: post.views,
              categories: [post.category],
            };
          });
          
          setArticles(processedArticles);
          setError(null);
        } else {
          // If not in the database, fall back to the original Reddit API fetch
          const response = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=15`);
          if (!response.ok) {
            throw new Error(`Failed to fetch Reddit posts from r/${subreddit}`);
          }
          
          const data = await response.json();
          const posts: RedditPost[] = data.data.children.map((child: any) => child.data);
          
          // Transform Reddit posts to article format
          const processedArticles: ProcessedArticle[] = posts
            .filter(post => !post.stickied && !post.is_video) // Filter out stickied posts and videos
            .map((post) => {
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
  
              // Extract categories from post flair or use subreddit
              const categories = [post.subreddit];
              
              // Better excerpt handling
              const excerpt = post.selftext 
                ? post.selftext.substring(0, 120) + '...' 
                : 'Click to read more about this topic from the Reddit community...';
                
              // Handle image thumbnails better
              const validThumbnail = post.thumbnail && 
                !['self', 'default', 'nsfw', 'spoiler'].includes(post.thumbnail);
              
              return {
                id: post.id,
                title: post.title,
                excerpt,
                coverImage: validThumbnail
                  ? post.thumbnail
                  : '/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png',
                author: {
                  id: post.author,
                  name: post.author,
                },
                publishedAt: formattedDate,
                readingTime,
                likes: post.ups,
                views: Math.floor(post.ups * 3.5), // Estimate views as 3.5x upvotes
                categories,
              };
            });
          
          setArticles(processedArticles);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching Reddit posts:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRedditPosts();
  }, [subreddit]);

  return { articles, isLoading, error };
}
