
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
    const senderName = fromParts[0] === 'noreply' ? 'Unimog Community Hub' :
                      fromParts[0] === 'info' ? 'Unimog Community Hub Info' :
                      fromParts[0] === 'help' ? 'Unimog Support' : 'Unimog Community Hub';
    
    // Proton Mail API endpoint (using Bridge SMTP via external mail service)
    const url = "https://api.smtp-relay-service.com/v1/email/send";
    
    const emailData = {
      from: {
        name: senderName,
        email: from
      },
      to: [{ email: to }],
      subject: subject,
      content: [
        {
          type: "text/plain",
          value: text
        },
        {
          type: "text/html",
          value: html || text
        }
      ]
    };

    console.log("Sending email to:", to, "from:", from);
    console.log("Email subject:", subject);
    
    // Get API key for the email service
    const apiKey = Deno.env.get("PROTON_BRIDGE_API_KEY");
    if (!apiKey) {
      throw new Error("PROTON_BRIDGE_API_KEY environment variable not set");
    }
    
    // Send the email via a service that connects to Proton Mail
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const responseData = await response.json();
      console.error("Email sending error:", responseData);
      throw new Error(`Email service error: ${response.status} ${JSON.stringify(responseData)}`);
    }

    console.log("Email sent successfully");
    return new Response(JSON.stringify({ success: true }), {
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
