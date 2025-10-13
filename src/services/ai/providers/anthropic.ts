import type { AiGenerateParams, AiProvider } from '../types'

export class AnthropicProvider implements AiProvider {
  readonly provider = 'anthropic' as const

  async generate(_params: AiGenerateParams): Promise<string> {
    // Intentionally not implemented in scaffold.
    throw new Error('AnthropicProvider.generate not implemented')
  }
}

