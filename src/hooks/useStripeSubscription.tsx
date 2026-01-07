import { useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useDistributor } from "@/hooks/useDistributor";

interface SubscriptionData {
  subscribed: boolean;
  plan: "monthly" | "annual" | null;
  subscription_end: string | null;
  status: "active" | "canceled" | "past_due" | "none" | string;
}

export function useStripeSubscription() {
  const { data: distributor } = useDistributor();
  const queryClient = useQueryClient();

  // Query local database instead of Stripe API
  const { data: dbSubscription, isLoading, error } = useQuery({
    queryKey: ["subscription", distributor?.id],
    queryFn: async () => {
      if (!distributor?.id) return null;
      
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("distributor_id", distributor.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!distributor?.id,
  });

  // Transform DB data to the expected format
  const subscription: SubscriptionData | null = dbSubscription
    ? {
        subscribed: dbSubscription.status === "active",
        plan: dbSubscription.plan,
        subscription_end: dbSubscription.expires_at,
        status: dbSubscription.status,
      }
    : { subscribed: false, plan: null, subscription_end: null, status: "none" };

  // Realtime subscription for instant updates
  useEffect(() => {
    if (!distributor?.id) return;

    const channel = supabase
      .channel("subscription-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "subscriptions",
          filter: `distributor_id=eq.${distributor.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["subscription", distributor.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [distributor?.id, queryClient]);

  // Force check via Stripe API (only for post-checkout verification)
  const forceCheckSubscription = useCallback(async () => {
    try {
      const { data, error: fnError } = await supabase.functions.invoke("check-subscription");

      if (fnError) throw new Error(fnError.message);

      // Invalidate query to refetch from DB (webhook should have updated it)
      if (distributor?.id) {
        queryClient.invalidateQueries({ queryKey: ["subscription", distributor.id] });
      }

      return data;
    } catch (err) {
      console.error("Error checking subscription:", err);
      throw err;
    }
  }, [distributor?.id, queryClient]);

  const createCheckout = async (plan: "monthly" | "annual") => {
    try {
      const { data, error: fnError } = await supabase.functions.invoke("create-checkout", {
        body: { plan },
      });

      if (fnError) throw new Error(fnError.message);

      if (data?.url) {
        window.location.href = data.url;
      }

      return data;
    } catch (err) {
      console.error("Error creating checkout:", err);
      throw err;
    }
  };

  const openCustomerPortal = async () => {
    try {
      const { data, error: fnError } = await supabase.functions.invoke("customer-portal");

      if (fnError) throw new Error(fnError.message);

      if (data?.url) {
        window.open(data.url, "_blank");
      }

      return data;
    } catch (err) {
      console.error("Error opening customer portal:", err);
      throw err;
    }
  };

  return {
    subscription,
    isLoading,
    error: error ? (error as Error).message : null,
    forceCheckSubscription,
    createCheckout,
    openCustomerPortal,
  };
}
