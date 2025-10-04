// Supabase Edge Function to send email notifications
// Triggered automatically when new events are queued in admin_email_log

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        }
      }
    )

    // Get pending email notifications from the queue
    const { data: pendingEmails, error: fetchError } = await supabaseClient
      .from('admin_email_log')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(10) // Process 10 at a time

    if (fetchError) {
      throw new Error(`Failed to fetch pending emails: ${fetchError.message}`)
    }

    if (!pendingEmails || pendingEmails.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No pending email notifications' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    console.log(`Processing ${pendingEmails.length} pending email notifications`)

    // Send each email via Supabase Auth
    const results = await Promise.allSettled(
      pendingEmails.map(async (email) => {
        try {
          // Send email using Resend (simpler and more reliable)
          const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

          if (!RESEND_API_KEY) {
            throw new Error('RESEND_API_KEY not configured - please sign up at resend.com and add the API key to Supabase secrets')
          }

          const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'Unimog Hub <onboarding@resend.dev>',
              to: [email.recipient_email],
              subject: email.subject,
              text: email.message,
            }),
          })

          if (!resendResponse.ok) {
            const errorText = await resendResponse.text()
            throw new Error(`Resend error: ${errorText}`)
          }

          const resendData = await resendResponse.json()
          console.log('Resend response:', resendData)

          // Update status to sent
          await supabaseClient
            .from('admin_email_log')
            .update({
              status: 'sent',
            })
            .eq('id', email.id)

          console.log(`✅ Email sent successfully: ${email.id}`)

          return { success: true, id: email.id }
        } catch (error: any) {
          console.error(`❌ Failed to send email ${email.id}:`, error)

          // Update status to failed
          await supabaseClient
            .from('admin_email_log')
            .update({
              status: 'failed',
              error_message: error.message
            })
            .eq('id', email.id)

          return { success: false, id: email.id, error: error.message }
        }
      })
    )

    // Count successes and failures
    const sent = results.filter(r => r.status === 'fulfilled' && r.value.success).length
    const failed = results.filter(r => r.status === 'fulfilled' && !r.value.success).length

    return new Response(
      JSON.stringify({
        message: `Processed ${pendingEmails.length} email notifications`,
        sent,
        failed,
        details: results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error in send-admin-email function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
