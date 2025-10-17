// Simplified AI Model Adapter - Progressive Integration
// Use this to gradually migrate Barry to hot-swappable models

export async function callAI(
  supabaseClient: any,
  serviceName: string,
  messages: Array<{ role: string; content: string }>,
  options?: {
    enableWebSearch?: boolean;
    enableExtendedThinking?: boolean;
  }
) {
  // Try to load config from database
  const { data: config } = await supabaseClient
    .from('ai_model_config')
    .select('provider, model_name, api_key_env_var, temperature, max_tokens, fallback_provider, fallback_model')
    .eq('service_name', serviceName)
    .eq('is_active', true)
    .single();

  // Fallback to hardcoded if table doesn't exist yet
  if (!config) {
    console.warn(`⚠️ No config found for ${serviceName}, using OpenAI default`);
    return await callOpenAI(messages, 'gpt-4o-mini', 0.7, 1500);
  }

  const apiKey = Deno.env.get(config.api_key_env_var);
  if (!apiKey) {
    throw new Error(`Missing API key: ${config.api_key_env_var}`);
  }

  try {
    console.log(`🔧 Using ${config.provider}/${config.model_name} for ${serviceName}`);

    switch (config.provider.toLowerCase()) {
      case 'openai':
        return await callOpenAI(messages, config.model_name, config.temperature, config.max_tokens);
      case 'anthropic':
        return await callAnthropic(messages, config.model_name, config.temperature, config.max_tokens, apiKey, options);
      case 'google':
        return await callGoogle(messages, config.model_name, config.temperature, config.max_tokens, apiKey);
      default:
        throw new Error(`Unsupported provider: ${config.provider}`);
    }
  } catch (error) {
    if (config.fallback_provider && config.fallback_model) {
      console.warn(`⚠️ Primary failed, using fallback: ${config.fallback_provider}/${config.fallback_model}`);
      const fallbackKey = Deno.env.get(
        config.fallback_provider === 'openai' ? 'OPENAI_API_KEY' :
        config.fallback_provider === 'anthropic' ? 'ANTHROPIC_API_KEY' : 'GOOGLE_API_KEY'
      );
      if (config.fallback_provider === 'openai') {
        return await callOpenAI(messages, config.fallback_model, config.temperature, config.max_tokens);
      } else if (config.fallback_provider === 'anthropic' && fallbackKey) {
        return await callAnthropic(messages, config.fallback_model, config.temperature, config.max_tokens, fallbackKey);
      }
    }
    throw error;
  }
}

async function callOpenAI(
  messages: Array<{ role: string; content: string }>,
  model: string,
  temperature: number,
  maxTokens: number
) {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI error: ${await response.text()}`);
  }

  const data = await response.json();
  return {
    content: data.choices[0].message.content,
    usage: data.usage,
    model,
    provider: 'openai',
  };
}

async function callAnthropic(
  messages: Array<{ role: string; content: string }>,
  model: string,
  temperature: number,
  maxTokens: number,
  apiKey: string,
  options?: {
    enableWebSearch?: boolean;
    enableExtendedThinking?: boolean;
  }
) {
  const systemMessages = messages.filter(m => m.role === 'system');
  const conversationMessages = messages.filter(m => m.role !== 'system');

  const anthropicMessages = conversationMessages.map(m => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: m.content,
  }));

  const requestBody: any = {
    model,
    system: systemMessages.map(m => m.content).join('\n\n'),
    messages: anthropicMessages,
    temperature,
    max_tokens: maxTokens,
  };

  // Add web search tool if enabled (Helper Barry mode)
  if (options?.enableWebSearch) {
    requestBody.tools = [{ type: 'web_search' }];
    console.log('🌐 Web search enabled for this request');
  }

  // Add extended thinking if enabled
  if (options?.enableExtendedThinking) {
    requestBody.thinking = {
      type: 'enabled',
      budget_tokens: 10000
    };
    console.log('🧠 Extended thinking enabled for this request');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`Anthropic error: ${await response.text()}`);
  }

  const data = await response.json();
  return {
    content: data.content[0].text,
    usage: {
      total_tokens: data.usage.input_tokens + data.usage.output_tokens,
      prompt_tokens: data.usage.input_tokens,
      completion_tokens: data.usage.output_tokens,
    },
    model,
    provider: 'anthropic',
  };
}

async function callGoogle(
  messages: Array<{ role: string; content: string }>,
  model: string,
  temperature: number,
  maxTokens: number,
  apiKey: string
) {
  const systemMessages = messages.filter(m => m.role === 'system');
  const conversationMessages = messages.filter(m => m.role !== 'system');

  const contents = conversationMessages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: systemMessages.length > 0
          ? { parts: [{ text: systemMessages.map(m => m.content).join('\n\n') }] }
          : undefined,
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Google error: ${await response.text()}`);
  }

  const data = await response.json();
  return {
    content: data.candidates[0].content.parts[0].text,
    usage: {
      total_tokens: (data.usageMetadata?.promptTokenCount || 0) + (data.usageMetadata?.candidatesTokenCount || 0),
      prompt_tokens: data.usageMetadata?.promptTokenCount || 0,
      completion_tokens: data.usageMetadata?.candidatesTokenCount || 0,
    },
    model,
    provider: 'google',
  };
}
