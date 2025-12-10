// Barry Answer Validation Endpoint
// Handles user feedback (thumbs up/down) for self-correcting system

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const {
      chatLogId,
      userQuery,
      barryResponse,
      isCorrect,
      userFeedback,
      manualReferences,
      searchMethod,
      responseTimeMs
    } = await req.json();

    if (!userQuery || !barryResponse || typeof isCorrect !== 'boolean') {
      return new Response(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`📝 User feedback: ${isCorrect ? '👍 Correct' : '👎 Wrong'}`);
    console.log(`Query: "${userQuery}"`);

    // Save feedback to database (triggers auto-save to knowledge base)
    const { data: feedbackRecord, error: feedbackError } = await supabaseClient
      .from('barry_answer_feedback')
      .insert({
        user_id: user.id,
        chat_log_id: chatLogId,
        user_query: userQuery,
        barry_response: barryResponse,
        is_correct: isCorrect,
        user_feedback: userFeedback,
        manual_references: manualReferences,
        search_method: searchMethod,
        response_time_ms: responseTimeMs
      })
      .select()
      .single();

    if (feedbackError) {
      console.error('❌ Error saving feedback:', feedbackError);
      return new Response(JSON.stringify({ error: 'Failed to save feedback' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`✅ Feedback saved: ${feedbackRecord.id}`);

    // If answer was wrong, provide guidance for re-search
    if (!isCorrect) {
      return new Response(JSON.stringify({
        success: true,
        message: 'Thanks for the feedback! Barry will search deeper for a better answer.',
        suggestion: 'Try rephrasing your question or providing more details about your Unimog model.',
        feedbackId: feedbackRecord.id
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

    // If answer was correct, it's already saved to knowledge base via trigger
    return new Response(JSON.stringify({
      success: true,
      message: 'Thanks! Your feedback helps Barry learn and improve.',
      feedbackId: feedbackRecord.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
