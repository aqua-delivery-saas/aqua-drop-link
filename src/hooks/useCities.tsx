import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export type City = Tables<'cities'>;

export function useCities() {
  return useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });
}

export function useCityBySlug(slug: string) {
  return useQuery({
    queryKey: ['city', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}

export function useDistributorsByCity(cityId: string | undefined) {
  return useQuery({
    queryKey: ['distributors-by-city', cityId],
    queryFn: async () => {
      if (!cityId) return [];

      const { data, error } = await supabase
        .from('distributors')
        .select(`
          *,
          business_hours (*),
          products (*)
        `)
        .eq('city_id', cityId)
        .eq('is_active', true);

      if (error) throw error;
      return data || [];
    },
    enabled: !!cityId,
  });
}

export function useDistributorBySlug(slug: string) {
  return useQuery({
    queryKey: ['distributor-by-slug', slug],
    queryFn: async () => {
      if (!slug) return null;

      const { data, error } = await supabase
        .from('distributors')
        .select(`
          *,
          business_hours (*),
          products (*),
          discount_rules (*),
          loyalty_programs (*)
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}
