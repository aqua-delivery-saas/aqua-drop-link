-- Remover as políticas restritivas existentes
DROP POLICY IF EXISTS "Anonymous can create orders" ON public.orders;
DROP POLICY IF EXISTS "Customers can create orders" ON public.orders;

-- Criar uma única política PERMISSIVA para INSERT
CREATE POLICY "Anyone can create orders"
ON public.orders
FOR INSERT
WITH CHECK (
  -- Se customer_id for NULL, permite (pedido anônimo)
  -- Se customer_id for igual ao usuário logado, permite
  (customer_id IS NULL) OR (customer_id = auth.uid())
);