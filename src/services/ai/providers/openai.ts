import type { AiGenerateParams, AiProvider } from '../types'

export class OpenAIProvider implements AiProvider {
  readonly provider = 'openai' as const

  async generate(_params: AiGenerateParams): Promise<string> {
    // Intentionally not implemented in scaffold.
    throw new Error('OpenAIProvider.generate not implemented')
  }
}

