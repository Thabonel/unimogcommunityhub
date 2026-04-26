import { RegisteredTool, ToolResult, ToolExecutionContext } from './types.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

function extractKeywords(query: string): string[] {
  const stop = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'have', 'has', 'do',
    'does', 'will', 'would', 'could', 'should', 'to', 'of', 'in', 'for', 'on',
    'with', 'at', 'by', 'from', 'how', 'what', 'where', 'when', 'why', 'which',
    'who', 'my', 'your', 'i', 'me', 'you', 'can', 'may', 'might',
  ]);
  return [...new Set(
    query.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/)
      .filter(w => w.length > 2 && !stop.has(w))
  )];
}

function scoreEntry(queryKeywords: string[], entryKeywords: string[]): number {
  if (!queryKeywords.length || !entryKeywords.length) return 0;
  const lower = entryKeywords.map(k => k.toLowerCase());
  let matches = 0;
  for (const qk of queryKeywords) {
    if (lower.some(ek => ek === qk || ek.includes(qk) || qk.includes(ek))) matches++;
  }
  return matches / queryKeywords.length;
}

async function execute(
  input: Record<string, unknown>,
  ctx: ToolExecutionContext,
): Promise<ToolResult> {
  const t0 = Date.now();
  const query = String(input.query ?? '');

  if (!query.trim()) {
    return {
      ok: false,
      error: { code: 'INVALID_INPUT', message: 'query is required', retriable: false },
      metadata: { latency_ms: 0, source: 'barry_knowledge_base', timestamp: new Date().toISOString() },
    };
  }

  try {
    const db = createClient(ctx.supabaseUrl, ctx.supabaseServiceKey);
    const { data: entries, error } = await db
      .from('barry_knowledge_base')
      .select('id,question_keywords,barry_response_template,manual_references,validation_count,updated_at')
      .order('priority', { ascending: false })
      .limit(50);

    if (error) throw new Error(error.message);

    const queryKeywords = extractKeywords(query);
    const MIN_SCORE = 0.4;

    const scored = (entries ?? [])
      .map((entry: Record<string, unknown>) => ({
        entry,
        score: scoreEntry(queryKeywords, (entry.question_keywords as string[]) ?? []),
      }))
      .filter(({ score }) => score >= MIN_SCORE)
      .sort((a, b) => b.score - a.score);

    if (!scored.length) {
      return {
        ok: true,
        data: { found: false, instructions: 'No validated answer found. Proceed with manual search.' },
        metadata: { latency_ms: Date.now() - t0, source: 'barry_knowledge_base', timestamp: new Date().toISOString() },
      };
    }

    const best = scored[0].entry;
    return {
      ok: true,
      data: {
        found: true,
        response_template: best.barry_response_template,
        manual_references: best.manual_references ?? [],
        validation_count: best.validation_count ?? 0,
        kb_entry_id: best.id,
        instructions: 'Use this validated answer as your primary source. You may supplement with manual search results.',
      },
      metadata: { latency_ms: Date.now() - t0, source: 'barry_knowledge_base', timestamp: new Date().toISOString() },
    };
  } catch (err) {
    return {
      ok: false,
      error: { code: 'UPSTREAM_ERROR', message: String(err), retriable: false },
      metadata: { latency_ms: Date.now() - t0, source: 'barry_knowledge_base', timestamp: new Date().toISOString() },
    };
  }
}

export const lookupKnowledgeBaseTool: RegisteredTool = {
  definition: {
    name: 'lookup_knowledge_base',
    description:
      'Check the admin-validated knowledge base for pre-approved answers to common Unimog questions. Use this FIRST for any technical question — validated answers are higher quality than raw manual search. Returns empty if no match.',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'The user question to look up' },
      },
      required: ['query'],
    },
  },
  config: { timeout_ms: 3000, retries: 0, fallback: 'none' },
  phase: 1,
  execute,
};
