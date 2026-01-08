import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Brand {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

interface BrandFormData {
  name: string;
  description?: string;
  logo_url?: string;
  is_active: boolean;
}

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Brand[];
    },
  });
}

export function useCreateBrand() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (formData: BrandFormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('brands')
        .insert({
          name: formData.name,
          description: formData.description || null,
          logo_url: formData.logo_url || null,
          is_active: formData.is_active,
          created_by: user?.id || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast({
        title: 'Marca criada',
        description: `${data.name} foi adicionada com sucesso.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao criar marca',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateBrand() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: BrandFormData }) => {
      const { data, error } = await supabase
        .from('brands')
        .update({
          name: formData.name,
          description: formData.description || null,
          logo_url: formData.logo_url || null,
          is_active: formData.is_active,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast({
        title: 'Marca atualizada',
        description: `${data.name} foi atualizada com sucesso.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao atualizar marca',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteBrand() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (brand: Brand) => {
      const { error } = await supabase
        .from('brands')
        .delete()
        .eq('id', brand.id);

      if (error) throw error;
      return brand;
    },
    onSuccess: (brand) => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast({
        title: 'Marca excluída',
        description: `${brand.name} foi removida com sucesso.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao excluir marca',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
