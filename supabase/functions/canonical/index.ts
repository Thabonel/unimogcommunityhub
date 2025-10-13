import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { encode as hexEncode } from 'https://deno.land/std@0.168.0/encoding/hex.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type EntityType = 'model' | 'procedure' | 'part'

function hashETag(input: string): string {
  const data = new TextEncoder().encode(input)
  const digest = crypto.subtle.digestSync('SHA-256', data)
  return 'W/"' + new TextDecoder().decode(hexEncode(new Uint8Array(digest))).slice(0, 32) + '"'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const type = (url.searchParams.get('type') || 'model') as EntityType
    const id = url.searchParams.get('id')
    const slug = url.searchParams.get('slug')
    const code = url.searchParams.get('code')

    // Prefer service role for read across RLS-protected tables, fallback to anon
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      supabaseKey,
    )

    async function log(success: boolean, status: number, opts: { error?: string } = {}) {
      try {
        const ip = req.headers.get('x-forwarded-for') || undefined
        await supabase.from('canonical_access_logs').insert({
          endpoint: 'canonical',
          entity_type: type,
          identifier: id || slug || code || null,
          status_code: status,
          success,
          error_text: opts.error || null,
          ip,
        })
      } catch (_) { /* ignore */ }
    }

    if (type === 'model') {
      let query = supabase.from('unimog_models').select('*').limit(1)
      if (id) query = query.eq('id', id)
      else if (slug) query = query.eq('model', slug)
      else { await log(false, 400, { error: 'Missing id or slug' }); return new Response(JSON.stringify({ error: 'Missing id or slug' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }) }

      const { data, error } = await query.single()
      if (error) { await log(false, 404, { error: error.message }); return new Response(JSON.stringify({ error: error.message }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }) }

      const baseUrl = Deno.env.get('PUBLIC_BASE_URL') || 'https://unimogcommunityhub.com'
      const canonicalId = `urn:unimog:model:${data.model}`

      // JSON-LD document
      const jsonld = {
        '@context': {
          '@vocab': 'https://schema.org/',
          unimog: 'https://unimogcommunityhub.com/vocab#',
        },
        '@id': canonicalId,
        '@type': 'Vehicle',
        name: data.model,
        model: data.model,
        vehicleModelDate: data.production_years || undefined,
        url: `${baseUrl}/models/${encodeURIComponent(data.model)}`,
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'series', value: data.series },
          { '@type': 'PropertyValue', name: 'wheelbase_cm', value: data.typical_wheelbase_cm },
          { '@type': 'PropertyValue', name: 'height_cm', value: data.typical_height_cm },
          { '@type': 'PropertyValue', name: 'width_cm', value: data.typical_width_cm },
          { '@type': 'PropertyValue', name: 'clearance_cm', value: data.typical_clearance_cm },
        ].filter((p) => p.value !== null && p.value !== undefined),
        isPartOf: {
          '@type': 'Dataset',
          name: 'Unimog Model Registry',
          url: `${baseUrl}/models`,
        },
        citation: [],
        // Provenance
        identifier: canonicalId,
        dateModified: data.created_at,
        license: `${baseUrl}/license`,
        publisher: {
          '@type': 'Organization',
          name: 'Unimog Community Hub',
          url: baseUrl,
        },
      }

      const accept = req.headers.get('accept') || ''
      const body = JSON.stringify(jsonld)
      const etag = hashETag(body)
      if (req.headers.get('if-none-match') === etag) { await log(true, 304); return new Response(null, { status: 304, headers: { ...corsHeaders } }) }
      const contentType = accept.includes('application/ld+json') ? 'application/ld+json' : 'application/json'
      await log(true, 200)
      return new Response(body, { status: 200, headers: { ...corsHeaders, 'Content-Type': contentType, ETag: etag } })
    }

    if (type === 'procedure') {
      // Lookup by id or code
      if (!id && !code) { await log(false, 400, { error: 'Missing id or code' }); return new Response(JSON.stringify({ error: 'Missing id or code' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }) }
      // Fetch procedure
      let procQuery = supabase.from('wis_procedures').select('id, procedure_code, title, description, overview, difficulty_level, estimated_time_hours, status').limit(1)
      if (id) procQuery = procQuery.eq('id', id)
      else if (code) procQuery = procQuery.eq('procedure_code', code)
      const { data: proc, error: procErr } = await procQuery.single()
      if (procErr || !proc) { await log(false, 404, { error: procErr?.message || 'Not found' }); return new Response(JSON.stringify({ error: 'Not found', detail: procErr?.message }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }) }

      // Steps
      const { data: steps } = await supabase
        .from('wis_procedure_steps')
        .select('step_number, step_title, instruction, primary_image_url')
        .eq('procedure_id', proc.id)
        .order('step_number', { ascending: true })

      // Parts (mpn and desc)
      const { data: parts } = await supabase
        .from('wis_procedure_parts')
        .select('quantity, usage_note, wis_parts(mercedes_part_number, description)')
        .eq('procedure_id', proc.id)

      // Tools
      const { data: tools } = await supabase
        .from('wis_procedure_tools')
        .select('usage_note, wis_tools(tool_name, mercedes_tool_number)')
        .eq('procedure_id', proc.id)

      // Bulletins referencing this procedure (for citations)
      const { data: bulls } = await supabase
        .from('wis_bulletin_procedures')
        .select('relationship_type, wis_service_bulletins(bulletin_number, title, url:pdf_url)')
        .eq('procedure_id', proc.id)

      const baseUrl = Deno.env.get('PUBLIC_BASE_URL') || 'https://unimogcommunityhub.com'
      const canonicalId = `urn:unimog:procedure:${proc.procedure_code}`

      // Build JSON‑LD as HowTo
      const jsonld: Record<string, unknown> = {
        '@context': {
          '@vocab': 'https://schema.org/',
          unimog: 'https://unimogcommunityhub.com/vocab#',
        },
        '@id': canonicalId,
        '@type': 'HowTo',
        name: proc.title,
        description: proc.description ?? proc.overview ?? undefined,
        url: `${baseUrl}/wis/procedures/${encodeURIComponent(proc.procedure_code)}`,
        difficulty: proc.difficulty_level ?? undefined,
        totalTime: proc.estimated_time_hours ? `PT${Math.round(Number(proc.estimated_time_hours) * 60)}M` : undefined,
        step: (steps || []).map((s: any) => ({
          '@type': 'HowToStep',
          position: s.step_number,
          name: s.step_title || undefined,
          text: s.instruction,
          image: s.primary_image_url || undefined,
        })),
        tool: (tools || []).map((t: any) => ({
          '@type': 'HowToTool',
          name: t?.wis_tools?.tool_name,
          identifier: t?.wis_tools?.mercedes_tool_number || undefined,
          description: t?.usage_note || undefined,
        })),
        supply: (parts || []).map((p: any) => ({
          '@type': 'HowToSupply',
          name: p?.wis_parts?.description,
          identifier: p?.wis_parts?.mercedes_part_number,
          requiredQuantity: p?.quantity || undefined,
          description: p?.usage_note || undefined,
        })),
        citation: (bulls || []).map((b: any) => {
          const bn = b?.wis_service_bulletins?.bulletin_number
          const title = b?.wis_service_bulletins?.title
          const link = b?.wis_service_bulletins?.url
          const rel = b?.relationship_type
          const text = [bn, title, rel].filter(Boolean).join(' - ')
          return link ? `${text} (${link})` : text
        }),
        identifier: canonicalId,
        publisher: { '@type': 'Organization', name: 'Unimog Community Hub', url: baseUrl },
      }

      const accept = req.headers.get('accept') || ''
      const body = JSON.stringify(jsonld)
      const etag = hashETag(body)
      if (req.headers.get('if-none-match') === etag) { await log(true, 304); return new Response(null, { status: 304, headers: { ...corsHeaders } }) }
      const contentType = accept.includes('application/ld+json') ? 'application/ld+json' : 'application/json'
      await log(true, 200)
      return new Response(body, { status: 200, headers: { ...corsHeaders, 'Content-Type': contentType, ETag: etag } })
    }

    if (type === 'part') {
      if (!id && !slug) { await log(false, 400, { error: 'Missing id or slug (mpn)' }); return new Response(JSON.stringify({ error: 'Missing id or slug (mpn)' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }) }
      // slug is treated as mercedes_part_number (mpn)
      let pQuery = supabase.from('wis_parts').select('id, mercedes_part_number, description, category, specifications, supersedes_part_number, superseded_by_part_number, status, alternative_parts, created_at').limit(1)
      if (id) pQuery = pQuery.eq('id', id)
      else if (slug) pQuery = pQuery.eq('mercedes_part_number', slug)
      const { data: part, error: pErr } = await pQuery.single()
      if (pErr || !part) { await log(false, 404, { error: pErr?.message || 'Not found' }); return new Response(JSON.stringify({ error: 'Not found', detail: pErr?.message }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }) }

      const baseUrl = Deno.env.get('PUBLIC_BASE_URL') || 'https://unimogcommunityhub.com'
      const canonicalId = `urn:unimog:part:${part.mercedes_part_number}`

      const additionalProperty: any[] = []
      if (part.category) additionalProperty.push({ '@type': 'PropertyValue', name: 'category', value: part.category })
      if (part.specifications) {
        try {
          const specs = typeof part.specifications === 'string' ? JSON.parse(part.specifications) : part.specifications
          for (const [k, v] of Object.entries(specs || {})) {
            additionalProperty.push({ '@type': 'PropertyValue', name: String(k), value: v as any })
          }
        } catch (_) {}
      }
      if (part.status) additionalProperty.push({ '@type': 'PropertyValue', name: 'status', value: part.status })
      if (Array.isArray(part.alternative_parts) && part.alternative_parts.length) additionalProperty.push({ '@type': 'PropertyValue', name: 'alternative_parts', value: part.alternative_parts.join(', ') })
      if (part.supersedes_part_number) additionalProperty.push({ '@type': 'PropertyValue', name: 'supersedes', value: part.supersedes_part_number })
      if (part.superseded_by_part_number) additionalProperty.push({ '@type': 'PropertyValue', name: 'superseded_by', value: part.superseded_by_part_number })

      const jsonld = {
        '@context': {
          '@vocab': 'https://schema.org/',
          unimog: 'https://unimogcommunityhub.com/vocab#',
        },
        '@id': canonicalId,
        '@type': 'Product',
        name: part.description,
        mpn: part.mercedes_part_number,
        sku: part.mercedes_part_number,
        url: `${baseUrl}/wis/parts/${encodeURIComponent(part.mercedes_part_number)}`,
        additionalProperty,
        identifier: canonicalId,
        dateModified: part.created_at,
        publisher: { '@type': 'Organization', name: 'Unimog Community Hub', url: baseUrl },
        citation: [],
      }

      const accept = req.headers.get('accept') || ''
      const body = JSON.stringify(jsonld)
      const etag = hashETag(body)
      if (req.headers.get('if-none-match') === etag) { await log(true, 304); return new Response(null, { status: 304, headers: { ...corsHeaders } }) }
      const contentType = accept.includes('application/ld+json') ? 'application/ld+json' : 'application/json'
      await log(true, 200)
      return new Response(body, { status: 200, headers: { ...corsHeaders, 'Content-Type': contentType, ETag: etag } })
    }

    await log(false, 400, { error: 'Unsupported type' })
    return new Response(JSON.stringify({ error: 'Unsupported type' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (err) {
    // Attempt to log error
    try {
      const url = new URL(req.url)
      const type = (url.searchParams.get('type') || 'model') as EntityType
      const id = url.searchParams.get('id')
      const slug = url.searchParams.get('slug')
      const code = url.searchParams.get('code')
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY') ?? ''
      const sb = createClient(Deno.env.get('SUPABASE_URL') ?? '', supabaseKey)
      await sb.from('canonical_access_logs').insert({ endpoint: 'canonical', entity_type: type, identifier: id || slug || code || null, status_code: 500, success: false, error_text: (err as Error).message })
    } catch (_) { /* ignore */ }
    return new Response(
      JSON.stringify({ error: 'Unexpected error', message: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
