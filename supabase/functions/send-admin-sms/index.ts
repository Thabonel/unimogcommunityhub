// Supabase Edge Function to send SMS notifications via Twilio
// Triggered automatically when new events are queued in admin_sms_log

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID')!
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN')!
const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER')! // Format: +1234567890

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

    // Get pending SMS notifications from the queue
    const { data: pendingSMS, error: fetchError } = await supabaseClient
      .from('admin_sms_log')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(10) // Process 10 at a time

    if (fetchError) {
      throw new Error(`Failed to fetch pending SMS: ${fetchError.message}`)
    }

    if (!pendingSMS || pendingSMS.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No pending SMS notifications' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    console.log(`Processing ${pendingSMS.length} pending SMS notifications`)

    // Send each SMS via Twilio
    const results = await Promise.allSettled(
      pendingSMS.map(async (sms) => {
        try {
          // Prepare Twilio request
          const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`

          const formData = new URLSearchParams({
            To: sms.phone_number,
            From: TWILIO_PHONE_NUMBER,
            Body: sms.message
          })

          // Send SMS via Twilio
          const twilioResponse = await fetch(twilioUrl, {
            method: 'POST',
            headers: {
              'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString()
          })

          const twilioData = await twilioResponse.json()

          if (!twilioResponse.ok) {
            throw new Error(`Twilio error: ${twilioData.message || 'Unknown error'}`)
          }

          // Update status to sent
          await supabaseClient
            .from('admin_sms_log')
            .update({
              status: 'sent',
              twilio_sid: twilioData.sid
            })
            .eq('id', sms.id)

          console.log(`✅ SMS sent successfully: ${sms.id} (${twilioData.sid})`)

          return { success: true, id: sms.id, sid: twilioData.sid }
        } catch (error) {
          console.error(`❌ Failed to send SMS ${sms.id}:`, error)

          // Update status to failed
          await supabaseClient
            .from('admin_sms_log')
            .update({
              status: 'failed',
              error_message: error.message
            })
            .eq('id', sms.id)

          return { success: false, id: sms.id, error: error.message }
        }
      })
    )

    // Count successes and failures
    const sent = results.filter(r => r.status === 'fulfilled' && r.value.success).length
    const failed = results.filter(r => r.status === 'fulfilled' && !r.value.success).length

    return new Response(
      JSON.stringify({
        message: `Processed ${pendingSMS.length} SMS notifications`,
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
    console.error('Error in send-admin-sms function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
