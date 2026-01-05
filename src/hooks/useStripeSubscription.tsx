import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface StripeSubscriptionStatus {
  subscribed: boolean;
  plan: "monthly" | "annual" | null;
  subscription_end: string | null;
  status: "active" | "canceled" | "past_due" | "none" | string;
}

export function useStripeSubscription() {
  const { user, isAuthenticated } = useAuth();
  const [subscription, setSubscription] = useState<StripeSubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkSubscription = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setSubscription(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fnError } = await supabase.functions.invoke("check-subscription");

      if (fnError) {
        throw new Error(fnError.message);
      }

      setSubscription(data as StripeSubscriptionStatus);
    } catch (err) {
      console.error("Error checking subscription:", err);
      setError(err instanceof Error ? err.message : "Error checking subscription");
      setSubscription(null);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      checkSubscription();
    }, 60000);

    return () => clearInterval(interval);
  }, [isAuthenticated, checkSubscription]);

  const createCheckout = async (plan: "monthly" | "annual") => {
    try {
      const { data, error: fnError } = await supabase.functions.invoke("create-checkout", {
        body: { plan },
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

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

      if (fnError) {
        throw new Error(fnError.message);
      }

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
    error,
    checkSubscription,
    createCheckout,
    openCustomerPortal,
  };
}
