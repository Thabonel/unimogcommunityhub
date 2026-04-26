/**
 * Barry Tools Edge Function
 * Native Anthropic tool-use implementation replacing context-stuffing with first-class tool calls.
 *
 * Architecture:
 *   Security guardrails → Tool-use loop (max 5 iterations) → Safety filter → Log → Response
 *
 * Drop-in compatible with chat-with-barry-agentic response shape.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getToolDefinitions, getToolByName } from './tools/registry.ts';
import type { ToolExecutionContext } from './tools/types.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform',
};

const ANTHROPIC_API_KEY = <ANTHROPIC_API_KEY>
const ANTHROPIC_MODEL = Deno.env.get('ANTHROPIC_MODEL_TOOLS') || 'claude-haiku-4-5';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const BRAVE_API_KEY = Deno.env.get('BRAVE_API_KEY');
const MAPBOX_TOKEN = Deno.env.get('MAPBOX_TOKEN');

const MAX_TOOL_ITERATIONS = 5;
const MAX_QUERY_LENGTH = 2000;
const MAX_MESSAGES = 20;

// --- Simple in-function rate limiting (avoids _shared dependency) ---
const requestCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = requestCounts.get(ip);
  if (!entry || now >= entry.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

function getClientIP(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

// --- Safety ---
const SAFETY_TRIGGERS: Array<{ keywords: string[]; disclaimer: string }> = [
  {
    keywords: ['brake', 'brakes', 'braking'],
    disclaimer: 'Safety: Always use jack stands and chock wheels before working under vehicle. Never work on brakes without proper support.',
  },
  {
    keywords: ['electrical', 'wiring', 'battery'],
    disclaimer: 'Safety: Disconnect the negative battery terminal before working on electrical systems.',
  },
  {
    keywords: ['lift', 'lifting', 'jack', 'raised'],
    disclaimer: 'Safety: Always use rated jack stands. Never work under a vehicle supported only by a jack.',
  },
  {
    keywords: ['hydraulic', 'hydraulics', 'pressure'],
    disclaimer: 'Safety: Depressurize hydraulic systems before opening any lines. High-pressure fluid can penetrate skin.',
  },
  {
    keywords: ['fuel', 'petrol', 'diesel', 'injector'],
    disclaimer: 'Safety: Work in a well-ventilated area away from ignition sources when handling fuel.',
  },
  {
    keywords: ['pto', 'power take-off', 'driveshaft'],
    disclaimer: 'Safety: Disengage PTO and wait for all rotation to stop before performing any maintenance.',
  },
];

const BLOCKED_PATTERNS = [
  'ignore previous instructions',
  'system prompt override',
  'act as different character',
  'jailbreak',
  'disable safety systems',
  'bypass brake system',
  'permanently disable brake',
  'remove airbag',
  'modify emissions control',
  'defeat emissions',
  'bypass seatbelt interlock',
  'disable pto safety switch',
];

function sanitizeQuery(query: string): string | null {
  const q = query.trim().slice(0, MAX_QUERY_LENGTH);
  const lower = q.toLowerCase();
  for (const pattern of BLOCKED_PATTERNS) {
    if (lower.includes(pattern)) return null;
  }
  return q;
}

function buildSafetyDisclaimer(response: string): string {
  const lower = response.toLowerCase();
  const disclaimers: string[] = [];
  for (const trigger of SAFETY_TRIGGERS) {
    if (trigger.keywords.some(kw => lower.includes(kw))) {
      disclaimers.push(trigger.disclaimer);
    }
  }
  if (!disclaimers.length) return response;
  return response + '\n\n---\n' + disclaimers.map(d => `⚠️ ${d}`).join('\n');
}

// --- System prompt ---
const BARRY_SYSTEM_PROMPT = `You are Barry, a gruff but friendly Unimog mechanic with 40+ years of experience. You specialise in the U435 series (U1300L, U1700L) and G-series military models, but you know the whole Unimog lineup.

Your character:
- Practical and direct — no waffle
- Use proper technical terms but explain them when useful
- Always emphasise safety, never skip safety precautions
- Light personality: occasional mechanic's aside, but don't force it

Tool use rules:
1. For any technical Unimog question, ALWAYS call lookup_knowledge_base first, then search_manual if needed.
2. Always cite specific page numbers from search_manual results in your response.
3. For weather, call get_weather. For anything needing current information, call web_search.
4. If you don't find information in the manuals, say so clearly — never fabricate specs or procedures.
5. For general questions that need no tools, answer directly from general knowledge.
6. If the user asks about their vehicle, call lookup_user_vehicle first.

Response format:
- Be concise but complete
- Use markdown formatting for procedures (numbered lists, bold for critical steps)
- When citing manuals, write: "According to page X of the U435 Workshop Manual..."`;

// --- Claude API ---
async function callClaude(
  messages: Array<{ role: string; content: unknown }>,
  tools: unknown[],
): Promise<Record<string, unknown>> {
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 2048,
      system: BARRY_SYSTEM_PROMPT,
      messages,
      tools,
    }),
  });

  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`Claude API ${resp.status}: ${body}`);
  }

  return resp.json() as Promise<Record<string, unknown>>;
}

// --- Tool execution ---
async function executeToolCall(
  toolName: string,
  toolInput: Record<string, unknown>,
  toolCtx: ToolExecutionContext,
  conversationId: string,
  db: ReturnType<typeof createClient>,
  claudeIteration: number,
): Promise<string> {
  const tool = getToolByName(toolName);
  if (!tool) {
    return JSON.stringify({ ok: false, error: { code: 'NOT_FOUND', message: `Unknown tool: ${toolName}` } });
  }

  const startMs = Date.now();
  let result;

  try {
    result = await Promise.race([
      tool.execute(toolInput, toolCtx),
      new Promise(resolve =>
        setTimeout(() => resolve({
          ok: false,
          error: { code: 'TIMEOUT', message: `Tool ${toolName} timed out`, retriable: false },
          metadata: { latency_ms: tool.config.timeout_ms, source: toolName, timestamp: new Date().toISOString() },
        }), tool.config.timeout_ms)
      ),
    ]) as typeof result;
  } catch (err) {
    result = {
      ok: false,
      error: { code: 'UPSTREAM_ERROR', message: String(err), retriable: false },
      metadata: { latency_ms: Date.now() - startMs, source: toolName, timestamp: new Date().toISOString() },
    };
  }

  // Log async — don't await
  db.from('barry_tool_executions').insert({
    conversation_id: conversationId,
    user_id: toolCtx.userId ?? null,
    tool_name: toolName,
    tool_phase: String(tool.phase),
    latency_ms: result?.metadata?.latency_ms ?? (Date.now() - startMs),
    success: result?.ok ?? false,
    error_code: result?.error?.code ?? null,
    claude_iteration: claudeIteration,
  }).then(() => {}).catch(() => {});

  return JSON.stringify(result);
}

// --- Main handler ---
serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const clientIP = getClientIP(req);

  if (!checkRateLimit(clientIP)) {
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded. Please wait before sending another message.' }),
      { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  try {
    const body = await req.json() as {
      message?: string;
      messages?: Array<{ role: string; content: string }>;
      userLocation?: { latitude: number; longitude: number };
      conversationId?: string;
    };

    const rawQuery = body.message ?? body.messages?.at(-1)?.content ?? '';
    const safeQuery = sanitizeQuery(rawQuery);

    if (!safeQuery) {
      return new Response(
        JSON.stringify({ error: 'Message blocked by safety filter.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Auth
    const authHeader = req.headers.get('Authorization');
    const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    let userId: string | undefined;

    if (authHeader) {
      const userDb = createClient(SUPABASE_URL, authHeader.replace('Bearer ', ''));
      const { data: { user } } = await userDb.auth.getUser();
      userId = user?.id;
    }

    const conversationId = body.conversationId ?? crypto.randomUUID();

    const toolCtx: ToolExecutionContext = {
      supabaseUrl: SUPABASE_URL,
      supabaseServiceKey: SUPABASE_SERVICE_KEY,
      anthropicKey: ANTHROPIC_API_KEY,
      braveApiKey: BRAVE_API_KEY,
      mapboxToken: MAPBOX_TOKEN,
      userId,
      userLocation: body.userLocation,
    };

    // Build messages from history
    const historyMessages = (body.messages ?? [])
      .slice(-(MAX_MESSAGES - 1))
      .map((m: { role: string; content: string }) => ({ role: m.role, content: m.content }));

    const claudeMessages: Array<{ role: string; content: unknown }> =
      historyMessages.length > 0 && historyMessages.at(-1)?.role === 'user'
        ? [...historyMessages.slice(0, -1), { role: 'user', content: safeQuery }]
        : [...historyMessages, { role: 'user', content: safeQuery }];

    const toolDefs = getToolDefinitions();
    const globalStartMs = Date.now();
    let finalContent = '';
    const manualReferences: Array<{ page_number: number; storage_url: string; title?: string }> = [];
    const toolsInvoked: string[] = [];
    let searchResultCount = 0;

    // Tool-use loop
    for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
      const response = await callClaude(claudeMessages, toolDefs);
      const stopReason = response.stop_reason as string;
      const content = response.content as Array<Record<string, unknown>>;

      for (const block of content) {
        if (block.type === 'text') {
          finalContent = String(block.text);
        }
      }

      if (stopReason === 'end_turn') break;
      if (stopReason !== 'tool_use') break;

      const toolUseBlocks = content.filter(b => b.type === 'tool_use');
      if (!toolUseBlocks.length) break;

      claudeMessages.push({ role: 'assistant', content });

      const toolResultContent: Array<Record<string, unknown>> = [];

      for (const toolCall of toolUseBlocks) {
        const toolName = String(toolCall.name);
        const toolInput = (toolCall.input ?? {}) as Record<string, unknown>;
        toolsInvoked.push(toolName);

        const resultJson = await executeToolCall(toolName, toolInput, toolCtx, conversationId, db, iteration + 1);
        const result = JSON.parse(resultJson) as Record<string, unknown>;

        // Extract manual references for frontend
        if (toolName === 'search_manual' && result.ok) {
          const data = result.data as Record<string, unknown>;
          const results = (data.results as Array<Record<string, unknown>>) ?? [];
          searchResultCount += results.length;
          for (const r of results) {
            if (r.page_number && r.storage_url) {
              manualReferences.push({
                page_number: Number(r.page_number),
                storage_url: String(r.storage_url),
                title: r.section_title ? String(r.section_title) : undefined,
              });
            }
          }
        }

        toolResultContent.push({
          type: 'tool_result',
          tool_use_id: toolCall.id,
          content: resultJson,
        });
      }

      claudeMessages.push({ role: 'user', content: toolResultContent });
    }

    const safeContent = buildSafetyDisclaimer(finalContent);

    // Log async
    db.from('chat_logs').insert({
      user_id: userId ?? null,
      messages: body.messages ?? [],
      response: safeContent,
      model: ANTHROPIC_MODEL,
      tokens_used: 0,
      knowledge_source: toolsInvoked.includes('lookup_knowledge_base') ? 'knowledge_base' : 'tool_use',
      pdf_references_found: searchResultCount,
    }).then(() => {}).catch(() => {});

    return new Response(
      JSON.stringify({
        content: safeContent,
        manualReferences,
        knowledgeMode: toolsInvoked.join(',') || 'direct',
        searchResultCount,
        skill_chain: toolsInvoked,
        execution_time_ms: Date.now() - globalStartMs,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('[barry-tools] Error:', err);
    return new Response(
      JSON.stringify({ error: 'Barry encountered an error. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
