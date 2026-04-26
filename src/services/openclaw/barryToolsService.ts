import { supabase } from '@/lib/supabase-client';
import type { BarryOpenClawMessage, BarryOpenClawResponse, ManualReference } from './barryOpenClawService';

export interface BarryToolsRequest {
  messages: BarryOpenClawMessage[];
  location?: { latitude: number; longitude: number };
  conversationId?: string;
}

/**
 * Calls the barry-tools edge function and normalises the response to the
 * same shape as BarryOpenClawResponse so existing UI works unchanged.
 */
export async function callBarryTools(request: BarryToolsRequest): Promise<BarryOpenClawResponse> {
  const { data, error } = await supabase.functions.invoke('barry-tools', {
    body: {
      messages: request.messages,
      userLocation: request.location,
      conversationId: request.conversationId,
    },
  });

  if (error) throw new Error(error.message || 'Barry Tools unavailable');

  // Normalise manual references — barry-tools returns a lighter shape
  const rawRefs: Array<{ page_number: number; storage_url: string; title?: string }> =
    data.manualReferences ?? [];

  const manualReferences: ManualReference[] = rawRefs.map(r => ({
    type: 'manual',
    title: r.title ?? 'U435 Workshop Manual',
    page_number: r.page_number,
    original_page: r.page_number,
    pdf_page: r.page_number,
    storage_url: r.storage_url,
    manual_type: 'manual',
  }));

  return {
    content: data.content ?? '',
    manualReferences,
    knowledgeMode: data.knowledgeMode ?? 'tool_use',
    searchResultCount: data.searchResultCount ?? 0,
    skill_chain: data.skill_chain ?? [],
    execution_time_ms: data.execution_time_ms,
  };
}
