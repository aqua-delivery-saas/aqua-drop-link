-- Adicionar campos faltantes à tabela loyalty_programs para suportar a UI
ALTER TABLE public.loyalty_programs
ADD COLUMN IF NOT EXISTS program_name TEXT DEFAULT 'Programa de Fidelidade',
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS min_order_value NUMERIC DEFAULT 0;

-- Adicionar campo keywords à tabela distributors para SEO
ALTER TABLE public.distributors
ADD COLUMN IF NOT EXISTS meta_keywords TEXT;