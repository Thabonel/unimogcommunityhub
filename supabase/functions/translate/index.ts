
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Define supported languages
const SUPPORTED_LANGUAGES = ['en', 'de', 'tr', 'es'];

serve(async (req) => {
  // Handle preflight CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const GOOGLE_TRANSLATE_API_KEY = Deno.env.get("GOOGLE_TRANSLATE_API_KEY");

    if (!GOOGLE_TRANSLATE_API_KEY) {
      throw new Error("Missing GOOGLE_TRANSLATE_API_KEY environment variable");
    }

    const body = await req.json();
    const { text, targetLanguage } = body;

    if (!text) {
      return new Response(
        JSON.stringify({ error: "Text is required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    if (!targetLanguage || !SUPPORTED_LANGUAGES.includes(targetLanguage)) {
      return new Response(
        JSON.stringify({ 
          error: `Target language must be one of: ${SUPPORTED_LANGUAGES.join(", ")}`
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Skip translation if the target language is English (our source)
    if (targetLanguage === "en") {
      return new Response(
        JSON.stringify({ translatedText: text }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Call Google Translate API
    const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        target: targetLanguage,
        format: "text",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Translation API error");
    }

    const translatedText = data.data?.translations?.[0]?.translatedText;

    if (!translatedText) {
      throw new Error("No translation returned");
    }

    return new Response(
      JSON.stringify({ translatedText }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Translation error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
