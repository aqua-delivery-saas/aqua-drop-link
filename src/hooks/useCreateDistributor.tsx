import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface DistributorData {
  name: string;
  cnpj?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  city_id?: string | null;
  state?: string;
  zip_code?: string;
}

interface BusinessHoursData {
  [key: string]: { open: string; close: string; active: boolean };
}

interface ProductData {
  name: string;
  liters: number;
  price: number;
}

interface CreateDistributorInput {
  distributor: DistributorData;
  businessHours?: BusinessHoursData;
  products?: ProductData[];
}

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
};

const generateCitySlug = (cityName: string, state: string): string => {
  return `${cityName}-${state}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

const dayNameToNumber: { [key: string]: number } = {
  // English keys (from OnboardingStep2)
  'sunday': 0,
  'monday': 1,
  'tuesday': 2,
  'wednesday': 3,
  'thursday': 4,
  'friday': 5,
  'saturday': 6,
  // Portuguese keys (fallback)
  'domingo': 0,
  'segunda': 1,
  'terca': 2,
  'quarta': 3,
  'quinta': 4,
  'sexta': 5,
  'sabado': 6,
};

export function useCreateDistributor() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateDistributorInput) => {
      if (!user?.id) throw new Error('Usuário não autenticado');

      // 1. Resolve city_id
      let cityId = data.distributor.city_id || null;
      
      if (!cityId && data.distributor.city && data.distributor.state) {
        // Try to find existing city by name and state (case insensitive)
        const { data: existingCity } = await supabase
          .from('cities')
          .select('id')
          .ilike('name', data.distributor.city)
          .eq('state', data.distributor.state)
          .maybeSingle();
        
        if (existingCity) {
          cityId = existingCity.id;
        } else {
          // Create new city
          const citySlug = generateCitySlug(data.distributor.city, data.distributor.state);
          const { data: newCity, error: cityError } = await supabase
            .from('cities')
            .insert({
              name: data.distributor.city,
              state: data.distributor.state,
              slug: citySlug,
              is_active: true,
            })
            .select('id')
            .single();
          
          if (cityError) {
            console.error('Error creating city:', cityError);
            // Continue without city_id if creation fails
          } else {
            cityId = newCity.id;
          }
        }
      }

      // 2. Create distributor
      const slug = generateSlug(data.distributor.name);
      
      const { data: distributor, error: distributorError } = await supabase
        .from('distributors')
        .insert({
          user_id: user.id,
          name: data.distributor.name,
          slug,
          cnpj: data.distributor.cnpj || null,
          phone: data.distributor.phone || null,
          whatsapp: data.distributor.whatsapp || null,
          email: data.distributor.email || null,
          street: data.distributor.street || null,
          number: data.distributor.number || null,
          complement: data.distributor.complement || null,
          neighborhood: data.distributor.neighborhood || null,
          zip_code: data.distributor.zip_code || null,
          city_id: cityId,
          is_active: true,
          is_verified: false,
        })
        .select()
        .single();

      if (distributorError) {
        console.error('Error creating distributor:', distributorError);
        throw new Error(`Erro ao criar distribuidora: ${distributorError.message}`);
      }

      // 2. Create business hours if provided
      if (data.businessHours) {
        const businessHoursInserts = Object.entries(data.businessHours).map(([day, hours]) => ({
          distributor_id: distributor.id,
          day_of_week: dayNameToNumber[day] ?? parseInt(day, 10),
          is_open: hours.active,
          open_time: hours.active ? hours.open : null,
          close_time: hours.active ? hours.close : null,
        }));

        const { error: hoursError } = await supabase
          .from('business_hours')
          .insert(businessHoursInserts);

        if (hoursError) {
          console.error('Error creating business hours:', hoursError);
          // Don't throw, just log - distributor is already created
        }
      }

      // 3. Create products if provided
      if (data.products && data.products.length > 0) {
        const productsInserts = data.products.map((product, index) => ({
          distributor_id: distributor.id,
          name: product.name,
          liters: product.liters,
          price: product.price,
          is_available: true,
          sort_order: index,
        }));

        const { error: productsError } = await supabase
          .from('products')
          .insert(productsInserts);

        if (productsError) {
          console.error('Error creating products:', productsError);
          // Don't throw, just log - distributor is already created
        }
      }

      return distributor;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['distributor'] });
      toast.success('Distribuidora cadastrada com sucesso!');
    },
    onError: (error) => {
      console.error('Create distributor error:', error);
      toast.error('Erro ao cadastrar distribuidora', { description: error.message });
    },
  });
}
