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

export function useCitiesByState(state: string) {
  return useQuery({
    queryKey: ['cities', 'by-state', state],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cities')
        .select('id, name, slug')
        .eq('state', state)
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!state,
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

export async function findCityByNameAndState(cityName: string, state: string) {
  const { data, error } = await supabase
    .from('cities')
    .select('id, name, slug')
    .ilike('name', cityName)
    .eq('state', state)
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export function useDistributorsByCity(cityId: string | undefined) {
  return useQuery({
    queryKey: ['distributors-by-city', cityId],
    queryFn: async () => {
      if (!cityId) return [];

      // Only select public commercial fields (whatsapp and cnpj are intentionally public)
      const { data, error } = await supabase
        .from('distributors')
        .select(`
          id,
          name,
          slug,
          city_id,
          whatsapp,
          cnpj,
          street,
          number,
          neighborhood,
          zip_code,
          complement,
          delivery_fee,
          min_order_value,
          accepts_pix,
          accepts_card,
          accepts_cash,
          is_active,
          is_verified,
          logo_url,
          meta_title,
          meta_description,
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

      // Only select public commercial fields (whatsapp and cnpj are intentionally public)
      const { data, error } = await supabase
        .from('distributors')
        .select(`
          id,
          name,
          slug,
          city_id,
          whatsapp,
          cnpj,
          street,
          number,
          neighborhood,
          zip_code,
          complement,
          delivery_fee,
          min_order_value,
          accepts_pix,
          accepts_card,
          accepts_cash,
          is_active,
          is_verified,
          logo_url,
          meta_title,
          meta_description,
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
