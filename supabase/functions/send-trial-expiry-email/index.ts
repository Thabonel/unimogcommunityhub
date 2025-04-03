
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.32.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Init Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Handle all requests - regular invocations and scheduled runs
const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Find trials that are about to expire (1 day left) and no email has been sent yet
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const { data: expiringTrials, error: trialError } = await supabase
      .from("user_trials")
      .select("*, profiles!inner(email, full_name)")
      .is("email_sent_at", null)
      .eq("is_active", true)
      .lt("expires_at", tomorrow.toISOString())
      .gt("expires_at", today.toISOString());
    
    if (trialError) throw trialError;
    
    console.log(`Found ${expiringTrials?.length || 0} expiring trials`);
    
    // Send emails and update the user_trials table
    if (expiringTrials && expiringTrials.length > 0) {
      for (const trial of expiringTrials) {
        console.log(`Processing trial for user ${trial.user_id}`);
        
        try {
          // Send email via the send-email function
          await supabase.functions.invoke("send-email", {
            body: {
              to: trial.profiles.email,
              from: "noreply@unimogcommunityhub.com",
              subject: "Your Unimog Community Hub trial is ending soon",
              text: `Hello ${trial.profiles.full_name || "there"},\n\nYour 7-day free trial at Unimog Community Hub is ending tomorrow. Subscribe now to keep enjoying all the premium features.\n\nWe promise not to spam you and will only occasionally notify you of new features. You can easily join at any time even if you choose not to subscribe now.\n\nTo continue your membership, please visit: https://unimogcommunityhub.com/pricing\n\nThank you for trying our platform!\n\nThe Unimog Community Hub Team`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <h2>Your Free Trial is Ending Soon</h2>
                  <p>Hello ${trial.profiles.full_name || "there"},</p>
                  <p>Your 7-day free trial at Unimog Community Hub is ending tomorrow.</p>
                  <p>Subscribe now to keep enjoying all the premium features!</p>
                  <div style="margin: 30px 0; text-align: center;">
                    <a href="https://unimogcommunityhub.com/pricing" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                      Choose Your Subscription Plan
                    </a>
                  </div>
                  <p>We promise not to spam you and will only occasionally notify you of new features.</p>
                  <p>You can easily join at any time even if you choose not to subscribe now.</p>
                  <p>Thank you for trying our platform!</p>
                  <p>The Unimog Community Hub Team</p>
                </div>
              `
            }
          });
          
          // Update the trial record to mark email as sent
          await supabase
            .from("user_trials")
            .update({ email_sent_at: new Date().toISOString() })
            .eq("id", trial.id);
          
          console.log(`Email sent for trial ${trial.id}`);
        } catch (emailError) {
          console.error(`Error sending email for trial ${trial.id}:`, emailError);
        }
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: expiringTrials?.length || 0 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing trial expiry emails:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

serve(handler);
