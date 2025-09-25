/**
 * Service for generating and managing diagrams for Barry AI
 *
 * Replaces hardcoded diagrams with DB-backed image retrieval.
 * - Queries `manual_chunks` for visual pages (has_visual_elements = true, page_image_url not null)
 * - Ranks results by semantic similarity to the current conversation context
 * - Falls back to legacy ASCII/SVG/Mermaid when no relevant images are found
 */

export interface DiagramData {
  type: 'ascii' | 'svg' | 'mermaid' | 'image';
  content: string;            // for type=image, this is the image URL
  title?: string;
  description?: string;
}

/** Minimal interface for an embeddings provider (inject your real one). */
export interface EmbeddingsProvider {
  embed(input: string): Promise<number[]>; // returns a dense vector
}

/** Shape of a row we need from `manual_chunks`. */
type ManualChunk = {
  id: string;
  manual_id: string;
  section_title: string | null;
  page_number: number | null;
  page_image_url: string | null;
  has_visual_elements: boolean | null;
  content: string | null;
  // If you store server-side embeddings, include them in the select as `embedding`
  embedding?: number[] | null;
};

type SearchOptions = {
  /** Limit images to a specific Unimog model or manual id(s). */
  manualIds?: string[];
  /** Number of images to return (default 8). */
  limit?: number;
  /** If true, require chunks to have server-side `embedding` and score client-side. */
  preferClientSideScoring?: boolean;
  /** Keyword filter to narrow down images by textual match before ranking. */
  keywordFilter?: string[];
};

/** Utility: cosine similarity. */
function cosineSimilarity(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length);
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < len; i++) {
    const x = a[i] || 0;
    const y = b[i] || 0;
    dot += x * y;
    na += x * x;
    nb += y * y;
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb) || 1e-9;
  return dot / denom;
}

/** Heuristic keyword extraction to bias search term prefiltering. */
function topKeywords(text: string, k = 6): string[] {
  const stop = new Set([
    'the','and','for','with','that','this','from','into','onto','your','you',
    'a','an','of','to','in','on','at','by','be','is','are','was','were','as',
    'it','or','if','then','than','can','will','should','could','would','have'
  ]);
  const counts = new Map<string, number>();
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stop.has(w))
    .forEach(w => counts.set(w, (counts.get(w) || 0) + 1));
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([w]) => w);
}

/**
 * DB-backed image search.
 * Tries RPC (pgvector) if available; otherwise fetches candidate rows and scores client-side.
 */
