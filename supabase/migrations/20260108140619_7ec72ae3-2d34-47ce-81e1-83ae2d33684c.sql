-- Habilitar extensão pg_cron (se não existir)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Agendar verificação de assinaturas expirando (executa diariamente às 8h)
SELECT cron.schedule(
  'check-expiring-subscriptions',
  '0 8 * * *',  -- Todo dia às 08:00 UTC
  $$SELECT public.check_expiring_subscriptions()$$
);

-- Agendar verificação de assinaturas expiradas (executa diariamente às 0h)
SELECT cron.schedule(
  'check-expired-subscriptions',
  '0 0 * * *',  -- Todo dia à meia-noite UTC
  $$SELECT public.check_expired_subscriptions()$$
);

-- Criar função para notificar pedidos agendados do dia
CREATE OR REPLACE FUNCTION public.notify_scheduled_orders_today()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  order_rec RECORD;
  distributor_user_id UUID;
BEGIN
  -- Buscar pedidos agendados para hoje que ainda não foram notificados
  FOR order_rec IN
    SELECT 
      o.id,
      o.order_number,
      o.customer_name,
      o.scheduled_date,
      o.delivery_period,
      o.distributor_id,
      o.total
    FROM orders o
    WHERE o.order_type = 'scheduled'
      AND o.status = 'novo'
      AND o.scheduled_date = CURRENT_DATE
      -- Evitar notificações duplicadas
      AND NOT EXISTS (
        SELECT 1 FROM notifications n
        WHERE n.order_id = o.id
          AND n.type = 'scheduled_reminder'
          AND n.created_at > now() - interval '12 hours'
      )
  LOOP
    -- Buscar user_id do distribuidor
    SELECT user_id INTO distributor_user_id
    FROM distributors WHERE id = order_rec.distributor_id;

    IF distributor_user_id IS NOT NULL THEN
      INSERT INTO notifications (
        user_id,
        type,
        title,
        message,
        order_id,
        link
      ) VALUES (
        distributor_user_id,
        'scheduled_reminder',
        'Entrega agendada para hoje',
        'Pedido #' || order_rec.order_number || ' de ' || order_rec.customer_name || 
          ' está agendado para ' || 
          CASE order_rec.delivery_period 
            WHEN 'manha' THEN 'manhã'
            WHEN 'tarde' THEN 'tarde'
            WHEN 'noite' THEN 'noite'
            ELSE 'hoje'
          END ||
          ' - R$ ' || TO_CHAR(order_rec.total, 'FM999G999D00'),
        order_rec.id,
        '/distributor/orders'
      );
    END IF;
  END LOOP;
END;
$$;

-- Agendar lembretes de pedidos agendados (executa às 6h todos os dias)
SELECT cron.schedule(
  'notify-scheduled-orders-today',
  '0 6 * * *',  -- Todo dia às 06:00 UTC
  $$SELECT public.notify_scheduled_orders_today()$$
);