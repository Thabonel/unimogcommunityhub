
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  userId: string;
  modelCode: string;
  wikiData: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    // Initialize Supabase client with service role key for admin-level access
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const body: RequestBody = await req.json();
    const { userId, modelCode, wikiData } = body;

    // Validate required fields
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // First, check if we have model info in our database
    const { data: modelData, error: modelError } = await supabase
      .from('unimog_models')
      .select('*')
      .eq('model_code', modelCode)
      .maybeSingle();

    if (modelError) {
      throw new Error(`Error fetching model data: ${modelError.message}`);
    }

    // Update the user's profile with the combined wiki data and model info
    const updateData: any = {};
    
    // Always update the unimog_wiki_data with the latest info
    if (wikiData) {
      updateData.unimog_wiki_data = wikiData;
    }
    
    // If modelData exists, update user's unimog_model field if not already set
    if (modelData) {
      // Get current profile to see if unimog_model needs to be updated
      const { data: profileData } = await supabase
        .from('profiles')
        .select('unimog_model')
        .eq('id', userId)
        .single();
      
      if (!profileData?.unimog_model) {
        updateData.unimog_model = modelCode;
      }
    }
    
    // Only update if we have data to update
    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);

      if (updateError) {
        throw new Error(`Error updating profile: ${updateError.message}`);
      }
      
      console.log(`Updated profile for user ${userId} with Unimog data for model ${modelCode}`);
    } else {
      console.log(`No updates needed for user ${userId}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
    
  } catch (error) {
    console.error('Error in update-profile-unimog function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error occurred' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
