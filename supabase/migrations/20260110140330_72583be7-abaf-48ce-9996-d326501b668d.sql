-- Criar bucket público para logos de distribuidoras
INSERT INTO storage.buckets (id, name, public)
VALUES ('distributor-logos', 'distributor-logos', true);

-- Leitura pública (qualquer um pode ver as logos)
CREATE POLICY "Logos são públicos"
ON storage.objects FOR SELECT
USING (bucket_id = 'distributor-logos');

-- Upload apenas para usuários autenticados
CREATE POLICY "Usuários autenticados podem fazer upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'distributor-logos' 
  AND auth.role() = 'authenticated'
);

-- Atualização apenas do próprio arquivo
CREATE POLICY "Usuários podem atualizar seus arquivos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'distributor-logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Deleção apenas do próprio arquivo
CREATE POLICY "Usuários podem deletar seus arquivos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'distributor-logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);