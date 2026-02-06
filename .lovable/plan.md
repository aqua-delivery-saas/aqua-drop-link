
# Plano: Landing Page para Distribuidoras

## Objetivo
Criar uma página de vendas profissional em `/landingpage` focada em converter distribuidoras de água mineral em assinantes do Aqua Delivery, destacando benefícios, funcionalidades e planos.

---

## Estrutura da Página

A landing page terá as seguintes seções:

### 1. Hero Section
- Headline principal impactante
- Subtítulo com proposta de valor
- CTA primário "Começar Agora Grátis"
- Background com imagem hero-water.jpg (reutilizada)

### 2. Problema/Solução
- Cards destacando dores das distribuidoras (atendimento manual, pedidos perdidos, etc.)
- Como o Aqua Delivery resolve cada problema

### 3. Funcionalidades Principais
Grid com 6 features principais:
- Painel completo de gestão
- Página pública de pedidos personalizada
- Envio automático via WhatsApp
- Horários de funcionamento configuráveis
- Descontos por quantidade
- Programa de fidelidade para clientes

### 4. Como Funciona
Timeline visual em 4 passos:
1. Crie sua conta (grátis)
2. Configure sua distribuidora
3. Compartilhe seu link
4. Receba pedidos automaticamente

### 5. Planos e Preços
Comparativo dos planos:
- **Mensal**: R$ 34,99/mês
- **Anual**: R$ 349/ano (economia de 2 meses)

Features incluídas em ambos:
- Painel completo
- Página pública de pedidos
- Envio via WhatsApp
- Cadastro ilimitado de produtos
- Suporte via WhatsApp

### 6. Depoimentos (Simulados)
3 cards com depoimentos de distribuidoras fictícias para gerar credibilidade

### 7. FAQ
Accordion com perguntas frequentes:
- Preciso pagar para testar?
- Como funciona o pagamento dos clientes?
- Posso cancelar quando quiser?
- Vocês cobram taxa por pedido?

### 8. CTA Final
Seção de fechamento com call-to-action forte

### 9. Footer Simplificado
Links para Termos, Privacidade e Suporte

---

## Arquivo a Criar

**`src/pages/LandingPage.tsx`**

---

## Rota a Adicionar

**`src/App.tsx`**

Adicionar rota pública:
```
<Route path="/landingpage" element={<LandingPage />} />
```

---

## Componentes Reutilizados

| Componente | Uso |
|------------|-----|
| `Logo` | Header da página |
| `Button` | CTAs principais |
| `Card` | Cards de features, planos, depoimentos |
| `Badge` | Destaque "Mais econômico" no plano anual |
| `Accordion` | Seção de FAQ |
| `heroWater` | Imagem de background do hero |

---

## Design Visual

- Utilização do design system existente (cores primary #007BFF, secondary #00C48C)
- Gradientes sutis entre seções
- Animações de entrada (`animate-fade-in`, `animate-slide-up`)
- Mobile-first responsivo
- Ícones do Lucide React para visualização das features

---

## Estrutura do Código

```text
src/pages/LandingPage.tsx
  |
  +-- HeroSection
  |     - Background image
  |     - Headline + CTA
  |
  +-- ProblemSection
  |     - 3 cards de problemas
  |
  +-- FeaturesSection
  |     - Grid 2x3 de funcionalidades
  |
  +-- HowItWorksSection
  |     - Timeline 4 passos
  |
  +-- PricingSection
  |     - 2 cards de planos
  |
  +-- TestimonialsSection
  |     - 3 cards de depoimentos
  |
  +-- FAQSection
  |     - Accordion com perguntas
  |
  +-- CTASection
  |     - CTA final
  |
  +-- FooterSection
      - Links legais
```

---

## Conteudo de Texto

### Hero
- **Headline**: "Aumente suas vendas com pedidos online 24h"
- **Subtítulo**: "Receba pedidos pelo WhatsApp automaticamente. Sem complicação, sem taxa por pedido."

### Features
1. **Painel Completo** - Gerencie pedidos, produtos e horários em um só lugar
2. **Página Exclusiva** - Seu link personalizado para clientes fazerem pedidos
3. **WhatsApp Integrado** - Receba cada pedido direto no seu WhatsApp
4. **Horários Flexíveis** - Configure quando sua distribuidora está aberta
5. **Descontos Automáticos** - Crie promoções por quantidade
6. **Programa de Fidelidade** - Fidelize clientes com pontos e recompensas

### Depoimentos (Fictícios)
- "Aumentamos 40% dos pedidos no primeiro mês!" - Maria, Distribuidora Água Pura
- "Antes eu perdia pedidos no WhatsApp. Agora tudo organizado!" - João, Água Cristal Express
- "O melhor investimento que fiz pro meu negócio." - Ana, Distribuidora Fonte Natural

### FAQ
1. **Preciso pagar para testar?** - Não! O cadastro é gratuito. Você só paga quando ativar sua assinatura.
2. **Como funciona o pagamento?** - Os clientes pagam diretamente a você (Pix, dinheiro ou cartão). Não intermediamos.
3. **Posso cancelar quando quiser?** - Sim, sem multa. Cancele quando quiser pelo painel.
4. **Vocês cobram taxa por pedido?** - Não! Taxa fixa mensal ou anual, sem surpresas.

---

## Detalhes Tecnicos

### Imports Necessarios
```typescript
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Logo } from "@/components/Logo";
import heroWater from "@/assets/hero-water.jpg";
import { 
  LayoutDashboard, Link2, MessageCircle, Clock, 
  Percent, Star, Check, ArrowRight, Users, 
  TrendingUp, Smartphone, ShoppingBag 
} from "lucide-react";
```

### SEO
```typescript
<Helmet>
  <title>Aqua Delivery para Distribuidoras - Receba Pedidos Online</title>
  <meta name="description" content="Aumente suas vendas com pedidos online 24h. Receba pedidos pelo WhatsApp automaticamente. Sem complicação, sem taxa por pedido." />
</Helmet>
```

### Responsividade
- Hero: texto centralizado mobile, grid 2 colunas desktop
- Features: 1 coluna mobile, 2 colunas tablet, 3 colunas desktop
- Planos: stack vertical mobile, side-by-side desktop
- Depoimentos: carousel ou stack mobile, grid 3 colunas desktop

---

## Resultado Esperado

Uma landing page profissional e persuasiva que:
- Comunica claramente os benefícios do Aqua Delivery
- Gera confiança com depoimentos e FAQ
- Converte visitantes em cadastros com CTAs estratégicos
- Mantém consistência visual com o resto do sistema
