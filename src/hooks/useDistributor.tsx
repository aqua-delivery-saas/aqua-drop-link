import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from 'sonner';

export type Distributor = Tables<'distributors'>;
export type Product = Tables<'products'>;
export type Order = Tables<'orders'>;
export type OrderItem = Tables<'order_items'>;

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
