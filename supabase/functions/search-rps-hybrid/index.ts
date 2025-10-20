// supabase/functions/search-rps-hybrid/index.ts
// Barry: lexical-first hybrid search with hard filters → deterministic recall

// Deno Edge Function
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

type HybridRow = {
  chunk_id: string;
  page_number: number;
  rps_group_code: string | null;
  rps_group_name: string | null;
  visual_content_type: string | null;
  content: string | null;
  bm25_score: number;
  phrase_bonus: number;
  exact_bonus: number;
  hybrid_score: number;
};

type SearchParams = {
  query: string;
  wantDiagram: boolean;
  wantGroupCode: string | null;
  limit?: number;
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false }
});

// --- Routing helpers (deterministic flags) ---

function normalize(s: string): string {
  return s.normalize("NFKC").toLowerCase().trim();
}

function looksLikeGroupCodeToken(token: string): boolean {
  // RPS codes are typically 2–3 uppercase letters (e.g., DA, DEA, etc.)
  return /^[a-z]{2,3}$/.test(token); // we compare on lowercased tokens
}

function maybeExtractInlineCode(qLower: string): string | null {
  // Check explicit "code:" patterns and standalone tokens
  // Priority 1: code:XYZ
  const m = qLower.match(/\bcode\s*:\s*([a-z]{2,3})\b/);
  if (m) return m[1];

  // Priority 2: standalone 2–3 letter token
  const tokens = qLower.split(/[^a-z0-9]+/).filter(Boolean);
  for (const t of tokens) {
    if (looksLikeGroupCodeToken(t)) return t;
  }
  return null;
}

function extractGroupCode(q: string): string | null {
  const lower = normalize(q);

  // High-confidence dictionary for common queries
  // Extend this map over time (safe defaults, lowercase keys)
  const map: Record<string, string> = {
    "fuel pump": "dea",
    "fuel tank": "da",
    "sender unit": "da",
    "crankcase": "a",
    "oil pump": "ab",
    "water pump": "bb",
    "radiator": "bd",
  };

  for (const [k, v] of Object.entries(map)) {
    if (lower.includes(k)) return v;
  }

  // Fallback: inline detection (e.g., "DEA exploded view" or "code:dea")
  const code = maybeExtractInlineCode(lower);
  return code;
}

function wantDiagramFromQuery(q: string): boolean {
  const lower = normalize(q);
  return (
    lower.includes("exploded view") ||
    lower.includes("exploded") ||
    lower.includes("diagram") ||
    lower.includes("schematic")
  );
}

function routeQuery(userQuery: string): SearchParams {
  const wantDiagram = wantDiagramFromQuery(userQuery);
  const wantGroupCode = extractGroupCode(userQuery); // lowercased or null
  return {
    query: userQuery,
    wantDiagram,
    wantGroupCode,
    limit: 8
  };
}

// If code path returns nothing (e.g., unknown code), fall back once to lexical
async function runHybridSearch(q: string, wantDiagram: boolean, wantGroupCode: string | null, limit = 8) {
  // Try code-filtered route if we have a plausible code
  if (wantGroupCode) {
    const { data, error } = await supabaseAdmin.rpc("search_manual_hybrid", {
      q,
      want_diagram: wantDiagram,
      want_group_code: wantGroupCode, // already lowercased
      limit_n: limit
    }) as unknown as { data: HybridRow[] | null; error: any };

    if (error) throw new Error(`search_manual_hybrid(code) failed: ${error.message || error}`);

    if (data && data.length > 0) {
      return { data, route: "code" as const };
    }
    // fall through to lexical if no hits
  }

  // Lexical-first route
  const { data, error } = await supabaseAdmin.rpc("search_manual_hybrid", {
    q,
    want_diagram: wantDiagram,
    want_group_code: null,
    limit_n: limit
  }) as unknown as { data: HybridRow[] | null; error: any };

  if (error) throw new Error(`search_manual_hybrid(lexical) failed: ${error.message || error}`);
  return { data: data ?? [], route: "lexical" as const };
}

// --- HTTP handler ---

type Incoming =
  | { query: string; top_k?: number }
  | { messages: Array<{ role: string; content: string }>; top_k?: number };

function extractUserQuery(body: Incoming): { query: string; topK: number } {
  const topK = Math.max(1, Math.min(20, (body as any).top_k ?? 8));

  if ("query" in body && typeof body.query === "string") {
    return { query: body.query, topK };
  }
  if ("messages" in body && Array.isArray(body.messages)) {
    // last user message content
    const lastUser = [...body.messages].reverse().find(m => m.role === "user");
    if (lastUser && typeof lastUser.content === "string") {
      return { query: lastUser.content, topK };
    }
  }
  throw new Error("No query provided");
}

serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
          "Access-Control-Allow-Methods": "POST,OPTIONS",
        },
      });
    }

    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const body = (await req.json()) as Incoming;
    const { query, topK } = extractUserQuery(body);

    const routed = routeQuery(query);
    const { data, route } = await runHybridSearch(
      query,
      routed.wantDiagram,
      routed.wantGroupCode, // pass lowercased or null
      routed.limit ?? topK
    );

    // Map results to a compact payload Barry can stuff into context
    const hits = (data ?? []).map((r) => ({
      chunk_id: r.chunk_id,
      page_number: r.page_number,
      rps_group_code: r.rps_group_code,
      rps_group_name: r.rps_group_name,
      visual: r.visual_content_type,
      score: r.hybrid_score,
      snippet: r.content,
    }));

    const response = {
      route_used: route,
      routed_params: {
        wantDiagram: routed.wantDiagram,
        wantGroupCode: routed.wantGroupCode,
        limit: routed.limit ?? topK,
      },
      query,
      hits
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store"
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});
