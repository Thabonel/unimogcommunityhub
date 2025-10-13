export type ProviderName = 'openai' | 'anthropic' | 'gemini'

export interface ModelDescriptor {
  provider: ProviderName
  name: string
  contextWindow: number
  price: {
    inputPer1K: number
    outputPer1K: number
  }
  supports: {
    json: boolean
    tools: boolean
    vision: boolean
  }
}

export interface RouterConstraints {
  requireJson?: boolean
  useTools?: boolean
  maxLatencyMs?: number
  minQuality?: 'low' | 'medium' | 'high'
  preferSpeed?: boolean
  targetLatencyMs?: number
}

export interface RouteDecision {
  provider: ProviderName
  model: string
  reason: string
  estimatedCostClass: 'low' | 'medium' | 'high'
}

export interface AiGenerateParams {
  input: string
  maxOutputTokens?: number
  constraints?: RouterConstraints
}

export interface AiProvider {
  readonly provider: ProviderName
  generate(params: AiGenerateParams): Promise<string>
}
