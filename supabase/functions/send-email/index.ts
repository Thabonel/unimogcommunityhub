
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  from: string;
  subject: string;
  text: string;
  html?: string;
}

const MAILGUN_API_KEY = Deno.env.get("MAILGUN_API_KEY");
const MAILGUN_DOMAIN = "unimogcommunityhub.com";
const MAILGUN_API_URL = `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`;

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, from, subject, text, html } = await req.json() as EmailRequest;
    
    // Extract sender name from the from address
    const fromParts = from.split('@');
    const senderName = fromParts[0] === 'noreply' ? 'Unimog Community Hub' :
                      fromParts[0] === 'info' ? 'Unimog Community Hub Info' :
                      fromParts[0] === 'help' ? 'Unimog Support' : 'Unimog Community Hub';
    
    if (!MAILGUN_API_KEY) {
      throw new Error("MAILGUN_API_KEY environment variable not set");
    }
    
    // Prepare form data for Mailgun API
    const formData = new FormData();
    formData.append("from", `${senderName} <${from}>`);
    formData.append("to", to);
    formData.append("subject", subject);
    formData.append("text", text);
    
    if (html) {
      formData.append("html", html);
    }

    console.log(`Sending email to: ${to}, from: ${from}, subject: ${subject}`);
    
    // Send the email via Mailgun API
    const response = await fetch(MAILGUN_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const responseData = await response.text();
      console.error("Mailgun API error:", response.status, responseData);
      throw new Error(`Mailgun API error: ${response.status} ${responseData}`);
    }

    const responseData = await response.json();
    console.log("Email sent successfully:", responseData);
    
    return new Response(JSON.stringify({ success: true, id: responseData.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
    
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
