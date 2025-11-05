import { create } from 'zustand';

export interface SubscriptionAlert {
  id: string;
  distributor_id: string;
  distributor_name: string;
  plan_type: 'monthly' | 'annual';
  expires_at: string;
  days_until_expiry: number;
  status: 'expiring_soon' | 'expiring_today' | 'expired';
}

interface AdminNotificationsState {
  subscriptionAlerts: SubscriptionAlert[];
  unreadCount: number;
  markAsRead: (alertId: string) => void;
  markAllAsRead: () => void;
  getUnreadCount: () => number;
  getCriticalAlerts: () => SubscriptionAlert[];
}

// Mock data de alertas de assinatura
const mockSubscriptionAlerts: SubscriptionAlert[] = [
  {
    id: '1',
    distributor_id: 'dist-001',
    distributor_name: 'Água Cristalina Ltda',
    plan_type: 'monthly',
    expires_at: '2025-01-15',
    days_until_expiry: 1,
    status: 'expiring_today',
  },
  {
    id: '2',
    distributor_id: 'dist-002',
    distributor_name: 'Distribuição Águas Puras',
    plan_type: 'annual',
    expires_at: '2025-01-18',
    days_until_expiry: 4,
    status: 'expiring_soon',
  },
  {
    id: '3',
    distributor_id: 'dist-003',
    distributor_name: 'Aqua Delivery Express',
    plan_type: 'monthly',
    expires_at: '2025-01-17',
    days_until_expiry: 3,
    status: 'expiring_soon',
  },
  {
    id: '4',
    distributor_id: 'dist-004',
    distributor_name: 'Fonte Natural Distribuidora',
    plan_type: 'monthly',
    expires_at: '2025-01-13',
    days_until_expiry: -1,
    status: 'expired',
  },
];

export const useAdminNotifications = create<AdminNotificationsState>((set, get) => ({
  subscriptionAlerts: mockSubscriptionAlerts,
  unreadCount: mockSubscriptionAlerts.length,

  markAsRead: (alertId: string) => {
    set((state) => ({
      subscriptionAlerts: state.subscriptionAlerts.filter((alert) => alert.id !== alertId),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  markAllAsRead: () => {
    set({
      subscriptionAlerts: [],
      unreadCount: 0,
    });
  },

  getUnreadCount: () => {
    return get().unreadCount;
  },

  getCriticalAlerts: () => {
    return get().subscriptionAlerts.filter(
      (alert) => alert.status === 'expired' || alert.status === 'expiring_today'
    );
  },
}));