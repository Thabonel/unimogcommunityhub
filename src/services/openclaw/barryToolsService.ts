import { supabase } from '@/lib/supabase-client';
import type { BarryOpenClawMessage, BarryOpenClawResponse, ManualReference } from './barryOpenClawService';

export interface BarryToolsRequest {
  messages: BarryOpenClawMessage[];
  location?: { latitude: number; longitude: number };
  conversationId?: string;
}

type BarryToolsManualReference = {
  page_number: number;
  storage_url?: string;
  title?: string;
};

type BarryToolsResponse = {
  content?: string;
  manualReferences?: BarryToolsManualReference[];
  knowledgeMode?: string;
  searchResultCount?: number;
  skill_chain?: string[];
  execution_time_ms?: number;
};

function normaliseManualReferences(rawRefs: BarryToolsManualReference[] | undefined): ManualReference[] {
  const seen = new Set<string>();
  const result: ManualReference[] = [];

  for (const ref of rawRefs ?? []) {
    const pageNumber = Number(ref.page_number);
    const storageUrl = ref.storage_url?.trim();
    if (!Number.isFinite(pageNumber) || pageNumber <= 0 || !storageUrl) continue;

    const key = `${pageNumber}|${storageUrl}`;
    if (seen.has(key)) continue;
    seen.add(key);

    result.push({
      type: 'manual',
      title: ref.title ?? 'U435 Workshop Manual',
      page_number: pageNumber,
      original_page: pageNumber,
      pdf_page: pageNumber,
      storage_url: storageUrl,
      manual_type: 'manual',
    });
  }

  return result;
}

export function normaliseBarryToolsResponse(data: BarryToolsResponse): BarryOpenClawResponse {
  return {
    content: data.content ?? '',
    manualReferences: normaliseManualReferences(data.manualReferences),
    knowledgeMode: data.knowledgeMode ?? 'tool_use',
    searchResultCount: data.searchResultCount ?? 0,
    skill_chain: data.skill_chain ?? [],
    execution_time_ms: data.execution_time_ms,
  };
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

  return normaliseBarryToolsResponse(data ?? {});
}
