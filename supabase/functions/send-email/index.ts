
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
    
    // Extract domain and sender name from the from address
    const fromParts = from.split('@');
    const domain = fromParts[1];
    const senderName = fromParts[0] === 'noreply' ? 'Unimog Community Hub' :
                      fromParts[0] === 'info' ? 'Unimog Info' :
                      fromParts[0] === 'help' ? 'Unimog Support' : 'Unimog Community Hub';
    
    // MailerSend API endpoint
    const url = "https://api.mailersend.com/v1/email";
    
    const emailData = {
      from: {
        email: from,
        name: senderName
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

    console.log("Sending email to:", to, "from:", from);
    console.log("Email subject:", subject);

    const apiKey = Deno.env.get("MAILERSEND_API_KEY");
    if (!apiKey) {
      throw new Error("MAILERSEND_API_KEY environment variable not set");
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(emailData),
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      console.error("MailerSend API error:", responseData);
      throw new Error(`MailerSend API error: ${response.status} ${JSON.stringify(responseData)}`);
    }

    console.log("Email sent successfully");
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
