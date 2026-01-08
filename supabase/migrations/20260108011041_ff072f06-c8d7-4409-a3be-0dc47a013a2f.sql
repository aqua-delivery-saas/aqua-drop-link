-- Função para verificar e criar notificações de assinaturas expirando em 7 dias
CREATE OR REPLACE FUNCTION public.check_expiring_subscriptions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  sub RECORD;
BEGIN
  -- Buscar assinaturas ativas que expiram nos próximos 7 dias
  FOR sub IN
    SELECT 
      s.id as subscription_id,
      s.expires_at,
      s.plan,
      d.user_id,
      d.name as distributor_name
    FROM subscriptions s
    JOIN distributors d ON d.id = s.distributor_id
    WHERE s.status = 'active'
      AND s.expires_at IS NOT NULL
      AND s.expires_at > now()
      AND s.expires_at <= now() + interval '7 days'
      -- Evitar notificações duplicadas (não notificar se já existe uma nos últimos 7 dias)
      AND NOT EXISTS (
        SELECT 1 FROM notifications n
        WHERE n.user_id = d.user_id
          AND n.type = 'subscription_expiring'
          AND n.subscription_id = s.id
          AND n.created_at > now() - interval '7 days'
      )
  LOOP
    -- Criar notificação para o distribuidor
    INSERT INTO notifications (
      user_id,
      type,
      title,
      message,
      subscription_id,
      link
    ) VALUES (
      sub.user_id,
      'subscription_expiring',
      'Assinatura expirando em breve',
      'Sua assinatura do plano ' || 
        CASE sub.plan 
          WHEN 'monthly' THEN 'Mensal' 
          WHEN 'annual' THEN 'Anual' 
        END || 
        ' expira em ' || to_char(sub.expires_at, 'DD/MM/YYYY') || 
        '. Renove para continuar utilizando todos os recursos.',
      sub.subscription_id,
      '/distributor/subscription'
    );
  END LOOP;
END;
$$;

-- Função para verificar assinaturas já expiradas e criar notificação
CREATE OR REPLACE FUNCTION public.check_expired_subscriptions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  sub RECORD;
BEGIN
  -- Buscar assinaturas que acabaram de expirar
  FOR sub IN
    SELECT 
      s.id as subscription_id,
      s.expires_at,
      s.plan,
      d.user_id,
      d.name as distributor_name
    FROM subscriptions s
    JOIN distributors d ON d.id = s.distributor_id
    WHERE s.status = 'active'
      AND s.expires_at IS NOT NULL
      AND s.expires_at <= now()
      -- Evitar notificações duplicadas
      AND NOT EXISTS (
        SELECT 1 FROM notifications n
        WHERE n.user_id = d.user_id
          AND n.type = 'subscription_expired'
          AND n.subscription_id = s.id
          AND n.created_at > now() - interval '1 day'
      )
  LOOP
    -- Criar notificação de expiração
    INSERT INTO notifications (
      user_id,
      type,
      title,
      message,
      subscription_id,
      link
    ) VALUES (
      sub.user_id,
      'subscription_expired',
      'Assinatura expirada',
      'Sua assinatura do plano ' || 
        CASE sub.plan 
          WHEN 'monthly' THEN 'Mensal' 
          WHEN 'annual' THEN 'Anual' 
        END || 
        ' expirou. Renove agora para continuar gerenciando sua distribuidora.',
      sub.subscription_id,
      '/distributor/subscription'
    );
  END LOOP;
END;
$$;