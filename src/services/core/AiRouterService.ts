export type AiRouteDecision = {
  provider: 'openai' | 'anthropic' | 'gemini'
  model: string
  reason: string
  estimatedCostClass: 'low' | 'medium' | 'high'
}

export class AiRouterService {
  static async decide(input: string, options?: { requireJson?: boolean; useTools?: boolean; preferSpeed?: boolean; targetLatencyMs?: number }) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
    if (!supabaseUrl) throw new Error('VITE_SUPABASE_URL not set')

    const url = `${supabaseUrl}/functions/v1/ai-router`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'decision',
        input,
        constraints: {
          requireJson: !!options?.requireJson,
          useTools: !!options?.useTools,
          preferSpeed: !!options?.preferSpeed,
          targetLatencyMs: options?.targetLatencyMs,
        },
      }),
    })
    if (!res.ok) throw new Error(`Router error: ${res.status}`)
    const data = (await res.json()) as { decision: AiRouteDecision }
    return data.decision
  }
}
