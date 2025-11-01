import { useState, useEffect } from 'react';
import { Notification } from '@/types/notification';

// Mock notifications - em produção, isso viria do Supabase
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'new_order',
    title: 'Novo Pedido',
    message: 'Maria Silva fez um pedido de 5 galões',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 min ago
    read: false,
    link: '/distributor/orders'
  },
  {
    id: '2',
    type: 'subscription_expiring',
    title: 'Assinatura Expirando',
    message: 'Sua assinatura expira em 5 dias',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    link: '/distributor/subscription'
  },
  {
    id: '3',
    type: 'new_order',
    title: 'Novo Pedido',
    message: 'João Santos fez um pedido de 10 galões',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    read: false,
    link: '/distributor/orders'
  },
  {
    id: '4',
    type: 'payment_failed',
    title: 'Falha no Pagamento',
    message: 'Não foi possível processar o pagamento da assinatura',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    link: '/distributor/subscription'
  },
  {
    id: '5',
    type: 'customer_review',
    title: 'Nova Avaliação',
    message: 'Cliente Carlos deixou uma avaliação 5 estrelas',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    read: true,
  }
];

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  // Simular chegada de novas notificações (em produção, usaria Supabase Realtime)
  useEffect(() => {
    const interval = setInterval(() => {
      // Chance de 10% de receber uma nova notificação a cada 30s
      if (Math.random() < 0.1) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: 'new_order',
          title: 'Novo Pedido',
          message: `Cliente fez um pedido de ${Math.floor(Math.random() * 10) + 1} galões`,
          timestamp: new Date(),
          read: false,
          link: '/distributor/orders'
        };
        
        setNotifications(prev => [newNotification, ...prev]);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
}
