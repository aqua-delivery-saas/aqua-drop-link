export interface MockUser {
  id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'distributor' | 'customer';
  created_at: string;
  is_active: boolean;
  phone?: string;
  city?: string;
  state?: string;
}

export interface MockDistributor {
  id: string;
  user_id: string;
  company_name: string;
  cnpj: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  is_active: boolean;
  subscription_status: 'active' | 'expiring_soon' | 'expired' | 'canceled';
  subscription_expires_at: string;
  created_at: string;
}

export const mockUsers: MockUser[] = [
  {
    id: '1',
    full_name: 'Administrador Sistema',
    email: 'admin@aquadelivery.com',
    role: 'admin',
    created_at: '2024-01-01T10:00:00Z',
    is_active: true,
  },
  {
    id: '2',
    full_name: 'Distribuidora Água Pura',
    email: 'contato@aguapura.com',
    role: 'distributor',
    created_at: '2024-02-15T14:30:00Z',
    is_active: true,
    phone: '11987654321',
    city: 'São Paulo',
    state: 'SP',
  },
  {
    id: '3',
    full_name: 'Distribuidora Fonte Cristalina',
    email: 'vendas@fontecristalina.com',
    role: 'distributor',
    created_at: '2024-03-10T09:15:00Z',
    is_active: true,
    phone: '21998765432',
    city: 'Rio de Janeiro',
    state: 'RJ',
  },
  {
    id: '4',
    full_name: 'João Silva',
    email: 'joao.silva@gmail.com',
    role: 'customer',
    created_at: '2024-04-05T16:45:00Z',
    is_active: true,
    phone: '11976543210',
    city: 'São Paulo',
    state: 'SP',
  },
  {
    id: '5',
    full_name: 'Maria Santos',
    email: 'maria.santos@hotmail.com',
    role: 'customer',
    created_at: '2024-04-12T11:20:00Z',
    is_active: true,
    phone: '21965432109',
    city: 'Rio de Janeiro',
    state: 'RJ',
  },
  {
    id: '6',
    full_name: 'Distribuidora H2O Express',
    email: 'contato@h2oexpress.com',
    role: 'distributor',
    created_at: '2024-01-20T08:00:00Z',
    is_active: false,
    phone: '11912345678',
    city: 'Campinas',
    state: 'SP',
  },
];

export const mockDistributors: MockDistributor[] = [
  {
    id: 'd1',
    user_id: '2',
    company_name: 'Distribuidora Água Pura Ltda',
    cnpj: '12.345.678/0001-90',
    phone: '11987654321',
    address: 'Rua das Águas, 123',
    city: 'São Paulo',
    state: 'SP',
    is_active: true,
    subscription_status: 'active',
    subscription_expires_at: '2025-06-15T23:59:59Z',
    created_at: '2024-02-15T14:30:00Z',
  },
  {
    id: 'd2',
    user_id: '3',
    company_name: 'Fonte Cristalina Distribuidora',
    cnpj: '23.456.789/0001-01',
    phone: '21998765432',
    address: 'Av. Central, 456',
    city: 'Rio de Janeiro',
    state: 'RJ',
    is_active: true,
    subscription_status: 'expiring_soon',
    subscription_expires_at: '2025-01-10T23:59:59Z',
    created_at: '2024-03-10T09:15:00Z',
  },
  {
    id: 'd3',
    user_id: '6',
    company_name: 'H2O Express Distribuidora',
    cnpj: '34.567.890/0001-12',
    phone: '11912345678',
    address: 'Rua do Comércio, 789',
    city: 'Campinas',
    state: 'SP',
    is_active: false,
    subscription_status: 'expired',
    subscription_expires_at: '2024-11-30T23:59:59Z',
    created_at: '2024-01-20T08:00:00Z',
  },
];

export const mockMetrics = {
  totalUsers: 6,
  totalDistributors: 3,
  activeDistributors: 2,
  expiredSubscriptions: 1,
  newUsersThisMonth: 2,
  totalOrders: 145,
};

export const mockMonthlyUsers = [
  { month: 'Jan', users: 1 },
  { month: 'Fev', users: 2 },
  { month: 'Mar', users: 3 },
  { month: 'Abr', users: 6 },
];

export const mockDailyOrders = [
  { day: 'Seg', orders: 18 },
  { day: 'Ter', orders: 22 },
  { day: 'Qua', orders: 25 },
  { day: 'Qui', orders: 30 },
  { day: 'Sex', orders: 35 },
  { day: 'Sáb', orders: 15 },
  { day: 'Dom', orders: 10 },
];
