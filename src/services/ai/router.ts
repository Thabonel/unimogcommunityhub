import { cheapestCapable, moreCapableBaseline, fastestCapable } from './registry'
import type { AiGenerateParams, RouteDecision } from './types'

function estimateTokens(s: string): number {
  // Rough heuristic: 4 chars per token
  return Math.ceil((s || '').length / 4)
}

export function decideRoute(params: AiGenerateParams): RouteDecision {
  const tokens = estimateTokens(params.input)
  const requireJson = !!params.constraints?.requireJson
  const useTools = !!params.constraints?.useTools
  const preferSpeed = !!params.constraints?.preferSpeed
  const targetLatencyMs = params.constraints?.targetLatencyMs || params.constraints?.maxLatencyMs

  // Simple heuristic
  const isSimple = tokens <= 800 && !useTools && !requireJson
  const isModerate = tokens <= 4000

  if (isSimple) {
    const m = preferSpeed || targetLatencyMs
      ? fastestCapable({ requireJson, useTools, targetLatencyMs })
      : cheapestCapable({ requireJson, useTools })
    return {
      provider: m.provider,
      model: m.name,
      reason: preferSpeed || targetLatencyMs ? 'Simple task routed to fastest capable model' : 'Simple task routed to cheapest capable model',
      estimatedCostClass: preferSpeed || targetLatencyMs ? 'medium' : 'low',
    }
  }

  if (isModerate) {
    const m = preferSpeed || targetLatencyMs
      ? fastestCapable({ requireJson, useTools, targetLatencyMs })
      : moreCapableBaseline({ requireJson, useTools })
    return {
      provider: m.provider,
      model: m.name,
      reason: preferSpeed || targetLatencyMs ? 'Moderate task routed to fastest eligible model' : 'Moderate task routed to mid-tier for quality/cost balance',
      estimatedCostClass: 'medium',
    }
  }

  // Large/complex
  // Pick the most capable among those that support required features by sorting by price descending.
  const m = preferSpeed || targetLatencyMs
    ? fastestCapable({ requireJson, useTools, targetLatencyMs })
    : moreCapableBaseline({ requireJson, useTools })
  return {
    provider: m.provider,
    model: m.name,
    reason: preferSpeed || targetLatencyMs ? 'Large task routed to fastest eligible model' : 'Large/complex task routed to more capable baseline',
    estimatedCostClass: 'high',
  }
}
