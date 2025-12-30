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

export const useAdminNotifications = create<AdminNotificationsState>((set, get) => ({
  subscriptionAlerts: [],
  unreadCount: 0,

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