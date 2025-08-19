
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.5.0?dts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.32.0";

const handler = async (req: Request): Promise<Response> => {
  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2023-10-16",
  });
  
  // Initialize Supabase admin client
  const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    // Get the signature from the headers
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return new Response("Webhook signature missing", { status: 400 });
    }
    
    // Get the raw request body
    const body = await req.text();
    
    // Verify the webhook signature
    const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";
    let event;
    
    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed:`, err);
      return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 });
    }
    
    // Handle specific event types
    switch (event.type) {
      case "checkout.session.completed": {
        console.log("Processing checkout.session.completed event");
        const session = event.data.object;
        
        if (session.payment_status === "paid") {
          const userId = session.client_reference_id || session.metadata?.userId;
          const planType = session.metadata?.planType;
          
          if (!userId) {
            return new Response("User ID not found in session", { status: 400 });
          }
          
          // Calculate expiration date or set to null for lifetime
          let expiresAt = null;
          if (planType !== "lifetime") {
            // For monthly subscription, set expiration to one month from now
            const date = new Date();
            date.setMonth(date.getMonth() + 1);
            expiresAt = date.toISOString();
          }
          
          // Check if user already has a subscription
          const { data: existingSubscription } = await supabase
            .from("user_subscriptions")
            .select("*")
            .eq("user_id", userId)
            .maybeSingle();
          
          if (existingSubscription) {
            // Update existing subscription
            await supabase
              .from("user_subscriptions")
              .update({
                subscription_level: planType,
                is_active: true,
                stripe_session_id: session.id,
                stripe_customer_id: session.customer,
                expires_at: expiresAt,
                updated_at: new Date().toISOString()
              })
              .eq("user_id", userId);
          } else {
            // Create new subscription
            await supabase
              .from("user_subscriptions")
              .insert({
                user_id: userId,
                subscription_level: planType,
                is_active: true,
                stripe_session_id: session.id,
                stripe_customer_id: session.customer,
                expires_at: expiresAt
              });
          }
          
          console.log(`Subscription created/updated for user ${userId}`);
        }
        break;
      }
      
      case "invoice.paid": {
        // Handle subscription renewal
        const invoice = event.data.object;
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
        const userId = subscription.metadata.userId;
        
        if (userId) {
          // Update subscription expiration date
          const date = new Date();
          date.setMonth(date.getMonth() + 1);
          
          await supabase
            .from("user_subscriptions")
            .update({
              is_active: true,
              expires_at: date.toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq("user_id", userId);
            
          console.log(`Subscription renewed for user ${userId}`);
        }
        break;
      }
      
      case "customer.subscription.deleted": {
        // Handle subscription cancellation
        const subscription = event.data.object;
        const userId = subscription.metadata.userId;
        
        if (userId) {
          await supabase
            .from("user_subscriptions")
            .update({
              is_active: false,
              updated_at: new Date().toISOString()
            })
            .eq("user_id", userId);
            
          console.log(`Subscription canceled for user ${userId}`);
        }
        break;
      }
    }
    
    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);
