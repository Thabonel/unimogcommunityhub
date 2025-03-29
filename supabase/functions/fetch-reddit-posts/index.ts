
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

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
  stickied: boolean;
}

interface ProcessedArticle {
  id: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  author_id: string;
  author_name: string;
  published_at: Date;
  reading_time: number;
  likes: number;
  views: number;
  category: string;
  content: string;
  url: string;
  subreddit: string;
}

const fetchRedditPosts = async (subreddit: string): Promise<ProcessedArticle[]> => {
  try {
    const response = await fetch(
      `https://www.reddit.com/r/${subreddit}/hot.json?limit=15`
    );
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
        const wordCount = (post.selftext || "").split(/\s+/).length;
        const readingTime = Math.max(1, Math.ceil(wordCount / 200));
        
        // Format date
        const date = new Date(post.created_utc * 1000);
        
        // Extract categories from post flair or use subreddit
        const category = post.subreddit;
        
        // Better excerpt handling
        const excerpt = post.selftext 
          ? post.selftext.substring(0, 120) + "..." 
          : "Click to read more about this topic from the Reddit community...";
          
        // Handle image thumbnails better
        const validThumbnail = post.thumbnail && 
          !["self", "default", "nsfw", "spoiler"].includes(post.thumbnail);
        
        return {
          id: post.id,
          title: post.title,
          excerpt: excerpt,
          coverImage: validThumbnail
            ? post.thumbnail
            : "/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png",
          author_id: post.author,
          author_name: post.author,
          published_at: date,
          reading_time: readingTime,
          likes: post.ups,
          views: Math.floor(post.ups * 3.5), // Estimate views as 3.5x upvotes
          category: category,
          content: post.selftext || excerpt,
          url: `https://www.reddit.com${post.permalink}`,
          subreddit: post.subreddit
        };
      });
    
    return processedArticles;
  } catch (err) {
    console.error("Error fetching Reddit posts:", err);
    throw err;
  }
};

// Handle CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Configure Supabase client with env vars
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get subreddits to fetch from request or use defaults
    let subreddits = ["unimog", "4x4", "Overlanding", "MercedesBenz"];
    
    if (req.method === "POST") {
      const body = await req.json();
      if (body.subreddits && Array.isArray(body.subreddits)) {
        subreddits = body.subreddits;
      }
    }
    
    // Process all subreddits
    const results: { subreddit: string; count: number }[] = [];
    
    for (const subreddit of subreddits) {
      const articles = await fetchRedditPosts(subreddit);
      
      // First, delete old articles from this subreddit
      const { error: deleteError } = await supabase
        .from("reddit_articles")
        .delete()
        .eq("subreddit", subreddit);
        
      if (deleteError) {
        console.error(`Error deleting old ${subreddit} articles:`, deleteError);
      }
      
      // Insert new articles
      const { data, error } = await supabase
        .from("reddit_articles")
        .insert(articles);
        
      if (error) {
        console.error(`Error inserting ${subreddit} articles:`, error);
        results.push({ subreddit, count: 0 });
      } else {
        results.push({ subreddit, count: articles.length });
      }
    }
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Reddit articles fetched and stored",
        results 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error in fetch-reddit-posts function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Unknown error occurred" 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
