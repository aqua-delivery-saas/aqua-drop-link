-- =============================================
-- FASE 3: PRODUTOS E CONFIGURAÇÕES
-- =============================================

-- 3.1 Criar Tabela products
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  distributor_id UUID REFERENCES public.distributors(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  liters DECIMAL(5,2) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_products_distributor ON public.products(distributor_id);
CREATE INDEX idx_products_available ON public.products(is_available);

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3.2 Criar Tabela discount_rules
CREATE TABLE public.discount_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  distributor_id UUID REFERENCES public.distributors(id) ON DELETE CASCADE NOT NULL,
  min_quantity INTEGER NOT NULL,
  max_quantity INTEGER,
  discount_percent DECIMAL(5,2) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.discount_rules ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_discount_rules_distributor ON public.discount_rules(distributor_id);

CREATE TRIGGER update_discount_rules_updated_at
  BEFORE UPDATE ON public.discount_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3.3 Criar Tabela loyalty_programs
CREATE TABLE public.loyalty_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  distributor_id UUID REFERENCES public.distributors(id) ON DELETE CASCADE NOT NULL UNIQUE,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  points_per_order INTEGER NOT NULL DEFAULT 1,
  reward_threshold INTEGER NOT NULL DEFAULT 10,
  reward_description TEXT DEFAULT 'Galão grátis',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.loyalty_programs ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_loyalty_programs_updated_at
  BEFORE UPDATE ON public.loyalty_programs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- RLS POLICIES - PRODUCTS
-- =============================================

CREATE POLICY "Anyone can view available products of active distributors"
  ON public.products FOR SELECT
  TO anon, authenticated
  USING (
    is_available = true AND
    EXISTS (
      SELECT 1 FROM public.distributors d 
      WHERE d.id = distributor_id AND d.is_active = true
    )
  );

CREATE POLICY "Distributors can view all own products"
  ON public.products FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.distributors d 
      WHERE d.id = distributor_id AND d.user_id = auth.uid()
    )
  );

CREATE POLICY "Distributors can manage own products"
  ON public.products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.distributors d 
      WHERE d.id = distributor_id AND d.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all products"
  ON public.products FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- RLS POLICIES - DISCOUNT_RULES
-- =============================================

CREATE POLICY "Anyone can view active discount rules of active distributors"
  ON public.discount_rules FOR SELECT
  TO anon, authenticated
  USING (
    is_active = true AND
    EXISTS (
      SELECT 1 FROM public.distributors d 
      WHERE d.id = distributor_id AND d.is_active = true
    )
  );

CREATE POLICY "Distributors can view all own discount rules"
  ON public.discount_rules FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.distributors d 
      WHERE d.id = distributor_id AND d.user_id = auth.uid()
    )
  );

CREATE POLICY "Distributors can manage own discount rules"
  ON public.discount_rules FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.distributors d 
      WHERE d.id = distributor_id AND d.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all discount rules"
  ON public.discount_rules FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- RLS POLICIES - LOYALTY_PROGRAMS
-- =============================================

CREATE POLICY "Anyone can view enabled loyalty programs of active distributors"
  ON public.loyalty_programs FOR SELECT
  TO anon, authenticated
  USING (
    is_enabled = true AND
    EXISTS (
      SELECT 1 FROM public.distributors d 
      WHERE d.id = distributor_id AND d.is_active = true
    )
  );

CREATE POLICY "Distributors can view own loyalty program"
  ON public.loyalty_programs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.distributors d 
      WHERE d.id = distributor_id AND d.user_id = auth.uid()
    )
  );

CREATE POLICY "Distributors can manage own loyalty program"
  ON public.loyalty_programs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.distributors d 
      WHERE d.id = distributor_id AND d.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all loyalty programs"
  ON public.loyalty_programs FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));