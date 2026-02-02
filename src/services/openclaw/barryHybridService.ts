/**
 * Barry Hybrid Service
 * Enables gradual rollout between legacy Barry and OpenClaw implementation
 * Supports A/B testing and fallback mechanisms
 */

import { supabase } from '@/lib/supabase-client';
import { barryOpenClawService, BarryOpenClawMessage, BarryOpenClawResponse } from './barryOpenClawService';

export interface HybridServiceConfig {
  openclawPercentage: number; // 0-100, percentage of requests to route to OpenClaw
  enableFallback: boolean;     // If OpenClaw fails, fall back to legacy
  trackMetrics: boolean;       // Track A/B comparison metrics
}

export interface HybridResponse extends BarryOpenClawResponse {
  usedOpenClaw: boolean;
  fallbackUsed: boolean;
}

/**
 * Barry Hybrid Service class
 * Routes requests between legacy and OpenClaw based on configuration
 */
export class BarryHybridService {
  private static instance: BarryHybridService;
  private config: HybridServiceConfig;
  private configLoaded: boolean = false;
  private configLoadPromise: Promise<void> | null = null;

  private constructor() {
    // Default configuration - start with 0% OpenClaw, increase gradually
    this.config = {
      openclawPercentage: 0,
      enableFallback: true,
      trackMetrics: true
    };
    // Load config from database on construction
    this.loadConfigFromDatabase();
  }

  /**
   * Load configuration from barry_openclaw_config database table
   */
  private async loadConfigFromDatabase(): Promise<void> {
    if (this.configLoadPromise) return this.configLoadPromise;

    this.configLoadPromise = (async () => {
      try {
        const { data, error } = await supabase
          .from('barry_openclaw_config')
          .select('config_key, config_value');

        if (error) {
          console.warn('[BarryHybrid] Failed to load config from DB:', error);
          return;
        }

        if (data) {
          for (const row of data) {
            if (row.config_key === 'openclaw_percentage') {
              this.config.openclawPercentage = typeof row.config_value === 'number'
                ? row.config_value
                : parseInt(String(row.config_value)) || 0;
            } else if (row.config_key === 'enable_fallback') {
              this.config.enableFallback = row.config_value === true || row.config_value === 'true';
            } else if (row.config_key === 'track_metrics') {
              this.config.trackMetrics = row.config_value === true || row.config_value === 'true';
            }
          }
          console.log(`[BarryHybrid] Config loaded from DB: OpenClaw ${this.config.openclawPercentage}%`);
        }

        this.configLoaded = true;
      } catch (err) {
        console.warn('[BarryHybrid] Error loading config:', err);
      }
    })();

    return this.configLoadPromise;
  }

  /**
   * Ensure config is loaded before proceeding
   */
  private async ensureConfigLoaded(): Promise<void> {
    if (!this.configLoaded && this.configLoadPromise) {
      await this.configLoadPromise;
    }
  }

  static getInstance(): BarryHybridService {
    if (!BarryHybridService.instance) {
      BarryHybridService.instance = new BarryHybridService();
    }
    return BarryHybridService.instance;
  }

  /**
   * Update hybrid service configuration (local only - use admin UI for persistent changes)
   */
  setConfig(config: Partial<HybridServiceConfig>): void {
    this.config = { ...this.config, ...config };
    console.log(`[BarryHybrid] Config updated: OpenClaw ${this.config.openclawPercentage}%, Fallback: ${this.config.enableFallback}`);
  }

  /**
   * Get current configuration
   */
  getConfig(): HybridServiceConfig {
    return { ...this.config };
  }

  /**
   * Refresh config from database (call after admin changes)
   */
  async refreshConfig(): Promise<void> {
    this.configLoaded = false;
    this.configLoadPromise = null;
    await this.loadConfigFromDatabase();
  }

  /**
   * Determine if request should use OpenClaw
   */
  private shouldUseOpenClaw(): boolean {
    const roll = Math.random() * 100;
    return roll < this.config.openclawPercentage;
  }

  /**
   * Send message to legacy Barry (existing chat-with-barry-agentic)
   */
  private async sendToLegacy(
    messages: BarryOpenClawMessage[],
    location?: { latitude: number; longitude: number }
  ): Promise<BarryOpenClawResponse> {
    const { data, error } = await supabase.functions.invoke('chat-with-barry-agentic', {
      body: { messages, location }
    });

    if (error) throw new Error(error.message || 'Legacy Barry failed');

    return {
      content: data.content || '',
      manualReferences: data.manualReferences || [],
      knowledgeMode: data.knowledgeMode || 'legacy',
      searchResultCount: data.searchResultCount || 0,
      confidence: data.confidence,
      source: 'legacy',
      cache: data.cache,
      degraded: data.degraded
    };
  }

