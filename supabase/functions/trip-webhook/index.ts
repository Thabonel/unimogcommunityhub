
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const url = new URL(req.url);
    const endpointId = url.pathname.split('/').pop();
    console.log(`Webhook received for endpoint: ${endpointId}`);
    
    // Parse the request body as JSON
    const tripData = await req.json();
    
    // Log the received trip data
    console.log('Trip data received:', JSON.stringify(tripData, null, 2));
    
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Store the trip data in the database for future reference (optional)
    // const { data, error } = await supabase
    //   .from('trip_webhooks')
    //   .insert({
    //     endpoint_id: endpointId,
    //     trip_data: tripData,
    //   });
    
    // if (error) {
    //   console.error('Error storing trip data:', error);
    // }
    
    // Return a successful response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Trip data received successfully',
        endpointId 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error processing webhook:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error occurred' 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
