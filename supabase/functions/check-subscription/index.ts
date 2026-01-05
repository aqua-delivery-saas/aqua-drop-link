import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PRODUCTS = {
  monthly: "prod_TjgnJtXohSvZWq",
  annual: "prod_TjgpJlCgzBvzTw",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Find customer by email
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found, returning unsubscribed state");
      return new Response(JSON.stringify({ 
        subscribed: false,
        plan: null,
        subscription_end: null,
        status: "none"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    // Check for active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      // Check for past_due or canceled subscriptions
      const allSubscriptions = await stripe.subscriptions.list({
        customer: customerId,
        limit: 1,
      });

      if (allSubscriptions.data.length > 0) {
        const sub = allSubscriptions.data[0];
        logStep("Found non-active subscription", { status: sub.status });
        
        return new Response(JSON.stringify({ 
          subscribed: false,
          plan: null,
          subscription_end: null,
          status: sub.status
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      logStep("No subscriptions found");
      return new Response(JSON.stringify({ 
        subscribed: false,
        plan: null,
        subscription_end: null,
        status: "none"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const subscription = subscriptions.data[0];
    logStep("Subscription data", { 
      id: subscription.id,
      current_period_end: subscription.current_period_end,
      items: subscription.items?.data?.length
    });

    // Safely parse the subscription end date
    let subscriptionEnd: string | null = null;
    if (subscription.current_period_end && typeof subscription.current_period_end === 'number') {
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
    }

    const productId = subscription.items?.data?.[0]?.price?.product as string;

    // Determine plan type based on product ID
    let plan: "monthly" | "annual" = "monthly";
    if (productId === PRODUCTS.annual) {
      plan = "annual";
    }

    logStep("Active subscription found", { 
      subscriptionId: subscription.id, 
      plan,
      productId,
      endDate: subscriptionEnd 
    });

    return new Response(JSON.stringify({
      subscribed: true,
      plan: plan,
      subscription_end: subscriptionEnd,
      status: "active"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
