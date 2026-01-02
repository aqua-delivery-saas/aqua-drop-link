import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from 'sonner';

export type Distributor = Tables<'distributors'>;
export type Product = Tables<'products'>;
export type Order = Tables<'orders'>;
export type OrderItem = Tables<'order_items'>;
export type BusinessHour = Tables<'business_hours'>;
export type DiscountRule = Tables<'discount_rules'>;
export type LoyaltyProgram = Tables<'loyalty_programs'>;
export type Subscription = Tables<'subscriptions'>;
export type Payment = Tables<'payments'>;

export function useDistributor() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['distributor', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('distributors')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
}

export function useUpdateDistributor() {
  const queryClient = useQueryClient();
  const { data: distributor } = useDistributor();

  return useMutation({
    mutationFn: async (updates: TablesUpdate<'distributors'>) => {
      if (!distributor?.id) throw new Error('Distribuidor não encontrado');

      const { data, error } = await supabase
        .from('distributors')
        .update(updates)
        .eq('id', distributor.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['distributor'] });
    },
    onError: (error) => {
      toast.error('Erro ao atualizar dados', { description: error.message });
    },
  });
}

export function useDistributorProducts() {
  const { data: distributor } = useDistributor();

  return useQuery({
    queryKey: ['distributor-products', distributor?.id],
    queryFn: async () => {
      if (!distributor?.id) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('distributor_id', distributor.id)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!distributor?.id,
  });
}

export function useDistributorOrders() {
  const { data: distributor } = useDistributor();

  return useQuery({
    queryKey: ['distributor-orders', distributor?.id],
    queryFn: async () => {
      if (!distributor?.id) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('distributor_id', distributor.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!distributor?.id,
  });
}

export function useDistributorStats() {
  const { data: orders = [] } = useDistributorOrders();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.created_at);
    orderDate.setHours(0, 0, 0, 0);
    return orderDate.getTime() === today.getTime();
  });

  const weekOrders = orders.filter(order => {
    const orderDate = new Date(order.created_at);
    return orderDate >= startOfWeek;
  });

  const monthOrders = orders.filter(order => {
    const orderDate = new Date(order.created_at);
    return orderDate >= startOfMonth;
  });

  const todayRevenue = todayOrders.reduce((sum, order) => sum + Number(order.total), 0);
  const totalRevenue = monthOrders.reduce((sum, order) => sum + Number(order.total), 0);
  const averageTicket = monthOrders.length > 0 ? totalRevenue / monthOrders.length : 0;

  const ordersWithTotal = monthOrders.filter(o => Number(o.total) > 0);
  const minOrder = ordersWithTotal.length > 0 
    ? Math.min(...ordersWithTotal.map(o => Number(o.total))) 
    : 0;
  const maxOrder = ordersWithTotal.length > 0 
    ? Math.max(...ordersWithTotal.map(o => Number(o.total))) 
    : 0;

  return {
    todayOrders: todayOrders.length,
    weekOrders: weekOrders.length,
    monthOrders: monthOrders.length,
    todayRevenue,
    totalRevenue,
    averageTicket,
    minOrder,
    maxOrder,
    recentOrders: orders.slice(0, 5),
  };
}

// Business Hours hooks
export function useDistributorBusinessHours() {
  const { data: distributor } = useDistributor();

  return useQuery({
    queryKey: ['distributor-business-hours', distributor?.id],
    queryFn: async () => {
      if (!distributor?.id) return [];
      
      const { data, error } = await supabase
        .from('business_hours')
        .select('*')
        .eq('distributor_id', distributor.id)
        .order('day_of_week', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!distributor?.id,
  });
}

export function useSaveBusinessHours() {
  const queryClient = useQueryClient();
  const { data: distributor } = useDistributor();

  return useMutation({
    mutationFn: async (hours: { day_of_week: number; open_time: string | null; close_time: string | null; is_open: boolean }[]) => {
      if (!distributor?.id) throw new Error('Distribuidor não encontrado');

      // Delete existing and insert new
      await supabase
        .from('business_hours')
        .delete()
        .eq('distributor_id', distributor.id);

      const { data, error } = await supabase
        .from('business_hours')
        .insert(hours.map(h => ({ ...h, distributor_id: distributor.id })))
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['distributor-business-hours'] });
      toast.success('Horários salvos com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao salvar horários', { description: error.message });
    },
  });
}

// Discount Rules hooks
export function useDistributorDiscountRules() {
  const { data: distributor } = useDistributor();

  return useQuery({
    queryKey: ['distributor-discount-rules', distributor?.id],
    queryFn: async () => {
      if (!distributor?.id) return [];
      
      const { data, error } = await supabase
        .from('discount_rules')
        .select('*')
        .eq('distributor_id', distributor.id)
        .order('min_quantity', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!distributor?.id,
  });
}

export function useSaveDiscountRules() {
  const queryClient = useQueryClient();
  const { data: distributor } = useDistributor();

  return useMutation({
    mutationFn: async (rules: { min_quantity: number; max_quantity: number | null; discount_percent: number }[]) => {
      if (!distributor?.id) throw new Error('Distribuidor não encontrado');

      // Delete existing and insert new
      await supabase
        .from('discount_rules')
        .delete()
        .eq('distributor_id', distributor.id);

      if (rules.length === 0) return [];

      const { data, error } = await supabase
        .from('discount_rules')
        .insert(rules.map(r => ({ ...r, distributor_id: distributor.id })))
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['distributor-discount-rules'] });
      toast.success('Regras de desconto salvas com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao salvar regras', { description: error.message });
    },
  });
}

