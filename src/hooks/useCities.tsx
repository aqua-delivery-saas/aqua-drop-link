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
      // Filter by active subscription to hide distributors without confirmed subscription
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
          subscriptions!inner (
            status,
            expires_at
          )
        `)
        .eq('city_id', cityId)
        .eq('is_active', true)
        .eq('subscriptions.status', 'active');

      if (error) throw error;
      
      // Filter in JS to handle NULL expires_at as valid (no expiration set = valid)
      // Normalize subscriptions: can be array (many-to-one) or object (one-to-one)
      const now = new Date();
      const validDistributors = data?.filter(d => {
        const sub = Array.isArray(d.subscriptions) ? d.subscriptions[0] : d.subscriptions;
        if (!sub) return false;
        // NULL expires_at = subscription without expiration = valid
        if (!sub.expires_at) return true;
        return new Date(sub.expires_at) >= now;
      }) || [];

      return validDistributors;
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
      // Filter by active subscription to hide distributors without confirmed subscription
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
          pix_key,
          is_active,
          is_verified,
          logo_url,
          meta_title,
          meta_description,
          business_hours (*),
          products (*),
          discount_rules (*),
          loyalty_programs (*),
          subscriptions!inner (
            status,
            expires_at
          )
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .eq('subscriptions.status', 'active')
        .maybeSingle();

      if (error) throw error;
      
      // Validate expiration in JS to handle NULL expires_at as valid
      // Normalize subscriptions: can be array (many-to-one) or object (one-to-one)
      if (data) {
        const sub = Array.isArray(data.subscriptions) ? data.subscriptions[0] : data.subscriptions;
        if (!sub) return null;
        // NULL expires_at = subscription without expiration = valid
        if (sub.expires_at && new Date(sub.expires_at) < new Date()) {
          return null; // Expired
        }
      }
      
      return data;
    },
    enabled: !!slug,
  });
}
