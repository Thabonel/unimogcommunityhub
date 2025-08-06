import { supabase } from '@/lib/supabase';

interface WISAnalyticsEvent {
  action: 'view_procedure' | 'search_part' | 'download_diagram' | 'bookmark_item';
  content_path: string;
  content_type: 'procedure' | 'part' | 'diagram' | 'wiring';
  model?: string;
  system?: string;
  metadata?: Record<string, any>;
}

class WISAnalyticsService {
  /**
   * Track user interactions with WIS EPC content
   */
  async trackEvent(event: WISAnalyticsEvent): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Log to usage table
      await supabase.from('wis_usage_logs').insert({
        user_id: user.id,
        action: event.action,
        details: {
          content_path: event.content_path,
          content_type: event.content_type,
          model: event.model,
          system: event.system,
          ...event.metadata,
          timestamp: new Date().toISOString()
        }
      });

      // Update content popularity (if tracking implemented)
      await this.updateContentPopularity(event);
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  /**
   * Get most accessed content
   */
  async getMostUsedContent(limit = 50): Promise<any[]> {
    try {
      const { data, error } = await supabase.rpc('get_popular_wis_content', {
        limit_count: limit
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching popular content:', error);
      return [];
    }
  }

  /**
   * Get usage patterns by model
   */
  async getUsageByModel(): Promise<Record<string, number>> {
    try {
      const { data, error } = await supabase
        .from('wis_usage_logs')
        .select('details->model')
        .not('details->model', 'is', null);

      if (error) throw error;

      // Count by model
      const modelCounts: Record<string, number> = {};
      data?.forEach(row => {
        const model = row['details']['model'];
        modelCounts[model] = (modelCounts[model] || 0) + 1;
      });

      return modelCounts;
    } catch (error) {
      console.error('Error analyzing usage:', error);
      return {};
    }
  }

  private async updateContentPopularity(event: WISAnalyticsEvent): Promise<void> {
    // This would update a separate popularity tracking table
    // Implementation depends on how you want to structure the data
  }
}

export const wisAnalyticsService = new WISAnalyticsService();