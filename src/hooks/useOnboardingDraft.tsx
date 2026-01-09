import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Json } from "@/integrations/supabase/types";

export interface OnboardingDraftData {
  id: string;
  user_id: string;
  current_step: number;
  distributor_data: {
    name?: string;
    cnpj?: string;
    phone?: string;
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    zip_code?: string;
    city?: string;
    state?: string;
    city_id?: string | null;
  } | null;
  business_hours_data: {
    [key: string]: { open: string; close: string; active: boolean };
  } | null;
  brands_data: Array<{
    id: string;
    nome: string;
    litros: number;
    logo?: string;
    preco?: number;
  }> | null;
  products_data: Array<{
    id: string;
    nome: string;
    litros: number;
    logo?: string;
    preco?: number;
  }> | null;
  created_at: string;
  updated_at: string;
}

interface SaveDraftInput {
  current_step: number;
  distributor_data?: OnboardingDraftData["distributor_data"];
  business_hours_data?: OnboardingDraftData["business_hours_data"];
  brands_data?: OnboardingDraftData["brands_data"];
  products_data?: OnboardingDraftData["products_data"];
}

// Hook para buscar o draft do onboarding
export function useOnboardingDraft() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["onboarding-draft", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("onboarding_drafts")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) return null;

      // Cast the JSON fields to proper types
      return {
        ...data,
        distributor_data: data.distributor_data as OnboardingDraftData["distributor_data"],
        business_hours_data: data.business_hours_data as OnboardingDraftData["business_hours_data"],
        brands_data: data.brands_data as OnboardingDraftData["brands_data"],
        products_data: data.products_data as OnboardingDraftData["products_data"],
      } as OnboardingDraftData;
    },
    enabled: !!user?.id,
  });
}

// Hook para salvar/atualizar o draft
export function useSaveOnboardingDraft() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: SaveDraftInput) => {
      if (!user?.id) throw new Error("Usuário não autenticado");

      // Check if draft exists
      const { data: existingDraft } = await supabase
        .from("onboarding_drafts")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingDraft) {
        // Update existing draft
        const { data, error } = await supabase
          .from("onboarding_drafts")
          .update({
            current_step: input.current_step,
            distributor_data: input.distributor_data as unknown as Json,
            business_hours_data: input.business_hours_data as unknown as Json,
            brands_data: input.brands_data as unknown as Json,
            products_data: input.products_data as unknown as Json,
          })
          .eq("user_id", user.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Insert new draft
        const { data, error } = await supabase
          .from("onboarding_drafts")
          .insert({
            user_id: user.id,
            current_step: input.current_step,
            distributor_data: input.distributor_data as unknown as Json,
            business_hours_data: input.business_hours_data as unknown as Json,
            brands_data: input.brands_data as unknown as Json,
            products_data: input.products_data as unknown as Json,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding-draft", user?.id] });
    },
  });
}

// Hook para deletar o draft após conclusão do onboarding
export function useDeleteOnboardingDraft() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from("onboarding_drafts")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding-draft", user?.id] });
    },
  });
}
