-- Função para verificar se o distribuidor do usuário tem assinatura ativa
CREATE OR REPLACE FUNCTION public.has_active_subscription(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.distributors d
    JOIN public.subscriptions s ON s.distributor_id = d.id
    WHERE d.user_id = _user_id
      AND s.status = 'active'
      AND (s.expires_at IS NULL OR s.expires_at > now())
  )
$$;

-- Atualizar política de products para exigir assinatura ativa em INSERT/UPDATE/DELETE
DROP POLICY IF EXISTS "Distributors can manage own products" ON public.products;

CREATE POLICY "Distributors can manage own products with active subscription" 
ON public.products 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM distributors d
    WHERE d.id = products.distributor_id 
    AND d.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM distributors d
    WHERE d.id = products.distributor_id 
    AND d.user_id = auth.uid()
  )
  AND has_active_subscription(auth.uid())
);

-- Atualizar política de business_hours
DROP POLICY IF EXISTS "Distributors can manage own business hours" ON public.business_hours;

CREATE POLICY "Distributors can manage own business hours with active subscription" 
ON public.business_hours 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM distributors d
    WHERE d.id = business_hours.distributor_id 
    AND d.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM distributors d
    WHERE d.id = business_hours.distributor_id 
    AND d.user_id = auth.uid()
  )
  AND has_active_subscription(auth.uid())
);

-- Atualizar política de discount_rules
DROP POLICY IF EXISTS "Distributors can manage own discount rules" ON public.discount_rules;

CREATE POLICY "Distributors can manage own discount rules with active subscription" 
ON public.discount_rules 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM distributors d
    WHERE d.id = discount_rules.distributor_id 
    AND d.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM distributors d
    WHERE d.id = discount_rules.distributor_id 
    AND d.user_id = auth.uid()
  )
  AND has_active_subscription(auth.uid())
);

-- Atualizar política de loyalty_programs
DROP POLICY IF EXISTS "Distributors can manage own loyalty program" ON public.loyalty_programs;

CREATE POLICY "Distributors can manage own loyalty program with active subscription" 
ON public.loyalty_programs 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM distributors d
    WHERE d.id = loyalty_programs.distributor_id 
    AND d.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM distributors d
    WHERE d.id = loyalty_programs.distributor_id 
    AND d.user_id = auth.uid()
  )
  AND has_active_subscription(auth.uid())
);