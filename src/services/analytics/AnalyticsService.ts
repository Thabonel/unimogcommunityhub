import { supabase } from '@/lib/supabase-client';
import { format, eachDayOfInterval, startOfDay, endOfDay, subDays, parseISO } from 'date-fns';

export interface AnalyticsMetrics {
  visitors: number;
  signups: number;
  avgSessionTime: number;
  conversionRate: number;
  visitorsChange: number;
  signupsChange: number;
  avgSessionTimeChange: number;
  conversionRateChange: number;
}

export interface EngagementData {
  date: string;
  pageViews: number;
  activeUsers: number;
  averageSessionTime: number;
}

export interface SubscriptionData {
  name: string;
  value: number;
}

export interface ContentData {
  title: string;
  views: number;
  type: string;
  engagementScore: number;
  category: string;
}

export interface CountryData {
  country: string;
  users: number;
  percentage: number;
}

export class AnalyticsService {
  private static instance: AnalyticsService;

  static getInstance(): AnalyticsService {
    if (!this.instance) {
      this.instance = new AnalyticsService();
    }
    return this.instance;
  }

  /**
   * Get analytics summary metrics for the specified date range
   */
  async getAnalyticsSummary(
    dateRange: { from: Date; to: Date },
    userType: string = 'all'
  ): Promise<AnalyticsMetrics> {
    try {
      const fromDate = startOfDay(dateRange.from).toISOString();
      const toDate = endOfDay(dateRange.to).toISOString();

      // Get current period metrics
      const [visitorsResult, signupsResult] = await Promise.all([
        this.getVisitorCount(fromDate, toDate),
        this.getSignupCount(fromDate, toDate, userType)
      ]);

      // Calculate previous period for comparison
      const daysDiff = Math.floor((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
      const prevFromDate = subDays(dateRange.from, daysDiff).toISOString();
      const prevToDate = dateRange.from.toISOString();

      const [prevVisitorsResult, prevSignupsResult] = await Promise.all([
        this.getVisitorCount(prevFromDate, prevToDate),
        this.getSignupCount(prevFromDate, prevToDate, userType)
      ]);

      // Calculate session time from visitor analytics
      const avgSessionTime = await this.getAverageSessionTime(fromDate, toDate, userType);
      const prevAvgSessionTime = await this.getAverageSessionTime(prevFromDate, prevToDate, userType);

      // Calculate changes
      const visitorsChange = this.calculatePercentageChange(visitorsResult, prevVisitorsResult);
      const signupsChange = this.calculatePercentageChange(signupsResult, prevSignupsResult);
      const avgSessionTimeChange = this.calculatePercentageChange(avgSessionTime, prevAvgSessionTime);

      // Calculate conversion rate
      const conversionRate = visitorsResult > 0 ? (signupsResult / visitorsResult) * 100 : 0;
      const prevConversionRate = prevVisitorsResult > 0 ? (prevSignupsResult / prevVisitorsResult) * 100 : 0;
      const conversionRateChange = this.calculatePercentageChange(conversionRate, prevConversionRate);

      return {
        visitors: visitorsResult,
        signups: signupsResult,
        avgSessionTime: parseFloat(avgSessionTime.toFixed(1)),
        conversionRate: parseFloat(conversionRate.toFixed(1)),
        visitorsChange,
        signupsChange,
        avgSessionTimeChange,
        conversionRateChange
      };
    } catch (error) {
      console.error('Error fetching analytics summary:', error);
      throw error;
    }
  }

  /**
   * Get daily engagement data for charts
   */
  async getEngagementData(
    dateRange: { from: Date; to: Date },
    userType: string = 'all'
  ): Promise<EngagementData[]> {
    try {
      const days = eachDayOfInterval({
        start: dateRange.from,
        end: dateRange.to
      }).slice(0, 30); // Limit to 30 days for performance

      const engagementData = await Promise.all(
        days.map(async (day) => {
          const dayStart = startOfDay(day).toISOString();
          const dayEnd = endOfDay(day).toISOString();

          const [activeUsers, pageViews, sessionTime] = await Promise.all([
            this.getSignupCount(dayStart, dayEnd, userType),
            this.getPageViews(dayStart, dayEnd),
            this.getAverageSessionTime(dayStart, dayEnd, userType)
          ]);

          return {
            date: format(day, 'MMM dd'),
            pageViews,
            activeUsers,
            averageSessionTime: Math.round(sessionTime)
          };
        })
      );

      return engagementData;
    } catch (error) {
      console.error('Error fetching engagement data:', error);
      throw error;
    }
  }

  /**
   * Get subscription distribution data
   */
  async getSubscriptionData(
    dateRange: { from: Date; to: Date },
    userType: string = 'all'
  ): Promise<{ data: SubscriptionData[]; conversionRate: number; retentionRate: number }> {
    try {
      const fromDate = dateRange.from.toISOString();
      const toDate = dateRange.to.toISOString();

      if (userType !== 'all') {
        // Return single subscription type data
        const { count } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('subscription_type', userType)
          .gte('created_at', fromDate)
          .lte('created_at', toDate);

        return {
          data: [{ name: userType.charAt(0).toUpperCase() + userType.slice(1), value: count || 0 }],
          conversionRate: await this.getConversionRate(userType),
          retentionRate: await this.getRetentionRate(userType)
        };
      }

      // Get all subscription types
      const subscriptionTypes = ['free', 'trial', 'basic', 'premium'];
      const subscriptionData = await Promise.all(
        subscriptionTypes.map(async (type) => {
          const { count } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('subscription_type', type)
            .gte('created_at', fromDate)
            .lte('created_at', toDate);

          return {
            name: type.charAt(0).toUpperCase() + type.slice(1),
            value: count || 0
          };
        })
      );

      const conversionRate = await this.getConversionRate();
      const retentionRate = await this.getRetentionRate();

      return {
        data: subscriptionData.filter(item => item.value > 0),
        conversionRate,
        retentionRate
      };
    } catch (error) {
      console.error('Error fetching subscription data:', error);
      throw error;
    }
  }

  /**
   * Get popular content data
   */
  async getPopularContent(dateRange: { from: Date; to: Date }): Promise<ContentData[]> {
    try {
      // Get popular posts from community_posts
      const { data: posts } = await supabase
        .from('community_posts')
        .select('title, views, created_at, metadata')
        .gte('created_at', dateRange.from.toISOString())
        .lte('created_at', dateRange.to.toISOString())
        .order('views', { ascending: false })
        .limit(10);

      // Get marketplace listings views (if they have view tracking)
      const { data: listings } = await supabase
        .from('marketplace_listings')
        .select('title, views, created_at, category')
        .gte('created_at', dateRange.from.toISOString())
        .lte('created_at', dateRange.to.toISOString())
        .order('views', { ascending: false })
        .limit(5);

      const contentData: ContentData[] = [];

      // Process posts
      if (posts) {
        posts.forEach(post => {
          contentData.push({
            title: post.title || 'Untitled Post',
            views: post.views || 0,
            type: 'post',
            engagementScore: this.calculateEngagementScore(post.views || 0, 'post'),
            category: 'Community'
          });
        });
      }

      // Process listings
      if (listings) {
        listings.forEach(listing => {
          contentData.push({
            title: listing.title || 'Untitled Listing',
            views: listing.views || 0,
            type: 'listing',
            engagementScore: this.calculateEngagementScore(listing.views || 0, 'listing'),
            category: listing.category || 'Marketplace'
          });
        });
      }

      // Sort by views and return top results
      return contentData
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);
    } catch (error) {
      console.error('Error fetching popular content:', error);
      throw error;
    }
  }

  /**
   * Get users by country data
   */
  async getUsersByCountry(
    dateRange: { from: Date; to: Date },
    userType: string = 'all'
  ): Promise<CountryData[]> {
    try {
      let query = supabase
        .from('profiles')
        .select('country')
        .gte('created_at', dateRange.from.toISOString())
        .lte('created_at', dateRange.to.toISOString());

      if (userType !== 'all') {
        query = query.eq('subscription_type', userType);
      }

      const { data: profiles } = await query;

      if (!profiles) return [];

      // Count users by country
      const countryMap = new Map<string, number>();
      profiles.forEach(profile => {
        const country = profile.country || 'Unknown';
        countryMap.set(country, (countryMap.get(country) || 0) + 1);
      });

      const totalUsers = profiles.length;
      const countryData: CountryData[] = Array.from(countryMap.entries())
        .map(([country, users]) => ({
          country,
          users,
          percentage: totalUsers > 0 ? (users / totalUsers) * 100 : 0
        }))
        .sort((a, b) => b.users - a.users)
        .slice(0, 10);

      return countryData;
    } catch (error) {
      console.error('Error fetching users by country:', error);
      throw error;
    }
  }

  // Private helper methods
  private async getVisitorCount(fromDate: string, toDate: string): Promise<number> {
    const { count } = await supabase
      .from('visitor_analytics')
      .select('*', { count: 'exact', head: true })
      .gte('visited_at', fromDate)
      .lte('visited_at', toDate);

    return count || 0;
  }

  private async getSignupCount(fromDate: string, toDate: string, userType: string = 'all'): Promise<number> {
    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', fromDate)
      .lte('created_at', toDate);

    if (userType !== 'all') {
      query = query.eq('subscription_type', userType);
    }

    const { count } = await query;
    return count || 0;
  }

  private async getPageViews(fromDate: string, toDate: string): Promise<number> {
    // Estimate page views based on visitor analytics
    const { count } = await this.getVisitorCount(fromDate, toDate);
    return (count || 0) * 3; // Assume average 3 page views per visitor
  }

  private async getAverageSessionTime(fromDate: string, toDate: string, userType: string = 'all'): Promise<number> {
    // For now, return a reasonable default
    // In future, this could track actual session durations
    const multiplier = userType === 'premium' ? 1.5 :
                      userType === 'basic' ? 1.2 :
                      userType === 'trial' ? 0.8 : 1;
    return 5.3 * multiplier;
  }

  private async getConversionRate(userType?: string): Promise<number> {
    try {
      const { count: trials } = await supabase
        .from('trial_events')
        .select('*', { count: 'exact', head: true });

      const { count: conversions } = await supabase
        .from('visitor_analytics')
        .select('*', { count: 'exact', head: true })
        .eq('converted_to_subscription', true);

      return trials && trials > 0 ? Math.round((conversions || 0) / trials * 100) : 0;
    } catch (error) {
      console.error('Error calculating conversion rate:', error);
      return 0;
    }
  }

  private async getRetentionRate(userType?: string): Promise<number> {
    // This would require more complex logic to track retention
    // For now, return reasonable defaults based on user type
    switch (userType) {
      case 'premium': return 92;
      case 'basic': return 78;
      case 'trial': return 0;
      default: return 82;
    }
  }

  private calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }

  private calculateEngagementScore(views: number, type: string): number {
    // Simple engagement score calculation
    const baseScore = Math.min(views / 100, 10);
    const typeMultiplier = type === 'post' ? 1.2 : 1.0;
    return Math.min(baseScore * typeMultiplier, 10);
  }
}

export const analyticsService = AnalyticsService.getInstance();