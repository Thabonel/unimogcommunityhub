import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

type Provider = 'openai' | 'anthropic' | 'gemini'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function estimateTokens(s: string): number {
  return Math.ceil((s || '').length / 4)
}

function decideRoute(input: string, constraints?: { requireJson?: boolean; useTools?: boolean; preferSpeed?: boolean; targetLatencyMs?: number }) {
  const tokens = estimateTokens(input)
  const requireJson = !!constraints?.requireJson
  const useTools = !!constraints?.useTools
  const preferSpeed = !!constraints?.preferSpeed
  const targetLatency = constraints?.targetLatencyMs

  // Simple heuristic mirrored from app-side router
  const isSimple = tokens <= 800 && !useTools && !requireJson
  const isModerate = tokens <= 4000

  // Candidate set with rough latency scores
  const candidates = [
    { provider: 'gemini' as Provider, model: 'gemini-1.5-flash', latency: 700, costClass: 'low' as const, reason: 'Fast & low-cost' },
    { provider: 'openai' as Provider, model: 'gpt-4o-mini', latency: 900, costClass: 'medium' as const, reason: 'Balanced speed & quality' },
    { provider: 'anthropic' as Provider, model: 'claude-3-5-haiku-latest', latency: 1100, costClass: 'medium' as const, reason: 'Structured output & speed' },
    { provider: 'anthropic' as Provider, model: 'claude-3-5-sonnet-latest', latency: 2400, costClass: 'high' as const, reason: 'Higher quality' },
    { provider: 'openai' as Provider, model: 'gpt-4o', latency: 2200, costClass: 'high' as const, reason: 'High quality multimodal' },
    { provider: 'gemini' as Provider, model: 'gemini-1.5-pro', latency: 2000, costClass: 'high' as const, reason: 'Long context, higher quality' },
  ]

  const simplePref = isSimple && !useTools && !requireJson
  const filtered = candidates.filter(c => true)

  let pick = null as null | typeof candidates[number]

  if (preferSpeed || targetLatency) {
    const within = targetLatency ? filtered.filter(c => c.latency <= targetLatency) : filtered
    pick = (within.length ? within : filtered).sort((a, b) => a.latency - b.latency)[0]
    return { provider: pick.provider, model: pick.model, reason: `Speed preference: ${pick.reason}`, estimatedCostClass: pick.costClass }
  }

  if (simplePref) {
    pick = candidates[0] // gemini flash
    return { provider: pick.provider, model: pick.model, reason: 'Simple task routed to low-cost, capable model', estimatedCostClass: pick.costClass }
  }

  if (isModerate) {
    pick = candidates[1] // gpt-4o-mini
    return { provider: pick.provider, model: pick.model, reason: 'Moderate task routed to balanced cost/quality', estimatedCostClass: pick.costClass }
  }

  pick = candidates[3] // claude sonnet
  return { provider: pick.provider, model: pick.model, reason: 'Large/complex task routed to more capable model', estimatedCostClass: pick.costClass }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } },
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const body = await req.json().catch(() => ({}))
    const mode = body?.mode as 'decision' | 'generate' | undefined
    const input = String(body?.input || '')
    const constraints = body?.constraints as { requireJson?: boolean; useTools?: boolean } | undefined

    if (!input) {
      return new Response(
        JSON.stringify({ error: 'Missing input' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const decision = decideRoute(input, constraints)

    if (mode === 'decision' || !mode) {
      return new Response(
        JSON.stringify({ decision }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    if (mode === 'generate') {
      const provider = decision.provider
      const model = decision.model

      const t0 = Date.now()
      let text = ''
      let ok = false
      let errorText = ''
      const stream = !!body?.stream

      if (stream) {
        // Streaming mode: currently implemented for OpenAI; others fallback to single-chunk SSE
        if (provider === 'openai') {
          const resp = await streamOpenAI(model, input, supabase, user.id, decision)
          return resp
        }
        // Fallback: compute once, stream as single event
        try {
          if (provider === 'anthropic') text = await callAnthropic(model, input)
          else if (provider === 'gemini') text = await callGemini(model, input)
          else throw new Error('Unsupported provider')
          ok = true
        } catch (e) {
          errorText = (e as Error).message
        }
        const latency = Date.now() - t0
        try {
          await supabase.from('ai_routing_logs').insert({
            user_id: user.id,
            route_provider: provider,
            route_model: model,
            reason: decision.reason,
            estimated_cost_class: decision.estimatedCostClass,
            input_tokens: Math.ceil(input.length / 4),
            output_tokens: Math.ceil(text.length / 4),
            latency_ms: latency,
            success: ok,
            error_text: errorText || null,
          })
        } catch (_) {}
        const encoder = new TextEncoder()
        const rs = new ReadableStream({
          start(controller) {
            if (ok) {
              controller.enqueue(encoder.encode(`data: ${text}\n\n`))
              controller.enqueue(encoder.encode(`data: [DONE]\n\n`))
            } else {
              controller.enqueue(encoder.encode(`event: error\n`))
              controller.enqueue(encoder.encode(`data: ${errorText}\n\n`))
            }
            controller.close()
          }
        })
        return new Response(rs, { status: ok ? 200 : 502, headers: { ...corsHeaders, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' } })
      }
      try {
        if (provider === 'openai') {
          text = await callOpenAI(model, input)
        } else if (provider === 'anthropic') {
          text = await callAnthropic(model, input)
        } else if (provider === 'gemini') {
          text = await callGemini(model, input)
        } else {
          throw new Error('Unsupported provider')
        }
        ok = true
      } catch (e) {
        errorText = (e as Error).message
      }
      const latency = Date.now() - t0

      try {
        await supabase.from('ai_routing_logs').insert({
          user_id: user.id,
          route_provider: provider,
          route_model: model,
          reason: decision.reason,
          estimated_cost_class: decision.estimatedCostClass,
          input_tokens: Math.ceil(input.length / 4),
          output_tokens: Math.ceil(text.length / 4),
          latency_ms: latency,
          success: ok,
          error_text: errorText || null,
        })
      } catch (_) {
        // best-effort logging
      }

      if (!ok) {
        return new Response(
          JSON.stringify({ error: 'Generation failed', message: errorText, decision }),
          { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
      }

      return new Response(
        JSON.stringify({ decision, output: { text } }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid mode' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Unexpected error', message: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})

async function callOpenAI(model: string, input: string): Promise<string> {
  const key = Deno.env.get('OPENAI_API_KEY')
  if (!key) throw new Error('Missing OPENAI_API_KEY')
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: input },
      ],
      temperature: 0.2,
      max_tokens: 1024,
    }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`OpenAI error ${res.status}: ${body}`)
  }
  const data = await res.json()
  const content = data?.choices?.[0]?.message?.content
  if (!content) throw new Error('OpenAI: empty response')
  return String(content)
}

async function callAnthropic(model: string, input: string): Promise<string> {
  const key = Deno.env.get('ANTHROPIC_API_KEY')
  if (!key) throw new Error('Missing ANTHROPIC_API_KEY')
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      messages: [
        { role: 'user', content: input },
      ],
    }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Anthropic error ${res.status}: ${body}`)
  }
  const data = await res.json()
  const content = data?.content?.[0]?.text
  if (!content) throw new Error('Anthropic: empty response')
  return String(content)
}

async function callGemini(model: string, input: string): Promise<string> {
  const key = Deno.env.get('GEMINI_API_KEY') ?? Deno.env.get('VITE_GEMINI_API_KEY')
  if (!key) throw new Error('Missing GEMINI_API_KEY')
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: input }],
        },
      ],
      generationConfig: { temperature: 0.2, maxOutputTokens: 1024 },
    }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Gemini error ${res.status}: ${body}`)
  }
  const data = await res.json()
  const parts = data?.candidates?.[0]?.content?.parts
  const text = Array.isArray(parts) ? parts.map((p: any) => p?.text || '').join('') : ''
  if (!text) throw new Error('Gemini: empty response')
  return String(text)
}

async function streamOpenAI(model: string, input: string, supabase: ReturnType<typeof createClient>, userId: string, decision: { provider: string; model: string; reason: string; estimatedCostClass: string }) {
  const key = Deno.env.get('OPENAI_API_KEY')
  if (!key) return new Response(JSON.stringify({ error: 'Missing OPENAI_API_KEY' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  const encoder = new TextEncoder()
  let buffer = ''
  const t0 = Date.now()

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: input },
      ],
      temperature: 0.2,
      max_tokens: 1024,
      stream: true,
    }),
  })
  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => '')
    return new Response(JSON.stringify({ error: `OpenAI stream error ${res.status}`, detail: text }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  const reader = res.body.getReader()
  const rs = new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read()
      if (done) {
        controller.enqueue(encoder.encode(`data: [DONE]\n\n`))
        controller.close()
        const latency = Date.now() - t0
        try {
          await supabase.from('ai_routing_logs').insert({
            user_id: userId,
            route_provider: decision.provider,
            route_model: decision.model,
            reason: decision.reason,
            estimated_cost_class: decision.estimatedCostClass,
            input_tokens: Math.ceil(input.length / 4),
            output_tokens: Math.ceil(buffer.length / 4),
            latency_ms: latency,
            success: true,
            error_text: null,
          })
        } catch (_) {}
        return
      }
      // Parse SSE lines and forward content deltas
      const chunk = new TextDecoder().decode(value)
      const lines = chunk.split(/\r?\n/)
      for (const line of lines) {
        if (!line.startsWith('data:')) continue
        const payload = line.slice(5).trim()
        if (payload === '[DONE]') continue
        try {
          const json = JSON.parse(payload)
          const delta = json?.choices?.[0]?.delta?.content
          if (delta) {
            buffer += delta
            controller.enqueue(encoder.encode(`data: ${delta}\n\n`))
          }
        } catch (_) {
          // ignore non-JSON SSE events
        }
      }
    }
  })

  return new Response(rs, { status: 200, headers: { ...corsHeaders, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' } })
}
