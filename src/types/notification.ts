export type NotificationType = 
  | 'new_order' 
  | 'subscription_expiring' 
  | 'subscription_expired'
  | 'payment_failed'
  | 'low_stock'
  | 'customer_review'
  | 'system_update';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  link?: string;
}

export const notificationConfig: Record<NotificationType, { icon: string; color: string }> = {
  new_order: { icon: '🛒', color: 'text-primary' },
  subscription_expiring: { icon: '⚠️', color: 'text-warning' },
  subscription_expired: { icon: '❌', color: 'text-destructive' },
  payment_failed: { icon: '💳', color: 'text-destructive' },
  low_stock: { icon: '📦', color: 'text-warning' },
  customer_review: { icon: '⭐', color: 'text-primary' },
  system_update: { icon: 'ℹ️', color: 'text-muted-foreground' },
};
