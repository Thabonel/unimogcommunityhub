/**
 * Barry Tools Edge Function — single-file bundle (no local imports)
 * OpenAI-compatible tool-use. DeepSeek picks tools per question; no context stuffing.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform',
};

const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY');
const DEEPSEEK_MODEL = Deno.env.get('DEEPSEEK_MODEL_TOOLS') || 'deepseek-chat';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const BRAVE_API_KEY = Deno.env.get('BRAVE_API_KEY');

if (!DEEPSEEK_API_KEY) throw new Error('DEEPSEEK_API_KEY env var is required');
if (!SUPABASE_URL) throw new Error('SUPABASE_URL env var is required');
if (!SUPABASE_SERVICE_KEY) throw new Error('SUPABASE_SERVICE_ROLE_KEY env var is required');

const MAX_TOOL_ITERATIONS = 5;
const MAX_QUERY_LENGTH = 2000;
const MAX_MESSAGES = 20;

const TOOL_PHASE: Record<string, string> = {
  lookup_knowledge_base: '1', search_manual: '1', lookup_user_vehicle: '1',
  get_weather: '1', web_search: '1', search_marketplace: '1',
  get_events: '1', convert_units: '1', translate_text: '1',
  search_rps: '2', find_nearby_services: '2', search_community_content: '2',
};

// ─── Rate limiting ───────────────────────────────────────────────────────────

const _rateCounts = new Map<string, { n: number; reset: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const e = _rateCounts.get(ip);
  if (!e || now >= e.reset) { _rateCounts.set(ip, { n: 1, reset: now + 60_000 }); return true; }
  if (e.n >= 10) return false;
  e.n++; return true;
}
function getClientIP(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? req.headers.get('x-real-ip') ?? 'unknown';
}

// ─── Safety ──────────────────────────────────────────────────────────────────

const BLOCKED_PATTERNS = [
  'ignore previous instructions', 'system prompt override', 'act as different character',
  'jailbreak', 'disable safety systems', 'bypass brake system', 'permanently disable brake',
  'remove airbag', 'modify emissions control', 'defeat emissions', 'bypass seatbelt interlock',
];

const SAFETY_TRIGGERS: Array<{ kw: string[]; msg: string }> = [
  { kw: ['brake', 'brakes', 'braking'], msg: 'Always use jack stands and chock wheels before working under vehicle. Never work on brakes without proper support.' },
  { kw: ['electrical', 'wiring', 'battery'], msg: 'Disconnect the negative battery terminal before working on electrical systems.' },
  { kw: ['lift', 'lifting', 'jack', 'raised'], msg: 'Always use rated jack stands. Never work under a vehicle supported only by a jack.' },
  { kw: ['hydraulic', 'hydraulics'], msg: 'Depressurise hydraulic systems before opening any lines. High-pressure fluid can penetrate skin.' },
  { kw: ['fuel', 'diesel', 'petrol', 'injector'], msg: 'Work in a well-ventilated area away from ignition sources when handling fuel.' },
  { kw: ['pto', 'power take-off', 'driveshaft'], msg: 'Disengage PTO and wait for all rotation to stop before performing any maintenance.' },
];

function sanitise(q: string): string | null {
  const s = q.trim().slice(0, MAX_QUERY_LENGTH);
  const lower = s.toLowerCase();
  for (const p of BLOCKED_PATTERNS) if (lower.includes(p)) return null;
  return s;
}

function addSafety(text: string): string {
  const lower = text.toLowerCase();
  const d = SAFETY_TRIGGERS.filter(t => t.kw.some(k => lower.includes(k))).map(t => `⚠️ ${t.msg}`);
  return d.length ? text + '\n\n---\n' + d.join('\n') : text;
}

const SUPA_STORAGE = `${SUPABASE_URL}/storage/v1/object/public`;

// ─── Tool: search_manual ──────────────────────────────────────────────────────

// The manuals bucket is heterogeneous: most files use spaces→dashes + .pdf,
// some preserve literal spaces, and some live under workshop/ or rps/ subfolders.
// We list once per cold start and resolve manual_title → real storage path.
let _pdfPaths: string[] | null = null;
let _pdfBasenames: Map<string, string> | null = null;

async function loadAvailablePdfs(db: ReturnType<typeof createClient>): Promise<void> {
  if (_pdfPaths) return;
  const { data } = await db.schema('storage').from('objects')
    .select('name').eq('bucket_id', 'manuals').like('name', '%.pdf').limit(500);
  const paths = (data ?? []).map((r: Record<string, unknown>) => String(r.name));
  _pdfPaths = paths;
  _pdfBasenames = new Map(paths.map((p: string) => [p.split('/').pop()!, p]));
}

function resolveManualPath(manualTitle: string): string | null {
  if (!manualTitle || !_pdfBasenames) return null;
  const stripped = manualTitle.replace(/\.pdf$/i, '');
  const candidates = [
    stripped.replace(/\s+/g, '-') + '.pdf',  // most common: spaces → dashes
    stripped + '.pdf',                        // literal spaces preserved
  ];
  for (const name of candidates) {
    const path = _pdfBasenames.get(name);
    if (path) return path;
  }
  return null;
}

function manualStorageUrl(manualTitle: string, pageNumber: number): string {
  const path = resolveManualPath(manualTitle);
  if (!path) return '';
  return `${SUPA_STORAGE}/manuals/${encodeURI(path)}#page=${pageNumber}`;
}

function keywords(q: string): string[] {
  const stop = new Set(['the','a','an','is','are','was','were','have','has','do','does','will','would',
    'could','should','to','of','in','for','on','with','at','by','from','how','what','where','when',
    'why','which','who','my','your','i','me','you','can','may','might','be','been']);
  return [...new Set(q.toLowerCase().replace(/[^\w\s]/g,' ').split(/\s+/).filter(w => w.length > 2 && !stop.has(w)))];
}

async function toolSearchManual(input: Record<string, unknown>, db: ReturnType<typeof createClient>): Promise<unknown> {
  const query = String(input.query ?? '');
  const max = Math.min(Number(input.max_results ?? 5), 8);
  if (!query.trim()) return { ok: false, error: 'query required' };

  await loadAvailablePdfs(db);

  const kws = keywords(query);
  let chunks: Record<string, unknown>[] = [];

  if (kws.length) {
    const { data: fts } = await db.from('manual_chunks')
      .select('content,section_title,page_number,manual_title')
      .textSearch('content', kws.join(' & '), { type: 'websearch', config: 'english' })
      .limit(max);
    if (fts?.length) { chunks = fts; }
    else {
      const seen = new Set<string>();
      for (const kw of kws.slice(0, 4)) {
        const { data } = await db.from('manual_chunks')
          .select('content,section_title,page_number,manual_title')
          .ilike('content', `%${kw}%`).limit(max);
        for (const r of data ?? []) {
          const key = `${r.manual_title}|${r.page_number}`;
          if (!seen.has(key)) { seen.add(key); chunks.push(r); }
        }
        if (chunks.length >= max) break;
      }
    }
  }

  const results = chunks
    .map(c => {
      const url = manualStorageUrl(String(c.manual_title ?? ''), Number(c.page_number));
      if (!url) return null;
      return {
        page_number: c.page_number,
        section_title: c.section_title ?? null,
        manual_title: c.manual_title ?? null,
        storage_url: url,
        content_preview: String(c.content ?? '').slice(0, 400),
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null)
    .slice(0, max);

  return {
    ok: true,
    found: results.length > 0,
    result_count: results.length,
    results,
    instructions: results.length > 0
      ? 'Cite specific page numbers from these results in your response.'
      : 'No manual content found. Tell the user the manual does not cover this topic.',
  };
}

// ─── Tool: lookup_knowledge_base ─────────────────────────────────────────────

function scoreKB(qkws: string[], ekws: string[]): number {
  if (!qkws.length || !ekws.length) return 0;
  const lower = ekws.map(k => k.toLowerCase());
  let m = 0;
  for (const qk of qkws) if (lower.some(ek => ek === qk || ek.includes(qk) || qk.includes(ek))) m++;
  return m / qkws.length;
}

async function toolKnowledgeBase(input: Record<string, unknown>, db: ReturnType<typeof createClient>): Promise<unknown> {
  const query = String(input.query ?? '');
  if (!query.trim()) return { ok: false, error: 'query required' };

  const { data } = await db.from('barry_knowledge_base')
    .select('id,question_keywords,barry_response_template,manual_references,validation_count')
    .order('priority', { ascending: false }).limit(50);

  const qkws = keywords(query);
  type ScoredEntry = { e: Record<string, unknown>; s: number };
  const scored: ScoredEntry[] = (data ?? [])
    .map((e: Record<string, unknown>) => ({ e, s: scoreKB(qkws, (e.question_keywords as string[]) ?? []) }))
    .filter((x: ScoredEntry) => x.s >= 0.4)
    .sort((a: ScoredEntry, b: ScoredEntry) => b.s - a.s);

  if (!scored.length) return { ok: true, found: false, instructions: 'No validated answer found. Use search_manual.' };

  const best = scored[0].e;
  return {
    ok: true, found: true,
    response_template: best.barry_response_template,
    manual_references: best.manual_references ?? [],
    validation_count: best.validation_count ?? 0,
    instructions: 'Use this validated answer as primary source.',
  };
}

// ─── Tool: get_weather ───────────────────────────────────────────────────────

interface WeatherData { ok: boolean; current: Record<string, unknown>; forecast: Record<string, unknown>[]; source: string; as_of: string; instructions: string }
const _weatherCache = new Map<string, { d: WeatherData; at: number }>();

function wmoDesc(code: number): string {
  const m: Record<number, string> = {
    0:'Clear sky',1:'Mainly clear',2:'Partly cloudy',3:'Overcast',
    45:'Foggy',48:'Rime fog',51:'Light drizzle',53:'Moderate drizzle',55:'Dense drizzle',
    61:'Slight rain',63:'Moderate rain',65:'Heavy rain',71:'Slight snow',73:'Moderate snow',
    75:'Heavy snow',80:'Slight showers',81:'Moderate showers',82:'Violent showers',
    95:'Thunderstorm',96:'Thunderstorm with hail',99:'Thunderstorm with heavy hail',
  };
  return m[code] ?? 'Unknown';
}

async function toolGetWeather(input: Record<string, unknown>, userLocation?: { latitude: number; longitude: number }): Promise<unknown> {
  const lat = input.latitude != null ? Number(input.latitude) : userLocation?.latitude;
  const lon = input.longitude != null ? Number(input.longitude) : userLocation?.longitude;
  const days = Math.min(Number(input.forecast_days ?? 3), 7);

  if (lat == null || lon == null) return { ok: false, error: 'latitude and longitude required — ask the user to share their location or specify a place name' };

  const key = `${lat.toFixed(2)},${lon.toFixed(2)}`;
  const cached = _weatherCache.get(key);
  if (cached && Date.now() - cached.at < 3_600_000) return cached.d;

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&forecast_days=${days}&timezone=auto&wind_speed_unit=kmh`;
    const resp = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!resp.ok) throw new Error(`Open-Meteo ${resp.status}`);
    const raw = await resp.json() as Record<string, unknown>;
    const cur = raw.current as Record<string, unknown>;
    const daily = raw.daily as Record<string, unknown[]>;
    const ts = new Date().toISOString();

    const data: WeatherData = {
      ok: true,
      current: {
        condition: wmoDesc(Number(cur.weather_code)),
        temperature_c: cur.temperature_2m,
        humidity_pct: cur.relative_humidity_2m,
        wind_kmh: cur.wind_speed_10m,
        precipitation_mm: cur.precipitation,
      },
      forecast: (daily.time as string[]).map((date, i) => ({
        date,
        condition: wmoDesc((daily.weather_code as number[])[i]),
        max_temp_c: (daily.temperature_2m_max as number[])[i],
        min_temp_c: (daily.temperature_2m_min as number[])[i],
        precipitation_mm: (daily.precipitation_sum as number[])[i],
        max_wind_kmh: (daily.wind_speed_10m_max as number[])[i],
      })),
      source: 'Open-Meteo',
      as_of: ts,
      instructions: `Include "(Source: Open-Meteo, ${ts})" when presenting this data.`,
    };
    _weatherCache.set(key, { d: data, at: Date.now() });
    return data;
  } catch (err) {
    if (cached) return { ...cached.d, stale: true };
    return { ok: false, error: String(err) };
  }
}

// ─── Tool: web_search ────────────────────────────────────────────────────────

async function toolWebSearch(input: Record<string, unknown>): Promise<unknown> {
  const query = String(input.query ?? '');
  const count = Math.min(Number(input.count ?? 5), 10);
  if (!query.trim()) return { ok: false, error: 'query required' };
  if (!BRAVE_API_KEY) return { ok: false, error: 'Web search not configured' };

  try {
    const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=${count}&text_decorations=0&safesearch=moderate`;
    const resp = await fetch(url, {
      headers: { Accept: 'application/json', 'X-Subscription-Token': BRAVE_API_KEY },
      signal: AbortSignal.timeout(8000),
    });
    if (resp.status === 429) return { ok: false, error: 'Search rate limited' };
    if (!resp.ok) throw new Error(`Brave ${resp.status}`);
    const raw = await resp.json() as { web?: { results?: Array<{ title: string; url: string; description: string; page_age?: string }> } };
    const ts = new Date().toISOString();
    return {
      ok: true,
      results: (raw.web?.results ?? []).map(r => ({ title: r.title, url: r.url, description: r.description, published: r.page_age ?? null })),
      as_of: ts,
      instructions: 'Include URL and publication date when citing these results.',
    };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

// ─── Tool: convert_units ─────────────────────────────────────────────────────

const CONV: Record<string, Record<string, (v: number) => number>> = {
  nm: { 'ft-lb': v => v * 0.737562 },
  'ft-lb': { nm: v => v * 1.35582 },
  bar: { psi: v => v * 14.5038, kpa: v => v * 100 },
  psi: { bar: v => v * 0.0689476, kpa: v => v * 6.89476 },
  kpa: { bar: v => v / 100, psi: v => v / 6.89476 },
  liter: { gallon: v => v * 0.264172, quart: v => v * 1.05669 },
  litre: { gallon: v => v * 0.264172, quart: v => v * 1.05669 },
  gallon: { liter: v => v * 3.78541, litre: v => v * 3.78541, quart: v => v * 4 },
  quart: { liter: v => v * 0.946353, litre: v => v * 0.946353 },
  km: { mile: v => v * 0.621371, miles: v => v * 0.621371 },
  mile: { km: v => v * 1.60934 }, miles: { km: v => v * 1.60934 },
  kmh: { mph: v => v * 0.621371 }, mph: { kmh: v => v * 1.60934 },
  kg: { lb: v => v * 2.20462, lbs: v => v * 2.20462 },
  lb: { kg: v => v * 0.453592 }, lbs: { kg: v => v * 0.453592 },
  celsius: { fahrenheit: v => v * 9/5 + 32 }, fahrenheit: { celsius: v => (v-32) * 5/9 },
  mm: { inch: v => v * 0.0393701, inches: v => v * 0.0393701 },
  inch: { mm: v => v * 25.4 }, inches: { mm: v => v * 25.4 },
  m: { ft: v => v * 3.28084, feet: v => v * 3.28084 },
  ft: { m: v => v * 0.3048 }, feet: { m: v => v * 0.3048 },
};

function toolConvertUnits(input: Record<string, unknown>): unknown {
  const value = Number(input.value);
  const from = String(input.from_unit ?? '').toLowerCase().replace(/\s/g,'');
  const to = String(input.to_unit ?? '').toLowerCase().replace(/\s/g,'');
  if (isNaN(value)) return { ok: false, error: 'value must be a number' };
  if (from === to) return { ok: true, input: value, from_unit: from, to_unit: to, result: value };
  const fn = CONV[from]?.[to];
  if (!fn) return { ok: false, error: `Cannot convert ${from} to ${to}. Supported: nm/ft-lb, bar/psi/kpa, liter/gallon, km/mile, kg/lb, celsius/fahrenheit, mm/inch, m/ft` };
  return { ok: true, input: value, from_unit: from, to_unit: to, result: Math.round(fn(value) * 10000) / 10000 };
}

// ─── Tool: lookup_user_vehicle ───────────────────────────────────────────────

async function toolUserVehicle(db: ReturnType<typeof createClient>, userId?: string): Promise<unknown> {
  if (!userId) return { ok: true, found: false, note: 'User not authenticated' };
  const { data } = await db.from('vehicles').select('make,model,year,notes').eq('user_id', userId).limit(5);
  return { ok: true, found: (data?.length ?? 0) > 0, vehicles: data ?? [] };
}

// ─── Tool: search_marketplace ────────────────────────────────────────────────

async function toolMarketplace(input: Record<string, unknown>, db: ReturnType<typeof createClient>): Promise<unknown> {
  const query = String(input.query ?? '');
  const category = input.category ? String(input.category) : null;
  let req = db.from('marketplace_listings')
    .select('id,title,description,price,category,condition,location,status,created_at')
    .eq('status', 'active').order('created_at', { ascending: false }).limit(8);
  if (query) req = req.ilike('title', `%${query}%`);
  if (category) req = req.eq('category', category);
  const { data } = await req;
  return { ok: true, found: (data?.length ?? 0) > 0, result_count: data?.length ?? 0, listings: data ?? [] };
}

// ─── Tool: get_events ────────────────────────────────────────────────────────

async function toolGetEvents(input: Record<string, unknown>, db: ReturnType<typeof createClient>): Promise<unknown> {
  const days = Math.min(Number(input.days_ahead ?? 90), 365);
  const now = new Date().toISOString();
  const until = new Date(Date.now() + days * 86_400_000).toISOString();
  const { data } = await db.from('events')
    .select('id,title,description,event_type,start_date,end_date,location_name,location_address,is_public')
    .eq('is_public', true).gte('start_date', now).lte('start_date', until)
    .order('start_date', { ascending: true }).limit(10);
  return { ok: true, found: (data?.length ?? 0) > 0, result_count: data?.length ?? 0, events: data ?? [] };
}

// ─── Tool: translate_text ────────────────────────────────────────────────────

async function toolTranslate(input: Record<string, unknown>): Promise<unknown> {
  const text = String(input.text ?? '');
  const lang = String(input.target_language ?? 'en');
  if (!text.trim()) return { ok: false, error: 'text required' };
  try {
    const resp = await fetch(`${SUPABASE_URL}/functions/v1/translate-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` },
      body: JSON.stringify({ text, target_language: lang }),
      signal: AbortSignal.timeout(6000),
    });
    if (!resp.ok) throw new Error(`translate-text ${resp.status}`);
    const r = await resp.json() as { translated_text?: string };
    return { ok: true, original: text, translated: r.translated_text ?? text, target_language: lang };
  } catch (err) {
    return { ok: true, original: text, translated: text, target_language: lang, note: `Translation unavailable: ${err}` };
  }
}

// ─── Tool: search_rps ────────────────────────────────────────────────────────

async function toolSearchRPS(input: Record<string, unknown>, db: ReturnType<typeof createClient>): Promise<unknown> {
  const query = String(input.query ?? '');
  const max = Math.min(Number(input.max_results ?? 6), 12);
  if (!query.trim()) return { ok: false, error: 'query required' };

  const kws = keywords(query);
  let parts: Record<string, unknown>[] = [];

  if (kws.length) {
    const { data: fts } = await db.from('rps_parts')
      .select('niin,nsn,description,group_code,repair_grade,page_number,rps_number,figure_reference')
      .textSearch('description', kws.join(' & '), { type: 'websearch', config: 'english' })
      .limit(max);
    if (fts?.length) {
      parts = fts;
    } else {
      for (const kw of kws.slice(0, 3)) {
        const { data } = await db.from('rps_parts')
          .select('niin,nsn,description,group_code,repair_grade,page_number,rps_number,figure_reference')
          .ilike('description', `%${kw}%`).limit(max);
        for (const r of data ?? []) {
          if (!parts.some(p => p.niin === r.niin)) parts.push(r);
        }
        if (parts.length >= max) break;
      }
    }
  }

  if (!parts.length) return { ok: true, found: false, instructions: 'No RPS parts found. Try web_search for aftermarket alternatives.' };

  const groupCodes = [...new Set(parts.map(p => String(p.group_code)))];
  const { data: groups } = await db.from('rps_groups').select('group_code,group_name').in('group_code', groupCodes);
  const groupMap = Object.fromEntries((groups ?? []).map((g: Record<string, string>) => [g.group_code, g.group_name]));

  return {
    ok: true,
    found: true,
    result_count: Math.min(parts.length, max),
    results: parts.slice(0, max).map(p => ({
      niin: p.niin,
      nsn: p.nsn ?? null,
      description: p.description,
      group_code: p.group_code,
      group_name: groupMap[String(p.group_code)] ?? null,
      repair_grade: p.repair_grade ?? null,
      page_number: p.page_number ?? null,
      rps_number: p.rps_number,
      figure_reference: p.figure_reference ?? null,
    })),
    instructions: 'Present NIIN and description. Repair grade: L=Light, M=Medium, H=Heavy. Always recommend verifying NSN with official TM before ordering.',
  };
}

// ─── Tool: find_nearby_services ──────────────────────────────────────────────

// Strip PostgREST filter syntax chars that would break or() string parsing
function sanitiseFilterValue(v: string): string {
  return v.replace(/[,%()\[\]]/g, ' ').trim().slice(0, 100);
}

async function toolFindNearbyServices(input: Record<string, unknown>, db: ReturnType<typeof createClient>): Promise<unknown> {
  const rawQuery = String(input.query ?? '');
  const rawSpecialty = input.specialty ? String(input.specialty) : null;
  const query = sanitiseFilterValue(rawQuery);
  const specialty = rawSpecialty ? sanitiseFilterValue(rawSpecialty) : null;

  // Build PostgREST or() filter string — values sanitised above
  const filters: string[] = [];
  if (query) {
    filters.push(`business_name.ilike.%${query}%`, `description.ilike.%${query}%`, `tagline.ilike.%${query}%`);
  }
  if (specialty) {
    filters.push(`business_name.ilike.%${specialty}%`, `description.ilike.%${specialty}%`);
  }

  let req = db.from('vendors')
    .select('business_name,tagline,description,location,website_url,phone,email,specialties,is_verified,is_featured')
    .order('is_featured', { ascending: false })
    .order('display_order', { ascending: true })
    .limit(8);

  if (filters.length) req = req.or(filters.join(','));

  const { data: vendors } = await req;

  return {
    ok: true,
    found: (vendors?.length ?? 0) > 0,
    result_count: vendors?.length ?? 0,
    services: (vendors ?? []).map((v: Record<string, unknown>) => ({
      name: v.business_name,
      tagline: v.tagline ?? null,
      location: v.location ?? null,
      website: v.website_url ?? null,
      phone: v.phone ?? null,
      email: v.email ?? null,
      specialties: v.specialties ?? [],
      verified: v.is_verified,
    })),
    instructions: (vendors?.length ?? 0) > 0
      ? 'Present these community vendors. Note if verified. Recommend contacting directly.'
      : 'No community vendors found. Suggest web_search to find local Unimog specialists.',
  };
}

// ─── Tool: search_community_content ─────────────────────────────────────────

async function toolSearchCommunity(input: Record<string, unknown>, db: ReturnType<typeof createClient>): Promise<unknown> {
  const rawQuery = String(input.query ?? '');
  const docType = input.document_type ? String(input.document_type) : null;
  if (!rawQuery.trim()) return { ok: false, error: 'query required' };
  const query = sanitiseFilterValue(rawQuery);

  let req = db.from('community_documents')
    .select('title,description,document_type,creator_name,download_count,rating_average')
    .eq('is_public', true)
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order('download_count', { ascending: false })
    .limit(6);

  if (docType) req = req.eq('document_type', docType);

  const { data: docs } = await req;

  return {
    ok: true,
    found: (docs?.length ?? 0) > 0,
    result_count: docs?.length ?? 0,
    documents: (docs ?? []).map((d: Record<string, unknown>) => ({
      title: d.title,
      description: d.description ?? null,
      type: d.document_type,
      author: d.creator_name,
      downloads: d.download_count ?? 0,
      rating: d.rating_average ?? null,
    })),
    instructions: (docs?.length ?? 0) > 0
      ? 'Community-contributed documents. Mention the author. Tell user to find them in the Knowledge Base section.'
      : 'No community documents found for this topic.',
  };
}

// ─── Tool registry ───────────────────────────────────────────────────────────

const TOOL_DEFINITIONS = [
  {
    type: 'function',
    function: {
      name: 'lookup_knowledge_base',
      description: 'Check admin-validated knowledge base for pre-approved answers to Unimog questions. Call FIRST for any technical question.',
      parameters: { type: 'object', properties: { query: { type: 'string', description: 'The user question' } }, required: ['query'] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_manual',
      description: 'Search U435 Unimog workshop manuals for procedures, torque specs, fluid capacities, troubleshooting. Always cite page numbers returned.',
      parameters: { type: 'object', properties: { query: { type: 'string', description: 'Technical topic to search' }, max_results: { type: 'number', description: 'Max results 1-8 (default 5)' } }, required: ['query'] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'lookup_user_vehicle',
      description: "Look up the user's registered Unimog vehicles (make, model, year). Call when the question refers to 'my Unimog' or 'my vehicle'.",
      parameters: { type: 'object', properties: {}, required: [] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_weather',
      description: "Get current weather and 7-day forecast. Call when the user asks about weather or trip planning that depends on conditions. Uses user's GPS location automatically if available.",
      parameters: { type: 'object', properties: { latitude: { type: 'number' }, longitude: { type: 'number' }, forecast_days: { type: 'number', description: '1-7 (default 3)' } }, required: [] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'web_search',
      description: 'Search the web for current information: parts prices, dealer locations, fuel prices, campsite reviews, road conditions, community forums.',
      parameters: { type: 'object', properties: { query: { type: 'string' }, count: { type: 'number', description: '1-10 (default 5)' } }, required: ['query'] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_marketplace',
      description: "Search the community marketplace for Unimog parts, vehicles, and services. Use when the user asks about buying or finding parts.",
      parameters: { type: 'object', properties: { query: { type: 'string' }, category: { type: 'string', description: 'parts | vehicles | services' } }, required: ['query'] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_events',
      description: 'Get upcoming community events: rallies, meetups, trail rides, workshops.',
      parameters: { type: 'object', properties: { days_ahead: { type: 'number', description: 'Days ahead to look (default 90)' } }, required: [] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'convert_units',
      description: 'Convert between units. Supports: Nm↔ft-lb, bar↔psi↔kPa, liter↔gallon↔quart, km↔miles, kg↔lb, celsius↔fahrenheit, mm↔inch, m↔ft. No API call needed.',
      parameters: { type: 'object', properties: { value: { type: 'number' }, from_unit: { type: 'string' }, to_unit: { type: 'string' } }, required: ['value', 'from_unit', 'to_unit'] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'translate_text',
      description: 'Translate text between languages. Useful for German Unimog manual text.',
      parameters: { type: 'object', properties: { text: { type: 'string' }, target_language: { type: 'string', description: 'e.g. "en", "de", "fr"' } }, required: ['text', 'target_language'] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_rps',
      description: 'Search the RPS illustrated parts catalog for Unimog spare parts by description or component name. Returns NIIN part numbers, group, repair grade, and page references. Use for parts lookup questions.',
      parameters: { type: 'object', properties: { query: { type: 'string', description: 'Part or component name (e.g. "fuel filter", "portal hub seal", "clutch disc")' }, max_results: { type: 'number', description: 'Max results 1-12 (default 6)' } }, required: ['query'] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'find_nearby_services',
      description: 'Find Unimog service providers, mechanics, and specialists from the community vendor directory. Use when the user asks about finding help, workshops, or specialists.',
      parameters: { type: 'object', properties: { query: { type: 'string', description: 'Service type or location (e.g. "restoration", "gearbox rebuild", "Australia")' }, specialty: { type: 'string', description: 'Specialty keyword to filter by' } }, required: [] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_community_content',
      description: 'Search community-contributed documents, procedures, checklists, and guides uploaded by members. Use for user-sourced knowledge like expedition prep, conversion guides, field repairs.',
      parameters: { type: 'object', properties: { query: { type: 'string', description: 'Topic (e.g. "expedition prep", "snorkel install", "pre-trip checklist")' }, document_type: { type: 'string', description: 'Filter by type: powerpoint | excel | pdf | checklist | procedure' } }, required: ['query'] },
    },
  },
];

// ─── Dispatch ────────────────────────────────────────────────────────────────

async function dispatch(
  name: string,
  input: Record<string, unknown>,
  db: ReturnType<typeof createClient>,
  userId?: string,
  userLocation?: { latitude: number; longitude: number },
): Promise<unknown> {
  try {
    switch (name) {
      case 'lookup_knowledge_base':    return await toolKnowledgeBase(input, db);
      case 'search_manual':            return await toolSearchManual(input, db);
      case 'lookup_user_vehicle':      return await toolUserVehicle(db, userId);
      case 'get_weather':              return await toolGetWeather(input, userLocation);
      case 'web_search':               return await toolWebSearch(input);
      case 'search_marketplace':       return await toolMarketplace(input, db);
      case 'get_events':               return await toolGetEvents(input, db);
      case 'convert_units':            return toolConvertUnits(input);
      case 'translate_text':           return await toolTranslate(input);
      case 'search_rps':               return await toolSearchRPS(input, db);
      case 'find_nearby_services':     return await toolFindNearbyServices(input, db);
      case 'search_community_content': return await toolSearchCommunity(input, db);
      default:                         return { ok: false, error: `Unknown tool: ${name}` };
    }
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

// ─── System prompt ───────────────────────────────────────────────────────────

const SYSTEM = `You are Barry, a gruff but friendly Unimog mechanic with 40+ years of experience. You specialise in the U435 series (U1300L, U1700L) and G-series military models.

Character: practical, direct, always emphasise safety. Light personality — don't force it.

Tool rules:
1. For any technical Unimog question, call lookup_knowledge_base first, then search_manual if needed.
2. Always cite specific page numbers from search_manual results.
3. For parts or component lookup questions, call search_rps to find NIIN part numbers.
4. For weather questions, call get_weather. For current info (prices, news), call web_search.
5. If manuals don't cover something, say so — never fabricate specs or procedures.
6. For "my Unimog" questions, call lookup_user_vehicle first.
7. For finding mechanics, workshops, or specialists, call find_nearby_services.
8. For community guides, checklists, or member-contributed content, call search_community_content.
9. For simple conversions or general knowledge, answer directly without tools.

Format: concise markdown, numbered steps for procedures, bold for critical steps.
Citations: "According to page X of the U435 Workshop Manual..."
Weather: always distinguish current conditions (the "current" block — what it is right now) from the daily forecast (the "forecast" array — what the day may bring). Never present today's daily forecast condition as the current weather.`;

// ─── Main ────────────────────────────────────────────────────────────────────

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  if (!checkRateLimit(getClientIP(req))) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  try {
    const body = await req.json() as {
      message?: string;
      messages?: Array<{ role: string; content: string }>;
      userLocation?: { latitude: number; longitude: number };
      conversationId?: string;
    };

    const rawQuery = body.message ?? body.messages?.at(-1)?.content ?? '';
    const safeQuery = sanitise(rawQuery);
    if (!safeQuery) {
      return new Response(JSON.stringify({ error: 'Message blocked by safety filter.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    let userId: string | undefined;
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const userDb = createClient(SUPABASE_URL, authHeader.split(' ')[1] ?? '');
      const { data: { user } } = await userDb.auth.getUser();
      userId = user?.id;
    }

    const history = (body.messages ?? []).slice(-(MAX_MESSAGES - 1))
      .map((m: { role: string; content: string }) => ({ role: m.role, content: m.content }));

    const msgs: Array<{ role: string; content: unknown }> =
      history.length && history.at(-1)?.role === 'user'
        ? [...history.slice(0, -1), { role: 'user', content: safeQuery }]
        : [...history, { role: 'user', content: safeQuery }];

    const requestConversationId = body.conversationId ?? crypto.randomUUID();
    const t0 = Date.now();
    let finalText = '';
    const manualRefs: Array<{ page_number: number; storage_url: string; title?: string }> = [];
    const toolsUsed: string[] = [];
    let searchCount = 0;

    for (let iter = 0; iter < MAX_TOOL_ITERATIONS; iter++) {
      const resp = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + DEEPSEEK_API_KEY },
        body: JSON.stringify({
          model: DEEPSEEK_MODEL,
          max_tokens: 2048,
          stream: false,
          messages: [{ role: 'system', content: SYSTEM }, ...msgs],
          tools: TOOL_DEFINITIONS,
        }),
      });
      if (!resp.ok) throw new Error(`DeepSeek ${resp.status}: ${await resp.text()}`);

      const data = await resp.json() as { choices: Array<Record<string, unknown>> };
      const choice = data.choices[0];
      const message = choice.message as Record<string, unknown>;

      if (message.content) finalText = String(message.content);

      if (choice.finish_reason !== 'tool_calls') break;

      const calls = message.tool_calls as Array<Record<string, unknown>>;
      if (!calls?.length) break;

      msgs.push({ role: 'assistant', content: message.content ?? null, tool_calls: calls });

      for (const call of calls) {
        const fn = call.function as Record<string, unknown>;
        const name = String(fn.name);
        const input = JSON.parse(String(fn.arguments ?? '{}')) as Record<string, unknown>;
        toolsUsed.push(name);

        const tTool = Date.now();
        const result = await dispatch(name, input, db, userId, body.userLocation) as Record<string, unknown>;
        const toolLatencyMs = Date.now() - tTool;

        db.from('barry_tool_executions').insert({
          conversation_id: requestConversationId,
          user_id: userId ?? null,
          tool_name: name,
          tool_phase: TOOL_PHASE[name] ?? '1',
          latency_ms: toolLatencyMs,
          success: result.ok !== false,
          error_code: result.ok === false ? String(result.error ?? 'unknown').slice(0, 100) : null,
          openai_iteration: iter + 1,
        }).then(() => {}).catch(() => {});

        if (name === 'search_manual' && result.ok) {
          const rows = (result.results as Array<Record<string, unknown>>) ?? [];
          searchCount += rows.length;
          for (const r of rows) if (r.page_number && r.storage_url) {
            const title = r.section_title ? String(r.section_title) : r.manual_title ? String(r.manual_title) : undefined;
            manualRefs.push({ page_number: Number(r.page_number), storage_url: String(r.storage_url), title });
          }
        }

        msgs.push({ role: 'tool', tool_call_id: call.id, content: JSON.stringify(result) });
      }
    }

    if (!finalText) finalText = "I wasn't able to generate a complete response. Please try rephrasing your question.";
    const content = addSafety(finalText);

    // Log async — fire and forget
    db.from('chat_logs').insert({
      user_id: userId ?? null, messages: body.messages ?? [], response: content,
      model: DEEPSEEK_MODEL,
      knowledge_source: toolsUsed.includes('lookup_knowledge_base') ? 'knowledge_base' : 'tool_use',
      pdf_references_found: searchCount,
    }).then(() => {}).catch(() => {});

    return new Response(JSON.stringify({
      content, manualReferences: manualRefs,
      knowledgeMode: toolsUsed.join(',') || 'direct',
      searchResultCount: searchCount,
      skill_chain: toolsUsed,
      execution_time_ms: Date.now() - t0,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (err) {
    console.error('[barry-tools]', err);
    return new Response(JSON.stringify({ error: 'Barry encountered an error. Please try again.' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
