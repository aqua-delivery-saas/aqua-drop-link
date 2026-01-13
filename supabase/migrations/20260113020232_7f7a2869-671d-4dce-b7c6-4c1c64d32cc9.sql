-- Adicionar novo tipo de notificação para resgate de fidelidade
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'loyalty_redemption';

-- Criar tabela para histórico de resgates
CREATE TABLE public.loyalty_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL,
  distributor_id UUID NOT NULL REFERENCES distributors(id) ON DELETE CASCADE,
  points_redeemed INTEGER NOT NULL,
  reward_description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  order_id UUID REFERENCES orders(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  used_at TIMESTAMPTZ,
  CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'used', 'expired'))
);

-- Enable RLS
ALTER TABLE public.loyalty_redemptions ENABLE ROW LEVEL SECURITY;

-- Clientes podem ver seus resgates
CREATE POLICY "Customers can view own redemptions"
  ON public.loyalty_redemptions FOR SELECT
  USING (auth.uid() = customer_id);

-- Clientes podem criar resgates
CREATE POLICY "Customers can create redemptions"
  ON public.loyalty_redemptions FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

-- Distribuidores podem ver e gerenciar resgates de seus clientes
CREATE POLICY "Distributors can view customer redemptions"
  ON public.loyalty_redemptions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM distributors d
    WHERE d.id = loyalty_redemptions.distributor_id
    AND d.user_id = auth.uid()
  ));

CREATE POLICY "Distributors can update customer redemptions"
  ON public.loyalty_redemptions FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM distributors d
    WHERE d.id = loyalty_redemptions.distributor_id
    AND d.user_id = auth.uid()
  ));

-- Admins podem gerenciar todos os resgates
CREATE POLICY "Admins can manage all redemptions"
  ON public.loyalty_redemptions FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Índices para performance
CREATE INDEX idx_loyalty_redemptions_customer ON public.loyalty_redemptions(customer_id);
CREATE INDEX idx_loyalty_redemptions_distributor ON public.loyalty_redemptions(distributor_id);
CREATE INDEX idx_loyalty_redemptions_status ON public.loyalty_redemptions(status);

-- Função para resgatar pontos de forma segura
CREATE OR REPLACE FUNCTION public.redeem_loyalty_points(
  p_customer_id UUID,
  p_distributor_id UUID,
  p_points INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verificar se o cliente tem pontos suficientes
  IF NOT EXISTS (
    SELECT 1 FROM customer_loyalty_points
    WHERE customer_id = p_customer_id
    AND distributor_id = p_distributor_id
    AND (total_points - redeemed_points) >= p_points
  ) THEN
    RAISE EXCEPTION 'Pontos insuficientes para resgate';
  END IF;

  -- Atualizar redeemed_points
  UPDATE customer_loyalty_points
  SET 
    redeemed_points = redeemed_points + p_points,
    updated_at = now()
  WHERE customer_id = p_customer_id
  AND distributor_id = p_distributor_id;
END;
$$;

-- Função para notificar distribuidor sobre resgate
CREATE OR REPLACE FUNCTION public.notify_distributor_loyalty_redemption()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  distributor_user_id UUID;
  customer_name TEXT;
BEGIN
  -- Buscar user_id do distribuidor
  SELECT user_id INTO distributor_user_id
  FROM distributors WHERE id = NEW.distributor_id;

  -- Buscar nome do cliente
  SELECT full_name INTO customer_name
  FROM profiles WHERE id = NEW.customer_id;

  IF distributor_user_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, type, title, message, link)
    VALUES (
      distributor_user_id,
      'loyalty_redemption',
      'Resgate de Fidelidade',
      'Cliente ' || COALESCE(customer_name, 'Anônimo') || 
        ' resgatou: ' || NEW.reward_description,
      '/distributor/orders'
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger para notificar distribuidor
CREATE TRIGGER trigger_notify_loyalty_redemption
  AFTER INSERT ON public.loyalty_redemptions
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_distributor_loyalty_redemption();