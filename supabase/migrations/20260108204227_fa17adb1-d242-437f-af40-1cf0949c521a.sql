-- Adicionar coluna created_by para rastrear o criador da marca
ALTER TABLE public.brands 
ADD COLUMN created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Distribuidores com assinatura ativa podem inserir marcas
CREATE POLICY "Distributors with subscription can insert brands"
  ON public.brands FOR INSERT
  TO authenticated
  WITH CHECK (
    has_role(auth.uid(), 'distributor') AND 
    has_active_subscription(auth.uid())
  );

-- Distribuidores podem atualizar marcas que criaram (com assinatura ativa)
CREATE POLICY "Distributors can update own brands"
  ON public.brands FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (
    has_role(auth.uid(), 'distributor') AND 
    has_active_subscription(auth.uid()) AND
    created_by = auth.uid()
  );

-- Distribuidores podem excluir marcas que criaram (com assinatura ativa)
CREATE POLICY "Distributors can delete own brands"
  ON public.brands FOR DELETE
  TO authenticated
  USING (
    created_by = auth.uid() AND
    has_role(auth.uid(), 'distributor') AND
    has_active_subscription(auth.uid())
  );

-- Distribuidores podem visualizar marcas ativas ou as próprias
CREATE POLICY "Distributors can view brands"
  ON public.brands FOR SELECT
  TO authenticated
  USING (
    has_role(auth.uid(), 'distributor') AND
    (is_active = true OR created_by = auth.uid())
  );