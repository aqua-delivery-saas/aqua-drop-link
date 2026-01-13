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
  logo_url?: string;
}

interface BusinessHoursData {
  [key: string]: { open: string; close: string; active: boolean };
}

interface ProductData {
  brandId: string;
  name: string;
  liters: number;
  price: number;
}

interface CreateDistributorInput {
  distributor: DistributorData;
  businessHours?: BusinessHoursData;
  products?: ProductData[];
}

const generateSeoData = (distributor: DistributorData) => {
  const city = distributor.city || '';
  const neighborhood = distributor.neighborhood || '';
  const state = distributor.state || '';
  
  // Meta Title: Nome - Água Mineral em Cidade (máx 60 chars)
  const baseTitle = `${distributor.name} - Água Mineral em ${city}`;
  const meta_title = baseTitle.length > 60 
    ? `${distributor.name} - ${city}`.slice(0, 60)
    : baseTitle;
  
  // Meta Description: Descrição atrativa (máx 160 chars)
  const baseDescription = neighborhood
    ? `Distribuidora de água mineral em ${neighborhood}, ${city} - ${state}. Entrega rápida de galões. Peça agora pelo WhatsApp!`
    : `Distribuidora de água mineral em ${city} - ${state}. Entrega rápida de galões de água. Peça agora pelo WhatsApp!`;
  const meta_description = baseDescription.slice(0, 160);
  
  // Meta Keywords: Palavras-chave relevantes
  const keywords = [
    'água mineral',
    'galão de água',
    'entrega de água',
    'distribuidora de água',
    city.toLowerCase(),
    neighborhood?.toLowerCase(),
  ].filter(Boolean).join(', ');
  
  return { meta_title, meta_description, meta_keywords: keywords };
};

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

      // Generate SEO data automatically
      const seoData = generateSeoData(data.distributor);

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
          logo_url: data.distributor.logo_url || null,
          is_active: true,
          is_verified: false,
          meta_title: seoData.meta_title,
          meta_description: seoData.meta_description,
          meta_keywords: seoData.meta_keywords,
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
          brand_id: product.brandId,
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
