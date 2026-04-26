import { RegisteredTool, ToolResult, ToolExecutionContext } from './types.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// --- lookup_user_vehicle ---

async function executeVehicleLookup(
  _input: Record<string, unknown>,
  ctx: ToolExecutionContext,
): Promise<ToolResult> {
  const t0 = Date.now();
  if (!ctx.userId) {
    return {
      ok: true,
      data: { found: false, note: 'User not authenticated' },
      metadata: { latency_ms: 0, source: 'supabase.vehicles', timestamp: new Date().toISOString() },
    };
  }

  try {
    const db = createClient(ctx.supabaseUrl, ctx.supabaseServiceKey);
    const { data, error } = await db
      .from('vehicles')
      .select('id,make,model,year,registration,notes')
      .eq('user_id', ctx.userId)
      .limit(5);

    if (error) throw new Error(error.message);

    return {
      ok: true,
      data: {
        found: (data?.length ?? 0) > 0,
        vehicles: data ?? [],
        instructions: data?.length ? 'Use this vehicle info to tailor your response.' : 'User has no registered vehicles.',
      },
      metadata: { latency_ms: Date.now() - t0, source: 'supabase.vehicles', timestamp: new Date().toISOString() },
    };
  } catch (err) {
    return {
      ok: false,
      error: { code: 'UPSTREAM_ERROR', message: String(err), retriable: false },
      metadata: { latency_ms: Date.now() - t0, source: 'supabase.vehicles', timestamp: new Date().toISOString() },
    };
  }
}

export const lookupUserVehicleTool: RegisteredTool = {
  definition: {
    name: 'lookup_user_vehicle',
    description:
      "Look up the user's registered Unimog vehicles. Call this when a question would benefit from knowing the user's specific model (e.g. 'my diff oil'). Returns make, model, year.",
    input_schema: { type: 'object', properties: {}, required: [] },
  },
  config: { timeout_ms: 3000, retries: 0, fallback: 'none' },
  phase: 1,
  execute: executeVehicleLookup,
};

// --- search_marketplace ---

async function executeMarketplaceSearch(
  input: Record<string, unknown>,
  ctx: ToolExecutionContext,
): Promise<ToolResult> {
  const t0 = Date.now();
  const query = String(input.query ?? '');
  const category = input.category ? String(input.category) : null;

  try {
    const db = createClient(ctx.supabaseUrl, ctx.supabaseServiceKey);
    let req = db
      .from('marketplace_listings')
      .select('id,title,description,price,category,condition,location,images,status,created_at')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(8);

    if (query) req = req.ilike('title', `%${query}%`);
    if (category) req = req.eq('category', category);

    const { data, error } = await req;
    if (error) throw new Error(error.message);

    return {
      ok: true,
      data: { found: (data?.length ?? 0) > 0, result_count: data?.length ?? 0, listings: data ?? [] },
      metadata: { latency_ms: Date.now() - t0, source: 'supabase.marketplace_listings', timestamp: new Date().toISOString() },
    };
  } catch (err) {
    return {
      ok: false,
      error: { code: 'UPSTREAM_ERROR', message: String(err), retriable: false },
      metadata: { latency_ms: Date.now() - t0, source: 'supabase.marketplace_listings', timestamp: new Date().toISOString() },
    };
  }
}

export const searchMarketplaceTool: RegisteredTool = {
  definition: {
    name: 'search_marketplace',
    description:
      "Search the community marketplace for Unimog parts, vehicles, and services for sale. Use when the user asks about buying or finding parts, or wants to know what's available.",
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Part name or keywords to search for' },
        category: { type: 'string', description: 'Filter by category: parts, vehicles, or services' },
      },
      required: ['query'],
    },
  },
  config: { timeout_ms: 4000, retries: 0, fallback: 'none' },
  phase: 2,
  execute: executeMarketplaceSearch,
};

// --- get_events ---

async function executeGetEvents(
  input: Record<string, unknown>,
  ctx: ToolExecutionContext,
): Promise<ToolResult> {
  const t0 = Date.now();
  const daysAhead = Math.min(Number(input.days_ahead ?? 90), 365);

  try {
    const db = createClient(ctx.supabaseUrl, ctx.supabaseServiceKey);
    const now = new Date().toISOString();
    const until = new Date(Date.now() + daysAhead * 86400000).toISOString();

    const { data, error } = await db
      .from('events')
      .select('id,title,description,event_type,start_date,end_date,location_name,location_address,is_public')
      .eq('is_public', true)
      .gte('start_date', now)
      .lte('start_date', until)
      .order('start_date', { ascending: true })
      .limit(10);

    if (error) throw new Error(error.message);

    return {
      ok: true,
      data: { found: (data?.length ?? 0) > 0, result_count: data?.length ?? 0, events: data ?? [] },
      metadata: { latency_ms: Date.now() - t0, source: 'supabase.events', timestamp: new Date().toISOString() },
    };
  } catch (err) {
    return {
      ok: false,
      error: { code: 'UPSTREAM_ERROR', message: String(err), retriable: false },
      metadata: { latency_ms: Date.now() - t0, source: 'supabase.events', timestamp: new Date().toISOString() },
    };
  }
}

export const getEventsTool: RegisteredTool = {
  definition: {
    name: 'get_events',
    description:
      'Get upcoming community events: rallies, meetups, trail rides, workshops. Use when the user asks about events, meetups, or community gatherings.',
    input_schema: {
      type: 'object',
      properties: {
        days_ahead: { type: 'number', description: 'How many days ahead to look (default 90, max 365)' },
      },
      required: [],
    },
  },
  config: { timeout_ms: 4000, retries: 0, fallback: 'none' },
  phase: 2,
  execute: executeGetEvents,
};
