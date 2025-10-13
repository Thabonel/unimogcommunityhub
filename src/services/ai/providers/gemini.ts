import type { AiGenerateParams, AiProvider } from '../types'

export class GeminiProvider implements AiProvider {
  readonly provider = 'gemini' as const

  async generate(_params: AiGenerateParams): Promise<string> {
    // Intentionally not implemented in scaffold.
    throw new Error('GeminiProvider.generate not implemented')
  }
}