async function findRelevantManualImages(
  supabase: any,
  embeddings: EmbeddingsProvider,
  contextText: string,
  opts: SearchOptions = {}
): Promise<DiagramData[]> {
  const limit = Math.max(1, Math.min(opts.limit ?? 8, 24));
  const queryEmbedding = await embeddings.embed(contextText);

  // 1) Attempt RPC path (preferred if you have pgvector + an RPC):
  // Create this RPC in SQL if you don't have it:
  //   create or replace function match_manual_images(query_embedding vector(384), match_count int, manual_ids text[])
  //   returns table(id text, manual_id text, section_title text, page_number int, page_image_url text, similarity float)
  //   language sql stable as $$
  //     select id, manual_id, section_title, page_number, page_image_url,
  //            1 - (embedding <=> query_embedding) as similarity
  //     from manual_chunks
  //     where has_visual_elements = true and page_image_url is not null
  //           and (manual_ids is null or manual_id = any(manual_ids))
  //     order by embedding <=> query_embedding
  //     limit match_count;
  //   $$;
  try {
    const rpcArgs: any = {
      query_embedding: queryEmbedding,
      match_count: limit * 2,
      manual_ids: opts.manualIds ?? null
    };
    const rpc = await supabase.rpc('match_manual_images', rpcArgs);
    if (!rpc.error && Array.isArray(rpc.data) && rpc.data.length) {
      // Optional: apply a light keyword bias
      const keywords = opts.keywordFilter?.length ? opts.keywordFilter : topKeywords(contextText);
      const scored = rpc.data.map((row: any) => {
        const meta = `${row.section_title ?? ''} ${row.page_number ?? ''}`.toLowerCase();
        const kwScore = keywords.reduce((s, w) => s + (meta.includes(w) ? 0.03 : 0), 0);
        return { row, score: (row.similarity ?? 0) + kwScore };
      });
      scored.sort((a: any, b: any) => b.score - a.score);
      return scored.slice(0, limit).map(({ row }: any): DiagramData => ({
        type: 'image',
        content: row.page_image_url,
        title: row.section_title ?? `Manual page ${row.page_number ?? ''}`.trim(),
        description: `Manual ${row.manual_id} • Page ${row.page_number ?? '—'}`
      }));
    }
  } catch {
    // Ignore and fall back below
  }

  // 2) Fallback: fetch candidates and score client-side.
  // Keep the select minimal to avoid bandwidth blowups.
  let sel = supabase
    .from('manual_chunks')
    .select('id, manual_id, section_title, page_number, page_image_url, has_visual_elements, content, embedding')
    .eq('has_visual_elements', true)
    .not('page_image_url', 'is', null);

  if (opts.manualIds?.length) {
    sel = sel.in('manual_id', opts.manualIds);
  }

  // Light keyword prefilter to shrink candidate set
  const keywords = opts.keywordFilter?.length ? opts.keywordFilter : topKeywords(contextText);
  if (keywords.length) {
    // Use ilike OR chain via filter() for portability
    keywords.slice(0, 5).forEach((kw, idx) => {
      // Supabase JS doesn't support OR chaining elegantly without .or(); use .or once with CSV conditions:
      // We'll collect and apply after.
    });
    // Compose OR expression for up to 5 keywords across title/content
    const ors = keywords
      .slice(0, 5)
      .map(kw => `section_title.ilike.%${kw}%,content.ilike.%${kw}%`)
      .join(',');
    sel = sel.or(ors);
  }

  const { data, error } = await sel.limit(300);
  if (error || !data?.length) return [];

  // Score client-side (prefer row.embedding, else light text heuristic).
  const candidates: { row: ManualChunk; score: number }[] = data.map((row: ManualChunk) => {
    let sim = 0;
    if (row.embedding && Array.isArray(row.embedding) && row.embedding.length > 0) {
      sim = cosineSimilarity(queryEmbedding, row.embedding);
    } else {
      // Textual fallback if no stored embedding
      const meta = `${row.section_title ?? ''} ${row.content ?? ''}`.toLowerCase();
      sim = keywords.reduce((s, w) => s + (meta.includes(w) ? 0.05 : 0), 0);
    }
    return { row, score: sim };
  });

  candidates.sort((a, b) => b.score - a.score);
  const picked = candidates.slice(0, limit);

  return picked.map(({ row }) => ({
    type: 'image',
    content: row.page_image_url as string,
    title: row.section_title ?? `Manual page ${row.page_number ?? ''}`.trim(),
    description: `Manual ${row.manual_id} • Page ${row.page_number ?? '—'}`
  }));
}

export class DiagramService {
  /**
   * High-level entrypoint: get diagrams/images relevant to the current conversation.
   * Tries DB images first; if none found, falls back to legacy generators.
   *
   * @param supabase    An initialized Supabase client
   * @param embeddings  An embeddings provider (e.g., OpenAI/SentenceTransformers)
   * @param lastUserMsg Last user message text
   * @param lastAssistantMsg Last assistant message text (optional)
   * @param options     SearchOptions to constrain results
   */
  static async getRelevant(
    supabase: any,
    embeddings: EmbeddingsProvider,
    lastUserMsg: string,
    lastAssistantMsg?: string,
    options?: SearchOptions
  ): Promise<DiagramData[]> {
    const context = [lastAssistantMsg ?? '', lastUserMsg ?? ''].filter(Boolean).join('  ');
    const images = await findRelevantManualImages(supabase, embeddings, context, options);

    if (images.length > 0) return images;

    // Fallback to legacy detectors if we couldn't find any visual pages
    const legacy = this.parseResponseForDiagrams(context);
    return legacy.length ? legacy : [{
      type: 'ascii',
      title: 'No diagram found',
      content: `No relevant manual images found for the current context.\nTry refining your query or opening a specific procedure.`,
      description: 'Fallback notice'
    }];
  }

