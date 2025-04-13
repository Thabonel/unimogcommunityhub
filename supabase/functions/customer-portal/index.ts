
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.5.0?dts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.32.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CUSTOMER-PORTAL] ${step}${detailsStr}`);
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Get subscription data from Supabase
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from("user_subscriptions")
      .select("stripe_customer_id, stripe_session_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (subscriptionError) throw new Error(`Subscription error: ${subscriptionError.message}`);
    logStep("Subscription data retrieved", { 
      hasCustomerId: !!subscriptionData?.stripe_customer_id,
      hasSessionId: !!subscriptionData?.stripe_session_id
    });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Determine customer ID - either from subscription data or by looking up the customer
    let customerId = subscriptionData?.stripe_customer_id;

    if (!customerId) {
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      if (customers.data.length === 0) {
        throw new Error("No Stripe customer found for this user");
      }
      customerId = customers.data[0].id;
      logStep("Found Stripe customer by email", { customerId });

      // Update the subscription record with the customer ID
      if (subscriptionData?.id) {
        await supabase
          .from("user_subscriptions")
          .update({ stripe_customer_id: customerId })
          .eq("id", subscriptionData.id);
      }
    }

    // Generate return URL with UTM parameters
    const origin = req.headers.get("origin") || "https://unimogcommunityhub.com";
    const returnUrl = new URL(`${origin}/dashboard`);
    returnUrl.searchParams.append("utm_source", "stripe_portal");
    returnUrl.searchParams.append("utm_medium", "customer_portal");
    returnUrl.searchParams.append("utm_campaign", "subscription_management");

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl.toString(),
      flow_data: {
        type: "subscription_cancel",
        subscription_cancel: {
          mode: "at_period_end",
        },
      },
    });
    logStep("Customer portal session created", { sessionId: portalSession.id });

    return new Response(JSON.stringify({ url: portalSession.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in customer-portal", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);
