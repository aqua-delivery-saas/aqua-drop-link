-- Inserir cidades
INSERT INTO public.cities (name, state, slug, country, is_active)
VALUES 
  ('Itabuna', 'BA', 'itabuna-ba', 'Brasil', true),
  ('Ilhéus', 'BA', 'ilheus-ba', 'Brasil', true);

-- Vincular Água Cristalina e Seu Jorge a Itabuna
UPDATE public.distributors 
SET city_id = (SELECT id FROM public.cities WHERE slug = 'itabuna-ba')
WHERE slug IN ('agua-cristalina', 'seu-jorge');

-- Vincular Natalina a Ilhéus
UPDATE public.distributors 
SET city_id = (SELECT id FROM public.cities WHERE slug = 'ilheus-ba')
WHERE slug = 'natalina';