  /**
   * Legacy: Generate an ASCII diagram based on the description
   */
  static generateAsciiDiagram(type: string, details?: any): DiagramData | null {
    switch (type.toLowerCase()) {
      case 'portal_axle':
        return {
          type: 'ascii',
          title: 'Portal Axle Drain & Fill Plugs',
          content: `
Portal Axle Assembly - Side View
================================

     [Wheel Hub]
         |
+--------+--------+
|                 |
|    PORTAL       |
|     BOX        |
|                 |
|  ○ <- Fill Plug |
|     (top)       |
|                 |
|                 |
|  ○ <- Drain     |
|     Plug        |
|    (bottom)     |
+--------+--------+
         |
    [Main Axle]

Note: Drain plug at lowest point
      Fill plug above oil level
          `,
          description: 'The drain plug is located at the lowest point of the portal box for complete drainage.'
        };

      case 'differential':
        return {
          type: 'ascii',
          title: 'Differential Lock System',
          content: `
Differential Lock Engagement
============================

Front Axle          Rear Axle
+-------+           +-------+
|   ○   |           |   ○   |
| DIFF  |           | DIFF  |
| LOCK  |           | LOCK  |
+-------+           +-------+
    |                   |
    +------- ○ ---------+
       Transfer Case
       (Central Lock)

Engagement Order:
1. Rear differential lock
2. Front differential lock
3. Central differential lock
          `,
          description: 'Engage locks in sequence: rear first, then front, finally central.'
        };

      case 'oil_circuit':
        return {
          type: 'ascii',
          title: 'Engine Oil Flow Diagram',
          content: `
Engine Oil Circuit
==================

Oil Pan/Sump
     |
[Oil Pump]
     |
[Oil Filter]
     |
+----+----+----+
|    |    |    |
Main  Cam  Turbo
Bear. shaft Cooling
     |
[Oil Cooler]
     |
Return to Sump
          `,
          description: 'Oil flows from sump through pump and filter to various engine components.'
        };

      default:
        return null;
    }
  }

  /**
   * Legacy: Generate an SVG diagram
   */
  static generateSvgDiagram(type: string, details?: any): DiagramData | null {
    switch (type.toLowerCase()) {
      case 'portal_axle_detailed':
        return {
          type: 'svg',
          title: 'Portal Axle Detailed View',
          content: `
<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
  <rect x="100" y="150" width="200" height="250" fill="none" stroke="#333" stroke-width="3" rx="10"/>
  <circle cx="200" cy="100" r="40" fill="#ddd" stroke="#333" stroke-width="2"/>
  <text x="200" y="105" text-anchor="middle" font-size="14">Wheel Hub</text>
  <rect x="180" y="400" width="40" height="50" fill="#999" stroke="#333" stroke-width="2"/>
  <text x="200" y="435" text-anchor="middle" font-size="12">Axle</text>
  <circle cx="280" cy="200" r="15" fill="#666" stroke="#333" stroke-width="2"/>
  <text x="320" y="205" font-size="14">Fill Plug</text>
  <line x1="295" y1="200" x2="315" y2="200" stroke="#333" stroke-width="1"/>
  <line x1="110" y1="250" x2="290" y2="250" stroke="#4CAF50" stroke-width="2" stroke-dasharray="5,5"/>
  <text x="90" y="255" font-size="12" fill="#4CAF50">Oil Level</text>
  <circle cx="280" cy="370" r="15" fill="#444" stroke="#333" stroke-width="2"/>
  <text x="320" y="375" font-size="14">Drain Plug</text>
  <line x1="295" y1="370" x2="315" y2="370" stroke="#333" stroke-width="1"/>
  <circle cx="200" cy="275" r="60" fill="none" stroke="#666" stroke-width="2" stroke-dasharray="10,5"/>
  <circle cx="200" cy="275" r="40" fill="none" stroke="#666" stroke-width="2"/>
  <text x="200" y="30" text-anchor="middle" font-size="18" font-weight="bold">Portal Axle Assembly</text>
  <text x="200" y="480" text-anchor="middle" font-size="12" fill="#666">Side View - Not to Scale</text>
</svg>
          `,
          description: 'Detailed SVG diagram showing portal axle components and plug locations.'
        };

      case 'wiring_diagram':
        return {
          type: 'svg',
          title: 'Basic Electrical Circuit',
          content: `
<svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
  <line x1="50" y1="100" x2="50" y2="200" stroke="#000" stroke-width="3"/>
  <line x1="35" y1="120" x2="65" y2="120" stroke="#000" stroke-width="2"/>
  <line x1="40" y1="180" x2="60" y2="180" stroke="#000" stroke-width="2"/>
  <text x="30" y="95" font-size="14">12V</text>
  <line x1="50" y1="100" x2="400" y2="100" stroke="#ff0000" stroke-width="2"/>
  <rect x="120" y="95" width="40" height="10" fill="none" stroke="#000" stroke-width="2"/>
  <text x="125" y="120" font-size="12">Fuse</text>
  <circle cx="250" cy="100" r="5" fill="#000"/>
  <line x1="250" y1="100" x2="270" y2="80" stroke="#000" stroke-width="2"/>
  <text x="240" y="70" font-size="12">Switch</text>
  <rect x="350" y="85" width="50" height="30" fill="#ffd700" stroke="#000" stroke-width="2"/>
  <text x="355" y="105" font-size="12">Light</text>
  <line x1="50" y1="200" x2="400" y2="200" stroke="#000" stroke-width="2"/>
  <line x1="375" y1="115" x2="375" y2="200" stroke="#000" stroke-width="2"/>
  <line x1="365" y1="200" x2="385" y2="200" stroke="#000" stroke-width="2"/>
  <line x1="370" y1="205" x2="380" y2="205" stroke="#000" stroke-width="2"/>
  <line x1="373" y1="210" x2="377" y2="210" stroke="#000" stroke-width="2"/>
</svg>
          `,
          description: 'Basic 12V electrical circuit with battery, fuse, switch, and light.'
        };

      default:
        return null;
    }
  }

