import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type Type = 'model' | 'procedure' | 'part'

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const url = new URL(req.url)
    const q = (url.searchParams.get('q') || '').trim()
    const type = (url.searchParams.get('type') || 'model') as Type
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '10', 10) || 10, 50)
    const modelCode = (url.searchParams.get('model_code') || '').trim()

    if (!q) return new Response(JSON.stringify({ items: [] }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', key)

    async function log(success: boolean, status: number, opts: { error?: string } = {}) {
      try {
        const ip = req.headers.get('x-forwarded-for') || undefined
        await supabase.from('canonical_access_logs').insert({
          endpoint: 'canonical-search',
          entity_type: type,
          identifier: null,
          query: q,
          status_code: status,
          success,
          error_text: opts.error || null,
          ip,
        })
      } catch (_) { /* ignore */ }
    }

    if (type === 'model') {
      const { data, error } = await supabase
        .from('unimog_models')
        .select('id, model')
        .ilike('model', `%${q}%`)
        .limit(limit)
      if (error) throw new Error(error.message)
      const items = (data || []).map((m: any) => ({
        type: 'model',
        id: m.id,
        slug: m.model,
        name: m.model,
        canonical_id: `urn:unimog:model:${m.model}`,
      }))
      await log(true, 200)
      return new Response(JSON.stringify({ items }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (type === 'procedure') {
      // If model_code provided, do inner joins to filter by model
      if (modelCode) {
        const { data, error } = await supabase
          .from('wis_procedures')
          .select('id, procedure_code, title, wis_components!inner(wis_systems!inner(wis_models!inner(model_code)))')
          .eq('wis_components.wis_systems.wis_models.model_code', modelCode)
          .or(`title.ilike.%${q}%,procedure_code.ilike.%${q}%`)
          .limit(limit)
        if (error) throw new Error(error.message)
        const items = (data || []).map((p: any) => ({
          type: 'procedure',
          id: p.id,
          code: p.procedure_code,
          name: p.title,
          canonical_id: `urn:unimog:procedure:${p.procedure_code}`,
        }))
        await log(true, 200)
        return new Response(JSON.stringify({ items }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      } else {
        const { data, error } = await supabase
          .from('wis_procedures')
          .select('id, procedure_code, title')
          .or(`title.ilike.%${q}%,procedure_code.ilike.%${q}%`)
          .limit(limit)
        if (error) throw new Error(error.message)
        const items = (data || []).map((p: any) => ({
          type: 'procedure',
          id: p.id,
          code: p.procedure_code,
          name: p.title,
          canonical_id: `urn:unimog:procedure:${p.procedure_code}`,
        }))
        await log(true, 200)
        return new Response(JSON.stringify({ items }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }
    }

    if (type === 'part') {
      const { data, error } = await supabase
        .from('wis_parts')
        .select('id, mercedes_part_number, description')
        .or(`mercedes_part_number.ilike.%${q}%,description.ilike.%${q}%`)
        .limit(limit)
      if (error) throw new Error(error.message)
      const items = (data || []).map((p: any) => ({
        type: 'part',
        id: p.id,
        slug: p.mercedes_part_number,
        name: p.description,
        canonical_id: `urn:unimog:part:${p.mercedes_part_number}`,
      }))
      return new Response(JSON.stringify({ items }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    await log(false, 400, { error: 'Unsupported type' })
    return new Response(JSON.stringify({ error: 'Unsupported type' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (err) {
    try {
      const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY') ?? ''
      const sb = createClient(Deno.env.get('SUPABASE_URL') ?? '', key)
      await sb.from('canonical_access_logs').insert({ endpoint: 'canonical-search', entity_type: null, identifier: null, query: '', status_code: 500, success: false, error_text: (err as Error).message })
    } catch (_) { /* ignore */ }
    return new Response(JSON.stringify({ error: 'Unexpected error', message: (err as Error).message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
