-- Criar tabela de marcas
CREATE TABLE public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_brands_updated_at
  BEFORE UPDATE ON public.brands
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

-- Admins podem gerenciar todas as marcas
CREATE POLICY "Admins can manage all brands"
  ON public.brands FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Qualquer pessoa pode visualizar marcas ativas
CREATE POLICY "Anyone can view active brands"
  ON public.brands FOR SELECT
  USING (is_active = true);

-- Inserir as 10 marcas do JSON
INSERT INTO public.brands (name, description, logo_url, is_active)
VALUES
  ('Minalba', 'Marca líder de água mineral no Brasil, parte do portfólio Minalba Brasil.', 'https://example.com/logos/minalba.png', true),
  ('Indaiá', 'Água mineral tradicional com forte presença no Norte e Nordeste.', 'https://example.com/logos/indaia.png', true),
  ('São Lourenço', 'Água mineral natural, conhecida por sua pureza e leveza.', 'https://example.com/logos/sao_lourenco.png', true),
  ('Crystal', 'Uma das águas minerais mais distribuídas no país, pertencente à Coca-Cola Brasil.', 'https://example.com/logos/crystal.png', true),
  ('Bonafont', 'Marca popular na categoria de água mineral comercializada em grande escala.', 'https://example.com/logos/bonafont.png', true),
  ('Cristalina', 'Água mineral amplamente conhecida e consumida no mercado brasileiro.', 'https://example.com/logos/cristalina.png', true),
  ('Nestlé Pureza Vital', 'Uma das marcas de água mineral mais reconhecidas, com ampla distribuição.', 'https://example.com/logos/nestle_pureza_vital.png', true),
  ('Petrópolis', 'Água mineral produzida por grupo brasileiro (distribuída em várias regiões).', 'https://example.com/logos/petropolis.png', true),
  ('Bioleve', 'Marca produzida em São Paulo, presente em vários pontos de venda.', 'https://example.com/logos/bioleve.png', true),
  ('Fresca', 'Água mineral popular na Bahia, com forte presença regional.', 'https://example.com/logos/fresca.png', true);