  /**
   * Legacy: Parse Barry's response to detect diagram requests
   * (kept for backward compatibility and as a fallback)
   */
  static parseResponseForDiagrams(response: string): DiagramData[] {
    const diagrams: DiagramData[] = [];

    const diagramKeywords: Record<string, string[]> = {
      'portal axle': ['drain plug', 'fill plug', 'portal box', 'portal axle', 'portal oil', 'change oil', 'portal service'],
      'differential': ['diff lock', 'differential lock', 'differential'],
      'oil circuit': ['oil flow', 'oil system', 'lubrication', 'oil circuit'],
      'wiring': ['electrical', 'circuit', 'wiring diagram', 'wiring']
    };

    const lower = (response || '').toLowerCase();
    for (const [diagramType, keywords] of Object.entries(diagramKeywords)) {
      if (keywords.some(k => lower.includes(k))) {
        const useDetailed =
          lower.includes('detailed') ||
          lower.includes('show me') ||
          lower.includes('diagram');

        let diagram: DiagramData | null = null;
        if (useDetailed && diagramType === 'portal axle') {
          diagram = this.generateSvgDiagram('portal_axle_detailed');
        } else if (diagramType === 'wiring') {
          diagram = this.generateSvgDiagram('wiring_diagram');
        } else {
          diagram = this.generateAsciiDiagram(diagramType.replace(' ', '_'));
        }
        if (diagram) diagrams.push(diagram);
      }
    }
    return diagrams;
  }

  /**
   * Legacy: Generate a Mermaid diagram from description
   */
  static generateMermaidDiagram(type: string, details?: any): DiagramData | null {
    switch (type.toLowerCase()) {
      case 'maintenance_schedule':
        return {
          type: 'mermaid',
          title: 'Maintenance Schedule',
          content: `
graph TD
  A[Daily Checks] --> B[Weekly Checks]
  B --> C[Monthly Checks]
  C --> D[Annual Service]

  A --> A1[Check Oil Level]
  A --> A2[Check Coolant]
  A --> A3[Visual Inspection]

  B --> B1[Tire Pressure]
  B --> B2[Battery Check]
  B --> B3[Brake Test]

  C --> C1[Air Filter]
  C --> C2[Grease Points]
  C --> C3[Belt Tension]

  D --> D1[Full Service]
  D --> D2[Replace Filters]
  D --> D3[Fluid Changes]
          `,
          description: 'Regular maintenance schedule for your Unimog'
        };
      default:
        return null;
    }
  }
}
