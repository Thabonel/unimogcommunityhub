
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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, from, subject, text, html } = await req.json() as EmailRequest;
    
    // MailerSend API endpoint
    const url = "https://api.mailersend.com/v1/email";
    
    const emailData = {
      from: {
        email: from,
      },
      to: [
        {
          email: to,
        },
      ],
      subject: subject,
      text: text,
      html: html || text,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("MAILERSEND_API_KEY")}`,
      },
      body: JSON.stringify(emailData),
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      console.error("MailerSend API error:", responseData);
      throw new Error(`MailerSend API error: ${response.status} ${JSON.stringify(responseData)}`);
    }

    return new Response(JSON.stringify(responseData), {
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
