-- Corrigir política permissiva de INSERT em notifications
-- Remover a política atual que permite qualquer insert
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;

-- Criar política mais restritiva: apenas admins podem inserir diretamente
-- (as funções SECURITY DEFINER como notify_distributor_new_order já conseguem inserir)
CREATE POLICY "Admins can insert notifications" 
ON public.notifications 
FOR INSERT 
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Corrigir política permissiva de INSERT em cities
-- Remover a política atual que permite qualquer usuário autenticado inserir
DROP POLICY IF EXISTS "Authenticated users can insert cities" ON public.cities;

-- Apenas admins podem inserir novas cidades
CREATE POLICY "Admins can insert cities" 
ON public.cities 
FOR INSERT 
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'));