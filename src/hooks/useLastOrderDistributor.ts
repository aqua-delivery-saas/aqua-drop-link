import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { clearLastOrderDistributor, getLastOrderDistributor, saveLastOrderDistributor } from "@/lib/lastOrderDistributor";

export function useLastOrderDistributor() {
  const { user, isLoading } = useAuth();
  const userId = user?.id ?? null;
  const { data } = useQuery({
    queryKey: ["last-order-distributor", userId],
    enabled: !isLoading,
    queryFn: async () => {
      if (!userId) return getLastOrderDistributor(null);

      const { data: order, error } = await supabase
        .from("orders")
        .select("distributors:distributor_id (id, name, slug)")
        .eq("customer_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) return getLastOrderDistributor(userId);
      const distributor = Array.isArray(order?.distributors) ? order.distributors[0] : order?.distributors;
      if (distributor?.id && distributor?.name && distributor?.slug) {
        const last = { id: distributor.id, name: distributor.name, slug: distributor.slug };
        saveLastOrderDistributor(userId, last);
        return last;
      }
      clearLastOrderDistributor(userId);
      return null;
    },
  });

  return isLoading ? null : data ?? null;
}