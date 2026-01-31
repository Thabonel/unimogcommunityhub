
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.5.0?dts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.32.0";

function logStep(step: string, details?: any) {
  console.log(`[STRIPE-WEBHOOK] ${step}${details ? ` - ${JSON.stringify(details)}` : ''}`);
}

const handler = async (req: Request): Promise<Response> => {
  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2023-10-16",
  });

  const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return new Response("Webhook signature missing", { status: 400 });
    }

    const body = await req.text();
    const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";
    let event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed:`, err);
      return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 });
    }

    logStep("Event received", { type: event.type });

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        if (session.payment_status === "paid") {
          const paymentType = session.metadata?.type || session.metadata?.planType || 'subscription';

          // For donations, user_id is optional (anonymous donations allowed)
          // For other payment types, user_id is required
          if (paymentType === 'donation') {
            // Handle one-time donation (authenticated or anonymous)
            const userId = session.metadata?.userId || null;
            const donationRef = session.metadata?.donation_ref || session.client_reference_id;
            const amount = parseFloat(session.metadata?.amount || '0');
            const donorName = session.metadata?.donor_name || null;
            const donorEmail = session.metadata?.donor_email || session.customer_email || null;
            const message = session.metadata?.message || null;
            const isAnonymous = session.metadata?.is_anonymous === 'true' || !donorName;

            logStep("Processing donation", {
              donationRef,
              amount,
              hasUserId: !!userId,
              donorEmail: donorEmail ? 'provided' : 'none'
            });

            const { error: donationError } = await supabase
              .from("donations")
              .insert({
                user_id: userId || null,
                amount,
                currency: session.currency?.toUpperCase() || 'AUD',
                donor_name: isAnonymous ? null : donorName,
                donor_email: donorEmail,
                message: isAnonymous ? null : message,
                is_anonymous: isAnonymous,
                stripe_session_id: session.id,
                stripe_payment_intent_id: session.payment_intent,
              });

            if (donationError) {
              logStep("Error inserting donation", { error: donationError.message });
            } else {
              logStep("Donation recorded", { amount, userId: userId || 'anonymous', donationRef });
            }
          } else {
            // Non-donation payments require user_id
            const userId = session.client_reference_id || session.metadata?.userId;

            if (!userId) {
              logStep("Error: User ID not found in session");
              return new Response("User ID not found in session", { status: 400 });
            }

            logStep("Processing payment", { userId, paymentType, sessionId: session.id });

            switch (paymentType) {

            case 'supporter': {
              // Handle supporter subscription
              const tier = session.metadata?.tier || 'supporter';
              const isAnnual = session.metadata?.isAnnual === 'true';
              const publicName = session.metadata?.public_name || null;
              const supporterMessage = session.metadata?.message || null;
              const showPublicly = session.metadata?.show_publicly !== 'false';

              // Calculate monthly amount based on tier
              const tierAmounts: Record<string, number> = {
                supporter: 5,
                patron: 15,
                champion: 25,
              };
              const monthlyAmount = tierAmounts[tier] || 5;

              // Check if supporter record exists
              const { data: existingSupporter } = await supabase
                .from("community_supporters")
                .select("*")
                .eq("user_id", userId)
                .maybeSingle();

              if (existingSupporter) {
                await supabase
                  .from("community_supporters")
                  .update({
                    tier,
                    monthly_amount: monthlyAmount,
                    is_annual: isAnnual,
                    is_active: true,
                    stripe_subscription_id: session.subscription,
                    stripe_customer_id: session.customer,
                    public_name: publicName,
                    supporter_message: supporterMessage,
                    show_publicly: showPublicly,
                    updated_at: new Date().toISOString(),
                  })
                  .eq("user_id", userId);
              } else {
                await supabase
                  .from("community_supporters")
                  .insert({
                    user_id: userId,
                    tier,
                    monthly_amount: monthlyAmount,
                    currency: 'AUD',
                    is_annual: isAnnual,
                    is_active: true,
                    stripe_subscription_id: session.subscription,
                    stripe_customer_id: session.customer,
                    public_name: publicName,
                    supporter_message: supporterMessage,
                    show_publicly: showPublicly,
                  });
              }

              logStep("Supporter subscription created/updated", { tier, userId });
              break;
            }

            case 'vendor': {
              // Handle vendor subscription
              const tier = session.metadata?.tier || 'basic';
              const businessName = session.metadata?.business_name || '';
              const contactEmail = session.metadata?.contact_email || '';

              const tierAmounts: Record<string, number> = {
                basic: 50,
                featured: 100,
                premium: 150,
              };
              const monthlyFee = tierAmounts[tier] || 50;

              // Check if vendor record exists
              const { data: existingVendor } = await supabase
                .from("commercial_vendors")
                .select("*")
                .eq("user_id", userId)
                .maybeSingle();

              if (existingVendor) {
                await supabase
                  .from("commercial_vendors")
                  .update({
                    tier,
                    monthly_fee: monthlyFee,
                    is_active: true,
                    stripe_subscription_id: session.subscription,
                    stripe_customer_id: session.customer,
                    business_name: businessName || existingVendor.business_name,
                    contact_email: contactEmail || existingVendor.contact_email,
                    updated_at: new Date().toISOString(),
                  })
                  .eq("user_id", userId);
              } else {
                await supabase
                  .from("commercial_vendors")
                  .insert({
                    user_id: userId,
                    tier,
                    monthly_fee: monthlyFee,
                    business_name: businessName,
                    contact_email: contactEmail,
                    is_active: true,
                    is_approved: false, // Requires admin approval
                    stripe_subscription_id: session.subscription,
                    stripe_customer_id: session.customer,
                  });
              }

              logStep("Vendor subscription created/updated", { tier, userId });
              break;
            }

            default: {
              // Legacy subscription handling
              const planType = session.metadata?.planType || paymentType;

              let expiresAt = null;
              if (planType !== "lifetime") {
                const date = new Date();
                date.setMonth(date.getMonth() + 1);
                expiresAt = date.toISOString();
              }

              const { data: existingSubscription } = await supabase
                .from("user_subscriptions")
                .select("*")
                .eq("user_id", userId)
                .maybeSingle();

              if (existingSubscription) {
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

              logStep("Subscription created/updated", { planType, userId });
              break;
            }
            }
          }
        }
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object;
        if (!invoice.subscription) break;

        const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
        const userId = subscription.metadata?.userId;
        const paymentType = subscription.metadata?.type;

        if (!userId) break;

        logStep("Processing invoice.paid", { userId, paymentType });

        if (paymentType === 'supporter') {
          // Renew supporter subscription
          await supabase
            .from("community_supporters")
            .update({
              is_active: true,
              updated_at: new Date().toISOString()
            })
            .eq("user_id", userId);
        } else if (paymentType === 'vendor') {
          // Renew vendor subscription
          const nextBillingDate = new Date();
          nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

          await supabase
            .from("commercial_vendors")
            .update({
              is_active: true,
              next_billing_date: nextBillingDate.toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq("user_id", userId);
        } else {
          // Legacy subscription renewal
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
        }

        logStep("Subscription renewed", { userId, paymentType });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;
        const paymentType = subscription.metadata?.type;

        if (!userId) break;

        logStep("Processing subscription.deleted", { userId, paymentType });

        if (paymentType === 'supporter') {
          await supabase
            .from("community_supporters")
            .update({
              is_active: false,
              updated_at: new Date().toISOString()
            })
            .eq("user_id", userId);
        } else if (paymentType === 'vendor') {
          await supabase
            .from("commercial_vendors")
            .update({
              is_active: false,
              updated_at: new Date().toISOString()
            })
            .eq("user_id", userId);
        } else {
          await supabase
            .from("user_subscriptions")
            .update({
              is_active: false,
              updated_at: new Date().toISOString()
            })
            .eq("user_id", userId);
        }

        logStep("Subscription canceled", { userId, paymentType });
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
