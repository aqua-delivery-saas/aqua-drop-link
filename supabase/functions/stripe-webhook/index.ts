import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!stripeKey || !webhookSecret) {
      logStep("ERROR: Missing Stripe configuration");
      return new Response(JSON.stringify({ error: "Missing Stripe configuration" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      logStep("ERROR: Missing Supabase configuration");
      return new Response(JSON.stringify({ error: "Missing Supabase configuration" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    // Get the raw body for signature verification
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      logStep("ERROR: Missing stripe-signature header");
      return new Response(JSON.stringify({ error: "Missing stripe-signature header" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
      logStep("Webhook signature verified", { eventType: event.type, eventId: event.id });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      logStep("ERROR: Webhook signature verification failed", { error: message });
      return new Response(JSON.stringify({ error: `Webhook signature verification failed: ${message}` }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Handle relevant subscription events
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("Processing subscription event", {
          eventType: event.type,
          subscriptionId: subscription.id,
          status: subscription.status,
          customerId: subscription.customer,
        });

        // Get customer email to find the user
        const customerId = typeof subscription.customer === "string" 
          ? subscription.customer 
          : subscription.customer.id;
        
        const customer = await stripe.customers.retrieve(customerId);
        
        if (customer.deleted) {
          logStep("Customer was deleted, skipping");
          break;
        }

        const customerEmail = customer.email;
        if (!customerEmail) {
          logStep("ERROR: Customer has no email", { customerId });
          break;
        }

        logStep("Found customer", { email: customerEmail });

        // Find the user by email
        const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
        
        if (userError) {
          logStep("ERROR: Failed to list users", { error: userError.message });
          break;
        }

        const user = userData.users.find((u) => u.email === customerEmail);
        if (!user) {
          logStep("User not found for email", { email: customerEmail });
          break;
        }

        logStep("Found user", { userId: user.id });

        // Find the distributor for this user
        const { data: distributor, error: distError } = await supabase
          .from("distributors")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (distError || !distributor) {
          logStep("Distributor not found for user", { userId: user.id, error: distError?.message });
          break;
        }

        logStep("Found distributor", { distributorId: distributor.id });

        // Determine the subscription status and plan
        const isActive = subscription.status === "active" || subscription.status === "trialing";
        const productId = subscription.items?.data?.[0]?.price?.product as string;
        
        // Map Stripe status to our status
        let ourStatus: "active" | "pending" | "expired" | "canceled" = "pending";
        if (subscription.status === "active" || subscription.status === "trialing") {
          ourStatus = "active";
        } else if (subscription.status === "canceled" || subscription.status === "unpaid") {
          ourStatus = "canceled";
        } else if (subscription.status === "past_due") {
          ourStatus = "pending";
        }

        // Determine plan type based on product ID (from check-subscription)
        const PRODUCTS = {
          monthly: "prod_SMTfWfq7TlJx98",
          annual: "prod_SMTgC8sOD0Whoh",
        };

        let plan: "monthly" | "annual" = "monthly";
        if (productId === PRODUCTS.annual) {
          plan = "annual";
        }

        const price = plan === "monthly" ? 34.99 : 349.0;

        // Check if subscription exists
        const { data: existingSub } = await supabase
          .from("subscriptions")
          .select("id")
          .eq("distributor_id", distributor.id)
          .single();

        if (event.type === "customer.subscription.deleted") {
          // Mark as canceled
          if (existingSub) {
            const { error: updateError } = await supabase
              .from("subscriptions")
              .update({
                status: "canceled",
                canceled_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq("id", existingSub.id);

            if (updateError) {
              logStep("ERROR: Failed to update subscription", { error: updateError.message });
            } else {
              logStep("Subscription marked as canceled", { subscriptionId: existingSub.id });
            }

            // Create notification for canceled subscription
            await supabase.from("notifications").insert({
              user_id: user.id,
              type: "subscription_expired",
              title: "Assinatura cancelada",
              message: "Sua assinatura foi cancelada. Assine novamente para continuar usando o sistema.",
              link: "/distributor/subscription",
            });
          }
        } else {
          // Create or update subscription
          const subscriptionData = {
            plan,
            price,
            status: ourStatus,
            started_at: subscription.start_date
              ? new Date(subscription.start_date * 1000).toISOString()
              : new Date().toISOString(),
            expires_at: subscription.current_period_end
              ? new Date(subscription.current_period_end * 1000).toISOString()
              : null,
            canceled_at: subscription.canceled_at
              ? new Date(subscription.canceled_at * 1000).toISOString()
              : null,
            updated_at: new Date().toISOString(),
          };

          if (existingSub) {
            const { error: updateError } = await supabase
              .from("subscriptions")
              .update(subscriptionData)
              .eq("id", existingSub.id);

            if (updateError) {
              logStep("ERROR: Failed to update subscription", { error: updateError.message });
            } else {
              logStep("Subscription updated", { subscriptionId: existingSub.id, status: ourStatus });
            }
          } else {
            const { error: insertError } = await supabase.from("subscriptions").insert({
              distributor_id: distributor.id,
              ...subscriptionData,
            });

            if (insertError) {
              logStep("ERROR: Failed to create subscription", { error: insertError.message });
            } else {
              logStep("Subscription created", { distributorId: distributor.id, status: ourStatus });
            }
          }

          // Create notification for new/updated subscription
          if (event.type === "customer.subscription.created" && ourStatus === "active") {
            await supabase.from("notifications").insert({
              user_id: user.id,
              type: "system_update",
              title: "Assinatura ativada!",
              message: `Sua assinatura ${plan === "monthly" ? "mensal" : "anual"} foi ativada com sucesso.`,
              link: "/distributor/subscription",
            });
          }
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        logStep("Invoice payment succeeded", {
          invoiceId: invoice.id,
          customerId: invoice.customer,
          amountPaid: invoice.amount_paid,
        });

        // Get customer to find user
        const customerId = typeof invoice.customer === "string" 
          ? invoice.customer 
          : invoice.customer?.id;

        if (!customerId) {
          logStep("No customer ID on invoice");
          break;
        }

        const customer = await stripe.customers.retrieve(customerId);
        if (customer.deleted || !customer.email) {
          logStep("Customer deleted or no email");
          break;
        }

        // Find user and distributor
        const { data: userData } = await supabase.auth.admin.listUsers();
        const user = userData?.users.find((u) => u.email === customer.email);
        
        if (!user) {
          logStep("User not found", { email: customer.email });
          break;
        }

        const { data: distributor } = await supabase
          .from("distributors")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (!distributor) {
          logStep("Distributor not found", { userId: user.id });
          break;
        }

        // Get subscription for this distributor
        const { data: subscription } = await supabase
          .from("subscriptions")
          .select("id")
          .eq("distributor_id", distributor.id)
          .single();

        if (!subscription) {
          logStep("Subscription not found", { distributorId: distributor.id });
          break;
        }

        // Record payment
        const { error: paymentError } = await supabase.from("payments").insert({
          subscription_id: subscription.id,
          amount: invoice.amount_paid / 100, // Convert from cents
          status: "paid",
          payment_method: "Stripe",
          paid_at: new Date().toISOString(),
          reference_period_start: invoice.period_start
            ? new Date(invoice.period_start * 1000).toISOString()
            : null,
          reference_period_end: invoice.period_end
            ? new Date(invoice.period_end * 1000).toISOString()
            : null,
        });

        if (paymentError) {
          logStep("ERROR: Failed to record payment", { error: paymentError.message });
        } else {
          logStep("Payment recorded", { subscriptionId: subscription.id });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        logStep("Invoice payment failed", {
          invoiceId: invoice.id,
          customerId: invoice.customer,
        });

        // Get customer to find user
        const customerId = typeof invoice.customer === "string" 
          ? invoice.customer 
          : invoice.customer?.id;

        if (!customerId) break;

        const customer = await stripe.customers.retrieve(customerId);
        if (customer.deleted || !customer.email) break;

        // Find user
        const { data: userData } = await supabase.auth.admin.listUsers();
        const user = userData?.users.find((u) => u.email === customer.email);
        
        if (user) {
          // Create notification for failed payment
          await supabase.from("notifications").insert({
            user_id: user.id,
            type: "payment_failed",
            title: "Falha no pagamento",
            message: "Houve um problema com seu pagamento. Atualize seu método de pagamento para evitar a suspensão.",
            link: "/distributor/subscription",
          });
          logStep("Payment failed notification created", { userId: user.id });
        }
        break;
      }

      default:
        logStep("Unhandled event type", { eventType: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logStep("ERROR: Unhandled exception", { error: message });
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
