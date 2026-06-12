import { RegisteredTool, ToolResult, ToolExecutionContext } from './types.ts';
import { searchManualTool } from './search-manual.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

function isV2Enabled(): boolean {
  return Deno.env.get('BARRY_V2_RETRIEVAL_ENABLED') === 'true';
}

function blockTypesForQueryType(queryType: string | undefined): string[] | null {
  switch (queryType) {
    case 'spec_lookup':
      return ['specification'];
    case 'procedure':
      return ['procedure', 'warning'];
    case 'diagnostic':
      return ['diagnostic', 'procedure', 'warning'];
    case 'parts':
      return ['parts_list', 'diagram'];
    default:
      return null;
  }
}

async function fallbackToV1(
  input: Record<string, unknown>,
  ctx: ToolExecutionContext,
  startedAt: number,
  reason: string,
): Promise<ToolResult> {
  const fallback = await searchManualTool.execute(input, ctx);
  return {
    ...fallback,
    metadata: {
      ...fallback.metadata,
      latency_ms: Date.now() - startedAt,
      source: `manual_chunks_fallback:${reason}`,
    },
  };
}

async function execute(
  input: Record<string, unknown>,
  ctx: ToolExecutionContext,
): Promise<ToolResult> {
  const t0 = Date.now();
  const query = String(input.query ?? '');
  const maxResults = Math.min(Number(input.max_results ?? 5), 8);
  const queryType = typeof input.query_type === 'string' ? input.query_type : undefined;

  if (!query.trim()) {
    return {
      ok: false,
      error: { code: 'INVALID_INPUT', message: 'query is required', retriable: false },
      metadata: { latency_ms: 0, source: 'barry_v2_content_blocks', timestamp: new Date().toISOString() },
    };
  }

  if (!isV2Enabled()) {
    return fallbackToV1(input, ctx, t0, 'feature_disabled');
  }

  try {
    const db = createClient(ctx.supabaseUrl, ctx.supabaseServiceKey);
    const blockTypes = blockTypesForQueryType(queryType);
    const { data, error } = await db.rpc('barry_v2_search_content', {
      query_text: query,
      match_count: maxResults,
      block_types: blockTypes,
    });

    if (error) {
      return fallbackToV1(input, ctx, t0, `v2_error:${error.code ?? 'unknown'}`);
    }

    const rows = Array.isArray(data) ? data : [];
    if (!rows.length) {
      return fallbackToV1(input, ctx, t0, 'no_v2_results');
    }

    const results = rows.slice(0, maxResults).map((row: Record<string, unknown>) => ({
      block_id: row.block_id,
      block_type: row.block_type,
      title: row.title ?? null,
      page_number: row.page_number ?? null,
      source_page_reference: row.source_page_reference ?? null,
      manual_title: row.manual_title ?? null,
      chapter_title: row.chapter_title ?? null,
      rank: row.rank ?? null,
      content_preview: String(row.content_text ?? '').slice(0, 500),
    }));

    return {
      ok: true,
      data: {
        found: results.length > 0,
        result_count: results.length,
        results,
        fallback_used: false,
        instructions: 'Use these typed Barry v2 content blocks. Cite source_page_reference or page_number for every technical claim.',
      },
      metadata: { latency_ms: Date.now() - t0, source: 'barry_v2_content_blocks', timestamp: new Date().toISOString() },
    };
  } catch (err) {
    return fallbackToV1(input, ctx, t0, `exception:${String(err).slice(0, 80)}`);
  }
}

export const searchManualV2Tool: RegisteredTool = {
  definition: {
    name: 'search_manual_v2',
    description:
      'Search Barry v2 structured content blocks for Unimog procedures, specifications, diagnostics, diagrams, warnings, and parts context. Falls back to current manual_chunks search when v2 is disabled or empty.',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'The technical question or topic to search for' },
        query_type: {
          type: 'string',
          description: 'Optional query type from classify_query_v2: diagnostic, spec_lookup, procedure, parts, or general',
        },
        max_results: { type: 'number', description: 'Maximum results to return (1-8, default 5)' },
      },
      required: ['query'],
    },
  },
  config: { timeout_ms: 10000, retries: 1, fallback: 'degrade' },
  phase: 1,
  execute,
};
