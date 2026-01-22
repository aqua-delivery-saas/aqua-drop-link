import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// IDs de usuários/distribuidoras de teste que devem ser excluídos das métricas
const TEST_USER_IDS = ['cd6cf668-0e69-46f4-89e0-05504275ef92'];
const TEST_DISTRIBUTOR_IDS = ['c3ff25c9-9f86-4e6b-9222-f9af242bf5e9'];

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .not('id', 'in', `(${TEST_USER_IDS.join(',')})`)
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      const usersWithRoles = (profiles || []).map(profile => {
        const userRole = roles?.find(r => r.user_id === profile.id);
        return {
          ...profile,
          role: userRole?.role || 'customer',
          is_active: true,
        };
      });

      return usersWithRoles;
    },
  });
}

export function useAdminUserById(userId: string) {
  return useQuery({
    queryKey: ['admin-user', userId],
    queryFn: async () => {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile) return null;

      const { data: role, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (roleError) throw roleError;

      return {
        ...profile,
        role: role?.role || 'customer',
        is_active: true,
      };
    },
    enabled: !!userId,
  });
}

export function useAdminDistributors() {
  return useQuery({
    queryKey: ['admin-distributors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('distributors')
        .select(`
          *,
          cities (*),
          subscriptions (*)
        `)
        .not('id', 'in', `(${TEST_DISTRIBUTOR_IDS.join(',')})`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
}

export function useAdminMetrics() {
  return useQuery({
    queryKey: ['admin-metrics'],
    queryFn: async () => {
      const { count: totalDistributors } = await supabase
        .from('distributors')
        .select('*', { count: 'exact', head: true })
        .not('id', 'in', `(${TEST_DISTRIBUTOR_IDS.join(',')})`);

      const { count: activeDistributors } = await supabase
        .from('distributors')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .not('id', 'in', `(${TEST_DISTRIBUTOR_IDS.join(',')})`);

      const { count: totalProfiles } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .not('id', 'in', `(${TEST_USER_IDS.join(',')})`);

      const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('status', 'active')
        .not('distributor_id', 'in', `(${TEST_DISTRIBUTOR_IDS.join(',')})`);

      const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .not('distributor_id', 'in', `(${TEST_DISTRIBUTOR_IDS.join(',')})`);

      const { data: allOrders } = await supabase
        .from('orders')
        .select('total')
        .not('distributor_id', 'in', `(${TEST_DISTRIBUTOR_IDS.join(',')})`);

      const totalRevenue = (allOrders || []).reduce((sum, order) => sum + Number(order.total), 0);
      const monthlyRevenue = (subscriptions || []).reduce((sum, sub) => sum + Number(sub.price), 0);
      const activeSubscriptions = subscriptions?.length || 0;

      const { count: activeCities } = await supabase
        .from('cities')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: newUsersThisMonth } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString())
        .not('id', 'in', `(${TEST_USER_IDS.join(',')})`);

      return {
        totalUsers: totalProfiles || 0,
        totalDistributors: totalDistributors || 0,
        activeDistributors: activeDistributors || 0,
        monthlyRevenue,
        newUsersThisMonth: newUsersThisMonth || 0,
        monthlyGrowth: 12.5,
        totalOrders: totalOrders || 0,
        totalRevenue,
        activeSubscriptions,
        activeCities: activeCities || 0,
      };
    },
  });
}

export function useAdminFinancialData() {
  return useQuery({
    queryKey: ['admin-financial'],
    queryFn: async () => {
      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('*')
        .not('distributor_id', 'in', `(${TEST_DISTRIBUTOR_IDS.join(',')})`);

      if (error) throw error;

      const activeSubscriptions = subscriptions?.filter(s => s.status === 'active') || [];
      const inactiveSubscriptions = subscriptions?.filter(s => s.status !== 'active') || [];
      const totalRevenue = activeSubscriptions.reduce((sum, sub) => sum + Number(sub.price), 0);
      
      const monthlyPlans = activeSubscriptions.filter(s => s.plan === 'monthly');
      const annualPlans = activeSubscriptions.filter(s => s.plan === 'annual');

      return {
        subscriptions: subscriptions || [],
        totalSubscriptions: subscriptions?.length || 0,
        activeSubscriptions: activeSubscriptions.length,
        inactiveSubscriptions: inactiveSubscriptions.length,
        totalRevenue,
        monthlyPlans: monthlyPlans.length,
        annualPlans: annualPlans.length,
        planDistribution: [
          { name: 'Mensal', value: monthlyPlans.length, color: '#007BFF' },
          { name: 'Anual', value: annualPlans.length, color: '#00C48C' },
        ],
      };
    },
  });
}

export function useAllOrders() {
  return useQuery({
    queryKey: ['admin-all-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .not('distributor_id', 'in', `(${TEST_DISTRIBUTOR_IDS.join(',')})`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
}
