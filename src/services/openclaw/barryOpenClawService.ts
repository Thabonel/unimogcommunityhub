/**
 * Barry OpenClaw Service
 * Service for interacting with the OpenClaw-based Barry edge function
 */

import { supabase } from '@/lib/supabase-client';

export interface BarryOpenClawMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ManualReference {
  type: string;
  title: string;
  page_number: number;
  original_page: number;
  pdf_page: number;
  storage_url: string;
  chapter_filename?: string;
  manual_type: string;
  cdn_url?: string;
  content_preview?: string;
}

export interface BarryOpenClawResponse {
  content: string;
  manualReferences: ManualReference[];
  knowledgeMode: string;
  searchResultCount: number;
  confidence?: number;
  source?: string;
  cache?: boolean;
  degraded?: boolean;
  skill_chain?: string[];
  execution_time_ms?: number;
  error?: string;
}

export interface BarryOpenClawRequest {
  messages: BarryOpenClawMessage[];
  location?: { latitude: number; longitude: number };
  userId?: string;
}

/**
 * Barry OpenClaw Service class
 * Provides methods to interact with the OpenClaw-based Barry AI
 */
export class BarryOpenClawService {
  private static instance: BarryOpenClawService;

  private constructor() {}

  static getInstance(): BarryOpenClawService {
    if (!BarryOpenClawService.instance) {
      BarryOpenClawService.instance = new BarryOpenClawService();
    }
    return BarryOpenClawService.instance;
  }

  /**
   * Send a chat message to Barry via OpenClaw edge function
   */
  async chat(request: BarryOpenClawRequest): Promise<BarryOpenClawResponse> {
    const startTime = performance.now();

    try {
      const { data, error } = await supabase.functions.invoke('barry-openclaw', {
        body: {
          messages: request.messages,
          location: request.location,
          userId: request.userId
        }
      });

      if (error) {
        console.error('[BarryOpenClaw] Edge function error:', error);
        throw new Error(error.message || 'Failed to reach Barry');
      }

      // Track execution time
      const executionTime = performance.now() - startTime;
      console.log(`[BarryOpenClaw] Response in ${executionTime.toFixed(0)}ms, mode: ${data.knowledgeMode}`);

      return {
        ...data,
        execution_time_ms: data.execution_time_ms || executionTime
      };

    } catch (error) {
      console.error('[BarryOpenClaw] Error:', error);
      throw error;
    }
  }

  /**
   * Simple message send helper
   */
  async sendMessage(
    message: string,
    conversationHistory: BarryOpenClawMessage[] = [],
    location?: { latitude: number; longitude: number }
  ): Promise<BarryOpenClawResponse> {
    return this.chat({
      messages: [
        ...conversationHistory,
        { role: 'user', content: message }
      ],
      location
    });
  }

  /**
   * Check if OpenClaw service is available
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.chat({
        messages: [{ role: 'user', content: 'ping' }]
      });
      return !!response.content;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const barryOpenClawService = BarryOpenClawService.getInstance();
