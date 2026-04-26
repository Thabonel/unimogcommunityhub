import { RegisteredTool, ToolResult, ToolExecutionContext } from './types.ts';

interface BraveWebResult {
  title: string;
  url: string;
  description: string;
  page_age?: string;
}

async function execute(
  input: Record<string, unknown>,
  ctx: ToolExecutionContext,
): Promise<ToolResult> {
  const t0 = Date.now();
  const query = String(input.query ?? '');
  const count = Math.min(Number(input.count ?? 5), 10);

  if (!query.trim()) {
    return {
      ok: false,
      error: { code: 'INVALID_INPUT', message: 'query is required', retriable: false },
      metadata: { latency_ms: 0, source: 'brave-search', timestamp: new Date().toISOString() },
    };
  }

  if (!ctx.braveApiKey) {
    return {
      ok: false,
      error: { code: 'INVALID_INPUT', message: 'Brave Search API key not configured', retriable: false },
      metadata: { latency_ms: 0, source: 'brave-search', timestamp: new Date().toISOString() },
    };
  }

  try {
    const url = new URL('https://api.search.brave.com/res/v1/web/search');
    url.searchParams.set('q', query);
    url.searchParams.set('count', count.toString());
    url.searchParams.set('text_decorations', '0');
    url.searchParams.set('search_lang', 'en');
    url.searchParams.set('safesearch', 'moderate');

    const resp = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip',
        'X-Subscription-Token': ctx.braveApiKey,
      },
      signal: AbortSignal.timeout(8000),
    });

    if (resp.status === 429) {
      return {
        ok: false,
        error: { code: 'RATE_LIMITED', message: 'Brave Search rate limit reached', retriable: false },
        metadata: { latency_ms: Date.now() - t0, source: 'brave-search', timestamp: new Date().toISOString() },
      };
    }

    if (!resp.ok) throw new Error(`Brave Search HTTP ${resp.status}`);

    const raw = await resp.json() as { web?: { results?: BraveWebResult[] } };
    const results = (raw.web?.results ?? []).map(r => ({
      title: r.title,
      url: r.url,
      description: r.description,
      published: r.page_age ?? null,
    }));

    const ts = new Date().toISOString();
    return {
      ok: true,
      data: {
        result_count: results.length,
        results,
        source: 'Brave Search',
        as_of: ts,
        instructions: 'When citing these results, include the URL and publication date when available.',
      },
      metadata: { latency_ms: Date.now() - t0, source: 'brave-search', timestamp: ts },
    };
  } catch (err) {
    return {
      ok: false,
      error: { code: 'UPSTREAM_ERROR', message: String(err), retriable: true },
      metadata: { latency_ms: Date.now() - t0, source: 'brave-search', timestamp: new Date().toISOString() },
    };
  }
}

export const webSearchTool: RegisteredTool = {
  definition: {
    name: 'web_search',
    description:
      'Search the web for current information not in the Unimog manuals — parts prices, dealer locations, community forums, recent news, fuel prices, campsite reviews, road conditions. Use for any question requiring up-to-date or location-specific information.',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        count: { type: 'number', description: 'Number of results to return (1-10, default 5)' },
      },
      required: ['query'],
    },
  },
  config: { timeout_ms: 8000, retries: 1, fallback: 'none' },
  phase: 2,
  execute,
};
