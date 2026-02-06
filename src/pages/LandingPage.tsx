import { Helmet } from "react-helmet-async";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Logo } from "@/components/Logo";
import heroWater from "@/assets/hero-water.jpg";
import {
  LayoutDashboard,
  Link2,
  MessageCircle,
  Clock,
  Percent,
  Star,
  Check,
  ArrowRight,
  UserPlus,
  Settings,
  Share2,
  ShoppingBag,
  Quote,
  Phone,
  AlertTriangle,
  XCircle,
  CheckCircle,
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleStartFree = () => {
    navigate("/distributor/signup");
  };

  const features = [
    {
      icon: LayoutDashboard,
      title: "Painel Completo",
      description: "Gerencie pedidos, produtos e horários em um só lugar",
    },
    {
      icon: Link2,
      title: "Página Exclusiva",
      description: "Seu link personalizado para clientes fazerem pedidos",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Integrado",
      description: "Receba cada pedido direto no seu WhatsApp",
    },
    {
      icon: Clock,
      title: "Horários Flexíveis",
      description: "Configure quando sua distribuidora está aberta",
    },
    {
      icon: Percent,
      title: "Descontos Automáticos",
      description: "Crie promoções por quantidade",
    },
    {
      icon: Star,
      title: "Programa de Fidelidade",
      description: "Fidelize clientes com pontos e recompensas",
    },
  ];

  const problems = [
    {
      icon: Phone,
      problem: "Atendimento manual",
      solution: "Pedidos automáticos 24h",
    },
    {
      icon: AlertTriangle,
      problem: "Pedidos perdidos no WhatsApp",
      solution: "Tudo organizado no painel",
    },
    {
      icon: XCircle,
      problem: "Clientes não voltam",
      solution: "Programa de fidelidade",
    },
  ];

  const steps = [
    {
      icon: UserPlus,
      title: "Crie sua conta",
      description: "Cadastro gratuito em menos de 2 minutos",
    },
    {
      icon: Settings,
      title: "Configure sua distribuidora",
      description: "Adicione produtos, preços e horários",
    },
    {
      icon: Share2,
      title: "Compartilhe seu link",
      description: "Divulgue para seus clientes",
    },
    {
      icon: ShoppingBag,
      title: "Receba pedidos",
      description: "Automaticamente no seu WhatsApp",
    },
  ];

  const testimonials = [
    {
      quote: "Aumentamos 40% dos pedidos no primeiro mês!",
      author: "Maria",
      company: "Distribuidora Água Pura",
    },
    {
      quote: "Antes eu perdia pedidos no WhatsApp. Agora tudo organizado!",
      author: "João",
      company: "Água Cristal Express",
    },
    {
      quote: "O melhor investimento que fiz pro meu negócio.",
      author: "Ana",
      company: "Distribuidora Fonte Natural",
    },
  ];

  const faqs = [
    {
      question: "Preciso pagar para testar?",
      answer:
        "Não! O cadastro é gratuito. Você só paga quando ativar sua assinatura para começar a receber pedidos.",
    },
    {
      question: "Como funciona o pagamento dos clientes?",
      answer:
        "Os clientes pagam diretamente a você (Pix, dinheiro ou cartão). Não intermediamos pagamentos.",
    },
    {
      question: "Posso cancelar quando quiser?",
      answer:
        "Sim, sem multa. Cancele quando quiser pelo painel, sem burocracia.",
    },
    {
      question: "Vocês cobram taxa por pedido?",
      answer:
        "Não! Taxa fixa mensal ou anual, sem surpresas. Não importa quantos pedidos você receba.",
    },
  ];

  const planFeatures = [
    "Painel completo de gestão",
    "Página pública de pedidos",
    "Envio via WhatsApp",
    "Cadastro ilimitado de produtos",
    "Horários de funcionamento",
    "Descontos por quantidade",
    "Programa de fidelidade",
    "Suporte via WhatsApp",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Aqua Delivery para Distribuidoras - Receba Pedidos Online</title>
        <meta
          name="description"
          content="Aumente suas vendas com pedidos online 24h. Receba pedidos pelo WhatsApp automaticamente. Sem complicação, sem taxa por pedido."
        />
      </Helmet>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/distributor/login")}
            >
              Entrar
            </Button>
            <Button onClick={handleStartFree}>Começar Grátis</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-16">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroWater})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/80" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-secondary text-secondary-foreground">
              Para Distribuidoras de Água
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Aumente suas vendas com{" "}
              <span className="text-primary">pedidos online 24h</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Receba pedidos pelo WhatsApp automaticamente. Sem complicação, sem
              taxa por pedido.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={handleStartFree}>
                Começar Agora Grátis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() =>
                  document
                    .getElementById("como-funciona")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Como Funciona
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Chega de perder vendas
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transforme os problemas do dia a dia em oportunidades de
              crescimento
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {problems.map((item, index) => (
              <Card
                key={index}
                className="relative overflow-hidden border-2 hover:border-primary transition-colors"
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-destructive/10">
                      <item.icon className="h-6 w-6 text-destructive" />
                    </div>
                    <span className="text-muted-foreground line-through">
                      {item.problem}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary/10">
                      <CheckCircle className="h-6 w-6 text-secondary" />
                    </div>
                    <span className="font-medium text-foreground">
                      {item.solution}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Funcionalidades pensadas para facilitar sua rotina e aumentar suas
              vendas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="como-funciona" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Como funciona
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comece a receber pedidos em 4 passos simples
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-4">
                      <step.icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Planos simples e transparentes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sem taxas escondidas. Sem cobrança por pedido.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Monthly Plan */}
            <Card className="relative">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl">Mensal</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">
                    R$ 34,99
                  </span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {planFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-secondary flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full mt-6"
                  variant="outline"
                  onClick={handleStartFree}
                >
                  Começar Grátis
                </Button>
              </CardContent>
            </Card>

            {/* Annual Plan */}
            <Card className="relative border-2 border-primary shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-secondary text-secondary-foreground">
                  Mais econômico
                </Badge>
              </div>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl">Anual</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">
                    R$ 349
                  </span>
                  <span className="text-muted-foreground">/ano</span>
                </div>
                <p className="text-sm text-secondary font-medium mt-2">
                  Economia de 2 meses!
                </p>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {planFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-secondary flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-6" onClick={handleStartFree}>
                  Começar Grátis
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Distribuidoras que já transformaram seus negócios
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="relative">
                <CardContent className="pt-6">
                  <Quote className="h-10 w-10 text-primary/20 mb-4" />
                  <p className="text-foreground mb-6 text-lg italic">
                    "{testimonial.quote}"
                  </p>
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.company}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tire suas dúvidas sobre o Aqua Delivery
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Pronto para aumentar suas vendas?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de distribuidoras que já modernizaram seu
            atendimento
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={handleStartFree}
            className="bg-background text-foreground hover:bg-background/90"
          >
            Começar Agora Grátis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Logo size="sm" />
            <nav className="flex items-center gap-6">
              <Link
                to="/terms"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Termos de Uso
              </Link>
              <Link
                to="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacidade
              </Link>
              <Link
                to="/support"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Suporte
              </Link>
            </nav>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Aqua Delivery
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
