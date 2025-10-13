import type { ModelDescriptor, ProviderName } from './types'

// NOTE: Prices are indicative placeholders. Update from vendor pricing.
const models: ModelDescriptor[] = [
  // OpenAI
  {
    provider: 'openai',
    name: 'gpt-4o-mini',
    contextWindow: 128_000,
    price: { inputPer1K: 0.15, outputPer1K: 0.6 },
    supports: { json: true, tools: true, vision: true },
  },
  {
    provider: 'openai',
    name: 'gpt-4o',
    contextWindow: 128_000,
    price: { inputPer1K: 5.0, outputPer1K: 15.0 },
    supports: { json: true, tools: true, vision: true },
  },

  // Anthropic
  {
    provider: 'anthropic',
    name: 'claude-3-5-haiku-latest',
    contextWindow: 200_000,
    price: { inputPer1K: 0.25, outputPer1K: 1.25 },
    supports: { json: true, tools: true, vision: false },
  },
  {
    provider: 'anthropic',
    name: 'claude-3-5-sonnet-latest',
    contextWindow: 200_000,
    price: { inputPer1K: 3.0, outputPer1K: 15.0 },
    supports: { json: true, tools: true, vision: false },
  },

  // Google
  {
    provider: 'gemini',
    name: 'gemini-1.5-flash',
    contextWindow: 1_000_000,
    price: { inputPer1K: 0.075, outputPer1K: 0.3 },
    supports: { json: true, tools: true, vision: true },
  },
  {
    provider: 'gemini',
    name: 'gemini-1.5-pro',
    contextWindow: 1_000_000,
    price: { inputPer1K: 3.5, outputPer1K: 10.5 },
    supports: { json: true, tools: true, vision: true },
  },
]

export function listModels(provider?: ProviderName): ModelDescriptor[] {
  return provider ? models.filter(m => m.provider === provider) : models.slice()
}

export function cheapestCapable({ requireJson, useTools }: { requireJson?: boolean; useTools?: boolean }): ModelDescriptor {
  const eligible = models.filter(m =>
    (!requireJson || m.supports.json) && (!useTools || m.supports.tools)
  )
  if (!eligible.length) throw new Error('No eligible models')
  return eligible.sort((a, b) => a.price.inputPer1K - b.price.inputPer1K)[0]
}

export function moreCapableBaseline({ requireJson, useTools }: { requireJson?: boolean; useTools?: boolean }): ModelDescriptor {
  // Prefer mid/high tier depending on provider diversity
  const eligible = models.filter(m =>
    (!requireJson || m.supports.json) && (!useTools || m.supports.tools)
  )
  // Heuristic: pick the second cheapest among eligible as a step-up
  const sorted = eligible.sort((a, b) => a.price.inputPer1K - b.price.inputPer1K)
  return sorted[Math.min(1, sorted.length - 1)]
}

// Extended metadata for speed-aware routing (approximate; tune with logs)
export const modelLatencyMs: Record<string, number> = {
  'gpt-4o-mini': 900,
  'gpt-4o': 2200,
  'claude-3-5-haiku-latest': 1100,
  'claude-3-5-sonnet-latest': 2400,
  'gemini-1.5-flash': 700,
  'gemini-1.5-pro': 2000,
}

export function fastestCapable({ requireJson, useTools, targetLatencyMs }: { requireJson?: boolean; useTools?: boolean; targetLatencyMs?: number }): ModelDescriptor {
  const eligible = models.filter(m =>
    (!requireJson || m.supports.json) && (!useTools || m.supports.tools)
  )
  if (!eligible.length) throw new Error('No eligible models')
  const withLatency = eligible.map(m => ({ m, l: modelLatencyMs[m.name] ?? 2000 }))
  if (targetLatencyMs && Number.isFinite(targetLatencyMs)) {
    const within = withLatency.filter(x => x.l <= targetLatencyMs)
    if (within.length) return within.sort((a, b) => a.l - b.l)[0].m
  }
  return withLatency.sort((a, b) => a.l - b.l)[0].m
}
