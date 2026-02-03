import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0',
];

const DEFAULT_SELECTORS: Record<string, Record<string, string>> = {
  'mercedessource.com': {
    title: 'h1.entry-title, h1, .post-title',
    content: '.entry-content, .post-content, article',
    steps: '.procedure-step, .step, ol li',
    tools: '.tools-list li, .tools li',
    author: '.author, .byline',
  },
  'unimog-community.de': {
    title: '.thread-title, h1',
    content: '.message-content, .post-body',
    steps: '.message-content ol li',
    author: '.username, .author',
  },
};

interface ProcedureStep {
  step_number: number;
  instruction: string;
  warning?: string;
}

interface ScrapedGuide {
  title: string;
  procedure_steps: ProcedureStep[];
  tools_required: string[];
  estimated_time?: string;
  difficulty?: string;
  applicable_models: string[];
  source_url: string;
  author?: string;
}

function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

function extractDomain(url: string): string {
  try { return new URL(url).hostname.replace('www.', ''); }
  catch { return ''; }
}

function getSelectorsForDomain(domain: string, custom?: Record<string, string>): Record<string, string> {
  return { ...(DEFAULT_SELECTORS[domain] || DEFAULT_SELECTORS['mercedessource.com']), ...custom };
}

function extractBySelector(html: string, selector: string): string | null {
  if (selector.startsWith('.')) {
    const className = selector.slice(1).split(',')[0].trim();
    const regex = new RegExp(`class="[^"]*${className}[^"]*"[^>]*>([^<]+)`, 'i');
    const m = html.match(regex);
    return m ? m[1].trim() : null;
  }
  if (selector.match(/^[a-z]+$/i)) {
    const regex = new RegExp(`<${selector}[^>]*>([^<]+)</${selector}>`, 'i');
    const m = html.match(regex);
    return m ? m[1].trim() : null;
  }
  return null;
}

function extractContentBlock(html: string, selector: string): string {
  if (selector.startsWith('.')) {
    const className = selector.slice(1).split(',')[0].trim();
    const regex = new RegExp(`<[^>]+class="[^"]*${className}[^"]*"[^>]*>([\\s\\S]*?)<\\/`, 'i');
    const m = html.match(regex);
    if (m) {
      return m[1].replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n\n').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    }
  }
  return '';
}

function extractTools(html: string): string[] {
  const tools: string[] = [];
  const patterns = [/(\d+mm\s+socket)/gi, /(\d+mm\s+wrench)/gi, /(torque\s+wrench)/gi, /(screwdriver)/gi, /(pliers)/gi];
  for (const p of patterns) {
    const matches = html.match(p);
    if (matches) tools.push(...matches.map(m => m.toLowerCase()));
  }
  return [...new Set(tools)];
}

function extractModels(html: string): string[] {
  const models: string[] = [];
  const patterns = [/U\s?1300L?/gi, /U\s?1700L?/gi, /U\s?435/gi, /U\s?404/gi, /U\s?416/gi];
  for (const p of patterns) {
    const matches = html.match(p);
    if (matches) models.push(...matches.map(m => m.toUpperCase().replace(/\s/g, '')));
  }
  return [...new Set(models)];
}

function parseSteps(content: string): ProcedureStep[] {
  const steps: ProcedureStep[] = [];
  const lines = content.split('\n').filter(l => l.trim().length > 15);
  let stepNum = 0;
  for (const line of lines.slice(0, 50)) {
    stepNum++;
    const instruction = line.replace(/^(?:\d+[\.\)]\s*|[\-\*]\s*)/i, '').trim();
    const step: ProcedureStep = { step_number: stepNum, instruction: instruction.slice(0, 500) };
    if (/warning|caution|danger/i.test(instruction)) step.warning = instruction;
    steps.push(step);
  }
  return steps;
}

async function scrapeUrl(url: string, selectors: Record<string, string>): Promise<ScrapedGuide> {
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
  const response = await fetch(url, {
    headers: { 'User-Agent': getRandomUserAgent(), 'Accept': 'text/html', 'Accept-Language': 'en-US,en;q=0.5' },
  });
  if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
  const html = await response.text();
  const title = extractBySelector(html, selectors.title) || 'Untitled Guide';
  const content = extractContentBlock(html, selectors.content);
  const author = extractBySelector(html, selectors.author);
  return {
    title, procedure_steps: parseSteps(content), tools_required: extractTools(html),
    applicable_models: extractModels(html), source_url: url, author: author || undefined,
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { source_id, url, selectors: custom } = await req.json();
    if (!url) return new Response(JSON.stringify({ error: 'URL required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const domain = extractDomain(url);
    const selectors = getSelectorsForDomain(domain, custom);
    console.log(`[scrape-guides] Scraping: ${url}`);

    const guideData = await scrapeUrl(url, selectors);

    let embedding = null;
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (openaiKey) {
      const embeddingText = `${guideData.title} ${guideData.procedure_steps.map(s => s.instruction).join(' ')}`.slice(0, 8000);
      const resp = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST', headers: { 'Authorization': `Bearer ${openaiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'text-embedding-3-small', input: embeddingText }),
      });
      if (resp.ok) { const d = await resp.json(); embedding = d.data[0].embedding; }
    }

    const contentText = [guideData.title, ...guideData.procedure_steps.map(s => s.instruction)].join('\n');
    const { error } = await supabase.from('scraped_content').upsert({
      source_id, url, content_type: 'guide', title: guideData.title, content: contentText.slice(0, 10000),
      metadata: { procedure_steps: guideData.procedure_steps, tools_required: guideData.tools_required, applicable_models: guideData.applicable_models, author: guideData.author },
      embedding, scraped_at: new Date().toISOString(),
    }, { onConflict: 'url' });

    if (error) throw error;
    if (source_id) await supabase.from('scrape_sources').update({ last_scraped_at: new Date().toISOString(), failure_count: 0 }).eq('id', source_id);

    console.log(`[scrape-guides] Success: ${guideData.title}`);
    return new Response(JSON.stringify({ success: true, data: guideData }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('[scrape-guides] Error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