  /**
   * Send chat message with hybrid routing
   */
  async chat(
    messages: BarryOpenClawMessage[],
    location?: { latitude: number; longitude: number },
    userId?: string
  ): Promise<HybridResponse> {
    // Ensure config is loaded from database before routing
    await this.ensureConfigLoaded();

    const useOpenClaw = this.shouldUseOpenClaw();
    const startTime = performance.now();

    console.log(`[BarryHybrid] Routing to ${useOpenClaw ? 'OpenClaw' : 'Legacy'} (${this.config.openclawPercentage}% OpenClaw)`);

    try {
      let response: BarryOpenClawResponse;
      let fallbackUsed = false;

      if (useOpenClaw) {
        try {
          response = await barryOpenClawService.chat({
            messages,
            location,
            userId
          });
        } catch (openclawError) {
          console.error('[BarryHybrid] OpenClaw failed:', openclawError);

          if (this.config.enableFallback) {
            console.log('[BarryHybrid] Falling back to legacy...');
            response = await this.sendToLegacy(messages, location);
            fallbackUsed = true;
          } else {
            throw openclawError;
          }
        }
      } else {
        response = await this.sendToLegacy(messages, location);
      }

      const executionTime = performance.now() - startTime;

      // Track metrics if enabled
      if (this.config.trackMetrics) {
        this.trackMetrics(
          useOpenClaw,
          fallbackUsed,
          executionTime,
          response.knowledgeMode,
          response.searchResultCount
        );
      }

      return {
        ...response,
        usedOpenClaw: useOpenClaw && !fallbackUsed,
        fallbackUsed,
        execution_time_ms: executionTime
      };

    } catch (error) {
      console.error('[BarryHybrid] Error:', error);
      throw error;
    }
  }

  /**
   * Track A/B testing metrics
   */
  private async trackMetrics(
    usedOpenClaw: boolean,
    fallbackUsed: boolean,
    executionTimeMs: number,
    knowledgeMode: string,
    referenceCount: number
  ): Promise<void> {
    try {
      await supabase.from('barry_ab_metrics').insert({
        used_openclaw: usedOpenClaw,
        fallback_used: fallbackUsed,
        execution_time_ms: executionTimeMs,
        knowledge_mode: knowledgeMode,
        reference_count: referenceCount,
        openclaw_percentage: this.config.openclawPercentage
      });
    } catch (error) {
      // Don't fail the request if metrics tracking fails
      console.warn('[BarryHybrid] Failed to track metrics:', error);
    }
  }

  /**
   * Run A/B comparison - send same query to both and compare
   */
  async compareImplementations(
    messages: BarryOpenClawMessage[],
    location?: { latitude: number; longitude: number }
  ): Promise<{
    legacy: BarryOpenClawResponse;
    openclaw: BarryOpenClawResponse;
    comparison: {
      legacyTimeMs: number;
      openclawTimeMs: number;
      sameKnowledgeMode: boolean;
      referenceCountDiff: number;
    };
  }> {
    console.log('[BarryHybrid] Running A/B comparison...');

    const [legacyResult, openclawResult] = await Promise.allSettled([
      (async () => {
        const start = performance.now();
        const result = await this.sendToLegacy(messages, location);
        return { result, time: performance.now() - start };
      })(),
      (async () => {
        const start = performance.now();
        const result = await barryOpenClawService.chat({ messages, location });
        return { result, time: performance.now() - start };
      })()
    ]);

    const legacy = legacyResult.status === 'fulfilled'
      ? legacyResult.value.result
      : { content: 'Error', manualReferences: [], knowledgeMode: 'error', searchResultCount: 0 };

    const openclaw = openclawResult.status === 'fulfilled'
      ? openclawResult.value.result
      : { content: 'Error', manualReferences: [], knowledgeMode: 'error', searchResultCount: 0 };

    const legacyTime = legacyResult.status === 'fulfilled' ? legacyResult.value.time : 0;
    const openclawTime = openclawResult.status === 'fulfilled' ? openclawResult.value.time : 0;

    return {
      legacy,
      openclaw,
      comparison: {
        legacyTimeMs: legacyTime,
        openclawTimeMs: openclawTime,
        sameKnowledgeMode: legacy.knowledgeMode === openclaw.knowledgeMode,
        referenceCountDiff: openclaw.searchResultCount - legacy.searchResultCount
      }
    };
  }

  /**
   * Simple message helper
   */
  async sendMessage(
    message: string,
    conversationHistory: BarryOpenClawMessage[] = [],
    location?: { latitude: number; longitude: number }
  ): Promise<HybridResponse> {
    return this.chat(
      [...conversationHistory, { role: 'user', content: message }],
      location
    );
  }
}

// Export singleton instance
export const barryHybridService = BarryHybridService.getInstance();
