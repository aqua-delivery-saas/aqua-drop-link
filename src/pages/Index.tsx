import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { Building2, Users, Droplets } from "lucide-react";
import heroWater from "@/assets/hero-water.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
          <Logo size="md" />
          <div className="flex gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs sm:text-sm px-2 sm:px-4"
              onClick={() => navigate("/distributor/login")}
            >
              Login Distribuidora
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs sm:text-sm px-2 sm:px-4"
              onClick={() => navigate("/customer/login")}
            >
              Login Cliente
            </Button>
            <Button
              size="sm"
              className="text-xs sm:text-sm px-2 sm:px-4"
              onClick={() => navigate("/distributor/signup")}
            >
              Criar Conta
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4">
        <section className="py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <Logo size="lg" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Simplifique a entrega de água
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Plataforma completa para distribuidoras gerenciarem pedidos online. Elimine o WhatsApp manual e organize
              sua operação.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/distributor/signup")} className="text-lg">
                Começar Grátis
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate("/order/distribuidora-agua-pura")}
                className="text-lg"
              >
                Ver Demo do Cliente
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-5xl mx-auto">
            <img src={heroWater} alt="Entrega de água profissional" className="w-full h-[400px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex items-end">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">Tecnologia para o seu negócio</h3>
                <p className="text-foreground/80">Transforme a experiência de compra dos seus clientes</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Como Funciona</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Para Distribuidoras</h3>
                <p className="text-muted-foreground">
                  Crie sua conta, cadastre produtos e receba um link exclusivo para compartilhar
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="rounded-full bg-secondary/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Para Clientes</h3>
                <p className="text-muted-foreground">
                  Acesse o link, escolha água, quantidade e endereço em menos de 1 minuto
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="rounded-full bg-accent/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Droplets className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Entrega Simples</h3>
                <p className="text-muted-foreground">
                  Pedidos organizados no painel e notificação por WhatsApp automática
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-16 text-center">
          <Card className="max-w-3xl mx-auto bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardContent className="py-12 px-8">
              <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Crie sua conta gratuitamente e comece a receber pedidos online hoje mesmo
              </p>
              <Button size="lg" onClick={() => navigate("/distributor/signup")} className="text-lg">
                Criar Conta Grátis
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t mt-16 py-8 bg-card/50">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <Logo size="sm" />
          <p className="mt-4">© 2025 Aqua Delivery. Simplificando a entrega de água.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
