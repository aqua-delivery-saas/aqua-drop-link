-- Permitir que usuários autenticados insiram novas cidades
CREATE POLICY "Authenticated users can insert cities" 
ON public.cities FOR INSERT
TO authenticated
WITH CHECK (true);