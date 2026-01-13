import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface CustomerLoyaltyPoints {
  id: string;
  customer_id: string;
  distributor_id: string;
  total_points: number;
  redeemed_points: number;
  available_points: number;
  last_order_at: string | null;
  created_at: string;
  updated_at: string;
}

interface LoyaltyProgram {
  id: string;
  distributor_id: string;
  is_enabled: boolean;
  points_per_order: number;
  reward_threshold: number;
  min_order_value: number | null;
  program_name: string | null;
  description: string | null;
  reward_description: string | null;
}

interface CustomerLoyaltyData {
  points: CustomerLoyaltyPoints | null;
  program: LoyaltyProgram | null;
}

export function useCustomerLoyaltyPoints(distributorId: string | undefined) {
  const { user } = useAuth();

  return useQuery<CustomerLoyaltyData>({
    queryKey: ['customer-loyalty-points', distributorId, user?.id],
    queryFn: async () => {
      if (!user?.id || !distributorId) {
        return { points: null, program: null };
      }

      // Fetch loyalty program for this distributor
      const { data: program, error: programError } = await supabase
        .from('loyalty_programs')
        .select('*')
        .eq('distributor_id', distributorId)
        .eq('is_enabled', true)
        .maybeSingle();

      if (programError) {
        console.error('Error fetching loyalty program:', programError);
      }

      // If no active program, return early
      if (!program) {
        return { points: null, program: null };
      }

      // Fetch customer's points for this distributor
      const { data: points, error: pointsError } = await supabase
        .from('customer_loyalty_points')
        .select('*')
        .eq('customer_id', user.id)
        .eq('distributor_id', distributorId)
        .maybeSingle();

      if (pointsError) {
        console.error('Error fetching customer loyalty points:', pointsError);
      }

      return {
        points: points as CustomerLoyaltyPoints | null,
        program: program as LoyaltyProgram,
      };
    },
    enabled: !!user?.id && !!distributorId,
  });
}

// Hook to get all loyalty points for a customer across all distributors
export function useAllCustomerLoyaltyPoints() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['all-customer-loyalty-points', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('customer_loyalty_points')
        .select(`
          *,
          distributors:distributor_id (
            id,
            name,
            slug
          )
        `)
        .eq('customer_id', user.id)
        .order('last_order_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });
}
