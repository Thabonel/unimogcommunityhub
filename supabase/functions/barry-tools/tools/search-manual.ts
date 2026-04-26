import { RegisteredTool, ToolResult, ToolExecutionContext } from './types.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://ydevatqwkoccxhtejdor.supabase.co';

const CHAPTER_RANGES: Array<{ start: number; end: number; filename: string }> = [
  { start: 1, end: 50, filename: 'U435_01_Introduction.pdf' },
  { start: 51, end: 100, filename: 'U435_02_Engine.pdf' },
  { start: 101, end: 150, filename: 'U435_03_Fuel_System.pdf' },
  { start: 151, end: 200, filename: 'U435_04_Cooling.pdf' },
  { start: 201, end: 250, filename: 'U435_05_Exhaust.pdf' },
  { start: 251, end: 300, filename: 'U435_06_Clutch.pdf' },
  { start: 301, end: 350, filename: 'U435_07_Transmission.pdf' },
  { start: 351, end: 400, filename: 'U435_08_Transfer_Case.pdf' },
  { start: 401, end: 450, filename: 'U435_09_Driveline.pdf' },
  { start: 451, end: 500, filename: 'U435_10_Front_Axle.pdf' },
  { start: 501, end: 550, filename: 'U435_11_Rear_Axle.pdf' },
  { start: 551, end: 600, filename: 'U435_12_Steering.pdf' },
  { start: 601, end: 650, filename: 'U435_13_Brakes.pdf' },
  { start: 651, end: 700, filename: 'U435_14_Suspension.pdf' },
  { start: 701, end: 750, filename: 'U435_15_Wheels.pdf' },
  { start: 751, end: 800, filename: 'U435_16_Frame.pdf' },
  { start: 801, end: 850, filename: 'U435_17_Cab.pdf' },
  { start: 851, end: 900, filename: 'U435_18_Electrical.pdf' },
  { start: 901, end: 950, filename: 'U435_19_Wheel_Hub_Front.pdf' },
  { start: 951, end: 1000, filename: 'U435_20_Wheel_Hub_Rear.pdf' },
];

function getChapterUrl(pageNumber: number): string {
  for (const ch of CHAPTER_RANGES) {
    if (pageNumber >= ch.start && pageNumber <= ch.end) {
      const pdfPage = pageNumber - ch.start + 1;
      return `${SUPABASE_URL}/storage/v1/object/public/manuals/${ch.filename}#page=${pdfPage}`;
    }
  }
  return '';
}

function extractKeywords(query: string): string[] {
  const stop = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has',
    'do', 'does', 'will', 'would', 'could', 'should', 'to', 'of', 'in', 'for',
    'on', 'with', 'at', 'by', 'from', 'how', 'what', 'where', 'when', 'why',
    'which', 'who', 'my', 'your', 'i', 'me', 'you', 'can', 'may', 'might',
  ]);
  return [...new Set(
    query.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/)
      .filter(w => w.length > 2 && !stop.has(w))
  )];
}

async function execute(
  input: Record<string, unknown>,
  ctx: ToolExecutionContext,
): Promise<ToolResult> {
  const t0 = Date.now();
  const query = String(input.query ?? '');
  const maxResults = Math.min(Number(input.max_results ?? 5), 8);

  if (!query.trim()) {
    return {
      ok: false,
      error: { code: 'INVALID_INPUT', message: 'query is required', retriable: false },
      metadata: { latency_ms: 0, source: 'manual_chunks', timestamp: new Date().toISOString() },
    };
  }

  try {
    const db = createClient(ctx.supabaseUrl, ctx.supabaseServiceKey);
    const keywords = extractKeywords(query);
    const searchPattern = keywords.join(' & ');

    let chunks: Record<string, unknown>[] = [];

    if (keywords.length > 0) {
      // Try full-text search first
      const { data: fts } = await db
        .from('manual_chunks')
        .select('content,section_title,page_number,manual_title')
        .textSearch('content', searchPattern, { type: 'websearch', config: 'english' })
        .ilike('manual_title', '%U435%')
        .limit(maxResults);

      if (fts && fts.length > 0) {
        chunks = fts;
      } else {
        // ILIKE fallback — OR across keywords
        const seen = new Set<number>();
        for (const kw of keywords.slice(0, 4)) {
          const { data } = await db
            .from('manual_chunks')
            .select('content,section_title,page_number,manual_title')
            .ilike('content', `%${kw}%`)
            .ilike('manual_title', '%U435%')
            .limit(maxResults);
          if (data) {
            for (const row of data) {
              if (!seen.has(row.page_number)) {
                seen.add(row.page_number);
                chunks.push(row);
              }
            }
          }
          if (chunks.length >= maxResults) break;
        }
      }
    }

    const results = chunks.slice(0, maxResults).map((c: Record<string, unknown>) => ({
      page_number: c.page_number,
      section_title: c.section_title ?? null,
      manual_title: c.manual_title ?? 'U435 Workshop Manual',
      storage_url: getChapterUrl(Number(c.page_number)),
      content_preview: String(c.content ?? '').slice(0, 400),
    }));

    return {
      ok: true,
      data: {
        found: results.length > 0,
        result_count: results.length,
        results,
        instructions: results.length > 0
          ? 'Cite specific page numbers from these results in your response.'
          : 'No manual content found. Tell the user the manual does not cover this topic.',
      },
      metadata: { latency_ms: Date.now() - t0, source: 'manual_chunks', timestamp: new Date().toISOString() },
    };
  } catch (err) {
    return {
      ok: false,
      error: { code: 'UPSTREAM_ERROR', message: String(err), retriable: true },
      metadata: { latency_ms: Date.now() - t0, source: 'manual_chunks', timestamp: new Date().toISOString() },
    };
  }
}

export const searchManualTool: RegisteredTool = {
  definition: {
    name: 'search_manual',
    description:
      'Search Unimog U435 workshop manuals for technical procedures, torque specs, fluid capacities, troubleshooting steps, and maintenance instructions. Use this for any technical Unimog question. Always cite the page numbers returned.',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'The technical question or topic to search for' },
        max_results: { type: 'number', description: 'Maximum results to return (1-8, default 5)' },
      },
      required: ['query'],
    },
  },
  config: { timeout_ms: 10000, retries: 1, fallback: 'none' },
  phase: 1,
  execute,
};
