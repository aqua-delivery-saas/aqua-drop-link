-- Enum para tipos de notificação
CREATE TYPE notification_type AS ENUM (
  'new_order', 
  'new_scheduled_order',
  'subscription_expiring', 
  'subscription_expired',
  'payment_failed',
  'low_stock',
  'customer_review',
  'system_update',
  'scheduled_reminder'
);

-- Tabela de notificações
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL
);

-- RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT WITH CHECK (true);

-- Habilitar Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Índices para performance
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_order_id ON notifications(order_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read);

-- Trigger para notificar distribuidor sobre novos pedidos
CREATE OR REPLACE FUNCTION notify_distributor_new_order()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  distributor_user_id UUID;
  notification_type_val notification_type;
  notification_title TEXT;
  notification_message TEXT;
BEGIN
  SELECT user_id INTO distributor_user_id
  FROM distributors WHERE id = NEW.distributor_id;

  IF distributor_user_id IS NULL THEN RETURN NEW; END IF;

  IF NEW.order_type = 'scheduled' THEN
    notification_type_val := 'new_scheduled_order';
    notification_title := 'Novo pedido agendado';
    notification_message := 'Pedido #' || NEW.order_number || ' agendado para ' || 
                           TO_CHAR(NEW.scheduled_date, 'DD/MM/YYYY') || ' - ' || NEW.customer_name;
  ELSE
    notification_type_val := 'new_order';
    notification_title := 'Novo pedido recebido';
    notification_message := 'Pedido #' || NEW.order_number || ' de ' || NEW.customer_name || 
                           ' - R$ ' || TO_CHAR(NEW.total, 'FM999G999D00');
  END IF;

  INSERT INTO notifications (user_id, type, title, message, link, order_id)
  VALUES (
    distributor_user_id,
    notification_type_val,
    notification_title,
    notification_message,
    '/distributor/orders',
    NEW.id
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_new_order_notify
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_distributor_new_order();