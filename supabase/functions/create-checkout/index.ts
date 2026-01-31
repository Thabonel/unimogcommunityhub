
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

// Supporter tier price IDs (to be configured in environment)
const SUPPORTER_PRICES = {
  supporter_monthly: Deno.env.get("STRIPE_SUPPORTER_MONTHLY_PRICE_ID"),
  supporter_annual: Deno.env.get("STRIPE_SUPPORTER_ANNUAL_PRICE_ID"),
  patron_monthly: Deno.env.get("STRIPE_PATRON_MONTHLY_PRICE_ID"),
  patron_annual: Deno.env.get("STRIPE_PATRON_ANNUAL_PRICE_ID"),
  champion_monthly: Deno.env.get("STRIPE_CHAMPION_MONTHLY_PRICE_ID"),
  champion_annual: Deno.env.get("STRIPE_CHAMPION_ANNUAL_PRICE_ID"),
};

// Vendor tier price IDs
const VENDOR_PRICES = {
  basic: Deno.env.get("STRIPE_VENDOR_BASIC_PRICE_ID"),
  featured: Deno.env.get("STRIPE_VENDOR_FEATURED_PRICE_ID"),
  premium: Deno.env.get("STRIPE_VENDOR_PREMIUM_PRICE_ID"),
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Log environment check
    const hasSupabaseUrl = !!Deno.env.get("SUPABASE_URL");
    const hasAnonKey = !!Deno.env.get("SUPABASE_ANON_KEY");
    const hasStripeKey = !!Deno.env.get("STRIPE_SECRET_KEY");
    logStep("Environment check", { hasSupabaseUrl, hasAnonKey, hasStripeKey });

    const body = await req.json();
    logStep("Request body parsed", { type: body.type, amount: body.amount });
    const {
      type,           // 'donation' | 'supporter' | 'vendor' | 'subscription' | 'lifetime'
      priceId,        // Optional: explicit price ID
      planType,       // Legacy: 'monthly' | 'lifetime'
      tier,           // For supporter/vendor: 'supporter' | 'patron' | 'champion' | 'basic' | 'featured' | 'premium'
      amount,         // For donations: amount in dollars
      isAnnual,       // For supporter: annual billing
      trialDays,
      metadata = {}   // Additional metadata (donor_name, message, donor_email, etc.)
    } = body;

    const checkoutType = type || (planType ? 'subscription' : null);

    if (!checkoutType) {
      throw new Error("Checkout type is required (donation, supporter, vendor, or subscription)");
    }

    logStep("Request parsed", { checkoutType, tier, amount, isAnnual });

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY environment variable is not set");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    logStep("Stripe initialized");

    const origin = req.headers.get("origin") || "https://unimogcommunityhub.com";

    // DONATION TYPE: No authentication required - like Buy Me a Coffee
    if (checkoutType === 'donation') {
      if (!amount || amount < 3) {
        throw new Error("Donation amount must be at least $3");
      }

      // Generate unique donation reference ID
      const donationRef = `donation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Try to get user if authenticated (optional)
      let userId: string | null = null;
      let userEmail: string | null = null;

      const authHeader = req.headers.get("Authorization");
      if (authHeader) {
        try {
          const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
          const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") as string;
          const supabase = createClient(supabaseUrl, supabaseKey);

          const token = authHeader.replace("Bearer ", "");
          const { data: { user } } = await supabase.auth.getUser(token);
          if (user) {
            userId = user.id;
            userEmail = user.email || null;
            logStep("Donation from authenticated user", { userId, email: userEmail });
          }
        } catch (e) {
          logStep("Auth check failed, proceeding as anonymous", { error: e.message });
        }
      }

      logStep("Processing anonymous donation", { amount, donationRef, hasUser: !!userId });

      // Create checkout session without requiring a Stripe customer
      const sessionConfig: Stripe.Checkout.SessionCreateParams = {
        line_items: [{
          price_data: {
            currency: 'aud',
            product_data: {
              name: 'Community Donation',
              description: 'Support the Unimog Community Hub',
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${origin}/dashboard?donation=success`,
        cancel_url: `${origin}/dashboard?donation=canceled`,
        client_reference_id: donationRef,
        metadata: {
          donation_ref: donationRef,
          userId: userId || '',
          type: 'donation',
          amount: amount.toString(),
          donor_name: metadata.donor_name || '',
          donor_email: metadata.donor_email || '',
          message: metadata.message || '',
          is_anonymous: metadata.is_anonymous ? 'true' : 'false',
        },
      };

      // If we have a user email or provided email, pre-fill it
      if (userEmail) {
        sessionConfig.customer_email = userEmail;
      } else if (metadata.donor_email) {
        sessionConfig.customer_email = metadata.donor_email;
      }

      logStep("Creating donation checkout session");
      const session = await stripe.checkout.sessions.create(sessionConfig);

      logStep("Donation checkout session created", {
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
    }

    // ALL OTHER TYPES: Require authentication
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

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

    // Get or create Stripe customer for authenticated flows
    const { data: customers } = await stripe.customers.list({
      email: user.email,
      limit: 1
    });

    let customerId: string;

    if (customers && customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing Stripe customer", { customerId });
    } else {
      const customerResponse = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id }
      });
      customerId = customerResponse.id;
      logStep("Created new Stripe customer", { customerId });
    }

    // Build checkout session based on type
    let sessionConfig: Stripe.Checkout.SessionCreateParams;

    switch (checkoutType) {

      case 'supporter': {
        // Supporter subscription tiers
        const tierKey = `${tier || 'supporter'}_${isAnnual ? 'annual' : 'monthly'}` as keyof typeof SUPPORTER_PRICES;
        const supporterPriceId = priceId || SUPPORTER_PRICES[tierKey];

        if (!supporterPriceId) {
          // Fallback: use price_data for custom amounts
          const tierAmounts: Record<string, number> = {
            supporter: 5,
            patron: 15,
            champion: 25,
          };
          const baseAmount = tierAmounts[tier || 'supporter'] || 5;
          const finalAmount = isAnnual ? Math.round(baseAmount * 12 * 0.85) : baseAmount;

          sessionConfig = {
            customer: customerId,
            line_items: [{
              price_data: {
                currency: 'aud',
                product_data: {
                  name: `Community Supporter - ${(tier || 'supporter').charAt(0).toUpperCase() + (tier || 'supporter').slice(1)}`,
                  description: `Thank you for supporting the Unimog Community!`,
                },
                unit_amount: finalAmount * 100,
                recurring: {
                  interval: isAnnual ? 'year' : 'month',
                },
              },
              quantity: 1,
            }],
            mode: 'subscription',
            success_url: `${origin}/supporter-signup?success=true`,
            cancel_url: `${origin}/supporter-signup?canceled=true`,
            client_reference_id: user.id,
            metadata: {
              userId: user.id,
              type: 'supporter',
              tier: tier || 'supporter',
              isAnnual: isAnnual ? 'true' : 'false',
              public_name: metadata.public_name || '',
              message: metadata.message || '',
              show_publicly: metadata.show_publicly ? 'true' : 'false',
            },
          };
        } else {
          sessionConfig = {
            customer: customerId,
            line_items: [{ price: supporterPriceId, quantity: 1 }],
            mode: 'subscription',
            success_url: `${origin}/supporter-signup?success=true`,
            cancel_url: `${origin}/supporter-signup?canceled=true`,
            client_reference_id: user.id,
            metadata: {
              userId: user.id,
              type: 'supporter',
              tier: tier || 'supporter',
              isAnnual: isAnnual ? 'true' : 'false',
              public_name: metadata.public_name || '',
              message: metadata.message || '',
              show_publicly: metadata.show_publicly ? 'true' : 'false',
            },
          };
        }
        break;
      }

      case 'vendor': {
        // Vendor subscription tiers
        const vendorPriceId = priceId || VENDOR_PRICES[tier as keyof typeof VENDOR_PRICES];

        if (!vendorPriceId) {
          // Fallback: use price_data
          const tierAmounts: Record<string, number> = {
            basic: 50,
            featured: 100,
            premium: 150,
          };
          const vendorAmount = tierAmounts[tier || 'basic'] || 50;

          sessionConfig = {
            customer: customerId,
            line_items: [{
              price_data: {
                currency: 'aud',
                product_data: {
                  name: `Commercial Vendor - ${(tier || 'basic').charAt(0).toUpperCase() + (tier || 'basic').slice(1)}`,
                  description: `Vendor subscription for the Unimog Community Hub`,
                },
                unit_amount: vendorAmount * 100,
                recurring: { interval: 'month' },
              },
              quantity: 1,
            }],
            mode: 'subscription',
            success_url: `${origin}/vendor-application?success=true`,
            cancel_url: `${origin}/vendor-application?canceled=true`,
            client_reference_id: user.id,
            metadata: {
              userId: user.id,
              type: 'vendor',
              tier: tier || 'basic',
              business_name: metadata.business_name || '',
              contact_email: metadata.contact_email || '',
            },
          };
        } else {
          sessionConfig = {
            customer: customerId,
            line_items: [{ price: vendorPriceId, quantity: 1 }],
            mode: 'subscription',
            success_url: `${origin}/vendor-application?success=true`,
            cancel_url: `${origin}/vendor-application?canceled=true`,
            client_reference_id: user.id,
            metadata: {
              userId: user.id,
              type: 'vendor',
              tier: tier || 'basic',
              business_name: metadata.business_name || '',
              contact_email: metadata.contact_email || '',
            },
          };
        }
        break;
      }

      case 'subscription':
      case 'lifetime':
      default: {
        // Legacy subscription flow
        let checkoutPriceId = priceId;
        const legacyPlanType = planType || checkoutType;

        if (!checkoutPriceId) {
          const priceEnvKey = legacyPlanType === 'lifetime'
            ? 'STRIPE_LIFETIME_PRICE_ID'
            : 'STRIPE_STANDARD_PRICE_ID';

          checkoutPriceId = Deno.env.get(priceEnvKey);

          if (!checkoutPriceId) {
            const stripeConfig = JSON.parse(Deno.env.get("STRIPE_CONFIG") || "{}");
            checkoutPriceId = legacyPlanType === 'lifetime'
              ? stripeConfig.lifetimePriceId
              : stripeConfig.premiumMonthlyPriceId;
          }
        }

        if (!checkoutPriceId) {
          throw new Error(`Price ID for ${legacyPlanType} plan is not configured`);
        }

        const mode = legacyPlanType === 'lifetime' ? 'payment' : 'subscription';
        const trialPeriodDays = trialDays && mode === 'subscription' ? parseInt(trialDays) : undefined;

        sessionConfig = {
          customer: customerId,
          line_items: [{ price: checkoutPriceId, quantity: 1 }],
          mode,
          success_url: `${origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/subscription/canceled`,
          client_reference_id: user.id,
          metadata: {
            userId: user.id,
            planType: legacyPlanType,
            type: 'subscription',
          },
          subscription_data: trialPeriodDays ? { trial_period_days: trialPeriodDays } : undefined,
        };
        break;
      }
    }

    logStep("Creating checkout session", { type: checkoutType, mode: sessionConfig.mode });

    const session = await stripe.checkout.sessions.create(sessionConfig);

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
