
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.5.0?dts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.32.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function logStep(step: string, details?: any) {
  console.log(`[CREATE-CHECKOUT] ${step}${details ? ` - ${JSON.stringify(details)}` : ''}`);
}

// Handle all requests
const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    // Parse request body
    const { priceId, planType, trialDays } = await req.json();
    
    if (!planType) {
      throw new Error("Plan type is required");
    }
    
    logStep("Request parsed", { planType, hasPriceId: !!priceId, trialDays });
    
    // Initialize Supabase client with auth context from the request
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get the user from the JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }
    
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error("Unauthorized: Invalid token or user not found");
    }
    
    logStep("User authenticated", { userId: user.id, email: user.email });
    
    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY environment variable is not set");
    }
    
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });
    
    logStep("Stripe initialized");

    // Check if user already exists as a Stripe customer
    const { data: customers, status } = await stripe.customers.list({
      email: user.email,
      limit: 1
    });
    
    let customerId: string | undefined;
    
    if (customers && customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing Stripe customer", { customerId });
    } else {
      // Create a new customer if one doesn't exist
      const customerResponse = await stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: user.id
        }
      });
      customerId = customerResponse.id;
      logStep("Created new Stripe customer", { customerId });
    }

    // Determine which price ID to use if not explicitly provided
    let checkoutPriceId = priceId;
    
    if (!checkoutPriceId) {
      const priceEnvKey = planType === 'lifetime' 
        ? 'STRIPE_LIFETIME_PRICE_ID'
        : 'STRIPE_STANDARD_PRICE_ID';
      
      checkoutPriceId = Deno.env.get(priceEnvKey);
      
      if (!checkoutPriceId) {
        // Fallback to config variables if direct env vars not found
        const configKey = planType === 'lifetime' ? 'lifetimePriceId' : 'premiumMonthlyPriceId';
        const stripeConfig = JSON.parse(Deno.env.get("STRIPE_CONFIG") || "{}");
        checkoutPriceId = stripeConfig[configKey];
      }
    }
    
    if (!checkoutPriceId) {
      throw new Error(`Price ID for ${planType} plan is not configured`);
    }
    
    logStep("Using price ID", { checkoutPriceId, planType });
    
    // Determine the mode based on plan type
    const mode = planType === 'lifetime' ? 'payment' : 'subscription';
    logStep("Checkout mode set", { mode });

    // Optional trial period (only applies to subscriptions)
    const trialPeriodDays = trialDays && mode === 'subscription' ? parseInt(trialDays) : undefined;
    
    // Create a new checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: checkoutPriceId,
          quantity: 1,
        },
      ],
      mode,
      success_url: `${req.headers.get("origin") || "https://unimogcommunityhub.com"}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin") || "https://unimogcommunityhub.com"}/subscription/canceled`,
      client_reference_id: user.id,
      metadata: {
        userId: user.id,
        planType,
      },
      subscription_data: trialPeriodDays ? {
        trial_period_days: trialPeriodDays
      } : undefined
    });
    
    logStep("Checkout session created", { 
      sessionId: session.id, 
      url: session.url?.substring(0, 50) + '...'
    });

    return new Response(
      JSON.stringify({ success: true, url: session.url }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
};

serve(handler);
