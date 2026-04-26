import { RegisteredTool, ToolResult, ToolExecutionContext } from './types.ts';

// Calls the existing translate-text edge function
async function execute(
  input: Record<string, unknown>,
  ctx: ToolExecutionContext,
): Promise<ToolResult> {
  const t0 = Date.now();
  const text = String(input.text ?? '');
  const targetLang = String(input.target_language ?? 'en');

  if (!text.trim()) {
    return {
      ok: false,
      error: { code: 'INVALID_INPUT', message: 'text is required', retriable: false },
      metadata: { latency_ms: 0, source: 'translate-text-fn', timestamp: new Date().toISOString() },
    };
  }

  try {
    const resp = await fetch(`${ctx.supabaseUrl}/functions/v1/translate-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ctx.supabaseServiceKey}`,
      },
      body: JSON.stringify({ text, target_language: targetLang }),
      signal: AbortSignal.timeout(6000),
    });

    if (!resp.ok) throw new Error(`translate-text function HTTP ${resp.status}`);
    const result = await resp.json() as { translated_text?: string; error?: string };

    if (result.error) throw new Error(result.error);

    return {
      ok: true,
      data: {
        original: text,
        translated: result.translated_text ?? text,
        target_language: targetLang,
      },
      metadata: { latency_ms: Date.now() - t0, source: 'translate-text-fn', timestamp: new Date().toISOString() },
    };
  } catch (err) {
    // Degrade: return original with note
    return {
      ok: true,
      data: {
        original: text,
        translated: text,
        target_language: targetLang,
        note: `Translation unavailable: ${String(err)}`,
      },
      metadata: { latency_ms: Date.now() - t0, source: 'translate-text-fn (degraded)', timestamp: new Date().toISOString() },
    };
  }
}

export const translateTextTool: RegisteredTool = {
  definition: {
    name: 'translate_text',
    description:
      'Translate text between languages. Useful when the user pastes German text from a Unimog manual, or needs a phrase translated for use in a foreign country.',
    input_schema: {
      type: 'object',
      properties: {
        text: { type: 'string', description: 'Text to translate' },
        target_language: { type: 'string', description: 'Target language code or name (e.g. "en", "de", "fr", "es")' },
      },
      required: ['text', 'target_language'],
    },
  },
  config: { timeout_ms: 6000, retries: 1, fallback: 'degrade' },
  phase: 3,
  execute,
};
