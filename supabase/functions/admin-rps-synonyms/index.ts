// Admin RPS Synonyms Manager - approve suggestions and manage lexicon
// Secured by ADMIN_EMAILS env (comma-separated) checking requester email

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function isPreflight(req: Request) {
  return req.method === 'OPTIONS';
}

serve(async (req) => {
  try {
    if (isPreflight(req)) {
      return new Response('ok', { headers: corsHeaders });
    }

    const ADMIN_EMAILS = (Deno.env.get('ADMIN_EMAILS') || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (ADMIN_EMAILS.length > 0) {
      const email = (user.email || '').toLowerCase();
      if (!ADMIN_EMAILS.includes(email)) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    const url = new URL(req.url);
    const pathname = url.pathname;
    const method = req.method.toUpperCase();

    // Simple router
    if (method === 'GET' && pathname.endsWith('/suggestions')) {
      const limit = Number(url.searchParams.get('limit') || '50');
      const { data, error } = await supabase
        .from('rps_synonym_suggestions')
        .select('id, phrase, normalized_phrase, candidates, created_at')
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return new Response(JSON.stringify({ suggestions: data || [] }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (method === 'POST' && pathname.endsWith('/approve')) {
      const body = await req.json();
      const phrase: string = body?.phrase?.toString() || '';
      const group_hint: string = body?.group_hint?.toString() || '';
      const weight: number = Number(body?.weight ?? 2.0);
      if (!phrase || !group_hint) {
        return new Response(JSON.stringify({ error: 'phrase and group_hint required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      const { error: insErr } = await supabase.from('rps_component_synonyms').insert({ phrase, group_hint, weight });
      if (insErr && !insErr.message.includes('duplicate key')) throw insErr;
      await supabase.from('rps_synonym_suggestions').delete().eq('phrase', phrase);
      return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (method === 'POST' && pathname.endsWith('/reject')) {
      const body = await req.json();
      const phrase: string = body?.phrase?.toString() || '';
      if (!phrase) return new Response(JSON.stringify({ error: 'phrase required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      await supabase.from('rps_synonym_suggestions').delete().eq('phrase', phrase);
      return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (method === 'POST' && pathname.endsWith('/seed')) {
      // Optional bulk seeding; body: [{ phrase, group_hint, weight }]
      const items = await req.json();
      if (!Array.isArray(items)) {
        return new Response(JSON.stringify({ error: 'array expected' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      const { error } = await supabase.from('rps_component_synonyms').insert(items, { upsert: true });
      if (error) throw error;
      return new Response(JSON.stringify({ ok: true, count: items.length }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('Admin synonyms error:', e);
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});

