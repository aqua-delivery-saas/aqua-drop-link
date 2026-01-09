-- Criar tabela para armazenar progresso parcial do onboarding
CREATE TABLE public.onboarding_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  current_step INTEGER NOT NULL DEFAULT 1,
  distributor_data JSONB,
  business_hours_data JSONB,
  brands_data JSONB,
  products_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.onboarding_drafts ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: usuários só podem gerenciar seus próprios drafts
CREATE POLICY "Users can view own draft"
ON public.onboarding_drafts
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own draft"
ON public.onboarding_drafts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own draft"
ON public.onboarding_drafts
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own draft"
ON public.onboarding_drafts
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_onboarding_drafts_updated_at
BEFORE UPDATE ON public.onboarding_drafts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Índice para busca rápida por user_id
CREATE INDEX idx_onboarding_drafts_user_id ON public.onboarding_drafts(user_id);