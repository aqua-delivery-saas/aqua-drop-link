-- =============================================
-- FASE 4: ASSINATURAS E PAGAMENTOS
-- =============================================

-- 4.1 Criar Enums para Assinaturas
CREATE TYPE public.subscription_plan AS ENUM ('monthly', 'annual');
CREATE TYPE public.subscription_status AS ENUM ('active', 'pending', 'expired', 'canceled');

-- 4.2 Criar Tabela subscriptions
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  distributor_id UUID REFERENCES public.distributors(id) ON DELETE CASCADE NOT NULL UNIQUE,
  plan subscription_plan NOT NULL DEFAULT 'monthly',
  status subscription_status NOT NULL DEFAULT 'pending',
  price DECIMAL(10,2) NOT NULL,
  started_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4.3 Criar Tabela payments
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  reference_period_start TIMESTAMPTZ,
  reference_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_payments_subscription ON public.payments(subscription_id);

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- FASE 5: PEDIDOS
-- =============================================

-- 5.1 Criar Enums para Pedidos
CREATE TYPE public.order_status AS ENUM ('novo', 'em_entrega', 'concluido', 'cancelado');
CREATE TYPE public.order_type AS ENUM ('immediate', 'scheduled');
CREATE TYPE public.delivery_period AS ENUM ('manha', 'tarde', 'noite');
CREATE TYPE public.payment_method AS ENUM ('dinheiro', 'pix', 'cartao', 'cartao_entrega');

-- 5.2 Criar Tabela orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number SERIAL,
  distributor_id UUID REFERENCES public.distributors(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Tipo e status
  order_type order_type NOT NULL DEFAULT 'immediate',
  status order_status NOT NULL DEFAULT 'novo',
  
  -- Agendamento
  scheduled_date DATE,
  delivery_period delivery_period,
  
  -- Endereço de entrega
  delivery_street TEXT NOT NULL,
  delivery_number TEXT,
  delivery_complement TEXT,
  delivery_neighborhood TEXT,
  delivery_city TEXT,
  delivery_state TEXT,
  delivery_zip_code TEXT,
  
  -- Cliente (para pedidos sem conta)
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  
  -- Valores
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  
  -- Pagamento
  payment_method payment_method NOT NULL,
  change_for DECIMAL(10,2),
  
  -- Observações
  notes TEXT,
  
  -- Fidelidade
  loyalty_points_earned INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_orders_distributor ON public.orders(distributor_id);
CREATE INDEX idx_orders_customer ON public.orders(customer_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created ON public.orders(created_at DESC);

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5.3 Criar Tabela order_items
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_liters DECIMAL(5,2) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_order_items_order ON public.order_items(order_id);

-- =============================================
-- RLS POLICIES - SUBSCRIPTIONS
-- =============================================

CREATE POLICY "Distributors can view own subscription"
  ON public.subscriptions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.distributors d 
      WHERE d.id = distributor_id AND d.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all subscriptions"
  ON public.subscriptions FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- RLS POLICIES - PAYMENTS
-- =============================================

CREATE POLICY "Distributors can view own payments"
  ON public.payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.subscriptions s
      JOIN public.distributors d ON d.id = s.distributor_id
      WHERE s.id = subscription_id AND d.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all payments"
  ON public.payments FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- RLS POLICIES - ORDERS
-- =============================================

CREATE POLICY "Customers can view own orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Customers can create orders"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid() OR customer_id IS NULL);

CREATE POLICY "Anonymous can create orders"
  ON public.orders FOR INSERT
  TO anon
  WITH CHECK (customer_id IS NULL);

CREATE POLICY "Distributors can view orders for their store"
  ON public.orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.distributors d 
      WHERE d.id = distributor_id AND d.user_id = auth.uid()
    )
  );

CREATE POLICY "Distributors can update orders for their store"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.distributors d 
      WHERE d.id = distributor_id AND d.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all orders"
  ON public.orders FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- RLS POLICIES - ORDER_ITEMS
-- =============================================

CREATE POLICY "Customers can view own order items"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o 
      WHERE o.id = order_id AND o.customer_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert order items with valid order"
  ON public.order_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o 
      WHERE o.id = order_id
    )
  );

CREATE POLICY "Distributors can view order items for their store"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      JOIN public.distributors d ON d.id = o.distributor_id
      WHERE o.id = order_id AND d.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all order items"
  ON public.order_items FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));