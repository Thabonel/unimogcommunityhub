export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  content: string;
  usage?: {
    total_tokens: number;
    prompt_tokens: number;
    completion_tokens: number;
  };
  model: string;
  provider: string;
}

export interface ModelConfig {
  provider: string;
  model_name: string;
  api_key_env_var: string;
  temperature: number;
  max_tokens: number;
  fallback_provider?: string;
  fallback_model?: string;
}

export class AIProviderAdapter {
  private config: ModelConfig;
  private apiKey: string;

  constructor(config: ModelConfig) {
    this.config = config;
    const envKey = Deno.env.get(config.api_key_env_var);
    if (!envKey) {
      throw new Error(`Missing API key: ${config.api_key_env_var}`);
    }
    this.apiKey = envKey;
  }

  async chat(messages: AIMessage[]): Promise<AIResponse> {
    try {
      switch (this.config.provider.toLowerCase()) {
        case 'openai':
          return await this.chatOpenAI(messages);
        case 'anthropic':
          return await this.chatAnthropic(messages);
        case 'google':
          return await this.chatGoogle(messages);
        default:
          throw new Error(`Unsupported provider: ${this.config.provider}`);
      }
    } catch (error) {
      if (this.config.fallback_provider && this.config.fallback_model) {
        console.warn(`Primary provider failed, using fallback: ${this.config.fallback_provider}/${this.config.fallback_model}`);
        const fallbackConfig: ModelConfig = {
          ...this.config,
          provider: this.config.fallback_provider,
          model_name: this.config.fallback_model,
        };
        const fallbackAdapter = new AIProviderAdapter(fallbackConfig);
        return await fallbackAdapter.chat(messages);
      }
      throw error;
    }
  }

  private async chatOpenAI(messages: AIMessage[]): Promise<AIResponse> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model_name,
        messages: messages,
        temperature: this.config.temperature,
        max_tokens: this.config.max_tokens,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      usage: data.usage,
      model: this.config.model_name,
      provider: 'openai',
    };
  }

  private async chatAnthropic(messages: AIMessage[]): Promise<AIResponse> {
    const systemMessages = messages.filter(m => m.role === 'system');
    const conversationMessages = messages.filter(m => m.role !== 'system');

    const anthropicMessages = conversationMessages.map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    }));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.config.model_name,
        system: systemMessages.map(m => m.content).join('\n\n'),
        messages: anthropicMessages,
        temperature: this.config.temperature,
        max_tokens: this.config.max_tokens,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Anthropic API error: ${errorText}`);
    }

    const data = await response.json();
    const content = data.content[0].text;

    return {
      content: content,
      usage: {
        total_tokens: data.usage.input_tokens + data.usage.output_tokens,
        prompt_tokens: data.usage.input_tokens,
        completion_tokens: data.usage.output_tokens,
      },
      model: this.config.model_name,
      provider: 'anthropic',
    };
  }

  private async chatGoogle(messages: AIMessage[]): Promise<AIResponse> {
    const systemMessages = messages.filter(m => m.role === 'system');
    const conversationMessages = messages.filter(m => m.role !== 'system');

    const contents = conversationMessages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const systemInstruction = systemMessages.length > 0
      ? systemMessages.map(m => m.content).join('\n\n')
      : undefined;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.config.model_name}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: contents,
          systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
          generationConfig: {
            temperature: this.config.temperature,
            maxOutputTokens: this.config.max_tokens,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google API error: ${errorText}`);
    }

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;

    return {
      content: content,
      usage: {
        total_tokens: (data.usageMetadata?.promptTokenCount || 0) + (data.usageMetadata?.candidatesTokenCount || 0),
        prompt_tokens: data.usageMetadata?.promptTokenCount || 0,
        completion_tokens: data.usageMetadata?.candidatesTokenCount || 0,
      },
      model: this.config.model_name,
      provider: 'google',
    };
  }
}

export async function getModelConfig(
  supabaseClient: any,
  serviceName: string
): Promise<ModelConfig> {
  const { data, error } = await supabaseClient
    .from('ai_model_config')
    .select('*')
    .eq('service_name', serviceName)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    throw new Error(`Failed to load model config for ${serviceName}: ${error?.message || 'Not found'}`);
  }

  return {
    provider: data.provider,
    model_name: data.model_name,
    api_key_env_var: data.api_key_env_var,
    temperature: data.temperature,
    max_tokens: data.max_tokens,
    fallback_provider: data.fallback_provider,
    fallback_model: data.fallback_model,
  };
}