// Loyalty Program hooks
export function useDistributorLoyaltyProgram() {
  const { data: distributor } = useDistributor();

  return useQuery({
    queryKey: ['distributor-loyalty-program', distributor?.id],
    queryFn: async () => {
      if (!distributor?.id) return null;
      
      const { data, error } = await supabase
        .from('loyalty_programs')
        .select('*')
        .eq('distributor_id', distributor.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!distributor?.id,
  });
}

export function useSaveLoyaltyProgram() {
  const queryClient = useQueryClient();
  const { data: distributor } = useDistributor();

  return useMutation({
    mutationFn: async (program: {
      is_enabled: boolean;
      program_name?: string;
      description?: string;
      points_per_order: number;
      min_order_value?: number;
      reward_threshold: number;
      reward_description?: string;
    }) => {
      if (!distributor?.id) throw new Error('Distribuidor não encontrado');

      // Check if exists
      const { data: existing } = await supabase
        .from('loyalty_programs')
        .select('id')
        .eq('distributor_id', distributor.id)
        .maybeSingle();

      if (existing) {
        const { data, error } = await supabase
          .from('loyalty_programs')
          .update(program)
          .eq('distributor_id', distributor.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('loyalty_programs')
          .insert({ ...program, distributor_id: distributor.id })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['distributor-loyalty-program'] });
      toast.success('Programa de fidelidade salvo com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao salvar programa', { description: error.message });
    },
  });
}

// Subscription hooks
export function useDistributorSubscription() {
  const { data: distributor } = useDistributor();

  return useQuery({
    queryKey: ['distributor-subscription', distributor?.id],
    queryFn: async () => {
      if (!distributor?.id) return null;
      
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('distributor_id', distributor.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!distributor?.id,
  });
}

export function useSubscriptionPayments() {
  const { data: subscription } = useDistributorSubscription();

  return useQuery({
    queryKey: ['subscription-payments', subscription?.id],
    queryFn: async () => {
      if (!subscription?.id) return [];
      
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('subscription_id', subscription.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!subscription?.id,
  });
}

// Product hooks
export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { data: distributor } = useDistributor();

  return useMutation({
    mutationFn: async (product: Omit<TablesInsert<'products'>, 'distributor_id'>) => {
      if (!distributor?.id) throw new Error('Distribuidor não encontrado');

      const { data, error } = await supabase
        .from('products')
        .insert({ ...product, distributor_id: distributor.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['distributor-products'] });
      toast.success('Produto criado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao criar produto', { description: error.message });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...product }: TablesUpdate<'products'> & { id: string }) => {
      const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['distributor-products'] });
      toast.success('Produto atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar produto', { description: error.message });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['distributor-products'] });
      toast.success('Produto removido com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao remover produto', { description: error.message });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'novo' | 'em_entrega' | 'concluido' | 'cancelado' }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['distributor-orders'] });
      toast.success('Status do pedido atualizado!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar pedido', { description: error.message });
    },
  });
}

// Create Order hook (for customers) - Uses Edge Function to bypass RLS
export type CreateOrderInput = {
  distributor_id: string;
  customer_id?: string | null;
  customer_name: string;
  customer_phone: string;
  order_type: 'immediate' | 'scheduled';
  scheduled_date?: string | null;
  delivery_period?: 'manha' | 'tarde' | 'noite' | null;
  delivery_street: string;
  delivery_neighborhood?: string | null;
  delivery_city?: string | null;
  delivery_state?: string | null;
  delivery_zip_code?: string | null;
  delivery_number?: string | null;
  delivery_complement?: string | null;
  payment_method: 'dinheiro' | 'pix' | 'cartao' | 'cartao_entrega';
  subtotal: number;
  discount_amount: number;
  total: number;
  notes?: string | null;
};

export type CreateOrderItemInput = {
  product_id: string;
  product_name: string;
  product_liters: number;
  quantity: number;
  unit_price: number;
  total_price: number;
};

export function useCreateOrder() {
  return useMutation({
    mutationFn: async ({
      order,
      items,
    }: {
      order: CreateOrderInput;
      items: CreateOrderItemInput[];
    }): Promise<{ id: string; order_number: number }> => {
      // Call the Edge Function that uses Service Role to bypass RLS
      const { data, error } = await supabase.functions.invoke('create-order', {
        body: {
          distributor_id: order.distributor_id,
          customer_name: order.customer_name,
          customer_phone: order.customer_phone,
          order_type: order.order_type,
          scheduled_date: order.scheduled_date || null,
          delivery_period: order.delivery_period || null,
          delivery_street: order.delivery_street,
          delivery_neighborhood: order.delivery_neighborhood || null,
          delivery_city: order.delivery_city || null,
          delivery_state: order.delivery_state || null,
          delivery_zip_code: order.delivery_zip_code || null,
          delivery_number: order.delivery_number || null,
          delivery_complement: order.delivery_complement || null,
          payment_method: order.payment_method,
          subtotal: order.subtotal,
          discount_amount: order.discount_amount,
          total: order.total,
          notes: order.notes || null,
          items: items,
        },
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Erro ao criar pedido');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Erro ao criar pedido');
      }

      return {
        id: data.order.id,
        order_number: data.order.order_number,
      };
    },
    onError: (error) => {
      toast.error('Erro ao criar pedido', { description: error.message });
    },
  });
}