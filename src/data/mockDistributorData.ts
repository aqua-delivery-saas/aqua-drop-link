// Mock data para dashboard da distribuidora

export const distributorStats = {
  todayOrders: 12,
  weekOrders: 45,
  monthOrders: 187,
  totalRevenue: 29340.50,
  averageTicket: 156.80,
  minOrder: 45.00,
  maxOrder: 450.00,
};

export const ordersPerDay = [
  { day: 'Seg', orders: 8, revenue: 1248.00 },
  { day: 'Ter', orders: 12, revenue: 1881.60 },
  { day: 'Qua', orders: 15, revenue: 2352.00 },
  { day: 'Qui', orders: 18, revenue: 2822.40 },
  { day: 'Sex', orders: 22, revenue: 3449.60 },
  { day: 'Sáb', orders: 10, revenue: 1568.00 },
  { day: 'Dom', orders: 5, revenue: 784.00 },
];

export const monthlyOrders = [
  { month: 'Jan', orders: 156, revenue: 24460.80 },
  { month: 'Fev', orders: 142, revenue: 22265.60 },
  { month: 'Mar', orders: 178, revenue: 27910.40 },
  { month: 'Abr', orders: 165, revenue: 25872.00 },
  { month: 'Mai', orders: 189, revenue: 29635.20 },
  { month: 'Jun', orders: 187, revenue: 29340.50 },
];

export const peakHours = [
  { hour: '6h-8h', orders: 5, intensity: 'low' as const },
  { hour: '8h-10h', orders: 25, intensity: 'high' as const },
  { hour: '10h-12h', orders: 18, intensity: 'medium' as const },
  { hour: '12h-14h', orders: 12, intensity: 'low' as const },
  { hour: '14h-16h', orders: 30, intensity: 'high' as const },
  { hour: '16h-18h', orders: 22, intensity: 'medium' as const },
  { hour: '18h-20h', orders: 15, intensity: 'medium' as const },
  { hour: '20h-22h', orders: 8, intensity: 'low' as const },
];

export const topProducts = [
  { name: 'Galão 20L', sales: 156, revenue: 2340.00, percentage: 42 },
  { name: 'Galão 10L', sales: 89, revenue: 1068.00, percentage: 24 },
  { name: 'Garrafão 5L', sales: 67, revenue: 536.00, percentage: 18 },
  { name: 'Garrafa 1,5L', sales: 45, revenue: 180.00, percentage: 12 },
  { name: 'Copo 200ml', sales: 23, revenue: 92.00, percentage: 4 },
];

export const recentOrders = [
  {
    id: 'PED-001',
    customer: 'João Silva',
    items: 'Galão 20L (x3)',
    total: 45.00,
    status: 'delivered' as const,
    time: '2h atrás',
  },
  {
    id: 'PED-002',
    customer: 'Maria Santos',
    items: 'Galão 10L (x2)',
    total: 24.00,
    status: 'out_for_delivery' as const,
    time: '30min atrás',
  },
  {
    id: 'PED-003',
    customer: 'Pedro Oliveira',
    items: 'Galão 20L (x5)',
    total: 75.00,
    status: 'preparing' as const,
    time: '15min atrás',
  },
  {
    id: 'PED-004',
    customer: 'Ana Costa',
    items: 'Garrafão 5L (x4)',
    total: 32.00,
    status: 'confirmed' as const,
    time: '5min atrás',
  },
  {
    id: 'PED-005',
    customer: 'Carlos Mendes',
    items: 'Galão 20L (x2)',
    total: 30.00,
    status: 'pending' as const,
    time: 'agora',
  },
];
