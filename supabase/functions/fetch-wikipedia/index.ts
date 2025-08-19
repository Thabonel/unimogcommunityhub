
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  modelCode: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const body: RequestBody = await req.json();
    const { modelCode } = body;

    if (!modelCode) {
      return new Response(
        JSON.stringify({ error: 'Model code is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Fetch general Unimog data from Wikipedia
    const wikiResponse = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/Unimog');
    
    if (!wikiResponse.ok) {
      throw new Error(`Wikipedia API error: ${wikiResponse.statusText}`);
    }
    
    const wikiData = await wikiResponse.json();
    
    // Enhance with model-specific info based on the provided model code
    // This is a simplified version - in a real app you might query multiple sources
    // or have a more sophisticated filtering mechanism
    let enhancedData = {
      ...wikiData,
      modelSpecific: {
        modelCode,
        isU1700L: modelCode === 'U1700L',
        australianModel: modelCode === 'U1700L',
        seriesInfo: modelCode === 'U1700L' ? 
          'The U1700L belongs to the 435 series of Unimogs, which were particularly popular in Australia.' : 
          'General Unimog information',
      }
    };

    console.log(`Processed Wikipedia data for model ${modelCode}`);
    
    return new Response(
      JSON.stringify(enhancedData),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
    
  } catch (error) {
    console.error('Error in fetch-wikipedia function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error occurred' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
