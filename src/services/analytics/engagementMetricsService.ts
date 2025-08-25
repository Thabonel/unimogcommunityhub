import { supabase } from '@/lib/supabase-client';

export interface ContentEngagementMetrics {
  content_id: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  average_view_time?: number;
  bounce_rate?: number;
  engagement_score?: number;
}

// Calculate engagement score based on various metrics
const calculateEngagementScore = (metrics: Partial<ContentEngagementMetrics>): number => {
  const { views = 0, likes = 0, comments = 0, shares = 0, average_view_time = 0 } = metrics;
  
  // Simple formula weighting different types of engagement
  // Can be adjusted based on business goals
  const likeWeight = 1;
  const commentWeight = 5; 
  const shareWeight = 10;
  const viewWeight = 0.1;
  const timeWeight = 0.05;
  
  // Prevent division by zero
  if (views === 0) return 0;
  
  const likeRatio = likes / views;
  const commentRatio = comments / views;
  const shareRatio = shares / views;
  
  return (
    (likeRatio * likeWeight) +
    (commentRatio * commentWeight) +
    (shareRatio * shareWeight) +
    (viewWeight * Math.log(views + 1)) + // Logarithmic scaling for views
    (timeWeight * average_view_time)
  );
};

// Get content engagement metrics
export const getContentEngagementMetrics = async (
  contentId: string,
  contentType: 'post' | 'article' = 'post'
): Promise<ContentEngagementMetrics | null> => {
  try {
    // Get views from activity tracking
    const { data: viewsData, error: viewsError } = await supabase
      .from('user_activities')
      .select('count')
      .eq('event_type', 'page_view')
      .eq('event_data->>content_id', contentId)
      .eq('event_data->>content_type', contentType)
      .single();
    
    if (viewsError) {
      console.error('Error fetching view metrics:', viewsError);
    }
    
    // Get engagement counts for the content
    let likes = 0, comments = 0, shares = 0;
    
    if (contentType === 'post') {
      // Get post metrics
      const { data: postData, error: postError } = await supabase
        .from('community_posts')
        .select('id, likes_count, comments_count, shares_count')
        .eq('id', contentId)
        .single();
      
      if (postError) {
        console.error('Error fetching post metrics:', postError);
      } else if (postData) {
        likes = postData.likes_count || 0;
        comments = postData.comments_count || 0;
        shares = postData.shares_count || 0;
      }
    }
    
    // Get average view time from session data
    const { data: viewTimeData, error: timeError } = await supabase
      .from('user_activities')
      .select('event_data->view_time')
      .eq('event_type', 'content_view_duration')
      .eq('event_data->>content_id', contentId);
    
    if (timeError) {
      console.error('Error fetching view time metrics:', timeError);
    }
    
    // Calculate average view time
    let average_view_time = 0;
    if (viewTimeData && viewTimeData.length > 0) {
      const totalTime = viewTimeData.reduce((sum, item) => {
        return sum + (Number(item.view_time) || 0);
      }, 0);
      average_view_time = totalTime / viewTimeData.length;
    }
    
    const metrics: ContentEngagementMetrics = {
      content_id: contentId,
      views: (viewsData?.count as number) || 0,
      likes,
      comments,
      shares,
      average_view_time,
      engagement_score: 0
    };
    
    // Calculate engagement score
    metrics.engagement_score = calculateEngagementScore(metrics);
    
    return metrics;
  } catch (error) {
    console.error('Error in getContentEngagementMetrics:', error);
    return null;
  }
};

// Update content popularity ranking based on engagement metrics
export const updateContentPopularityRanking = async (
  contentType: 'post' | 'article' = 'post'
): Promise<void> => {
  try {
    // Get all content IDs of the specified type
    const { data: contentIds, error } = await supabase
      .from(contentType === 'post' ? 'posts' : 'community_articles')
      .select('id');
    
    if (error || !contentIds) {
      console.error(`Error fetching ${contentType} IDs:`, error);
      return;
    }
    
    // Get engagement metrics for all content
    const metricsPromises = contentIds.map(content => 
      getContentEngagementMetrics(content.id, contentType)
    );
    
    const metricsResults = await Promise.all(metricsPromises);
    
    // Filter out nulls and sort by engagement score
    const validMetrics = metricsResults.filter(
      (metrics): metrics is ContentEngagementMetrics => metrics !== null
    ).sort((a, b) => (b.engagement_score || 0) - (a.engagement_score || 0));
    
    // Save updated rankings to database
    for (let i = 0; i < validMetrics.length; i++) {
      const { content_id, engagement_score } = validMetrics[i];
      
      await supabase
        .from(`${contentType}_metrics`)
        .upsert({
          content_id,
          engagement_score,
          popularity_rank: i + 1,
          last_updated: new Date().toISOString()
        }, {
          onConflict: 'content_id'
        });
    }
  } catch (error) {
    console.error('Error in updateContentPopularityRanking:', error);
  }
};

// Get trending content based on recent engagement
export const getTrendingContent = async (
  contentType: 'post' | 'article' = 'post',
  timeframe: 'day' | 'week' | 'month' = 'day',
  limit: number = 10
): Promise<string[]> => {
  try {
    let timeAgo;
    const now = new Date();
    
    switch (timeframe) {
      case 'month':
        timeAgo = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'week':
        timeAgo = new Date(now.setDate(now.getDate() - 7));
        break;
      default: // day
        timeAgo = new Date(now.setDate(now.getDate() - 1));
        break;
    }
    
    // Query for recent engagement using Supabase's query builder without 'group'
    const { data, error } = await supabase
      .rpc('get_trending_content', { 
        content_type: contentType,
        time_ago: timeAgo.toISOString(),
        result_limit: limit
      });
    
    if (error) {
      console.error('Error fetching trending content:', error);
      // Fallback approach if RPC not available
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('user_activities')
        .select('event_data->content_id')
        .eq('event_data->>content_type', contentType)
        .in('event_type', ['post_like', 'post_comment', 'post_share', 'page_view'])
        .gte('timestamp', timeAgo.toISOString())
        .order('timestamp', { ascending: false })
        .limit(limit);
      
      if (fallbackError || !fallbackData) {
        console.error('Error with fallback trending content query:', fallbackError);
        return [];
      }
      
      // Extract unique content IDs from results
      const uniqueContentIds = [...new Set(fallbackData.map(item => item['event_data->>content_id']))];
      return uniqueContentIds.filter(Boolean).slice(0, limit);
    }
    
    // Extract content IDs from results
    return data?.map(item => item.content_id) || [];
  } catch (error) {
    console.error('Error in getTrendingContent:', error);
    return [];
  }
};
