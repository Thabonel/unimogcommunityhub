import { RegisteredTool, ToolResult, ToolExecutionContext } from './types.ts';

type QueryType = 'diagnostic' | 'spec_lookup' | 'procedure' | 'parts' | 'general';

const QUERY_PATTERNS: Array<{ type: QueryType; terms: string[] }> = [
  {
    type: 'diagnostic',
    terms: [
      'wont start',
      "won't start",
      'clicking',
      'noise',
      'overheating',
      'leaking',
      'vibration',
      'smoke',
      'warning light',
      'not working',
      'fault',
      'problem',
    ],
  },
  {
    type: 'spec_lookup',
    terms: [
      'torque',
      'spec',
      'capacity',
      'clearance',
      'gap',
      'pressure',
      'weight',
      'dimension',
      'measurement',
      'nm',
      'litres',
    ],
  },
  {
    type: 'procedure',
    terms: [
      'how to',
      'replace',
      'remove',
      'install',
      'adjust',
      'check',
      'service',
      'bleed',
      'drain',
      'fill',
    ],
  },
  {
    type: 'parts',
    terms: [
      'part number',
      'nsn',
      'niin',
      'gasket',
      'seal',
      'bearing',
      'filter',
      'pump',
      'rps',
    ],
  },
];

const SYSTEM_TERMS: Array<{ system: string; terms: string[] }> = [
  { system: 'engine', terms: ['engine', 'cylinder', 'head', 'fuel', 'cooling', 'coolant', 'oil', 'injector', 'starter'] },
  { system: 'transmission', terms: ['transmission', 'gearbox', 'clutch', 'transfer case', 'pto'] },
  { system: 'brakes', terms: ['brake', 'brakes', 'caliper', 'air brake', 'handbrake'] },
  { system: 'electrical', terms: ['electrical', 'battery', 'alternator', 'wiring', 'light', 'starter'] },
  { system: 'axles', terms: ['axle', 'hub', 'portal', 'differential', 'wheel'] },
  { system: 'hydraulics', terms: ['hydraulic', 'hydraulics', 'pump', 'cylinder', 'pressure'] },
];

const MODEL_TERMS: Array<{ model: string; terms: string[] }> = [
  { model: 'u1700l', terms: ['u1700l', '1700l'] },
  { model: 'u435', terms: ['u435', '435'] },
];

function scoreTerms(query: string, terms: string[]): number {
  return terms.reduce((score, term) => score + (query.includes(term) ? 1 : 0), 0);
}

function classify(query: string) {
  const normalized = query.toLowerCase().replace(/[^\w\s']/g, ' ').replace(/\s+/g, ' ').trim();
  const scoredTypes = QUERY_PATTERNS
    .map((pattern) => ({ type: pattern.type, score: scoreTerms(normalized, pattern.terms) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  const queryType: QueryType = scoredTypes[0]?.type ?? 'general';
  const systems = SYSTEM_TERMS
    .filter((entry) => scoreTerms(normalized, entry.terms) > 0)
    .map((entry) => entry.system);
  const models = MODEL_TERMS
    .filter((entry) => scoreTerms(normalized, entry.terms) > 0)
    .map((entry) => entry.model);

  return {
    query_type: queryType,
    confidence: scoredTypes.length ? Math.min(0.95, 0.55 + scoredTypes[0].score * 0.15) : 0.4,
    system_tags: [...new Set(systems)],
    model_tags: [...new Set(models)],
    routing_hint: queryType === 'spec_lookup'
      ? 'Use search_specs_v2 first, then search_manual_v2 if no exact spec is found.'
      : queryType === 'diagnostic'
        ? 'Use search_diagnostics_v2 first, then search_manual_v2 for supporting procedures.'
        : queryType === 'parts'
          ? 'Use deterministic RPS search first, then search_manual_v2 for supporting context.'
          : 'Use search_manual_v2 with v1 fallback.',
  };
}

async function execute(
  input: Record<string, unknown>,
  _ctx: ToolExecutionContext,
): Promise<ToolResult> {
  const t0 = Date.now();
  const query = String(input.query ?? '');

  if (!query.trim()) {
    return {
      ok: false,
      error: { code: 'INVALID_INPUT', message: 'query is required', retriable: false },
      metadata: { latency_ms: 0, source: 'barry_v2_classifier', timestamp: new Date().toISOString() },
    };
  }

  return {
    ok: true,
    data: classify(query),
    metadata: { latency_ms: Date.now() - t0, source: 'barry_v2_classifier', timestamp: new Date().toISOString() },
  };
}

export const classifyQueryV2Tool: RegisteredTool = {
  definition: {
    name: 'classify_query_v2',
    description:
      'Classify a Unimog technical query into diagnostic, spec lookup, procedure, parts, or general before choosing Barry retrieval tools.',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'The user technical question to classify' },
      },
      required: ['query'],
    },
  },
  config: { timeout_ms: 2000, retries: 0, fallback: 'none' },
  phase: 1,
  execute,
};
