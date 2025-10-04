// Supabase Edge Function to send SMS notifications via Vonage (Nexmo)
// Triggered automatically when new events are queued in admin_sms_log

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const VONAGE_API_KEY = Deno.env.get('VONAGE_API_KEY')!
const VONAGE_API_SECRET = Deno.env.get('VONAGE_API_SECRET')!
const VONAGE_FROM_NUMBER = Deno.env.get('VONAGE_FROM_NUMBER')! // Your Vonage virtual number

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

    // Send each SMS via Vonage
    const results = await Promise.allSettled(
      pendingSMS.map(async (sms) => {
        try {
          // Prepare Vonage request
          const vonageUrl = 'https://rest.nexmo.com/sms/json'

          const requestBody = {
            api_key: VONAGE_API_KEY,
            api_secret: VONAGE_API_SECRET,
            to: sms.phone_number.replace('+', ''), // Vonage wants numbers without +
            from: VONAGE_FROM_NUMBER,
            text: sms.message
          }

          // Send SMS via Vonage
          const vonageResponse = await fetch(vonageUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
          })

          const vonageData = await vonageResponse.json()

          if (!vonageResponse.ok || vonageData.messages[0].status !== '0') {
            const errorText = vonageData.messages[0]['error-text'] || 'Unknown error'
            throw new Error(`Vonage error: ${errorText}`)
          }

          const messageId = vonageData.messages[0]['message-id']

          // Update status to sent
          await supabaseClient
            .from('admin_sms_log')
            .update({
              status: 'sent',
              twilio_sid: messageId // Reusing column for Vonage message ID
            })
            .eq('id', sms.id)

          console.log(`✅ SMS sent successfully: ${sms.id} (${messageId})`)

          return { success: true, id: sms.id, sid: messageId }
        } catch (error: any) {
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
